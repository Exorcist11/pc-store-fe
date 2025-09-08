import { IApiParams } from "@/interface/shared/api";
import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";
import { IBrand } from "@/interface/brands.interface";

export const getAllBrands = async (params?: IApiParams) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.BRANDS}`,
      params: params,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const createNewBrand = async (payload: IBrand) => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: `${URL_PATHS.BRANDS}`,
      data: payload,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
