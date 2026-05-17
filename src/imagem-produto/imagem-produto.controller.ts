import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ImagemProdutoService } from './imagem-produto.service';
import { CreateImagemProdutoDto } from './dto/create-imagem-produto.dto';
import { UpdateImagemProdutoDto } from './dto/update-imagem-produto.dto';

@Controller('produtos/:produto_id/imagens')
export class ImagemProdutoController {
    constructor(private readonly imagemProdutoService: ImagemProdutoService) {}


    @Post()
    create(
        @Param('produto_id', ParseIntPipe) produto_id: number,
        @Body() dto: CreateImagemProdutoDto,
    ) {
        return this.imagemProdutoService.create(produto_id, dto);
    }

    @Get()
    findAll(@Param('produto_id', ParseIntPipe) produto_id: number) {
        return this.imagemProdutoService.findAll(produto_id);
    }

    @Get(':id')
    findOne(@Param('produto_id', ParseIntPipe) produto_id: number) {
        return this.imagemProdutoService.findAll(produto_id);
    }

    @Put(':id')
    update(
        @Param('produto_id', ParseIntPipe) produto_id: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateImagemProdutoDto,
    ) {
        return this.imagemProdutoService.update(produto_id, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @Param('produto_id', ParseIntPipe) produto_id: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.imagemProdutoService.remove(produto_id, id);
    }
}
