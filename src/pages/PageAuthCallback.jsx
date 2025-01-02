import React, {useCallback, useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import LoadingSpinner from "../components/LoadingSpinner";
import {useSearchParams} from "react-router-dom";
import {axiosClient} from "../components/axiosClient";
import axios from "axios";

const PageAuthCallback = () => {
    const [loading, setLoading] = useState(true)
    const [params] = useSearchParams();
    const login = useCallback(async () => {
        const code = params.get("code")
        try {
            const response = await axiosClient.post("auth/oauth2", {code}, {
                // Optional configuration
            })
            if (response.status === 200) {
                const {
                    accessToken, refreshToken, session
                } = response.data
                localStorage.setItem("access_token", accessToken)
                localStorage.setItem("refresh_token", refreshToken);
                localStorage.setItem("session", JSON.stringify(session));
                window.location.href = "http://localhost:3000/"
            }
        } catch (error) {

        }
    }, [params]);
    useEffect(() => {
        login().then()
    }, [login]);
    return (<PageWrapper suffix={"page-auth"}>
        <div className={"processing"}>
            <div className={"blur"}>
                {loading && <LoadingSpinner/>}
            </div>
        </div>
    </PageWrapper>);
};

export default PageAuthCallback;