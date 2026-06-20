import { ImagemProduto } from '../entities/imagem-produto.entity';
import {
  IsString,
  IsInt,
  IsUrl,
  IsNotEmpty
} from 'class-validator';

export class CreateImagemProdutoDto extends ImagemProduto {

    @IsInt()
    declare produto_id: number;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    declare url_imagem: string;

    @IsInt()
    declare ordem: number;
}