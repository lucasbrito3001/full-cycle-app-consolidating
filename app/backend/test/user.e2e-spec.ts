import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { UserEntity } from 'src/database/entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;

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
  });

  describe('/user (POST)', () => {
    it('should register an user successfully', async () => {
      const result = await request(app.getHttpServer()).post('/user').send({
        email: 'test@example.com',
        familyIncome: 1000,
        name: 'John Doe',
        password: 'mockpass',
      });

      expect(result.status).toBe(HttpStatus.CREATED);
      expect(result.body.data).toHaveProperty('access_token');
      expect(result.body.data).toHaveProperty('uuid');

      await pgsqlQueryRunner.manager.delete(UserEntity, {
        uuid: result.body.data.uuid,
      });
    });

    it('should return invalid input error', async () => {
      const expectedStructureError = {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['name'],
        message: 'Required',
      };

      const result = await request(app.getHttpServer()).post('/user').send({});

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.errors.length).toBe(4);
      expect(result.body.errors[0]).toEqual(expectedStructureError);
    });
  });
});
