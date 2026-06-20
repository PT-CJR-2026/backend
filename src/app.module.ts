import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ProdutoModule } from './produto/produto.module';
import { CategoriaModule } from './categoria/categoria.module';
import { AvaliacaoLojaModule } from './avaliacao-loja/avaliacao-loja.module';
import { AvaliacaoProdutoModule } from './avaliacao-produto/avaliacao-produto.module';
import { LojaModule } from './loja/loja.module';
import { ComentarioAvaliacaoModule } from './comentario-avaliacao/comentario-avaliacao.module';
import { ImagemProdutoModule } from './imagem-produto/imagem-produto.module';


@Module({
  imports: [PrismaModule, UsuarioModule, AuthModule, ProdutoModule, CategoriaModule, AvaliacaoLojaModule, AvaliacaoProdutoModule, LojaModule, ComentarioAvaliacaoModule, ImagemProdutoModule,],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}