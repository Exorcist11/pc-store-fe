import { create } from "zustand";

export interface IUserInfo {
  id: string;
  userName: string;
  userType: string;
  displayName: string;
  email: string;
  title: string;
  isActive: boolean;
  roles: IRole[];
  image: string;
  userHistories: IUserHistory[];
  phoneNumber: string;
  country: string;
  currencyCode: string;
  status: string;
  gender: string;
  birthDay: Date;
  firstName: string;
  lastName: string;
}

interface IRole {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}
interface IUserHistory {
  action: string;
  environment: string;
  ipConnected: string;
  deviceName: boolean;
}

interface IUserInfoState {
  userInfo: IUserInfo | null;
  setUserInfo: (newUserInfo: IUserInfo) => void;
}

const useStoreUserInfo = create<IUserInfoState>((set) => ({
  userInfo: null,
  setUserInfo: (newUserInfo) => set({ userInfo: newUserInfo }),
}));

export const useUserInfo = () => {
  const userInfo = useStoreUserInfo((state) => state.userInfo);
  const setUserInfo = useStoreUserInfo((state) => state.setUserInfo);

  return { userInfo, setUserInfo };
};

export default useStoreUserInfo;
