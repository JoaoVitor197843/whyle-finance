import { api } from '../apiConnect';

type verifyEmailData = {
    token: string | null;
    uid: string | null;
}

export const verifyEmail = (data: verifyEmailData) =>  api.post('/auth/verify-email/', data)