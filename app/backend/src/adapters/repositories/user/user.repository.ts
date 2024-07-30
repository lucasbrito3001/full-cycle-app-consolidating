import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { TUser, UserFactory } from 'src/domain/factory/user';
// import { User } from 'src/domain/user/user.domain';
import { InternalErrorException } from 'src/shared/exceptions';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger('UserRepository');

  constructor(
    @InjectDataSource('pgsql')
    private pgsqlDataSource: DataSource,
    private userFactory: UserFactory,
  ) {}

  async save(user: TUser): Promise<TUser> {
    this.logger.log('Converting user domain to entity');

    let userEntity = UserEntity.fromDomain(user);

    this.logger.log('Creating save data source query runner');
    const queryRunner = this.pgsqlDataSource.createQueryRunner();

    this.logger.log('Connecting query runner to connection pool');
    await queryRunner.connect();

    try {
      this.logger.log('Saving user to database');
      userEntity = await queryRunner.manager.save(UserEntity, userEntity);
    } catch (error) {
      throw new InternalErrorException(error);
    } finally {
      this.logger.log('Releasing connection');
      await queryRunner.release();
    }

    this.logger.log('Converting user entity to domain and returning');
    return this.userFactory.fromEntity(userEntity);
  }

  async findByEmail(email: string): Promise<TUser | null> {
    this.logger.log('Creating findByEmail data source query runner');
    const queryRunner = this.pgsqlDataSource.createQueryRunner();

    let userEntity: UserEntity | null = null;

    this.logger.log('Connecting query runner to connection pool');
    await queryRunner.connect();

    try {
      this.logger.log('Searching user by email');
      userEntity = await queryRunner.manager.findOneBy(UserEntity, { email });
    } catch (error) {
      throw new InternalErrorException(error);
    } finally {
      this.logger.log('Releasing connection');
      await queryRunner.release();
    }

    if (userEntity === null) return null;

    this.logger.log('Converting user entity to domain and returning');
    return this.userFactory.fromEntity(userEntity);
  }

  async findByUUID(uuid: string): Promise<TUser | null> {
    this.logger.log('Creating findByUUID data source query runner');
    const queryRunner = this.pgsqlDataSource.createQueryRunner();

    let userEntity: UserEntity | null = null;

    this.logger.log('Connecting query runner to connection pool');
    await queryRunner.connect();

    try {
      this.logger.log('Searching user by UUID');
      userEntity = await queryRunner.manager.findOneBy(UserEntity, { uuid });
    } catch (error) {
      throw new InternalErrorException(error);
    } finally {
      this.logger.log('Releasing connection');
      await queryRunner.release();
    }

    if (userEntity === null) return null;

    this.logger.log('Converting user entity to domain and returning');
    return this.userFactory.fromEntity(userEntity);
  }
}
