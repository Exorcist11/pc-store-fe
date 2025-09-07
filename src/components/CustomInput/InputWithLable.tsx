import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputProps {
  title: string;
  type: "text" | "password" | "email" | "number" | "tel";
  id?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  isRequired?: boolean;
  value?: string | number;
  disable?: boolean;
}

export function InputWithLabel(props: InputProps) {
  const {
    title,
    type,
    id,
    placeholder,
    onChange,
    className,
    isRequired,
    value,
    disable,
  } = props;
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={id} className="font-bold">
        {title}&nbsp;
        {isRequired && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        className={cn(className, "focus-visible:ring-transparent w-full")}
        value={value}
        disabled={disable}
      />
    </div>
  );
}
