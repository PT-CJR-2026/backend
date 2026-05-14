import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usuarioService: UsuarioService) {}
    async validateUsuario(email: string, senha_hash: string) {
        const usuario = await this.usuarioService.findByEmail(email);
    
        if( usuario) {
            //checar se a senha informada corresponde a hash que está no banco

            const isPassowrdValid = await bcrypt.compare(senha_hash, usuario.senha_hash);
        
            if (isPassowrdValid) {
                return {
                    ...usuario,
                    senha_hash: undefined
                };
            }
        }
        //se chegar aqui, significa que não encontrou um user e/ou senha não corresponde
        throw new Error ('email ou senha inseridos são incorretas.');
    }
}
