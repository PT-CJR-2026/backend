import { Test, TestingModule } from '@nestjs/testing';
import { ComentarioAvaliacaoController } from './comentario-avaliacao.controller';
import { ComentarioAvaliacaoService } from './comentario-avaliacao.service';

describe('ComentarioAvaliacaoController', () => {
  let controller: ComentarioAvaliacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComentarioAvaliacaoController],
      providers: [ComentarioAvaliacaoService],
    }).compile();

    controller = module.get<ComentarioAvaliacaoController>(ComentarioAvaliacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
