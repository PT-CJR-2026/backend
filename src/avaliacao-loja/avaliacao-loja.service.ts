import { Injectable } from '@nestjs/common';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvaliacaoLojaService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAvaliacaoLojaDto: CreateAvaliacaoLojaDto) {
    return this.prisma.avaliacao_Loja.create({
      data: createAvaliacaoLojaDto,
    });
  }

  findAll() {
    return this.prisma.avaliacao_Loja.findMany();
  }

  findOne(id: number) {
    return this.prisma.avaliacao_Loja.findUnique({
      where: { id },
    });
  }

  update(id: number, updateAvaliacaoLojaDto: UpdateAvaliacaoLojaDto) {
    return this.prisma.avaliacao_Loja.update({
      where: { id },
      data: updateAvaliacaoLojaDto,
    });
  }

  remove(id: number) {
    return this.prisma.avaliacao_Loja.delete({
      where: { id },
    });
  }
}