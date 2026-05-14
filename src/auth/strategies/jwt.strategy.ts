import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserFromJwt } from '../models/UserFromJwt';
import { UsuarioPayload } from '../models/UsuarioPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET não definido');
    }

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: secret,
    });
  }



//estava tendo problema com essa estrutura. Não estava lendo o secret
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET,
//     });
//   }

  async validate(payload: UsuarioPayload): Promise<UserFromJwt> {
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}