import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({
      data: createCategoriaDto,
    });
  }

  findAll() {
    return this.prisma.categoria.findMany({
      include: {
        categoria_pai: true,
        categoria_filho: true,
      },
    });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: {
        categoria_pai: true,
        categoria_filho: true,
      },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria com id ${id} não encontrada`);
    }

    return categoria;
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  async remove(id: number) {
    const [totalSubcategorias, totalProdutos] = await Promise.all([
      this.prisma.categoria.count({ where: { categoria_pai_id: id } }),
      this.prisma.produto.count({ where: { categoria_id: id } }),
    ]);

    if (totalSubcategorias > 0) {
      throw new ConflictException(
        'Não é possível remover: esta categoria possui subcategorias vinculadas.',
      );
    }

    if (totalProdutos > 0) {
      throw new ConflictException(
        'Não é possível remover: esta categoria possui produtos vinculados.',
      );
    }

    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}