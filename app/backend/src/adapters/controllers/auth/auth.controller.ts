import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { SignInInput, signInInputSchema } from '../../dto/sign-in.dto';
import { RequestOutput } from 'src/shared/response';
import { SignIn } from 'src/application/usecases/sign-in/sign-in.usecase';

@Controller('auth')
export class AuthController {
  constructor(private readonly signIn: SignIn) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(signInInputSchema))
  async trySignIn(@Body() body: SignInInput): Promise<RequestOutput> {
    const result = await this.signIn.execute(body.email, body.password);

    return new RequestOutput(HttpStatus.OK, 'Signed in successfully', result);
  }
}
