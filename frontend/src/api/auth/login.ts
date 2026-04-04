import { api } from "../api_connect";

type LoginData = {
    email: string;
    password: string;
};

export const login = (data: LoginData) => api.post('/login/', data);