// 변경사항: size 속성 추가 (sm, md, lg)
//          세로 텍스트 깨짐 방지를 위한 min-w, whitespace 설정 추가

import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyle =
    "inline-flex justify-center items-center font-medium transition-colors duration-200 focus:outline-none rounded-xl whitespace-nowrap"; // ✅ 변경사항: 줄바꿈 방지 추가

  const sizeStyles: Record<string, string> = {
    sm: "px-3 py-1 text-sm min-w-[64px]", // ✅ 변경사항: 최소 너비 설정
    md: "px-4 py-2 text-sm min-w-[80px]", // ✅ 변경사항
    lg: "px-6 py-3 text-base min-w-[96px]", // ✅ 변경사항
  };

  const variants: Record<string, string> = {
    primary: "bg-primary text-white hover:bg-blue-700",
    secondary: "bg-secondary text-white hover:bg-teal-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
