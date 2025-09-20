import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to require authentication.
 * @param req 
 * @param res 
 * @param next 
 * @returns 401 if not authenticated, otherwise calls next().
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.userId) { next(); }
    else { res.status(401).json({ message: 'Unauthorized' }); }
};