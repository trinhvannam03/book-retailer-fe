import axios from "axios";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";

// export const axiosClient = (accessToken) => {
//     // Create axios instance
//     const client = axios.create({
//         baseURL: "http://localhost:3979/",
//         headers: {},
//         paramsSerializer: (params) => {
//             const urlParams = new URLSearchParams(params);
//             return urlParams.toString();
//         }
//     });
//
//     client.interceptors.request.use(
//         async (config) => {
//             // First, use the passed `accessToken` (if provided)
//             let token = accessToken || localStorage.getItem("token");
//
//             // If a token is found, add it to the Authorization header
//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//
//             return config;
//         },
//         (error) => Promise.reject(error)
//     );
//
//     return client;
// }
export const axiosClient = axios.create({
    baseURL: "http://localhost:3979/", headers: {}, paramsSerializer: (params) => {
        const urlParams = new URLSearchParams(params);
        return urlParams.toString();
    }
})
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("access_token");
    config.headers.ContentType = 'application/json'
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function throwHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}


export const fetchWithRetry = async (path, method, payload, headers) => {
    const executeRequest = async () => {
        switch (method.toUpperCase()) {
            case "GET":
                return await axiosClient.get(path, {headers});
            case "POST":
                return await axiosClient.post(path, payload, {headers});
            case "PUT":
                return await axiosClient.put(path, payload, {headers});
            case "DELETE":
                return await axiosClient.delete(path, {headers});
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }
    };
    try {
        return await executeRequest();
    } catch (error) {
        if (error.response.status === 403) {
            try {
                //always 401 so that we redirect to login page (if necessary) every time a 401 is thrown.
                const session = JSON.parse(localStorage.getItem("session"))
                const refreshResponse = await axiosClient.post("auth/refresh", {
                    refreshToken: localStorage.getItem("refresh_token"),
                    session: session
                })
                //other than 401. if still 403, redirect to login page.
                if (refreshResponse.status === 200) {
                    localStorage.setItem('access_token', refreshResponse.data.accessToken);
                    localStorage.setItem("refresh_token", refreshResponse.data.refreshToken)
                    return await executeRequest();
                }
            } catch (refreshError) {
                throw refreshError;
            }
        }
        throw error;
    }
}

export const ScrollToTop = ({children}) => {
    const {pathname} = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <>
            {children}
        </>
    );
};
