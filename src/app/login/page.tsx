"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log("Login attempt:", { email, password });
  };

  return (
    // 부모가 h-auto로 시작하기에 h-full을 사용한다. (h-full : 부모 컴포넌트 크기의 100%로 맞추기)
    // login page는 가운데에 컴포넌트가 있어야 하기 때문에 h-screen을 사용한다. (h-screen : viewpoint 100%로 맞추기)
    <div className="flex justify-center items-center w-full h-screen">
      <form>
        {/* Login Box  w-96 */}
        <div className="flex flex-col justify-center items-center min-w-96 min-h-96 bg-gray-50 border-2 gap-5">
          <h1 className="text-center text-3xl font-bold text-blue-600 mb-2">
            로그인
          </h1>

          {/* ID */}
          <form className="flex flex-col w-full h-full gap-4">
            <div className="flex justify-center items-center gap-5">
              <label>ID : </label>
              <input
                type="id"
                placeholder="ID"
                className="pl-6 w-72 h-16 border-2"
              ></input>
            </div>

            {/* PW */}
            <div className="flex justify-center items-center gap-5">
              <label>PW : </label>
              <input
                type="pw"
                placeholder="PASSWORD"
                className="pl-6 w-72 h-16 border-2"
              ></input>
            </div>

            <div className="flex w-72 px-0 mx-0 justify-end items-center">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </form>
    </div>
  );
}
