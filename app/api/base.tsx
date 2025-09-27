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
const put = async <T = any>(endpoint: string, payload?: unknown): Promise<AxiosResponse<T>> => api.put<T>(endpoint, payload);
const remove = async <T = any>(endpoint: string): Promise<AxiosResponse<T>> => api.delete<T>(endpoint);

const base = { get, post, put, remove };
export default base;
