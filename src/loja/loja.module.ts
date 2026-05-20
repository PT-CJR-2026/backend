import { Module } from '@nestjs/common';
import { LojaService } from './loja.service';
import { LojaController } from './loja.controller';

@Module({
  controllers: [LojaController],
  providers: [LojaService],
  exports: [LojaController]
})
export class LojaModule {}