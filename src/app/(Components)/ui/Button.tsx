// 변경사항: size 속성 추가 (sm, md, lg)
//          세로 텍스트 깨짐 방지를 위한 min-w, whitespace 설정 추가
//          더 현대적인, 둥근 디자인과 시각 효과 적용

import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  icon?: ReactNode;
}

const Button = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyle =
    "inline-flex justify-center items-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded-full whitespace-nowrap shadow-sm hover:shadow active:scale-95";

  const sizeStyles: Record<string, string> = {
    sm: "px-4 py-1.5 text-xs min-w-[68px]",
    md: "px-5 py-2 text-sm min-w-[88px]",
    lg: "px-7 py-3 text-base min-w-[104px]",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-primary text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-400",
    secondary:
      "bg-secondary text-white hover:bg-teal-600 active:bg-teal-700 focus:ring-teal-400",
    danger:
      "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400",
    outline:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-400",
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="text-current">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
