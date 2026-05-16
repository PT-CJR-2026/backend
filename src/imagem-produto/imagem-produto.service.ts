import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImagemProdutoDto } from './dto/create-imagem-produto.dto';
import { UpdateImagemProdutoDto } from './dto/update-imagem-produto.dto';

@Injectable()
export class ImagemProdutoService {
    constructor(private readonly prisma: PrismaService) {}

    // Poder ser uma entidade fraca ela precisa do pai, isso aqui confere se ela tem pai
    private async verificarProduto(produtoId: number) {
        const produto = await this.prisma.produto.findUnique({
            where: { id: produtoId },
        });
    if (!produto) {
        throw new NotFoundException(`Produto ${produtoId} não encontrado`);
        }
    }

    // Busca a imagem de acordo com o produto
    private async buscarImagem(produtoId: number, id: number) {
        const imagem = await this.prisma.imagem_Produto.findFirst({
            where: { id, produto_id: produtoId },
        });
        if (!imagem) {
            throw new NotFoundException(
            `Imagem ${id} não encontrada para o produto ${produtoId}`,
            );
        }
        return imagem;
    }

    async create(produtoId: number, dto: CreateImagemProdutoDto) {
        await this.verificarProduto(produtoId);

        return this.prisma.imagem_Produto.create({
            data: {
                ...dto,
                produto_id: produtoId,
            },
        });
    }

    async findAll(produtoId: number) {
        await this.verificarProduto(produtoId);

        return this.prisma.imagem_Produto.findMany({
            where: { produto_id: produtoId },
            orderBy: { ordem: 'asc' },
        });
    }

    async findOne(produtoId: number, id: number) {
        await this.verificarProduto(produtoId);
        return this.buscarImagem(produtoId, id);
        }

        async update(produtoId: number, id: number, dto: UpdateImagemProdutoDto) {
        await this.buscarImagem(produtoId, id);

        return this.prisma.imagem_Produto.update({
            where: { id },
            data: dto,
        });
    }

    async remove(produtoId: number, id: number) {
        await this.buscarImagem(produtoId, id);

        return this.prisma.imagem_Produto.delete({
            where: { id },
        });
    }
}
