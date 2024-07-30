import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { ErrorMessages } from 'src/constants/enums';
import { UserEntity } from 'src/database/entities/user.entity';
import * as request from 'supertest';
import { DataSource, QueryRunner } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  let pgsqlDatasource: DataSource;
  let pgsqlQueryRunner: QueryRunner;

  let createdUserUUID: string;

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

    createdUserUUID = registerUserResult.body.data.uuid;
  });

  describe('/auth/sign-in (POST)', () => {
    it('should return invalid credentials when the email is not found in database', async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: 'wrongmail@example.com',
          password: 'mockpass',
        });

      expect(result.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(result.body.message).toBe(ErrorMessages.InvalidCredentials);
    });

    it('should return invalid credentials when the password is invalid', async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: faker.internet.email(),
          password: 'wrongpass',
        });

      expect(result.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(result.body.message).toBe(ErrorMessages.InvalidCredentials);
    });

    it('should return invalid input error', async () => {
      const expectedStructureError = {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['email'],
        message: 'Required',
      };

      const result = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({});

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.message).toBe(ErrorMessages.InvalidInput);
      expect(result.body.errors[0]).toEqual(expectedStructureError);
    });

    it('should sign in successfully', async () => {
      const email = faker.internet.email();

      await request(app.getHttpServer()).post('/user').send({
        email: email,
        familyIncome: 1000,
        name: 'John Doe',
        password: 'mockpass',
      });

      const result = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: email,
          password: 'mockpass',
        });

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.body.data).toHaveProperty('access_token');
    });
  });

  afterEach(async () => {
    await pgsqlQueryRunner.manager.delete(UserEntity, {
      uuid: createdUserUUID,
    });
    await pgsqlQueryRunner.release();
  });
});
