import { IApiParams } from "@/interface/shared/api";
import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";

export const getAllOrders = async (params?: IApiParams) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.ORDERS}`,
      params: params,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};
