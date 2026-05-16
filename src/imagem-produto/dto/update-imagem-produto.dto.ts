import { PartialType } from '@nestjs/mapped-types';
import { CreateImagemProdutoDto } from './create-imagem-produto.dto';

export class UpdateImagemProdutoDto extends PartialType(CreateImagemProdutoDto) {}