import { IAddToCart } from "@/interface/cart.interface";
import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";

export const addToCart = async (data: IAddToCart) => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: `${URL_PATHS.CART}/add`,
      data: data,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCartByUserId = async (userId: string) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.CART}/user/${userId}`,
    });

    return res?.data?.data;
  } catch (error) {
    throw error;
  }
};
