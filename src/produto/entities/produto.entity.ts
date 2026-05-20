export class Produto {
  id!: number;
  loja_id!: number;
  categoria_id!: number;
  nome!: string;
  descricao?: string;
  preco!: number;
  estoque!: number;
  created_at!: Date;
  updated_at!: Date;
}