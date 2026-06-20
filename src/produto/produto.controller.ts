import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtoService.create(createProdutoDto);
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.produtoService.findAll();
  }

  @IsPublic()
  @Get('melhores-avaliados')
  findMelhoresAvaliados() {
    return this.produtoService.findMelhoresAvaliados();
  }

  @IsPublic()
  @Get('mais-baratos')
  findMaisBaratos() {
    return this.produtoService.findMaisBaratos();
  }

  @IsPublic()
  @Get('recem-adicionados')
  findRecemAdicionados() {
    return this.produtoService.findRecemAdicionados();
  }

  @IsPublic()
  @Get('categoria/:categoriaId')
  findByCategoria(@Param('categoriaId') categoriaId: string) {
    return this.produtoService.findByCategoria(+categoriaId);
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtoService.update(+id, updateProdutoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtoService.remove(+id);
  }
}