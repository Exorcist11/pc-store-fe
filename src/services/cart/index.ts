import { IAddToCart } from "@/interface/cart.interface";
import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";

export const addToCart = async (data: IAddToCart) => {
  try {
    const res = await axiosInstance({
      method: "PATCH",
      url: `${URL_PATHS.CART}`,
      data: data,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
