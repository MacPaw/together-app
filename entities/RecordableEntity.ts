import type { Nullable } from '../types';

export interface RecordableEntityAttributes {
  id: string;
  createdAt: Nullable<Date>;
  updatedAt: Nullable<Date>;
}

export type CreatableEntityAttributes<T extends RecordableEntityAttributes> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type SavableEntityAttributes<T extends RecordableEntity> = Omit<T, 'createdAt' | 'updatedAt'>;

export interface SerializableTimestamps {
  createdAt: Nullable<string>;
  updatedAt: Nullable<string>;
}

export class RecordableEntity {
  public readonly id: string;

  public readonly createdAt: Nullable<Date>;

  public readonly updatedAt: Nullable<Date>;

  constructor(params: RecordableEntityAttributes) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  public static getSavableAttributes<T extends RecordableEntity>(record: T): SavableEntityAttributes<T> {
    const pruned = { ...record };
    const { createdAt, updatedAt, ...rest } = pruned;

    return rest;
  }

  protected getSerializableTimestamps(): SerializableTimestamps {
    return {
      createdAt: this.createdAt ? this.createdAt.toISOString() : null,
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
    };
  }
}
