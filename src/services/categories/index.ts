import { IApiParams } from "@/interface/shared/api";
import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";
import { ICategory } from "@/interface/category.interface";

export const getAllCategories = async (params?: IApiParams) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.CATEGORIES}`,
      params: params,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.CATEGORIES}/${id}`,
    });
    return res?.data.data;
  } catch (error) {
    throw error;
  }
};

export const createNewCategory = async (payload: ICategory) => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: `${URL_PATHS.CATEGORIES}`,
      data: payload,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (id: string, payload: ICategory) => {
  try {
    const res = await axiosInstance({
      method: "PATCH",
      url: `${URL_PATHS.CATEGORIES}/${id}`,
      data: payload,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const res = await axiosInstance({
      method: "DELETE",
      url: `${URL_PATHS.CATEGORIES}/${id}`,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPublicCategory = async (params?: IApiParams) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.PUBLIC_CATEGORY}`,
      params: params,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getPublicProductByCategorySlug = async (
  slug: string,
  params?: IApiParams
) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.PUBLIC_PRODUCT_BY_CATEGORY}/${slug}`,
      params: params,
    });
    return res?.data.data;
  } catch (error) {
    throw error;
  }
};
