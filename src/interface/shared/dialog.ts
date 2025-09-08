export interface IDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: string;
  setType: (type: string) => void;
  id: string;
  reload?: (pageIndex: number) => Promise<void>;
}
