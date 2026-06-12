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

  // Busca perfil público por username — usado na página de perfil
  // Nunca retorna senha_hash
  async findByUsername(username: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { username },
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

    // o Conjunto abaixo deleta o usuário e todas as suas dependências, seguindo a ordem correta para evitar erros de integridade referencial.
    // 1. Comentários
    await this.prisma.comentario_Avaliacao.deleteMany({
      where: { usuario_id: id },
    });

    // 2. Avaliacoes do usuario
    await this.prisma.avaliacao_Loja.deleteMany({ where: { usuario_id: id } });
    await this.prisma.avaliacao_Produto.deleteMany({
      where: { usuario_id: id },
    });

    // 3. Comentarios nas avaliacoes das lojas do usuario
    await this.prisma.comentario_Avaliacao.deleteMany({
      where: { avaliacao_loja: { loja: { usuario_id: id } } },
    });

    // 4. Avaliacoes das lojas do usuario
    await this.prisma.avaliacao_Loja.deleteMany({
      where: { loja: { usuario_id: id } },
    });

    // 5. Comentarios nas avaliacoes dos produtos das lojas do usuario
    await this.prisma.comentario_Avaliacao.deleteMany({
      where: { avaliacao_produto: { produto: { loja: { usuario_id: id } } } },
    });

    // 6. Avaliacoes dos produtos das lojas do usuario
    await this.prisma.avaliacao_Produto.deleteMany({
      where: { produto: { loja: { usuario_id: id } } },
    });

    // 7. Imagens dos produtos
    await this.prisma.imagem_Produto.deleteMany({
      where: { produto: { loja: { usuario_id: id } } },
    });

    // 8. Produtos das lojas
    await this.prisma.produto.deleteMany({
      where: { loja: { usuario_id: id } },
    });

    // 9. Lojas
    await this.prisma.loja.deleteMany({ where: { usuario_id: id } });

    // 10. Usuario
    await this.prisma.usuario.delete({ where: { id } });

    return { message: 'Conta deletada com sucesso' };
  }
}
