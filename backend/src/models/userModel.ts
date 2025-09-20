import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** 
 * Find a user by their username.
 * @param username 
 * @returns User object or null if not found.
 */
export const findUserByUsername = async (username: string) => {
    return prisma.user.findUnique({ where: { username } });
};

/**
 * Add a new user to the database.
 * @param username 
 * @param passwordHash 
 * @returns Created user object.
 */
export const addUser = async (username: string, passwordHash: string) => {
    return prisma.user.create({ data: { username, passwordHash } });
};

/**
 * Find a user by their ID.
 * @param id 
 * @returns User object or null if not found.
 */
export const findUserById = async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
};

/**
 * Get a user's availability.
 * @param userId 
 * @returns User's availability or null if not set.
 */
export const getUserAvailability = async (userId: string) => {
    return prisma.user.findUnique({ where: { id: userId }, select: { availability: true } });
};

/** * Set or update a user's availability.
 * @param userId 
 * @param availability 
 * @returns Updated user object.
 */
export const setUserAvailability = async (userId: string, availability: any) => {
    return prisma.user.update({ where: { id: userId }, data: { availability } });
};