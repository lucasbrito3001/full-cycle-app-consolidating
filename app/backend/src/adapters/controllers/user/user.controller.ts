import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  RegisterUserInput,
  registerUserInputSchema,
} from 'src/adapters/dto/register-user.dto';
import { RegisterUser } from 'src/application/usecases/register-user/register-user.usecase';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { RequestOutput } from 'src/shared/response';

@Controller('user')
export class UserController {
  constructor(private registerUser: RegisterUser) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(registerUserInputSchema))
  async register(@Body() body: RegisterUserInput): Promise<RequestOutput> {
    const result = await this.registerUser.execute(body);

    return new RequestOutput(HttpStatus.CREATED, 'User registered', {
      access_token: result.token,
      uuid: result.uuid,
    });
  }
}
