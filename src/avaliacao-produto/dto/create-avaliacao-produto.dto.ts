import { IsInt, IsString, Min, Max, IsOptional } from 'class-validator';
export class CreateAvaliacaoProdutoDto {
    @IsInt()
    @IsOptional()
    usuario_id?: number;

    @IsInt()
    produto_id!: number;

    @IsInt()
    @Min(1)
    @Max(5)
    nota!: number;

    @IsString()
    @IsOptional()
    comentario ?: string;
}
