import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if(user) {
            //checar se a senha informada corresponde a hash que está no banco
            //em "isPasswordValid", a senha digitada no login está sendo comparada 
            //com a senha encripitada no banco
            const isPassowrdValid = await bcrypt.compare(password, user.senha_hash);

            if (isPassowrdValid) {
                return {
                    ...user,
                    password: undefined,
                };
            }
        }
        // Se chegar aqui, significa que não encontrou um user e/ou senha não corresponde
        throw new Error('Email adress or passowrd provided is incorrect');
    }
}
