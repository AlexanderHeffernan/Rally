import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** 
 * Find a user by their username.
 * @param username 
 * @returns User object or null if not found.
 */
export const findUserByUsername = async (username: string) =>
    prisma.user.findUnique({ where: { username } });

/**
 * Add a new user to the database.
 * @param username 
 * @param passwordHash 
 * @returns Created user object.
 */
export const addUser = async (username: string, passwordHash: string) =>
    prisma.user.create({ data: { username, passwordHash } });

/**
 * Find a user by their ID.
 * @param id 
 * @returns User object or null if not found.
 */
export const findUserById = async (id: string) =>
    prisma.user.findUnique({ where: { id } });