import { ACTION, ACTION_LABEL } from "@/constants/action";
import { Send, SquarePen, Trash2 } from "lucide-react";
import { ReactElement } from "react";

interface DropdownMenuItem {
  title: string;
  icon: ReactElement;
  action: string;
}

export const dropDownMenus: DropdownMenuItem[] = [
  { title: ACTION_LABEL.VIEW, icon: <Send />, action: ACTION.VIEW },
  { title: ACTION_LABEL.EDIT, icon: <SquarePen />, action: ACTION.EDIT },
  { title: ACTION_LABEL.DELETE, icon: <Trash2 />, action: ACTION.DELETE },
];
