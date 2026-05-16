import { Module } from '@nestjs/common';
import { ImagemProdutoService } from './imagem-produto.service';
import { ImagemProdutoController } from './imagem-produto.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImagemProdutoController],
  providers: [ImagemProdutoService],
  exports: [ImagemProdutoService],
})
export class ImagemProdutoModule {}