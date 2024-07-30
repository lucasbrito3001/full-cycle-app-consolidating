import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { OutcomeEntity } from 'src/database/entities/outcome.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { TUser } from 'src/domain/factory/user';
import { Outcome } from 'src/domain/outcome/outcome.domain';
import { User } from 'src/domain/user/user.domain';
import { InternalErrorException } from 'src/shared/exceptions';
import { DataSource } from 'typeorm';

@Injectable()
export class OutcomeRepository {
  private readonly logger = new Logger('OutcomeRepository');

  constructor(
    @InjectDataSource('pgsql')
    private pgsqlDataSource: DataSource,
  ) {}

  async save(outcome: Outcome, user: TUser): Promise<Outcome> {
    this.logger.log('Converting outcome and user domain to entity');

    const userEntity = UserEntity.fromDomain(user);
    let outcomeEntity = OutcomeEntity.fromDomain(outcome);

    outcomeEntity.user = userEntity;

    this.logger.log('Creating save data source query runner');
    const queryRunner = this.pgsqlDataSource.createQueryRunner();

    this.logger.log('Connecting query runner to connection pool');
    await queryRunner.connect();

    try {
      this.logger.log('Saving user to database');
      outcomeEntity = await queryRunner.manager.save(
        OutcomeEntity,
        outcomeEntity,
      );
    } catch (error) {
      throw new InternalErrorException(error);
    } finally {
      this.logger.log('Releasing connection');
      await queryRunner.release();
    }

    this.logger.log('Converting outcome entity to domain and returning');
    return Outcome.fromEntity(outcomeEntity);
  }
}
