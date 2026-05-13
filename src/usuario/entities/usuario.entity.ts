export class Usuario {
  id?: number;
  username!: string;
  nome!: string;
  email!: string;
  senha_hash!: string;
  foto_perfil_url?: string;
  created_at?: Date;
  updated_at?: Date;
}
