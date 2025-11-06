# MyEvent

> **Para correr el proyecto en tu máquina local utiliza:**
> ```
> npx next dev
> ```

---

## Descripción del Proyecto

**MyEvent** es una plataforma web diseñada para facilitar la organización y gestión de eventos de manera práctica y ordenada. Su propósito es ofrecer una experiencia completa tanto para organizadores como para asistentes, integrando funciones sociales, herramientas colaborativas y notificaciones oportunas.

El sistema permite crear eventos, invitar participantes, confirmar asistencias, compartir recursos y mantener una comunicación clara entre organizadores e invitados. De esta forma, se busca reemplazar métodos tradicionales poco eficientes (como listas manuales o chats dispersos) por una plataforma digital moderna, intuitiva y accesible.

---

## Características Principales

1. **Gestión de usuarios y accesos**
   - Registro y autenticación mediante correo electrónico.
   - Edición de perfil (nombre, correo, imagen).
   - Eliminación segura de cuenta.
   - Cierre de sesión desde cualquier dispositivo.

2. **Creación y administración de eventos**
   - Registro de eventos con nombre, descripción, imagen, fecha, hora y lugar.
   - Privacidad configurable (evento público o privado).
   - Edición y eliminación de eventos.
   - Inclusión de rutas alternativas y coorganizadores.

3. **Invitación y confirmación de asistencia**
   - Búsqueda e invitación de usuarios por nombre o correo.
   - Visualización de invitados confirmados.
   - Confirmación de asistencia (sí / no).
   - Posibilidad de desvincularse de un evento.

4. **Recursos compartidos**
   - Subida de archivos relevantes (PDF, imágenes, listas).
   - Compartición de enlaces externos.
   - Acceso a todos los recursos por parte de los asistentes.

5. **Mapas y localización**
   - Integración con servicios de mapas para mostrar ubicaciones exactas.
   - Visualización de puntos alternativos de encuentro.

6. **Notificaciones**
   - Alertas sobre invitaciones, cambios en eventos y nuevos recursos compartidos.
   - Gestión de confirmaciones de asistencia.

7. **Exploración de eventos públicos**
   - Visualización de eventos disponibles.
   - Guardado de favoritos y gestión de listas personales.

---

## Suposiciones, Restricciones y Reglas de Negocio

- Los eventos son creados manualmente por usuarios registrados.  
- La plataforma no gestiona pagos ni entradas.  
- Los archivos compartidos están sujetos a límites de formato y tamaño.  
- Solo los organizadores pueden eliminar un evento o retirar invitados.  
- La aplicación se limita a versión web en esta primera etapa.  

**Reglas destacadas:**
- No se permiten eventos duplicados con el mismo nombre.  
- Un usuario puede tener como máximo 5 eventos activos creados.  
- Los eventos públicos no pueden superar los 100 asistentes confirmados.  
- Las invitaciones privadas expiran después de 5 días.  

---

## Justificación y ODS Relacionados

El proyecto se alinea con los Objetivos de Desarrollo Sostenible (ODS):

- **ODS 9: Industria, innovación e infraestructura**, al plantear una solución digital accesible que optimiza la organización de actividades.  
- **ODS 11: Ciudades y comunidades sostenibles**, al facilitar la coordinación de personas, horarios y ubicaciones, promoviendo un uso más eficiente del espacio urbano.  

---

## Tecnologías Utilizadas

- **Next.js** (con TypeScript) para frontend y backend en un mismo entorno.  
- **Prisma** para la gestión de base de datos.  
- **API de Google Maps** para la geolocalización de eventos.  
- **Node.js** como entorno de ejecución.  
- **Scrum** como metodología ágil para la gestión del proyecto.  

---