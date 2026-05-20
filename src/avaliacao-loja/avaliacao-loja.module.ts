import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { AvaliacaoLojaController } from './avaliacao-loja.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AvaliacaoLojaController],
  providers: [AvaliacaoLojaService],
})
export class AvaliacaoLojaModule {}
