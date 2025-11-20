import { AxiosResponse } from "axios";

export const apiRequest = async <T>(
  request: Promise<AxiosResponse<T>>,
  fallbackMessage: string
): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || fallbackMessage;
    throw new Error(message);
  }
};