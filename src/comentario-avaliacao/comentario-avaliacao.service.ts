import { Injectable } from '@nestjs/common';
import { CreateComentarioAvaliacaoDto } from './dto/create-comentario-avaliacao.dto';
import { UpdateComentarioAvaliacaoDto } from './dto/update-comentario-avaliacao.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComentarioAvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDto: CreateComentarioAvaliacaoDto) {
    return this.prisma.comentario_Avaliacao.create({
      data: createDto,
    });
  }

  // Método padrão (traz todos os comentários do banco inteiro - pouco usado na UI)
  findAll() {
    return this.prisma.comentario_Avaliacao.findMany();
  }

  // MÉTODO EXTRA PARA A UI: Busca comentários específicos de uma avaliação de LOJA
  findByAvaliacaoLoja(avaliacaoLojaId: number) {
    return this.prisma.comentario_Avaliacao.findMany({
      where: { avaliacao_loja_id: avaliacaoLojaId },
      include: {
        usuario: { 
          select: { username: true, foto_perfil_url: true }
        }
      },
      orderBy: { created_at: 'asc' } // Traz do mais antigo pro mais novo (padrão de chat)
    });
  }

  findOne(id: number) {
    return this.prisma.comentario_Avaliacao.findUnique({
      where: { id },
    });
  }

  update(id: number, updateDto: UpdateComentarioAvaliacaoDto) {
    return this.prisma.comentario_Avaliacao.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.comentario_Avaliacao.delete({
      where: { id },
    });
  }
}