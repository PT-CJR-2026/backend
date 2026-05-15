import { Usuario } from '../entities/usuario.entity';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto extends Usuario {
  @IsString()
  declare username: string;

  @IsString()
  declare nome: string;

  @IsEmail()
  declare email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'senha muito fraca',
  })
  declare senha_hash: string;

}