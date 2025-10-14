import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useTemporaryAlert = (redirectUrl = null, duration = 2000) => {
    const [visibleSuccessAlert, setVisible] = useState(false);
    const timeoutRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    const showSuccessAlert = () => {
        setVisible(false);
        clearTimeout(timeoutRef.current);

        setTimeout(() => {
            setVisible(true);
            timeoutRef.current = setTimeout(() => {
                setVisible(false);
                if (redirectUrl) {
                    navigate(redirectUrl);
                }
            }, duration);
        }, 10);
    };
    
    return { visibleSuccessAlert, showSuccessAlert };
};