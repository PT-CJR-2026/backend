
import { IsInt, IsString, IsNumber, IsOptional } from 'class-validator';
import { Produto } from '../entities/produto.entity';
export class CreateProdutoDto extends Produto{
    @IsNumber()
    declare loja_id: number;
    
    @IsInt()
    declare ategorias_id: number;

    @IsString()
    declare nome: string;

    @IsString()
    @IsOptional()
    declare descricao?: string;

    @IsNumber()
    declare preco: number;

    @IsInt()
    declare estoque: number;

}
