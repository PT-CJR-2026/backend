import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProdutoDto: CreateProdutoDto) {
    return this.prisma.produto.create({
      data: createProdutoDto,
    });
  }

  findAll() {
    return this.prisma.produto.findMany({
      include: {
        categoria: true,
        imagem_produto: { orderBy: { ordem: 'asc' } },
        loja: { select: { nome: true, logo_url: true } },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
        imagem_produto: { orderBy: { ordem: 'asc' } },
        loja: { select: { nome: true, logo_url: true } },
      },
    });
  }

  async findMelhoresAvaliados(limit = 20) {
    const produtos = await this.prisma.produto.findMany({
      include: {
        categoria: true,
        imagem_produto: { orderBy: { ordem: 'asc' } },
        loja: { select: { nome: true, logo_url: true } },
        avaliacao_produto: { select: { nota: true } },
      },
    });

    const comAvaliacao = produtos.filter((p) => p.avaliacao_produto.length > 0);

    if (comAvaliacao.length === 0) {
      return this.prisma.produto.findMany({
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          categoria: true,
          imagem_produto: { orderBy: { ordem: 'asc' } },
          loja: { select: { nome: true, logo_url: true } },
        },
      });
    }

    const mediaGeral =
      comAvaliacao.reduce((soma, p) => {
        const mediaProduto =
          p.avaliacao_produto.reduce((s, a) => s + a.nota, 0) /
          p.avaliacao_produto.length;
        return soma + mediaProduto;
      }, 0) / comAvaliacao.length;

    const MIN_AVALIACOES_PESO = 5;

    const ranqueados = comAvaliacao
      .map((p) => {
        const v = p.avaliacao_produto.length;
        const r = p.avaliacao_produto.reduce((s, a) => s + a.nota, 0) / v;
        const score =
          (v / (v + MIN_AVALIACOES_PESO)) * r +
          (MIN_AVALIACOES_PESO / (v + MIN_AVALIACOES_PESO)) * mediaGeral;
        const { avaliacao_produto, ...resto } = p;
        return { ...resto, score, mediaAvaliacao: r, totalAvaliacoes: v };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return ranqueados;
  }

  findMaisBaratos(limit = 20) {
    return this.prisma.produto.findMany({
      take: limit,
      where: { estoque: { gt: 0 } },
      orderBy: { preco: 'asc' },
      include: {
        categoria: true,
        imagem_produto: { orderBy: { ordem: 'asc' } },
        loja: { select: { nome: true, logo_url: true } },
      },
    });
  }

  findRecemAdicionados(limit = 20) {
    return this.prisma.produto.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        categoria: true,
        imagem_produto: { orderBy: { ordem: 'asc' } },
        loja: { select: { nome: true, logo_url: true } },
      },
    });
  }

  async findByTermo(termo: string) {
    const termoLimpo = termo.trim();

    if (!termoLimpo) {
      return [];
    }

    return this.prisma.produto.findMany({
      where: {
        OR: [
          { nome: { contains: termoLimpo, mode: 'insensitive' } },
          { descricao: { contains: termoLimpo, mode: 'insensitive' } },
          { loja: { nome: { contains: termoLimpo, mode: 'insensitive' } } },
          { categoria: { nome: { contains: termoLimpo, mode: 'insensitive' } } },
        ],
      },
      include: {
        categoria: true,
        imagem_produto: { orderBy: { ordem: 'asc' } },
        loja: { select: { nome: true, logo_url: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findSugestoes(termo: string, limit = 5) {
    const termoLimpo = termo.trim();

    if (!termoLimpo) {
      return [];
    }

    return this.prisma.produto.findMany({
      take: limit,
      where: {
        nome: { contains: termoLimpo, mode: 'insensitive' },
      },
      select: {
        id: true,
        nome: true,
        preco: true,
        imagem_produto: {
          orderBy: { ordem: 'asc' },
          take: 1,
          select: { url_imagem: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByCategoria(categoriaId: number) {
    const subcategorias = await this.prisma.categoria.findMany({
      where: { categoria_pai_id: categoriaId },
    });
    const ids = [categoriaId, ...subcategorias.map((s) => s.id)];
    return this.prisma.produto.findMany({
      where: {
        categoria_id: { in: ids },
      },
      include: {
        imagem_produto: { orderBy: { ordem: 'asc' } },
        loja: { select: { nome: true, logo_url: true } },
      },
    });
  }

  update(id: number, updateProdutoDto: UpdateProdutoDto) {
    return this.prisma.produto.update({
      where: { id },
      data: updateProdutoDto,
    });
  }

  async remove(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }

    const avaliacoes = await this.prisma.avaliacao_Produto.findMany({
      where: { produto_id: id },
      select: { id: true },
    });
    const avaliacaoIds = avaliacoes.map((a) => a.id);

    return this.prisma.$transaction([
      this.prisma.comentario_Avaliacao.deleteMany({
        where: { avaliacao_produto_id: { in: avaliacaoIds } },
      }),
      this.prisma.avaliacao_Produto.deleteMany({ where: { produto_id: id } }),
      this.prisma.imagem_Produto.deleteMany({ where: { produto_id: id } }),
      this.prisma.produto.delete({ where: { id } }),
    ]);
  }
}