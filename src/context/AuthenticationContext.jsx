import React, {createContext, useContext, useEffect, useState} from 'react';
import {axiosClient, fetchWithRetry} from "../components/axiosClient";
import {UAParser} from "ua-parser-js";

const baseURL = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount';
const params = {
    client_id: '315074024599-2ftepktk2pkjo21bikn8nj0nvav618tr.apps.googleusercontent.com',
    scope: 'profile email openid', // The requested scopes
    redirect_uri: 'http://localhost:3000/auth/callback', // Your redirect URI
    prompt: 'consent', // Ensure that the user is prompted to grant consent
    response_type: 'code', // Use authorization code flow
    service: 'lso', // Internal Google service identifier
    o2v: '1', // OAuth version
    ddm: '1', // Unknown, likely internal use
    flowName: 'GeneralOAuthFlow' // General flow name for OAuth
};

function buildOAuthURL(baseURL, params) {
    const queryString = new URLSearchParams(params).toString(); // Convert params object to query string
    return `${baseURL}?${queryString}`; // Append the query string to the base URL
}

export const oauthURL = buildOAuthURL(baseURL, params);

export const AuthenticationContext = createContext();
export const AuthenticationProvider = ({children}) => {


    const getProfile = async () => {
        try {
            const response = await fetchWithRetry("api/user/profile", "GET");
            setProfile(response.data)
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        }
    }
    const [browser, setBrowser] = useState({})
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
                browserName, osName, osVersion, deviceType, userAgent, ipAddress, timestamp: new Date().toISOString(),
            }
            setBrowser(deviceInfo)
        } catch (error) {
            return {}
        }
    };
    const CLIENT_ID = "968131579401-sp8mcjvsskkv0djfk2sc65pp51qkpp16.apps.googleusercontent.com";
    const scopes = ["scope", ["openid", "email", "profile"]];
    const response_type = ["response_type", "code"];

    useEffect(() => {
        collectBrowserInfo().then()
    }, []);
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
    const [profile, setProfile] = useState({})
    useEffect(() => {
        getProfile().then();
    }, []);
    return (<AuthenticationContext.Provider
        value={{
            browser, getProfile, isAuthenticated, setIsAuthenticated, profile, setProfile, logout
        }}>
        {children}
    </AuthenticationContext.Provider>);
};

export const useAuthentication = () => {
    const context = useContext(AuthenticationContext);

    // If context is not available, return fallback values
    if (!context) {
        return {
            profile: undefined, setIsAuthenticated: undefined, // Fallback for setRecords function
            isAuthenticated: false, // Fallback for checkedItems
            setProfile: undefined, getProfile: undefined
        };
    }

    return context;
};
