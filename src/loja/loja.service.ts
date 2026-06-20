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
    const lojas = await this.prisma.loja.findMany({
      include: {
        produtos: {
          take: 1,
          include: {
            categoria: {
              include: { categoria_pai: true },
            },
          },
        },
        _count: { select: { produtos: true, avaliacoes: true } },
      },
    });

    return lojas.map((loja) => {
      const cat = loja.produtos[0]?.categoria;
      const nomeExibido = cat?.categoria_pai?.nome ?? cat?.nome ?? null;
      return { ...loja, categoria: nomeExibido };
    });
  }

  // ─── READ (uma loja) ───────────────────────────────────────────────────────

  async findOne(id: number) {
    const loja = await this.prisma.loja.findUnique({
      where: { id },
      include: {
        usuario: {
          // CORREÇÃO 1: Adicionado 'nome: true' para puxar o nome real
          select: { id: true, nome: true, username: true, foto_perfil_url: true },
        },

        produtos: {
          where: { estoque: { gt: 0 } },
          orderBy: { created_at: 'desc' },
          include: {
            imagem_produto: { orderBy: { ordem: 'asc' }, take: 1 },
            //  CORREÇÃO 2: Include da categoria idêntico ao do seu findAll()
            categoria: {
              include: { categoria_pai: true },
            },
          },
        },

        avaliacoes: {
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
            avaliacoes: true,
          },
        },
      },
    });

    if (!loja) {
      throw new NotFoundException(`Loja com id ${id} não encontrada`);
    }

    // CORREÇÃO 3: Extrai a categoria e anexa à resposta, igual no findAll()
    const cat = loja.produtos[0]?.categoria;
    const nomeExibido = cat?.categoria_pai?.nome ?? cat?.nome ?? null;

    return { ...loja, categoria: nomeExibido };
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

    const [avaliacoesLoja, produtos] = await Promise.all([
      this.prisma.avaliacao_Loja.findMany({
        where: { loja_id: id },
        select: { id: true },
      }),
      this.prisma.produto.findMany({
        where: { loja_id: id },
        select: { id: true },
      }),
    ]);

    const avaliacaoLojaIds = avaliacoesLoja.map((a) => a.id);
    const produtoIds = produtos.map((p) => p.id);

    const avaliacoesProduto = await this.prisma.avaliacao_Produto.findMany({
      where: { produto_id: { in: produtoIds } },
      select: { id: true },
    });
    const avaliacaoProdutoIds = avaliacoesProduto.map((a) => a.id);

    return this.prisma.$transaction([
      this.prisma.comentario_Avaliacao.deleteMany({
        where: { avaliacao_loja_id: { in: avaliacaoLojaIds } },
      }),
      this.prisma.comentario_Avaliacao.deleteMany({
        where: { avaliacao_produto_id: { in: avaliacaoProdutoIds } },
      }),
      // depois avaliações
      this.prisma.avaliacao_Loja.deleteMany({ where: { loja_id: id } }),
      this.prisma.avaliacao_Produto.deleteMany({
        where: { produto_id: { in: produtoIds } },
      }),
      // depois imagens e produtos
      this.prisma.imagem_Produto.deleteMany({
        where: { produto_id: { in: produtoIds } },
      }),
      this.prisma.produto.deleteMany({ where: { loja_id: id } }),
      // por fim a loja
      this.prisma.loja.delete({ where: { id } }),
    ]);
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

  // ─── HELPER: lojas por categoria (via produtos) ───────────────────────────

  async findByCategoria(categoriaId: number) {
    const subcategorias = await this.prisma.categoria.findMany({
      where: { categoria_pai_id: categoriaId },
    });

    const ids = [categoriaId, ...subcategorias.map((s) => s.id)];

    return this.prisma.loja.findMany({
      where: {
        produtos: {
          some: {
            categoria_id: { in: ids },
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