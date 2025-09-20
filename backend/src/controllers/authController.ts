import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { addUser, findUserByUsername, getUserAvailability, setUserAvailability } from '../models/userModel';

/**
 * Register a new user.
 * @param req
 * @param res 
 * @returns 201 on success, 400/409 on failure.
 */
export const register = async (req: Request, res: Response) => {
    // Ensure username and password are provided
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }

    // Check if user already exists
    const existing = await findUserByUsername(username);
    if (existing) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await addUser(username, passwordHash);

    // Store user ID in session
    req.session.userId = user.id;

    // Respond with success
    res.status(201).json({ message: 'User registered successfully.' });
};

/**
 * Login an existing user.
 * @param req 
 * @param res 
 * @returns 200 on success, 400/401 on failure.
 */
export const login = async (req: Request, res: Response) => {
    // Ensure username and password are provided
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }

    // Find user and validate password
    const user = await findUserByUsername(username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Store user ID in session
    req.session.userId = user.id;

    // Respond with success
    res.json({ message: 'Login successful.' });
};

/**
 * Logout the current user.
 * @param req 
 * @param res 
 * @returns 200 on success.
 */
export const logout = (req: Request, res: Response) => {
    // Destroy the session
    req.session.destroy(() => {
        res.json({ message: 'Logged out.' });
    });
};

/**
 * Get the current user's availability.
 * @param req 
 * @param res 
 * @returns 200 with availability data or 401 if not logged in.
 */
export const getAvailability = async (req: Request, res: Response) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
    const result = await getUserAvailability(req.session.userId);
    res.json({ availability: result?.availability || {} });
};

/**
 * Update the current user's availability.
 * @param req 
 * @param res 
 * @returns 200 on success or 401 if not logged in.
 */
export const updateAvailability = async (req: Request, res: Response) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
    const { availability } = req.body;
    if (!availability) return res.status(400).json({ message: 'No availability provided' });
    await setUserAvailability(req.session.userId, availability);
    res.json({ message: 'Availability updated' });
};