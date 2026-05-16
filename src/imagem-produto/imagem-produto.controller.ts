import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ImagemProdutoService } from './imagem-produto.service';
import { CreateImagemProdutoDto } from './dto/create-imagem-produto.dto';
import { UpdateImagemProdutoDto } from './dto/update-imagem-produto.dto';

@Controller('produtos/:produtoId/imagens')
export class ImagemProdutoController {
    constructor(private readonly imagemProdutoService: ImagemProdutoService) {}


    @Post()
    create(
        @Param('produtoId', ParseIntPipe) produtoId: number,
        @Body() dto: CreateImagemProdutoDto,
    ) {
        return this.imagemProdutoService.create(produtoId, dto);
    }

    @Get()
    findAll(@Param('produtoId', ParseIntPipe) produtoId: number) {
        return this.imagemProdutoService.findAll(produtoId);
    }

    @Get(':id')
    findOne(@Param('produtoId', ParseIntPipe) produtoId: number) {
        return this.imagemProdutoService.findAll(produtoId);
    }

    @Put(':id')
    update(
        @Param('produtoId', ParseIntPipe) produtoId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateImagemProdutoDto,
    ) {
        return this.imagemProdutoService.update(produtoId, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @Param('produtoId', ParseIntPipe) produtoId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.imagemProdutoService.remove(produtoId, id);
    }
}
