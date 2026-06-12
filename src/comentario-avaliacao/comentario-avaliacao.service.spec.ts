import { Test, TestingModule } from '@nestjs/testing';
import { ComentarioAvaliacaoService } from './comentario-avaliacao.service';

describe('ComentarioAvaliacaoService', () => {
  let service: ComentarioAvaliacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComentarioAvaliacaoService],
    }).compile();

    service = module.get<ComentarioAvaliacaoService>(ComentarioAvaliacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
