import React, {createContext, useContext, useEffect, useState} from 'react';
import {fetchWithRetry} from "../components/axiosClient";
import {UAParser} from "ua-parser-js";

export const AuthenticationContext = createContext();
export const AuthenticationProvider = ({children}) => {

    const isAuthenticatedCheck = async () => {
        try {
            const response = await fetchWithRetry("api/user/profile", "GET");
            setBasicInfo(response.data)
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        }
    }
    const collectBrowserInfo = async () => {
        try {
            const parser = new UAParser();
            const result = parser.getResult();
            const browserName = result.browser.name + result.browser.version;
            const osName = result.os.name;
            const osVersion = result.os.version;
            const deviceType = result.device.type || "desktop";
            const userAgent = navigator.userAgent;
            let ipAddress = undefined
            try {
                const ipResponse = await fetch("https://api.ipify.org?format=json");
                const ipData = await ipResponse.json();
                ipAddress = ipData.ip;
            } catch (error) {

            }
            const deviceInfo = {
                browserName,
                osName,
                osVersion,
                deviceType,
                userAgent,
                ipAddress,
                timestamp: new Date().toISOString(),
            }
            return deviceInfo;
        } catch (error) {
            return {}
        }
    };
    const logout = async (session) => {
        try {
            const response = await fetchWithRetry("auth/logout", "POST", session)
            if (response.status === 200) {
                localStorage.clear();
                window.location.href = "/auth"
            }
        } catch (error) {
            localStorage.clear();
            window.location.href = "/auth"
        }
    }
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [basicInfo, setBasicInfo] = useState({})
    useEffect(() => {
        isAuthenticatedCheck().then();
    }, []);
    return (
        <AuthenticationContext.Provider
            value={{
                isAuthenticatedCheck,
                collectBrowserInfo,
                isAuthenticated,
                setIsAuthenticated,
                basicInfo,
                setBasicInfo,
                logout
            }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export const useAuthentication = () => {
    const context = useContext(AuthenticationContext);

    // If context is not available, return fallback values
    if (!context) {
        return {
            basicInfo: undefined,
            setIsAuthenticated: undefined, // Fallback for setRecords function
            isAuthenticated: false, // Fallback for checkedItems
            setBasicInfo: undefined,
            isAuthenticatedCheck: undefined
        };
    }

    return context;
};
