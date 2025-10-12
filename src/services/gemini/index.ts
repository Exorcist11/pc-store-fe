import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";

export const getGeminiRecommend = async (payload: { query: string }) => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: `${URL_PATHS.GEMINI}`,
      data: payload,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};
