import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

interface InputWithLabelProps {
  title: string;
  type?: "text" | "password" | "email" | "number" | "tel";
  id?: string;
  placeholder?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  className?: string;
  isRequired?: boolean;
  value?: string | number;
  disable?: boolean;
  as?: "input" | "textarea"; 
  rows?: number; 
}

export function InputWithLabel(props: InputWithLabelProps) {
  const {
    title,
    type = "text",
    id,
    placeholder,
    onChange,
    className,
    isRequired,
    value,
    disable,
    as = "input",
    rows = 4,
  } = props;

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={id} className="font-bold">
        {title}&nbsp;
        {isRequired && <span className="text-red-500">*</span>}
      </Label>

      {as === "textarea" ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          className={cn(
            className,
            "focus-visible:ring-transparent w-full p-2 border rounded-md"
          )}
          value={value as string | undefined}
          disabled={disable}
          rows={rows}
        />
      ) : (
        <Input
          type={type}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          className={cn(className, "focus-visible:ring-transparent w-full")}
          value={value}
          disabled={disable}
        />
      )}
    </div>
  );
}
