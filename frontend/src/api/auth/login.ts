import { api } from "../apiConnect";

type LoginData = {
    email: string;
    password: string;
};

export const login = (data: LoginData) => api.post('/auth/login/', data);