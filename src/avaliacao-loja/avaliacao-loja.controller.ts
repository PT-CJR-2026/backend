import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';

@Controller('avaliacao-loja')
export class AvaliacaoLojaController {
  constructor(private readonly avaliacaoLojaService: AvaliacaoLojaService) {}

  @Post()
  create(@Body() createAvaliacaoLojaDto: CreateAvaliacaoLojaDto, @Request() req) {
    return this.avaliacaoLojaService.create({
      ...createAvaliacaoLojaDto,
      usuario_id: req.user.id,
    });
  }

  @Get()
  findAll() {
    return this.avaliacaoLojaService.findAll();
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avaliacaoLojaService.findOne(+id);
  }

  @Get('loja/:lojaId')
  findByLoja(@Param('lojaId') lojaId: string) {
    return this.avaliacaoLojaService.findByLoja(+lojaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvaliacaoLojaDto: UpdateAvaliacaoLojaDto) {
    return this.avaliacaoLojaService.update(+id, updateAvaliacaoLojaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avaliacaoLojaService.remove(+id);
  }
}
