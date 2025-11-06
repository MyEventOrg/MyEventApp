"use client"
import Resumen from './components/home_components/Resumen';
import { useState, useEffect } from "react";
import Aviso from "../components/Aviso";
export default function Home() {

  const [mensajeAviso, setMensajeAviso] = useState("");
  const [visible, setVisible] = useState(false);
  const [tipo, setTipo] = useState<"error" | "exito">("exito");

  const showAviso = (texto: string, tipo: "error" | "exito" = "exito") => {
    setMensajeAviso(texto);
    setTipo(tipo);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  useEffect(() => {
    const msg = localStorage.getItem("EventCreadoExito");
    if (msg) {
      showAviso(msg, "exito");
      localStorage.removeItem("EventCreadoExito");
    }
  }, []);
  return (
    <>
      <Resumen />
      <Aviso mensaje={mensajeAviso} visible={visible} tipo={tipo} />
    </>
  );
}