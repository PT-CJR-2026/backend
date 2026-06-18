import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';

@Injectable()
export class LojaService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CREATE ────────────────────────────────────────────────────────────────

  async create(createLojaDto: CreateLojaDto, usuarioId: number) {
    return this.prisma.loja.create({
      data: {
        ...createLojaDto,
        usuario_id: usuarioId,
      },
    });
  }

  // ─── READ (lista todas) ────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.loja.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        usuario: {
          select: { id: true, username: true, foto_perfil_url: true },
        },
        _count: {
          select: {
            produtos: true,
            avaliacoes: true, // ✅ corrigido
          },
        },
      },
    });
  }

  // ─── READ (uma loja) ───────────────────────────────────────────────────────

  async findOne(id: number) {
    const loja = await this.prisma.loja.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, username: true, foto_perfil_url: true },
        },

        produtos: {
          where: { estoque: { gt: 0 } },
          orderBy: { created_at: 'desc' },
          include: {
            imagem_produto: { orderBy: { ordem: 'asc' }, take: 1 },
          },
        },

        avaliacoes: { // ✅ corrigido
          orderBy: { created_at: 'desc' },
          include: {
            usuario: {
              select: { id: true, username: true, foto_perfil_url: true },
            },
          },
        },
        _count: {
          select: {
            produtos: true,
            avaliacoes: true, // ✅ corrigido
          },
        },
      },
    });

    if (!loja) {
      throw new NotFoundException(`Loja com id ${id} não encontrada`);
    }

    return loja;
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────

  async update(id: number, updateLojaDto: UpdateLojaDto, usuarioId: number) {
    await this.checkOwnership(id, usuarioId);

    return this.prisma.loja.update({
      where: { id },
      data: updateLojaDto,
    });
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────

  async remove(id: number, usuarioId: number) {
    await this.checkOwnership(id, usuarioId);

    return this.prisma.loja.delete({
      where: { id },
    });
  }

  // ─── HELPER: lojas do próprio usuário ─────────────────────────────────────

  async findByUsuario(usuarioId: number) {
    return this.prisma.loja.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: {
            produtos: true,
            avaliacoes: true,
          },
        },
      },
    });
  }

    // ─── HELPER: lojas do próprio usuário ─────────────────────────────────────

  async findByCategoria(categoriaId: number) {
  // Busca subcategorias da categoria pai
  const subcategorias = await this.prisma.categoria.findMany({
    where: { categoria_pai_id: categoriaId },
  });

  const ids = [categoriaId, ...subcategorias.map((s) => s.id)];

  return this.prisma.loja.findMany({
    where: {
      produtos: {
        some: {
          categoria_id: { in: ids }, // ← agora inclui subcategorias também
        },
      },
    },
    orderBy: { created_at: 'desc' },
    include: {
      _count: {
        select: {
          produtos: true,
          avaliacoes: true,
        },
      },
    },
  });
}

  // ─── HELPER PRIVADO: checa se usuário é dono ──────────────────────────────

  private async checkOwnership(lojaId: number, usuarioId: number) {
    const loja = await this.prisma.loja.findUnique({
      where: { id: lojaId },
      select: { id: true, usuario_id: true },
    });

    if (!loja) {
      throw new NotFoundException(`Loja com id ${lojaId} não encontrada`);
    }

    if (loja.usuario_id !== usuarioId) {
      throw new ForbiddenException(
        'Você não tem permissão para modificar esta loja',
      );
    }

    return loja;
  }
}