import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

interface RequestOptions extends AxiosRequestConfig {}

export const apiUrl = 'https://maps-api-1.onrender.com'
export const client = axios.create({ baseURL: apiUrl });

export const request = (options: RequestOptions): Promise<AxiosResponse> => {


  const onSuccess = (response: AxiosResponse) => response;
  const onError = (error: AxiosError) => {
   
    return Promise.reject(error);
  };

  return client(options).then(onSuccess).catch(onError);
};
