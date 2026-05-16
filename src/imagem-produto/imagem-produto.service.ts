import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImagemProdutoDto } from './dto/create-imagem-produto.dto';
import { UpdateImagemProdutoDto } from './dto/update-imagem-produto.dto';

@Injectable()
export class ImagemProdutoService {
    constructor(private readonly prisma: PrismaService) {}

    // Poder ser uma entidade fraca ela precisa do pai, isso aqui confere se ela tem pai
    private async verificarProduto(imagem_id: number) {
        const produto = await this.prisma.produto.findUnique({
            where: { id: imagem_id },
        });
    if (!produto) {
        throw new NotFoundException(`Produto ${imagem_id} não encontrado`);
        }
    }

    // Busca a imagem de acordo com o produto
    private async buscarImagem(produto_id: number, id: number) {
        const imagem = await this.prisma.imagem_Produto.findFirst({
            where: { id, produto_id },
        });
        if (!imagem) {
            throw new NotFoundException(
            `Imagem ${id} não encontrada para o produto ${produto_id}`,
            );
        }
        return imagem;
    }

    async create(produto_id: number, dto: CreateImagemProdutoDto) {
        await this.verificarProduto(produto_id);

        return this.prisma.imagem_Produto.create({
            data: {
                ...dto,
                produto_id,
            },
        });
    }

    async findAll(produto_id: number) {
        await this.verificarProduto(produto_id);

        return this.prisma.imagem_Produto.findMany({
            where: { produto_id },
            orderBy: { ordem: 'asc' },
        });
    }

    async findOne(produto_id: number, id: number) {
        await this.verificarProduto(produto_id);
        return this.buscarImagem(produto_id, id);
        }

        async update(produto_id: number, id: number, dto: UpdateImagemProdutoDto) {
        await this.buscarImagem(produto_id, id);

        return this.prisma.imagem_Produto.update({
            where: { id },
            data: dto,
        });
    }

    async remove(produto_id: number, id: number) {
        await this.buscarImagem(produto_id, id);

        return this.prisma.imagem_Produto.delete({
            where: { id },
        });
    }
}
