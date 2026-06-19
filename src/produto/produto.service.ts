import { Injectable } from '@nestjs/common';
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

  async findByCategoria(categoriaId: number) {
    // Busca subcategorias da categoria pai
    const subcategorias = await this.prisma.categoria.findMany({
      where: { categoria_pai_id: categoriaId },
    });

    // Inclui o id da categoria pai + ids das subcategorias
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

  remove(id: number) {
    return this.prisma.$transaction([
      this.prisma.avaliacao_Produto.deleteMany({ where: { produto_id: id } }),
      this.prisma.imagem_Produto.deleteMany({ where: { produto_id: id } }),
      this.prisma.produto.delete({ where: { id } }),
    ]);
  }
}