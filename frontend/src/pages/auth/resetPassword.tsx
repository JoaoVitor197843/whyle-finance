import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../api/apiConnect";

const ResetPassword = () => {
    const [SearchParams] = useSearchParams();
    const uid = SearchParams.get('uid');
    const token = SearchParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            if (!uid || !token) {
                void navigate('/forgot-password')
                return;
            }
            try {
            await api.get(`/auth/reset-password/?uid=${uid}&token=${token}`)
            } catch {
                void navigate('/forgot-password')
            }
        }
        void verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
        </>
    )
}

export default ResetPassword