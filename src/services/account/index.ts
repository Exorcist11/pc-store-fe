import axiosInstance from '../api-services';
import URL_PATHS from '../url-path';

export const GetCurrentUser = async () => {
  try {
    const res = await axiosInstance.get(URL_PATHS.GET_CURRENT_USER);
    return res;
  } catch (error) {
    throw error;
  }
};

export const GetPermission = async () => {
  try {
    const res = await axiosInstance.get(URL_PATHS.GET_CURRENT_USER);
    return res;
  } catch (error) {
    throw error;
  }
};
