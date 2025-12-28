import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AxiosAdapter } from './http-adapters/axios.adapter';

@Module({
  providers: [AxiosAdapter],
  imports: [HttpModule],
  exports: [AxiosAdapter],
})
export class CommonModule {}
