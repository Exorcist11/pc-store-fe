import { IApiParams } from "@/interface/shared/api";
import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";

export const getAllUsers = async (params?: IApiParams) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.USERS}`,
      params: params,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};
