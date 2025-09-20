import { Request, Response } from 'express';
import { getGroupById, addUserToGroup, createGroup, getGroupsForUser } from '../models/groupModel';

/**
 * Handler to create a new group.
 * @param req 
 * @param res 
 * @returns 201 status with group data or error message.
 */
export const createGroupHandler = async (req: Request, res: Response) => {
    // Preare data for group creation
    const { name, sport } = req.body;
    const adminId = req.session.userId;

    // Validate data
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
    if (!name || !sport) return res.status(400).json({ message: 'Name and sport required' });

    // Create group
    try {
        const group = await createGroup(name, sport, adminId, [adminId]);
        res.status(201).json(group);
    } catch (e) {
        res.status(500).json({ message: 'Failed to create group' });
    }
};

/**
 * Handler to get groups for the logged-in user.
 * @param req 
 * @param res 
 * @returns List of groups or error message.
 */
export const getMyGroupsHandler = async (req: Request, res: Response) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const groups = await getGroupsForUser(userId);
        res.json(groups);
    } catch (e) {
        res.status(500).json({ message: 'Failed to fetch groups' });
    }
};

/**
 * Handler to get details of a specific group by ID.
 * @param req 
 * @param res 
 * @returns Group details or error message.
 */
export const getGroupHandler = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const group = await getGroupById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
};

/**
 * Handler to join a group.
 * @param req 
 * @param res 
 * @returns Updated group details or error message.
 */
export const joinGroupHandler = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const group = await addUserToGroup(groupId, userId);
        res.json(group);
    } catch {
        res.status(400).json({ message: 'Could not join group' });
    }
};