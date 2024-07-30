import { Module } from '@nestjs/common';
import { HashService } from '../shared/utils/hash.service';

@Module({
  imports: [],
  providers: [HashService],
  exports: [HashService],
})
export class UtilsModule {}
