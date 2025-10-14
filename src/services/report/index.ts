import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";

export const getReport = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.DASHBOARD}`,
      params: params,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getReportByPeriod = async (params?: {
  startDate: string;
  endDate: string;
  period: "month" | "week" | "day";
}) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `${URL_PATHS.REVENUE_BY_PERIOD}`,
      params: params,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};
