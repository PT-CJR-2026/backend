import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import type { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  // Gera um novo token JWT com os dados atualizados do usuário logado
  // Usado após atualizar username para manter o token em sincronia
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req: AuthRequest) {
    // req.user vem do JwtAuthGuard que já valida o token atual
    // Busca os dados mais recentes do banco para gerar o novo token
    return this.authService.refreshToken(req.user.id!);
  }
}
