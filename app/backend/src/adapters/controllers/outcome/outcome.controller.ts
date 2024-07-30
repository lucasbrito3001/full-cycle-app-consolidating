import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  AddOutcomeInput,
  addOutcomeInputSchema,
} from 'src/adapters/dto/add-outcome.dto';
import { AddOutcome } from 'src/application/usecases/add-outcome/add-outcome.usecase';
import { AuthGuard } from 'src/guards/auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { RequestOutput } from 'src/shared/response';

@UseGuards(AuthGuard)
@Controller('outcome')
export class OutcomeController {
  constructor(private readonly addOutcome: AddOutcome) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(addOutcomeInputSchema))
  async add(@Req() req, @Body() body: AddOutcomeInput): Promise<RequestOutput> {
    const user = req.user;

    const result = await this.addOutcome.execute(user.uuid, body);

    return new RequestOutput(
      HttpStatus.CREATED,
      'Outcome created successfully',
      result,
    );
  }
}
