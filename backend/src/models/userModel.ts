import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserByUsername = async (username: string) =>
    prisma.user.findUnique({ where: { username } });

export const addUser = async (username: string, passwordHash: string) =>
    prisma.user.create({ data: { username, passwordHash } });

export const findUserById = async (id: string) =>
    prisma.user.findUnique({ where: { id } });