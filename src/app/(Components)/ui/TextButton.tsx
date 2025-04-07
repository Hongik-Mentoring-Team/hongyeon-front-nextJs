//수정/삭제/저장/취소 전용 버튼 컴포넌트 생성

import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "default" | "blue" | "gray" | "red";
  children: ReactNode;
}

const colorVariants: Record<string, string> = {
  default: "text-neutral-600 hover:text-neutral-800",
  blue: "text-blue-500 hover:text-blue-700",
  gray: "text-gray-500 hover:text-gray-700",
  red: "text-red-500 hover:text-red-700",
};

const TextButton = ({
  color = "default",
  children,
  className = "",
  ...props
}: TextButtonProps) => {
  return (
    <button
      type="button"
      className={`bg-transparent text-sm transition-colors ${colorVariants[color]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default TextButton;
