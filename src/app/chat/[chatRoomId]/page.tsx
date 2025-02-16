"use client";

import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "next/navigation";

// 백엔드의 WebSocket 엔드포인트
const WS_ENDPOINT = "http://localhost:8080/ws-stomp"; // SockJS 사용 시 변경 가능
const SEND_DESTINATION = "/app/chat/message"; // 메시지 전송 경로

interface ChatRoomMemberResDto {
  chatRoomMemberId: number;
  chatRoomId: number;
  nickname: string;
}
// , roomName, membersInfo
function ParticipateChatRoom() {
  const { chatRoomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [currentMembersInfo, setCurrentMembersInfo] = useState<
    ChatRoomMemberResDto[]
  >([]);
  const [chatRoomMemberId, setChatRoomMemberId] = useState<Number>(-1);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null); // 스크롤 자동 하단 이동을 위한 ref

  // ======================================================

  useEffect(() => {
    if (!chatRoomId) return;

    // 1) STOMP 클라이언트 생성
    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(WS_ENDPOINT, null, {
          withCredentials: true,
        }),
      reconnectDelay: 5000, // 자동 재연결 (5초)
      debug: (msg) => console.log(msg),
      onConnect: () => {
        console.log("STOMP Connection 성공");

        // 2) 채팅방 메시지 수신 구독
        const subscribeUrl = `/topic/chat/${chatRoomId}`;
        stompClient.subscribe(subscribeUrl, (message) => {
          if (!message.body) return;
          console.log("수신된 메시지: ", message.body);
          const msgData = JSON.parse(message.body);
          setMessages((prev) => [...prev, msgData]);
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
  }, [chatRoomId]);

  //채팅방 입장 후 채팅방 히스토리 요청
  useEffect(() => {
    fetchChatHistory();
  }, [chatRoomId]);

  // 새 메시지가 추가될 때 자동으로 스크롤을 하단으로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===============================================================

  // === 변경: 채팅방 메시지 내역 요청 함수 (GET 방식) ===
  const fetchChatHistory = async () => {
    try {
      // GET 요청
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
      const history = await response.json(); // 반환 형식: ChatRoomResponseDto
      setMessages(history.chatMessages);
      console.log("채팅방 내역 불러오기 성공", history.chatMessages);
      setCurrentMembersInfo(history.chatMembers);
      setRoomName(history.name);
      setChatRoomMemberId(history.currentChatMemberId);
    } catch (err) {
      console.error(err);
      alert("채팅방 내역을 불러오지 못했습니다.");
    }
  };
  // =================================================

  // 메시지 전송 (각 memberId별 전송은 따로 구현되어 있지 않고, 현재 사용자는 myMemberId임)
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      alert("소켓 연결이 안 되어 있습니다.");
      return;
    }
    const member = currentMembersInfo.find(
      (item) => String(item.chatRoomMemberId) === String(chatRoomMemberId)
    );
    const currentNickname = member ? member.nickname : "익명";

    const chatMessageDto = {
      chatRoomId: chatRoomId,
      nickname: currentNickname,
      content: inputValue,
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
          {currentMembersInfo.map((member: any) => (
            <span key={member.memberId} className="mr-2">
              {member.nickname} (ID: {member.memberId})
            </span>
          ))}
        </div>
      </div>

      {/* 채팅 메시지 목록 */}
      <div className="border border-gray-300 h-80 overflow-y-auto p-3 rounded-md mb-4">
        {messages.map((msg: any, idx: number) => (
          <div key={idx} className="mb-2">
            <strong className="text-gray-800">
              {msg.nickname} (ID: {msg.memberId}):
            </strong>{" "}
            <span className="text-gray-700">{msg.content}</span>
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
