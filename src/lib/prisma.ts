import { PrismaClient } from '@prisma/client';

// PrismaClient instance for whole application use.
const prisma = new PrismaClient();

export default prisma;
