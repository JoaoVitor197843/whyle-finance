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
            try {
            api.get(`/reset-password/?uid=${uid}&token=${token}`)
            } catch {
                navigate('/forgot-password/')
            }
        }
        verifyToken();
    }, [])

    return (
        <>
        </>
    )
}

export default ResetPassword