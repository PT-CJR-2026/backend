import { IsInt, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateComentarioAvaliacaoDto {
  @IsInt()
  @IsOptional()
  usuario_id?: number; // ← vem do token, não do body

  @IsInt()
  @IsOptional()
  avaliacao_loja_id?: number;

  @IsInt()
  @IsOptional()
  avaliacao_produto_id?: number;

  @IsString()
  @IsNotEmpty()
  conteudo!: string;
}