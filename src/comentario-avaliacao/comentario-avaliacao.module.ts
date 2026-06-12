import { Module } from '@nestjs/common';
import { ComentarioAvaliacaoService } from './comentario-avaliacao.service';
import { ComentarioAvaliacaoController } from './comentario-avaliacao.controller';
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule],
  controllers: [ComentarioAvaliacaoController],
  providers: [ComentarioAvaliacaoService]
})
export class ComentarioAvaliacaoModule {}