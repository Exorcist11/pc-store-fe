import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface InputProps {
  className?: string;
  Icon: React.ElementType;
  placeholder?: string;
  size?: number;
  color?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDoubleClick?: React.MouseEventHandler<HTMLInputElement>;
}

export default function InputWithIcon(props: InputProps) {
  const { className, Icon, placeholder, size = 16, color, onChange, onDoubleClick } = props;
  return (
    <div className="flex items-center w-fit border px-2 rounded-lg focus-visible:ring-1 ">
      <Icon size={size} color={color} />
      <Input
        placeholder={placeholder}
        onChange={onChange}
        onDoubleClick={onDoubleClick}
        className={cn(
          className,
          "border-none shadow-none focus-visible:ring-transparent w-full"
        )}
      />
    </div>
  );
}
