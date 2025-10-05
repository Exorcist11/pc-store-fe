import { IApiOrderByUserParams, IApiParams } from "@/interface/shared/api";
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

export const getOrderById = async (id: string) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.ORDERS}/${id}`,
    });
    return res?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderByUser = async (params: IApiOrderByUserParams) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.ORDERS}/user/${params?.userId}`,
      params: params,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};
