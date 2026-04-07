import type { UseFormSetError } from "react-hook-form"

type ErrorData = {
    detail: string
    errors?: Record<string, string[]>
}

export function handleApiErrors(errorData: ErrorData, setError: UseFormSetError<any>, setGlobalErrors: React.Dispatch<React.SetStateAction<string>>) {

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