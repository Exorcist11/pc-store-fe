import { IApiParams } from "@/interface/shared/api";
import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";
import { ICreateProduct } from "@/interface/product.interface";

export const getAllProducts = async (params?: IApiParams) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.PRODUCTS}`,
      params: params,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.PRODUCTS}/${id}`,
    });
    return res?.data.data;
  } catch (error) {
    throw error;
  }
};

export const createNewProduct = async (payload: ICreateProduct) => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: `${URL_PATHS.PRODUCTS}`,
      data: payload,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id: string, payload: ICreateProduct) => {
  try {
    const res = await axiosInstance({
      method: "PATCH",
      url: `${URL_PATHS.PRODUCTS}/${id}`,
      data: payload,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await axiosInstance({
      method: "DELETE",
      url: `${URL_PATHS.PRODUCTS}/${id}`,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFeatureProduct = async (params?: IApiParams) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.FEATURE_PRODUCT}`,
      params: params,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};
