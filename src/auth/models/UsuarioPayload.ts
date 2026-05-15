export interface UsuarioPayload {
    sub: number;
    email: string;
    username: string;
    nome?: string;
    iat?: number;
    exp?: number;
}