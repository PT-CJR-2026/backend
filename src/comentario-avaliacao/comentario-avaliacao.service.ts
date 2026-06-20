import { Injectable } from '@nestjs/common';
import { CreateComentarioAvaliacaoDto } from './dto/create-comentario-avaliacao.dto';
import { UpdateComentarioAvaliacaoDto } from './dto/update-comentario-avaliacao.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComentarioAvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDto: CreateComentarioAvaliacaoDto, usuarioId: number) {
    return this.prisma.comentario_Avaliacao.create({
      data: {
        ...createDto,
        usuario_id: usuarioId,
      },
    });
  }

  findAll() {
    return this.prisma.comentario_Avaliacao.findMany();
  }

  findByAvaliacaoLoja(avaliacaoLojaId: number) {
    return this.prisma.comentario_Avaliacao.findMany({
      where: { avaliacao_loja_id: avaliacaoLojaId },
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            foto_perfil_url: true,
          }
        }
      },
      orderBy: { created_at: 'asc' }
    });
  }

  async findByAvaliacaoProduto(avaliacaoProdutoId: number) {
    return this.prisma.comentario_Avaliacao.findMany({
      where: { avaliacao_produto_id: avaliacaoProdutoId },
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            foto_perfil_url: true,
          }
        }
      },
      orderBy: { created_at: 'asc' }
    });
  }

  findOne(id: number) {
    return this.prisma.comentario_Avaliacao.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            foto_perfil_url: true,
          }
        }
      },
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