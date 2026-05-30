import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import {
  UpdateSenhaDto,
  UpdateEmailDto,
  UpdateUsernameDto,
  UpdateNomeDto,
} from './dto/update-usuario.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @IsPublic()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get('me')
  getMe(@Request() req) {
    return this.usuarioService.findById(req.user.id);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  // Pega o id do token JWT — mais seguro que pegar da URL
  @Patch('atualizar-senha')
  updateSenha(@Request() req, @Body() dto: UpdateSenhaDto) {
    return this.usuarioService.updateSenha(req.user.id, dto);
  }

  @Patch('atualizar-username')
  updateUsername(@Request() req, @Body() dto: UpdateUsernameDto) {
    return this.usuarioService.updateUsername(req.user.id, dto);
  }

  @Patch('atualizar-email')
  updateEmail(@Request() req, @Body() dto: UpdateEmailDto) {
    return this.usuarioService.updateEmail(req.user.id, dto);
  }

  @Patch('atualizar-nome')
  updateNome(@Request() req, @Body() dto: UpdateNomeDto) {
    return this.usuarioService.updateNome(req.user.id, dto);
  }

  @Delete('me')
  remove(@Request() req, @Body() body: { senha_hash: string }) {
    return this.usuarioService.remove(req.user.id, body.senha_hash);
  }
}
