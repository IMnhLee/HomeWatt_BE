import { DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IRepository<T> {
    create(data: DeepPartial<T>): Promise<T>;
    createMany(data: DeepPartial<T>[]): Promise<T[]>;
    findOne(id: string): Promise<T>;
    findOneBy(options: any): Promise<T>;
    findAll(): Promise<T[]>;
    findWithOptions(options: any): Promise<T[]>;
    count(options?: any): Promise<number>;
    update(id: string, data: QueryDeepPartialEntity<T>): Promise<T>;
    delete(id: string): Promise<boolean>;
    transaction<R>(operation: () => Promise<R>): Promise<R>;
    exists(id: string): Promise<boolean>;
  }