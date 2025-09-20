import { Request, Response } from 'express';
import { createSession, getSessionsForGroup, getSessionsForUser, respondToSession } from '../models/sessionModel';

export const createSessionHandler = async (req: Request, res: Response) => {
    const { groupId, date, startHour, endHour } = req.body;
    if (!groupId || !date || startHour == null || endHour == null) return res.status(400).json({ message: 'Missing fields' });
    const session = await createSession(groupId, new Date(date), startHour, endHour);
    res.status(201).json(session);
};

export const getGroupSessionsHandler = async (req: Request, res: Response) => {
    const groupId = req.params.groupId;
    const sessions = await getSessionsForGroup(groupId);
    res.json(sessions);
};

export const getUserSessionsHandler = async (req: Request, res: Response) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const sessions = await getSessionsForUser(userId);
    res.json(sessions);
};

export const respondSessionHandler = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { going } = req.body;
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const session = await respondToSession(sessionId, userId, going);
    res.json(session);
};