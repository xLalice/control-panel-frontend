import { AxiosResponse } from "axios";

export const apiRequest = async <T>(
  request: Promise<AxiosResponse<T>>,
  fallbackMessage: string
): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    const serverData = error.response?.data || {};

    const message = serverData.message || serverData.error || fallbackMessage;

    const customError = new Error(message);

    (customError as any).details = serverData.details;

    (customError as any).response = error.response;

    throw customError;
  }
};