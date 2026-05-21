import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const data = {
      ...createUsuarioDto,
      senha_hash: await bcrypt.hash(createUsuarioDto.senha_hash, 10),
    };

    const createdUsuario = await this.prisma.usuario.create({  data  })

    return {
      ...createdUsuario,
      senha_hash: undefined
    };
  }

  // findAll() {
  //   return `This action returns all usuario`;
  // }

  findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: {  email  },
    });
  }

  findByUsername(username: string) {
    return this.prisma.usuario.findUnique({
      where: {  username  },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
  const { senha_hash, ...rest } = updateUsuarioDto;

  const data: Record<string, any> = { ...rest };

  if (senha_hash) {
    data.senha_hash = await bcrypt.hash(senha_hash, 10);
  }

  const updatedUsuario = await this.prisma.usuario.update({
    where: { id },
    data,
  });

  return {
    ...updatedUsuario,
    senha_hash: undefined,
  };
}

async remove(id: number) {
  await this.prisma.usuario.delete({
    where: { id },
  });

  return { message: `Usuário #${id} removido com sucesso` };
}

}