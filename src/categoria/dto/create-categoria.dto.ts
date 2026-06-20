import { IsInt, IsString, IsOptional } from 'class-validator';
export class CreateCategoriaDto {
    @IsString()
    nome!: string;

    @IsInt()
    @IsOptional()
    categoria_pai_id ?: number;
}
