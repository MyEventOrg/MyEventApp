"use client";
import React from "react";
import NoMainHeader from "../components/NoMainHeader";
import { Toaster } from "react-hot-toast";
import DatosPerfil from "./components/DatosPerfil";
import InfoCuenta from "./components/InfoCuenta";
import EstadisticasCuenta from "./components/EstadisticasCuenta";
import EliminarCuenta from "./components/EliminarCuenta";
import { useProfile } from "./hooks/useProfile";

export default function PerfilPage() {
  const {
    profileData,
    originalProfile,
    isLoading,
    error,
    isEditing,
    isSaving,
    isDirty,
    isValidForm,
    isAuthenticated,
    userLoading,
    setIsEditing,
    setProfileData,
    handleInputChange,
    handleSaveChanges,
    handleDeleteAccount,
    handlePictureUpload,
    handleDeletePhoto,
  } = useProfile();

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NoMainHeader title="Mi Perfil" />
        <main className="flex-1 flex items-center justify-center text-lg font-medium">Cargando perfil...</main>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <NoMainHeader title="Mi Perfil" />
        <main className="flex-1 flex items-center justify-center text-red-600 text-lg font-medium">Debes iniciar sesión para ver tu perfil.</main>
      </div>
    );
  }
  if (error || !profileData) {
    return (
      <div className="min-h-screen flex flex-col">
        <NoMainHeader title="Mi Perfil" />
        <main className="flex-1 flex items-center justify-center text-red-600 text-lg font-medium">{error || 'Error desconocido.'}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Toaster position="top-right" />
      <NoMainHeader title="Mi Perfil" />
      <div className="max-w-2xl mx-auto px-2 sm:px-0 py-6">
        <DatosPerfil
          profileData={profileData}
          isEditing={isEditing}
          isDirty={!!isDirty}
          isValidForm={isValidForm}
          onEditClick={() => {
            if (isDirty && originalProfile) {
              setProfileData(originalProfile); // Restaura los datos si se cancela
            }
            setIsEditing((prev: boolean) => !prev);
          }}
          onInputChange={handleInputChange}
          onSave={handleSaveChanges}
          saving={isSaving}
          onPictureChange={handlePictureUpload}
          onDeletePhoto={handleDeletePhoto}
        />
        <InfoCuenta profileData={profileData} />
        <EstadisticasCuenta />
        <EliminarCuenta onDelete={handleDeleteAccount} />
      </div>
    </div>
  );
}
