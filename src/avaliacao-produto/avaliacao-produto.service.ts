import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';

@Injectable()
export class AvaliacaoProdutoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAvaliacaoProdutoDto: CreateAvaliacaoProdutoDto) {
    return 'This action adds a new avaliacaoProduto';
  }

  findAll() {
    return `This action returns all avaliacaoProduto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avaliacaoProduto`;
  }

  update(id: number, updateAvaliacaoProdutoDto: UpdateAvaliacaoProdutoDto) {
    return `This action updates a #${id} avaliacaoProduto`;
  }

  remove(id: number) {
    return `This action removes a #${id} avaliacaoProduto`;
  }
}
