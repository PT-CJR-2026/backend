export class Loja {
  id!: number;
  usuario_id!: number;
  nome!: string;
  descricao!: string | null;
  logo_url!: string | null;
  banner_url!: string | null;
  sticker_url!: string | null;
  created_at!: Date;
  updated_at!: Date;
}