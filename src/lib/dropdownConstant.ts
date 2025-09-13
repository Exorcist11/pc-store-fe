import { ISelectOption } from "@/interface/shared/common";

export const ROLES = [
  { title: "Người dùng", value: "user" },
  { title: "Quản trị viên", value: "admin" },
  { title: "Nhân viên", value: "staff" },
];

export const PRODUCT_TYPE: ISelectOption[] = [
  { label: "Linh kiện rời (CPU, GPU, RAM, SSD...)", value: "component" },
  { label: "Laptop", value: "laptop" },
  { label: "Máy bộ dựng sẵn", value: "prebuilt" },
  { label: "Phụ kiện chung", value: "accessory" },
];
