import axios, { AxiosResponse } from "axios";

const URI = "http://localhost:3001";

const api = axios.create({
    baseURL: URI,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,

});

const get = async <T = any>(endpoint: string): Promise<AxiosResponse<T>> => api.get<T>(endpoint);
const post = async <T = any>(endpoint: string, payload?: unknown): Promise<AxiosResponse<T>> => api.post<T>(endpoint, payload);
const postImg = async <T = any>(
    endpoint: string,
    payload?: unknown,
    config?: any
): Promise<AxiosResponse<T>> => api.post<T>(endpoint, payload, config);

const put = async <T = any>(endpoint: string, payload?: unknown): Promise<AxiosResponse<T>> => api.put<T>(endpoint, payload);
const remove = async <T = any>(
    endpoint: string,
    config?: any
): Promise<AxiosResponse<T>> => api.delete<T>(endpoint, config);

// ✅ Versión extendida del GET para permitir params opcionales
const getParams = async <T = any>(
    endpoint: string,
    config?: Record<string, any> // <-- este parámetro opcional permitirá { params }
): Promise<AxiosResponse<T>> => api.get<T>(endpoint, config);

const base = { get, post, put, remove, postImg, getParams };
export default base;
