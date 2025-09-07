import * as LucideIcons from "lucide-react";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  [key: string]: any;
}

const IconComponent = ({
  name,
  size = 18,
  color = "currentColor",
  ...props
}: IconProps) => {
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react!`);
    return null;
  }

  return <LucideIcon size={size} color={color} {...props} />;
};

export default IconComponent;
