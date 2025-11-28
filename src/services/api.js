import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "X-API-KEY": import.meta.env.VITE_API_KEY,

    },
});

const postData = async ({ url, data }) => {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    const response = await apiClient.post(url, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

const getData = async (url) => {
    return apiClient
        .get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => response.data)
        .catch((error) => error);
};

export const usePOST = (key) => {
    return useMutation({
        mutationKey: [key],
        mutationFn: postData,
    });
};

export const useGET = (url, options = {}) => {
    return useQuery({
        queryKey: [url],
        queryFn: () => getData(url),
        enabled: options.enabled ?? true, // default true
        ...options, // biar bisa pakai option lain seperti staleTime, refetchOnWindowFocus
    });
};

const deleteData = async (url) => {
    const response = await apiClient.delete(url, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

export const useDELETE = (key) => {
    return useMutation({
        mutationKey: [key],
        mutationFn: deleteData,
    });
};



const patchData = async ({ url, data }) => {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    const response = await apiClient.patch(url, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

export const usePATCH = (key) => {
    return useMutation({
        mutationKey: [key],
        mutationFn: patchData,
    });
};

