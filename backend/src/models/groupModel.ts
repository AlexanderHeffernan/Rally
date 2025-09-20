import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Create a new group with the specified name, sport, admin, and users.
 * @param name 
 * @param sport 
 * @param adminId 
 * @param userIds
 * @returns The created group.
 */
export const createGroup = async (name: string, sport: string, adminId: string, userIds: string[]) => {
    return prisma.group.create({
        data: {
            name,
            sport,
            adminId,
            users: { connect: userIds.map(id => ({ id })) }
        },
        include: { users: true, admin: true }
    });
};

/**
 * Get all groups that a user belongs to.
 * @param userId 
 * @returns List of groups.
 */
export const getGroupsForUser = async (userId: string) => {
    return prisma.group.findMany({
        where: {
            users: { some: { id: userId } }
        },
        include: { users: true, admin: true }
    });
};

/** * Get a group by its ID.
 * @param groupId 
 * @returns Group details or null if not found.
 */
export const getGroupById = async (groupId: string) => {
    return prisma.group.findUnique({
        where: { id: groupId },
        include: { users: true, admin: true }
    });
};

/**
 * Add a user to a group.
 * @param groupId 
 * @param userId 
 * @returns Updated group details.
 */
export const addUserToGroup = async (groupId: string, userId: string) => {
    return prisma.group.update({
        where: { id: groupId },
        data: { users: { connect: { id: userId } } },
        include: { users: true, admin: true }
    });
};