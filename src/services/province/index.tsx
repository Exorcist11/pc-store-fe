import axiosInstance from "../api-services";

const URL = "https://provinces.open-api.vn";

export const getProvinces = async () => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `https://provinces.open-api.vn/api/v2/p/`,
    });

    return res;
  } catch (error) {
    throw error;
  }
};
