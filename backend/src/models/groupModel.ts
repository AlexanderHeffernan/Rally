import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createGroup = async (name: string, sport: string, adminId: string, userIds: string[]) =>
  prisma.group.create({
    data: {
      name,
      sport,
      adminId,
      users: { connect: userIds.map(id => ({ id })) }
    },
    include: { users: true, admin: true }
  });

export const getGroupsForUser = async (userId: string) =>
  prisma.group.findMany({
    where: {
      users: { some: { id: userId } }
    },
    include: { users: true, admin: true }
  });

export const getGroupById = async (groupId: string) =>
  prisma.group.findUnique({
    where: { id: groupId },
    include: { users: true, admin: true }
  });

export const addUserToGroup = async (groupId: string, userId: string) =>
  prisma.group.update({
    where: { id: groupId },
    data: { users: { connect: { id: userId } } },
    include: { users: true, admin: true }
  });