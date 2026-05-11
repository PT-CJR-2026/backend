import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtservice: JwtService) {}

    login(user: User): UserToken {
      //Transforma o user em um JWT
    const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        name: user.username
    };

    const jtwToken = this.jwtservice.sign(payload);

    return { 
        access_token: jtwToken
    };
    }

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
