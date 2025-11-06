import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import usuarioApi from '../../../api/usuario';
import { ProfileData } from '../types';
import { useUser } from '../../../context/userContext';

// Hook principal para gestión de perfil de usuario 
export function useProfile() {
  const { user, refreshFromCookie } = useUser();
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Determina si el formulario ha sido modificado
  const isDirty = isEditing && profileData && originalProfile &&
    (profileData.nombreCompleto !== originalProfile.nombreCompleto ||
     profileData.apodo !== originalProfile.apodo);

  // Validaciones de campos
  const isValidForm = profileData ? 
    profileData.nombreCompleto.length >= 3 && profileData.nombreCompleto.length <= 40 &&
    profileData.apodo.length >= 3 && profileData.apodo.length <= 12
    : false;

  // Función para cargar los datos del perfil desde el backend
  const fetchProfileData = async () => {
    // No reseteamos isLoading aquí para evitar parpadeos al guardar
    try {
      console.log('Cargando perfil...');
      const response = await usuarioApi.getPerfil();
      if (response && response.success) {
        // Mapea url_imagen a foto_url para el frontend y mapea campos
        const mappedData: ProfileData = {
          nombreCompleto: response.data.nombreCompleto || '',
          apodo: response.data.apodo || '',
          correo: response.data.correo || '',
          fecha_registro: response.data.fecha_registro ? new Date(response.data.fecha_registro).toLocaleDateString() : '',
          id_usuario: response.data.usuario_id?.toString() || '',
          estado: response.data.activo ?? true,
          foto_url: response.data.url_imagen || undefined,
        };
        setProfileData(mappedData);
        setOriginalProfile(mappedData);
        setError(null);
      } else {
        console.log('Error en respuesta:', response?.message);
        setError('No se pudo cargar el perfil.');
      }
    } catch (err: any) {
      console.log('Error en fetch:', err);
      setError('No se pudo cargar el perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  // Llama a fetchProfileData cuando el componente se monta
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profileData) return;
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Función para guardar los cambios
  const handleSaveChanges = async () => {
    if (!profileData) return;
    setIsSaving(true);
    try {
      const response = await usuarioApi.updatePerfil({
        nombreCompleto: profileData.nombreCompleto,
        apodo: profileData.apodo,
      });

      if (response && response.success) {
        toast.success('Perfil actualizado con éxito');
        setIsEditing(false);
        await fetchProfileData(); // Re-sincroniza con el backend
        // Refresca el usuario desde el nuevo token (importante para apodo, etc)

        if (typeof refreshFromCookie === 'function') {
          refreshFromCookie();
        }
      } else {
        toast.error(response.message || 'No se pudo actualizar el perfil.');
      }
    } catch (error) {
      toast.error('Error de conexión. No se pudieron guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Función para eliminar la cuenta
  const handleDeleteAccount = async () => {
    try {
      const res = await usuarioApi.eliminarCuenta();
      if (res && res.success) {
        toast.success('Cuenta eliminada correctamente. Serás redirigido.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error(res?.message || 'No se pudo eliminar la cuenta.');
      }
    } catch {
      toast.error('Error de conexión. No se pudo eliminar la cuenta.');
    }
  };

  const handlePictureUpload = async (file: File) => {
    toast.loading('Subiendo imagen...');
    try {
      const response = await usuarioApi.updateFotoPerfil(file);
      if (response && response.success) {
        toast.dismiss();
        toast.success('¡Foto de perfil actualizada!');
        // Actualiza la foto en el estado local
        const newPhotoUrl = response.data?.url_imagen;
        setProfileData(prev => prev ? { ...prev, foto_url: newPhotoUrl } : null);
        setOriginalProfile(prev => prev ? { ...prev, foto_url: newPhotoUrl } : null);
        // Refresca desde cookie para mantener consistencia
        if (typeof refreshFromCookie === 'function') {
          refreshFromCookie();
        }
      } else {
        throw new Error(response.message || 'Error al subir la imagen');
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || 'No se pudo subir la imagen.');
    }
  };

  // Función para eliminar la foto de perfil
  const handleDeletePhoto = async () => {
    if (!profileData) return;
    toast.loading('Eliminando foto...');
    try {
      const response = await usuarioApi.eliminarFotoPerfil();
      toast.dismiss();
      if (response && response.success) {
        toast.success('Foto de perfil eliminada');
        setProfileData(prev => prev ? { ...prev, foto_url: undefined } : null);
        setOriginalProfile(prev => prev ? { ...prev, foto_url: undefined } : null);
        // Refresca desde cookie para mantener consistencia
        if (typeof refreshFromCookie === 'function') {
          refreshFromCookie();
        }
      } else {
        toast.error(response.message || 'No se pudo eliminar la foto.');
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || 'No se pudo eliminar la foto.');
    }
  };

  // Retorna la interfaz pública del hook (patrón Facade)
  return {
    profileData,
    originalProfile,
    isLoading,
    error,
    isEditing,
    isSaving,
    isDirty,
    isValidForm,
    isAuthenticated: !!user,
    userLoading: false,
    setIsEditing,
    setProfileData,
    handleInputChange,
    handleSaveChanges,
    handleDeleteAccount,
    handlePictureUpload,
    handleDeletePhoto,
  };
}