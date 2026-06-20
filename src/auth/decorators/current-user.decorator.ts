import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from '@/src/usuario/entities/usuario.entity';
import { AuthRequest } from '../models/AuthRequest';

//decorator utilizado para chamar os dados de usuarioo, recomendo utilizar
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): Usuario => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);