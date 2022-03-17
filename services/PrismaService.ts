import type { PrismaClient } from '@prisma/client';

export interface PrismaServiceParams {
  connection: PrismaClient
}

export class PrismaService {
  protected readonly connection: PrismaClient;

  constructor(params: PrismaServiceParams) {
    this.connection = params.connection;
  }
}
