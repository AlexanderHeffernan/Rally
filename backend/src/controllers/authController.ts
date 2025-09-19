import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { addUser, findUserByUsername } from '../models/userModel';

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }
    const existing = await findUserByUsername(username);
    if (existing) {
        return res.status(409).json({ message: 'Username already exists.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await addUser(username, passwordHash);
    req.session.userId = user.id;
    res.status(201).json({ message: 'User registered successfully.' });
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    req.session.userId = user.id;
    res.json({ message: 'Login successful.' });
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out.' });
    });
};