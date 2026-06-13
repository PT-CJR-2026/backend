import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComentarioAvaliacaoService } from './comentario-avaliacao.service';
import { CreateComentarioAvaliacaoDto } from './dto/create-comentario-avaliacao.dto';
import { UpdateComentarioAvaliacaoDto } from './dto/update-comentario-avaliacao.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@Controller('comentario-avaliacao')
export class ComentarioAvaliacaoController {
  constructor(private readonly comentarioAvaliacaoService: ComentarioAvaliacaoService) {}

  @Post()
  create(@Body() createDto: CreateComentarioAvaliacaoDto) {
    return this.comentarioAvaliacaoService.create(createDto);
  }

  @Get()
  findAll() {
    return this.comentarioAvaliacaoService.findAll();
  }

  // ROTA PARA A UI: /comentario-avaliacao/loja/5
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
