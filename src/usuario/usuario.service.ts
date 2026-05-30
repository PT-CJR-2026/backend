import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import {
  UpdateSenhaDto,
  UpdateEmailDto,
  UpdateUsernameDto,
  UpdateNomeDto,
} from './dto/update-usuario.dto';
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
    const createdUsuario = await this.prisma.usuario.create({ data });
    return { ...createdUsuario, senha_hash: undefined };
  }

  async findById(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        username: true,
        email: true,
        foto_perfil_url: true,
      },
    });

    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, username: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  findByUsername(username: string) {
    return this.prisma.usuario.findUnique({ where: { username } });
  }

  // Atualiza senha — valida a senha antiga antes
  async updateSenha(id: number, dto: UpdateSenhaDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const senhaCorreta = await bcrypt.compare(
      dto.senha_antiga,
      usuario.senha_hash,
    );
    if (!senhaCorreta) {
      throw new BadRequestException('Senha antiga incorreta');
    }

    const nova_senha_hash = await bcrypt.hash(dto.nova_senha, 10);
    await this.prisma.usuario.update({
      where: { id },
      data: { senha_hash: nova_senha_hash },
    });

    return { message: 'Senha atualizada com sucesso' };
  }

  // Atualiza username — checa se já existe
  async updateUsername(id: number, dto: UpdateUsernameDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { username: dto.username },
    });
    if (existe && existe.id !== id) {
      throw new ConflictException('Username já está em uso');
    }

    const updated = await this.prisma.usuario.update({
      where: { id },
      data: { username: dto.username },
    });
    return { ...updated, senha_hash: undefined };
  }

  // Atualiza email — checa se já existe
  async updateEmail(id: number, dto: UpdateEmailDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (existe && existe.id !== id) {
      throw new ConflictException('Email já está em uso');
    }

    const updated = await this.prisma.usuario.update({
      where: { id },
      data: { email: dto.email },
    });
    return { ...updated, senha_hash: undefined };
  }

  // Atualiza nome
  async updateNome(id: number, dto: UpdateNomeDto) {
    const updated = await this.prisma.usuario.update({
      where: { id },
      data: { nome: dto.nome },
    });
    return { ...updated, senha_hash: undefined };
  }

  async remove(id: number, senha_hash: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const senhaCorreta = await bcrypt.compare(senha_hash, usuario.senha_hash);
    if (!senhaCorreta) throw new BadRequestException('Senha incorreta');

    await this.prisma.usuario.delete({ where: { id } });
    return { message: 'Conta deletada com sucesso' };
  }
}
