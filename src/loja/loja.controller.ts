import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { LojaService } from './loja.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@Controller('lojas')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  // POST /lojas
  @Post('criarloja')
  create(@Body() createLojaDto: CreateLojaDto, @Request() req) {
    return this.lojaService.create(createLojaDto, req.user.id);
  }

  // GET /lojas
  @IsPublic()
  @Get()
  findAll() {
    return this.lojaService.findAll();
  }

  // GET /lojas/minhas — deve vir ANTES de :id
  @Get('minhas')
  findMinhas(@Request() req) {
    return this.lojaService.findByUsuario(req.user.id);
  }

  // GET /lojas/:id
  @IsPublic()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lojaService.findOne(id);
  }

  // PATCH /lojas/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLojaDto: UpdateLojaDto,
    @Request() req,
  ) {
    return this.lojaService.update(id, updateLojaDto, req.user.id);
  }

  // DELETE /lojas/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.lojaService.remove(id, req.user.id);
  }
}