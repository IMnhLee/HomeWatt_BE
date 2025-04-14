import { Logger, NotFoundException } from '@nestjs/common';
import { Repository, DeepPartial, FindOptionsWhere, FindManyOptions, FindOneOptions } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IRepository } from './repository.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends BaseEntity> implements IRepository<T> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    try {
      const saved = await this.repository.save(entity);
      this.logger.log(`Entity created with id: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to create entity: ${error.message}`);
      throw error;
    }
  }

  async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    const entities = this.repository.create(data);
    try {
      const saved = await this.repository.save(entities);
      this.logger.log(`Created ${saved.length} entities`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to create entities: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>
    });

    if (!entity) {
      this.logger.warn(`Entity not found with id: ${id}`);
      throw new NotFoundException('Entity not found');
    }

    return entity;
  }

  async findOneBy(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findOne(options);
    
    if (!entity) {
      this.logger.warn(`Entity not found with specified criteria`);
      throw new NotFoundException('Entity not found');
    }
    
    return entity;
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findWithOptions(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  async update(id: string, data: QueryDeepPartialEntity<T>): Promise<T> {
    try {
      await this.repository.update(id, data);
      return this.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to update entity: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      this.logger.error(`Failed to delete entity: ${error.message}`);
      throw error;
    }
  }

  async transaction<R>(operation: () => Promise<R>): Promise<R> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      this.logger.error(`Transaction failed: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as FindOptionsWhere<T>
    });
    return count > 0;
  }
}