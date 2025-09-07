import { ACTION } from "@/constants/action";

export const dialogTitle = (typeAction: string, page: string) => {
  switch (typeAction) {
    case ACTION.ADD:
      return `Thêm mới ${page}`;
    case ACTION.EDIT:
      return `Chỉnh sửa ${page}`;
    case ACTION.VIEW:
      return `Chi tiết ${page}`;
    default:
      return `Xác nhận xóa ${page}`;
  }
};
