import { PrismaClient } from '@prisma/client';
import { ApplicationError } from '../exceptions';

export const connection: PrismaClient = new PrismaClient();

export const validateAndReturnConnection = (connection: PrismaClient): PrismaClient => {
  if (!connection) {
    throw new ApplicationError({
      status: 500,
      code: null,
      data: null,
      message: 'Could not connect to the database.',
    });
  }

  return connection;
};
