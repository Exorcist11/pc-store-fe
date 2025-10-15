import { IApiParams } from "@/interface/shared/api";
import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";
import { IUserPayload } from "@/interface/user.interface";

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

export const getUserById = async (id: string) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.USERS}/${id}`,
    });
    return res?.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: string, payload: IUserPayload) => {
  try {
    const res = await axiosInstance({
      method: "PATCH",
      url: `${URL_PATHS.USERS}/${id}`,
      data: payload,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (payload: IUserPayload) => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: `${URL_PATHS.USERS}`,
      data: payload,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};
