import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { UsuarioPayload } from './models/UsuarioPayload';
import { JwtService } from '@nestjs/jwt';
import { UsuarioToken } from './models/UsuarioToken';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
    ) {}

    login(usuario: Usuario): UsuarioToken {
    // transforma o usuario em um token JWT
    const payload: UsuarioPayload = { 
        sub: usuario.id!,
        email: usuario.email,
        username: usuario.username,
        nome: usuario.nome,
    };

    const JwtToken = this.jwtService.sign(payload);

    return {
        access_token: JwtToken,
    };
}

    async validateUsuario(email: string, senha_hash: string) {
    const usuario = await this.usuarioService.findByEmail(email);

    if (usuario) {
        // checar se a senha informada corresponde à hash do banco
        const isPasswordValid = await bcrypt.compare(
            senha_hash,
            usuario.senha_hash,
        );

        if (isPasswordValid) {
            return usuario;
        }
        //se chegar aqui, significa que não encontrou um user e/ou senha não corresponde
    }

    throw new Error(
        'email ou senha inseridos são incorretas.',
    );
}
}
