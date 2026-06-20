import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite o front (3000) acessar apenas esse back (3001)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Arruma os dados para poderem ser lidos pelo back
  app.use(require('express').json());
  app.use(require('express').urlencoded({ extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3001);
}
bootstrap();