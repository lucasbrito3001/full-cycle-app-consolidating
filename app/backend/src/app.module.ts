import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './database/entities/user.entity';
import { AuthModule } from './modules/auth.module';
import { CustomHttpExceptionFilter } from './filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { OutcomeController } from './adapters/controllers/outcome/outcome.controller';
import { OutcomeEntity } from './database/entities/outcome.entity';
import { OutcomeModule } from './modules/outcome.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE_PATH,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forRoot({
      name: 'pgsql',
      type: 'postgres',
      url: process.env.DB_CONNECTION_URL,
      entities: [UserEntity, OutcomeEntity],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    OutcomeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
