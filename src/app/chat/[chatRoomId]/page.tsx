"use client";

import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "next/navigation";

// 백엔드의 WebSocket 엔드포인트
const WS_ENDPOINT = "http://localhost:8080/ws-stomp"; // SockJS 사용 시
const SEND_DESTINATION = "/app/chat/message"; // 메시지 전송 경로

/**
 * ChatRoomMemberResDto: 채팅방 참여 멤버 정보
 */
interface ChatRoomMemberResDto {
  chatRoomMemberId: number;
  chatRoomId: number;
  nickname: string;
}

/**
 * ChatMessageResponseDto: 서버에서 반환하는 채팅 메시지 DTO(for http)
 */
interface ChatMessageResponseDto {
  chatRoomId: number;
  memberId: number;
  nickname: string;
  content: string;
  createdAt: string; // ISO Date string
  owner: boolean;
}

/**
 * ChatMessageStompResDto: 서버에서 받는 채팅 메시지(for webSocket)
 *
 */
interface ChatMessageStompResDto {
  chatRoomId: number;
  nickname: string;
  content: string;
  chatRoomMemberId: number;
  memberId: number;
}

/**
 * ChatRoomResponseDto: 서버에서 GET /api/v1/chatRoom/history/{chatRoomId} 시 반환
 * - chatMessages: ChatMessageResponseDto[]
 * - chatMembers: ChatRoomMemberResDto[]
 * - name: string (채팅방 이름)
 * - currentChatMemberId: number (내 채팅멤버 ID)
 */
interface ChatRoomResponseDto {
  chatMessages: ChatMessageResponseDto[];
  chatMembers: ChatRoomMemberResDto[];
  name: string;
  currentChatMemberId: number;
}

function ParticipateChatRoom() {
  const { chatRoomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [currentMembersInfo, setCurrentMembersInfo] = useState<
    ChatRoomMemberResDto[]
  >([]);
  const [chatRoomMemberId, setChatRoomMemberId] = useState<number>(-1); //현재 참여중인 사용자의 ChatRoomMember아이디(not MemberId)

  // ✅ messages를 ChatMessageResponseDto[]로 타입 지정
  const [messages, setMessages] = useState<ChatMessageResponseDto[]>([]);
  const [inputValue, setInputValue] = useState("");

  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // 스크롤 자동 하단 이동을 위한 ref

  // ======================================================
  // 1) STOMP 클라이언트 생성 및 구독
  useEffect(() => {
    if (!chatRoomId || chatRoomMemberId === -1) return; //chatRoomMemberId가 세팅된 후에 구독

    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(WS_ENDPOINT),
      reconnectDelay: 5000,
      debug: (msg) => console.log(msg),
      onConnect: () => {
        console.log("STOMP Connection 성공");
        const subscribeUrl = `/topic/chat/${chatRoomId}`;
        stompClient.subscribe(subscribeUrl, (message) => {
          //구독 및 메시지 수신
          if (!message.body) return;
          console.log("수신된 메시지: ", message.body);

          // msgData는 ChatMessageReqeDto 형태
          const msgData: ChatMessageStompResDto = JSON.parse(message.body);
          const receivedMessage: ChatMessageResponseDto = {
            chatRoomId: msgData.chatRoomId,
            nickname: msgData.nickname,
            content: msgData.content,
            createdAt: new Date().toISOString(),
            memberId: msgData.memberId,
            owner: msgData.chatRoomMemberId === chatRoomMemberId, //현재 클라이언트가 보낸 메시지 식별
          };
          console.log("1:", msgData);
          console.log("2:  ", chatRoomMemberId);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP 오류 발생:", frame);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log("STOMP 연결 해제됨");
      }
    };
  }, [chatRoomId, chatRoomMemberId]);

  // 2) 채팅방 입장 후 채팅방 히스토리 요청
  useEffect(() => {
    if (chatRoomId) {
      fetchChatHistory();
    }
  }, [chatRoomId]);

  // 3) 새 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===============================================================

  /**
   * 채팅방 메시지 내역 요청
   * /api/v1/chatRoom/history/{chatRoomId} => ChatRoomResponseDto
   */
  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/chatRoom/history/${chatRoomId}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("채팅 내역 요청 실패!");
      }
      // ChatRoomResponseDto 형태
      const history: ChatRoomResponseDto = await response.json();

      // 메시지 배열 설정
      setMessages(history.chatMessages);
      console.log("채팅방 내역 불러오기 성공", history.chatMessages);

      // 멤버 정보, 방 이름 설정
      setCurrentMembersInfo(history.chatMembers);
      setRoomName(history.name);
      setChatRoomMemberId(history.currentChatMemberId);
    } catch (err) {
      console.error(err);
      alert("채팅방 내역을 불러오지 못했습니다.");
    }
  };

  /**
   * 메시지 전송
   */
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      alert("소켓 연결이 안 되어 있습니다.");
      return;
    }
    // 내가 보낸 메시지의 닉네임
    const member = currentMembersInfo.find(
      (item) => String(item.chatRoomMemberId) === String(chatRoomMemberId)
    );
    const currentNickname = member ? member.nickname : "익명";

    // 서버에 전송할 DTO
    //여기에 위에서 정의한 인터페이스 chatmessageReqdto를 이용하고싶어
    const chatMessageDto = {
      chatRoomId: Number(chatRoomId),
      nickname: currentNickname,
      content: inputValue,
      chatRoomMemberId: chatRoomMemberId,
    };

    stompClientRef.current.publish({
      destination: SEND_DESTINATION,
      body: JSON.stringify(chatMessageDto),
    });

    setInputValue("");
  };

  if (!chatRoomId) {
    return <div>채팅방 정보를 불러오는 중...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      {/* 채팅방 헤더 */}
      <h1 className="text-3xl font-bold mb-4">채팅방: {roomName}</h1>
      <p className="text-gray-600 text-sm mb-2">채팅방 ID: {chatRoomId}</p>

      {/* 참여 멤버 */}
      <div className="mb-4">
        <p className="text-sm font-semibold">참여 멤버:</p>
        <div className="text-sm text-gray-600">
          {currentMembersInfo.map((member) => (
            <span key={member.chatRoomMemberId} className="mr-2">
              {member.nickname} (채팅멤버ID: {member.chatRoomMemberId})
            </span>
          ))}
        </div>
      </div>

      {/* 채팅 메시지 목록 */}
      <div className="border border-gray-300 h-80 overflow-y-auto p-3 rounded-md mb-4">
        {messages.map((msg, idx) => (
          // 본인 메시지는 우측. 상대방 메시지는 좌측.
          <div
            key={idx}
            className={`mb-2 flex ${
              msg.owner ? "justify-end" : "justify-start"
            }`}
          >
            {/* 실제 메시지 박스 */}
            <div
              className={`max-w-[70%] p-2 rounded-lg ${
                msg.owner ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
              }`}
            >
              {/* 작성자 닉네임/아이디 영역 */}
              <strong className="block text-gray-800 text-sm">
                {msg.nickname} (memberId: {msg.memberId})
              </strong>
              {/* 메시지 내용 */}
              <span className="block text-gray-700">{msg.content}</span>
              {/* 메시지 날짜 */}
              <span className="block text-xs text-gray-500">
                {msg.createdAt}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력란 */}
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="메시지를 입력..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default ParticipateChatRoom;
