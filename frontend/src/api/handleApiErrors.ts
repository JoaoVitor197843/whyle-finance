import type { UseFormSetError } from "react-hook-form"

type ErrorData = {
    detail: string
    errors?: Record<string, string[]>
}

export function handleApiFormErrors(errorData: ErrorData, setError: UseFormSetError<any>, setGlobalErrors: React.Dispatch<React.SetStateAction<string>>) {

    if(errorData.errors) {
        const errors = errorData.errors;
        Object.entries(errors).forEach(([field, messages]) => {
            setError(field, {
                type: "server",
                message: messages?.[0] || "Unknown error"
            });
        })
        };
    if(errorData.detail && setGlobalErrors) {
    setGlobalErrors(errorData.detail);
    };

    return errorData;
}

export function handleApiErrors(errorData: ErrorData, setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>) {

    if(errorData.errors) {
        const errors = errorData.errors;
        Object.entries(errors).forEach(([field, messages]) => {
            setErrors(prev => ({...prev, 
                [field]: messages?.[0] || "Unknown error"
            }));
        })
        };
    if(errorData.detail) {
    setErrors(prev => ({...prev, detail: errorData.detail}));
    };

    return errorData;
}