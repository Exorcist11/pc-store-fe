import axiosInstance from "../api-services";
import URL_PATHS from "../url-path";
import { z } from "zod";

export const fileSchema = {
  name: z.string().optional(),
  file: z.instanceof(File).optional(),
  urlPath: z.string().optional(),
  type: z.string().optional(),
};

export const uploadFile = async (formData: FormData) => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: URL_PATHS.UPLOAD_IMG,
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
      timeout: 300000,
    });

    return res.data.data.url;
  } catch (error) {
    throw error;
  }
};
