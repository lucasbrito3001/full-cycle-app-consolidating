import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { mockOutcomeTests } from 'src/constants/mock';
import { OutcomeEntity } from 'src/database/entities/outcome.entity';
import { faker } from '@faker-js/faker';
import { ErrorMessages } from 'src/constants/enums';

describe('OutcomeController (e2e)', () => {
  let app: INestApplication;

  let userUUID: string;
  let token: string;

  let pgsqlDatasource: DataSource;
  let pgsqlQueryRunner: QueryRunner;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    pgsqlDatasource = app.get(getDataSourceToken('pgsql'));
    pgsqlQueryRunner = pgsqlDatasource.createQueryRunner();

    await pgsqlQueryRunner.connect();

    const registerUserResult = await request(app.getHttpServer())
      .post('/user')
      .send({
        email: faker.internet.email(),
        familyIncome: 1000,
        name: 'John Doe',
        password: 'mockpass',
      });

    token = registerUserResult.body.data.access_token;
    userUUID = registerUserResult.body.data.uuid;
  });

  describe('/outcome (POST)', () => {
    it('should register an outcome successfully', async () => {
      const result = await request(app.getHttpServer())
        .post('/outcome')
        .set('Authorization', `Bearer ${token}`)
        .send(mockOutcomeTests);

      expect(result.status).toBe(HttpStatus.CREATED);
      expect(result.body.data).toHaveProperty('id');

      await pgsqlQueryRunner.manager.delete(OutcomeEntity, {
        id: result.body.data.id,
      });
    });

    it('should return invalid input error', async () => {
      const expectedStructureError = {
        code: 'invalid_type',
        expected: 'number',
        received: 'undefined',
        path: ['value'],
        message: 'Required',
      };

      const result = await request(app.getHttpServer())
        .post('/outcome')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.errors.length).toBe(3);
      expect(result.body.errors[0]).toEqual(expectedStructureError);
    });

    it('should return unauthorized error when send a request without Authorization header', async () => {
      const result = await request(app.getHttpServer())
        .post('/outcome')
        .send({});

      expect(result.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(result.body.message).toBe(ErrorMessages.Unauthorized);
    });
  });

  afterEach(async () => {
    await pgsqlQueryRunner.manager.delete(UserEntity, {
      uuid: userUUID,
    });
    await pgsqlQueryRunner.release();
  });
});
