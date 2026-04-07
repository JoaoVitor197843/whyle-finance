import { api } from "../apiConnect";

type RegisterData = {
    username: string;
    first_name?: string;
    last_name?: string;
    email: string
    password: string;
};


export const register = (data: RegisterData) => api.post('/auth/register/', data);