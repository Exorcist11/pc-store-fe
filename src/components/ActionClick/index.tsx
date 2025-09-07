import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { dropDownMenus } from "@/lib/dropdownMenu";

interface IActionClick {
  onMenuClick: (key: string) => void;
}

export default function ActionClick(props: IActionClick) {
  const { onMenuClick } = props;
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-slate-200 py-1 px-2 rounded-lg focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0">
          <Ellipsis size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {dropDownMenus.map((menu, index) => (
            <DropdownMenuItem
              key={index}
              className="hover:cursor-pointer"
              onClick={() => onMenuClick(menu.action)}
            >
              {menu.icon} {menu.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
