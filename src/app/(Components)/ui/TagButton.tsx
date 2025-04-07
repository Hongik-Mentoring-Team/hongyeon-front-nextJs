// TagButton.tsx
// 변경사항: 태그 선택 전용 버튼 컴포넌트

import React from "react";

interface TagButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
}

const TagButton = ({
  selected = false,
  children,
  className = "",
  ...props
}: TagButtonProps) => {
  const baseStyle = "px-4 py-2 rounded-md border transition-colors";
  const selectedStyle = selected
    ? "bg-blue-600 text-white"
    : "bg-gray-100 text-gray-700";

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
