// Tipo para los datos de perfil (compartido entre componentes)
export type ProfileData = {
  nombreCompleto: string;
  apodo: string;
  correo: string;
  fecha_registro: string;
  id_usuario: string;
  estado: boolean;
  foto_url?: string;
};