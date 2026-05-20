import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';

@Injectable()
export class AvaliacaoProdutoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAvaliacaoProdutoDto: CreateAvaliacaoProdutoDto) {
    return this.prisma.avaliacao_Produto.create({
      data: createAvaliacaoProdutoDto,
    });
  }

  findAll() {
    return this.prisma.avaliacao_Produto.findMany();
  }

  findOne(id: number) {
    return this.prisma.avaliacao_Produto.findUnique({
      where: { id },
    });
  }

  update(id: number, updateAvaliacaoProdutoDto: UpdateAvaliacaoProdutoDto) {
    return this.prisma.avaliacao_Produto.update({
      where: { id },
      data: updateAvaliacaoProdutoDto,
    });
  }

  remove(id: number) {
    return this.prisma.avaliacao_Produto.delete({
      where: { id },
    });
  }
}