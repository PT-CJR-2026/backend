import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from '@prisma/client';

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
    include: { categoria: true },
  });
}

  findOne(id: number) {
  return this.prisma.produto.findUnique({
    where: { id },
    include: { categoria: true },
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
