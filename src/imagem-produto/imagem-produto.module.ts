import { Module } from '@nestjs/common';
import { ImagemProdutoService } from './imagem-produto.service';
import { ImagemProdutoController } from './imagem-produto.controller';

@Module({
  providers: [ImagemProdutoService],
  controllers: [ImagemProdutoController]
})
export class ImagemProdutoModule {}
