import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateLojaDto {
  @IsString()
  @MinLength(2)
  nome!: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsUrl()
  @IsOptional()
  logo_url?: string;

  @IsUrl()
  @IsOptional()
  banner_url?: string;

  @IsUrl()
  @IsOptional()
  sticker_url?: string;
}