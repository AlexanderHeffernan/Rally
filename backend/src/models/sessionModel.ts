import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createSession = async (groupId: string, date: Date, startHour: number, endHour: number) => {
    return prisma.session.create({
        data: { groupId, date, startHour, endHour },
        include: { going: true, notGoing: true }
    });
};

export const getSessionsForGroup = async (groupId: string) => {
    return prisma.session.findMany({
        where: { groupId },
        include: { going: true, notGoing: true }
    });
};

export const getSessionsForUser = async (userId: string) => {
    return prisma.session.findMany({
        where: {
            OR: [
                { going: { some: { id: userId } } },
                { notGoing: { some: { id: userId } } },
                { group: { users: { some: { id: userId } } } }
            ]
        },
        include: { group: true, going: true, notGoing: true }
    });
};

export const respondToSession = async (sessionId: string, userId: string, going: boolean) => {
    // Remove from both lists, then add to the correct one
    await prisma.session.update({
        where: { id: sessionId },
        data: {
            going: { disconnect: { id: userId } },
            notGoing: { disconnect: { id: userId } }
        }
    });
    return prisma.session.update({
        where: { id: sessionId },
        data: going
            ? { going: { connect: { id: userId } } }
            : { notGoing: { connect: { id: userId } } },
        include: { going: true, notGoing: true }
    });
};