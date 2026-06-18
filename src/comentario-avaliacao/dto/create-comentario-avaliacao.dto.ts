import { IsInt, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateComentarioAvaliacaoDto {
  @IsInt()
  usuario_id!: number;

  // Opcional, pois o comentário pode ser na avaliação de um produto
  @IsInt()
  @IsOptional()
  avaliacao_loja_id?: number;

  // Opcional, pois o comentário pode ser na avaliação de uma loja
  @IsInt()
  @IsOptional()
  avaliacao_produto_id?: number;

  @IsString()
  @IsNotEmpty()
  conteudo!: string;
}