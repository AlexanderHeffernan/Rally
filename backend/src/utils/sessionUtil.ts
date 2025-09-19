import { sign, verify } from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key'; // Replace with a strong secret key
const EXPIRATION_TIME = '1h'; // Session expiration time

export const createSessionToken = (userId: string) => {
    const token = sign({ id: userId }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
    return token;
};

export const validateSessionToken = (token: string) => {
    try {
        const decoded = verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        return null;
    }
};