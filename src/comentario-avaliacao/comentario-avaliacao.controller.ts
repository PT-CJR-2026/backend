import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ComentarioAvaliacaoService } from './comentario-avaliacao.service';
import { CreateComentarioAvaliacaoDto } from './dto/create-comentario-avaliacao.dto';
import { UpdateComentarioAvaliacaoDto } from './dto/update-comentario-avaliacao.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@Controller('comentario-avaliacao')
export class ComentarioAvaliacaoController {
  constructor(private readonly comentarioAvaliacaoService: ComentarioAvaliacaoService) {}

  @Post()
  create(@Body() createDto: CreateComentarioAvaliacaoDto, @Request() req) {
    return this.comentarioAvaliacaoService.create(createDto, req.user.id);
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.comentarioAvaliacaoService.findAll();
  }

  @IsPublic()
  @Get('loja/:avaliacaoLojaId')
  findByAvaliacaoLoja(@Param('avaliacaoLojaId') avaliacaoLojaId: string) {
    return this.comentarioAvaliacaoService.findByAvaliacaoLoja(+avaliacaoLojaId);
  }

  @IsPublic()
  @Get('produto/:avaliacaoProdutoId')
  findByAvaliacaoProduto(
    @Param('avaliacaoProdutoId') avaliacaoProdutoId: string,
  ) {
    return this.comentarioAvaliacaoService.findByAvaliacaoProduto(+avaliacaoProdutoId);
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comentarioAvaliacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateComentarioAvaliacaoDto) {
    return this.comentarioAvaliacaoService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comentarioAvaliacaoService.remove(+id);
  }
}