import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { AvaliacaoProdutoService } from './avaliacao-produto.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@Controller('avaliacao-produto')
export class AvaliacaoProdutoController {
  constructor(private readonly avaliacaoProdutoService: AvaliacaoProdutoService) {}

  @Post()
create(@Body() createAvaliacaoProdutoDto: CreateAvaliacaoProdutoDto, @Request() req) {
  return this.avaliacaoProdutoService.create({
    ...createAvaliacaoProdutoDto,
    usuario_id: req.user.id,
  });
}

  @Get()
  findAll() {
    return this.avaliacaoProdutoService.findAll();
  }

  @IsPublic()
  @Get('produto/:produtoId')
  findByProduto(@Param('produtoId') produtoId: string) {
    return this.avaliacaoProdutoService.findByProduto(+produtoId);
  }

  @IsPublic()
  @Get(':id/completo')
  findCompleto(@Param('id') id: string) {
    return this.avaliacaoProdutoService.findCompleto(+id);
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avaliacaoProdutoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvaliacaoProdutoDto: UpdateAvaliacaoProdutoDto) {
    return this.avaliacaoProdutoService.update(+id, updateAvaliacaoProdutoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avaliacaoProdutoService.remove(+id);
  }
}