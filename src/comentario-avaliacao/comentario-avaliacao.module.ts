import { Module } from '@nestjs/common';
import { ComentarioAvaliacaoService } from './comentario-avaliacao.service';
import { ComentarioAvaliacaoController } from './comentario-avaliacao.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Importe o PrismaModule aqui

@Module({
  imports: [PrismaModule], // 2. Coloque ele no array de imports
  controllers: [ComentarioAvaliacaoController],
  providers: [ComentarioAvaliacaoService]
})
export class ComentarioAvaliacaoModule {}