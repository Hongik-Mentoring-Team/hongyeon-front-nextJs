// src/app/(Components)/ui/Input.tsx
// 변경사항: 일관된 디자인을 위한 공통 Input 컴포넌트 추가

import React, { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary w-full text-sm placeholder-neutral-400"
      {...props}
    />
  );
}
