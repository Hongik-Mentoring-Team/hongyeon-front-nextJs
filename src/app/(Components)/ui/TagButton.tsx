// TagButton.tsx
// 변경사항: 태그 선택 전용 버튼 컴포넌트
// 업데이트: 더 현대적인 디자인과 애니메이션 적용

import React from "react";

interface TagButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

const TagButton = ({
  selected = false,
  children,
  className = "",
  variant = "primary",
  ...props
}: TagButtonProps) => {
  const baseStyle =
    "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-opacity-30 hover:shadow-sm active:scale-95";

  const variantStyles = {
    primary: {
      selected:
        "bg-primary text-white border-transparent hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-400",
      unselected:
        "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary focus:ring-blue-300",
    },
    secondary: {
      selected:
        "bg-secondary text-white border-transparent hover:bg-teal-600 active:bg-teal-700 focus:ring-teal-400",
      unselected:
        "bg-white text-gray-600 border-gray-200 hover:border-secondary hover:text-secondary focus:ring-teal-300",
    },
  };

  const selectedStyle = selected
    ? variantStyles[variant].selected
    : variantStyles[variant].unselected;

  return (
    <button
      type="button"
      className={`${baseStyle} ${selectedStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default TagButton;
