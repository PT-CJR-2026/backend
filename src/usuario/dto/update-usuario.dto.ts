import { IsEmail, IsString, Matches, MaxLength, MinLength, IsOptional } from 'class-validator';

export class UpdateSenhaDto {
  @IsString()
  senha_antiga!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'senha muito fraca',
  })
  nova_senha!: string;
}

export class UpdateEmailDto {
  @IsEmail()
  email!: string;
}

export class UpdateUsernameDto {
  @IsString()
  username!: string;
}

export class UpdateNomeDto {
  @IsString()
  nome!: string;
}