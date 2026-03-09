# Teamline

**Teamline** es una red social diseñada para clubes deportivos que permite **preservar y compartir la historia colectiva de los equipos** a lo largo del tiempo.

La plataforma permite que jugadores, entrenadores y miembros de un club registren recuerdos, aprendizajes y momentos importantes en una **línea de tiempo compartida**, creando así una memoria deportiva que trasciende generaciones.

A diferencia de herramientas como WhatsApp o Discord, donde los recuerdos se pierden en conversaciones efímeras, **Teamline centraliza la memoria del equipo en un único lugar estructurado y permanente**.

---

# Visión

El deporte genera historias, aprendizajes y vínculos que muchas veces se pierden cuando las generaciones cambian.

Teamline busca resolver este problema mediante un **hub digital de memoria deportiva colectiva**, donde cada equipo pueda construir su historia de forma colaborativa.

La plataforma promueve:

* **Preservación de recuerdos deportivos**
* **Transmisión de experiencia entre generaciones**
* **Fortalecimiento del sentido de pertenencia**
* **Construcción colectiva de la identidad del equipo**

---

# Problema que resuelve

Actualmente la historia de los equipos se dispersa en múltiples plataformas:

* grupos de WhatsApp
* servidores de Discord
* fotografías en redes sociales
* recuerdos personales

Esto genera que:

* la historia del equipo se **pierda con el tiempo**
* las nuevas generaciones **no conozcan el pasado del club**
* el conocimiento deportivo **no se transfiera entre generaciones**

Teamline centraliza toda esa memoria en un **timeline estructurado y persistente**.

---

# Concepto principal

Cada equipo tiene una **línea de tiempo colectiva (Team Timeline)** donde los miembros pueden:

* publicar recuerdos
* compartir fotos o historias
* comentar
* reaccionar

Las publicaciones se organizan cronológicamente y quedan asociadas a los **miembros activos del equipo en ese periodo**.

Esto crea una **historia deportiva viva** del club.

---

# Principales funcionalidades

## 1. Cuentas de usuario

Cada persona puede crear una cuenta en Teamline para:

* crear equipos
* unirse a equipos existentes
* interactuar con timelines

---

## 2. Equipos

Los usuarios pueden:

* crear equipos
* solicitar unirse a equipos
* invitar miembros mediante nombre de usuario

El acceso siempre requiere **confirmación mutua** para garantizar la autenticidad de la comunidad.

---

## 3. Timeline del equipo

Cada equipo posee una **línea de tiempo compartida** donde los miembros activos pueden:

* publicar recuerdos
* comentar publicaciones
* reaccionar con likes
* interactuar con la historia del equipo

---

## 4. Periodos de membresía

Cada miembro tiene un **periodo activo dentro del equipo**.

Esto permite:

* registrar en qué etapa perteneció al equipo
* contextualizar las publicaciones dentro de una generación deportiva
* construir una narrativa histórica del club.

---

## 5. Roles dentro del equipo

Teamline permite asignar roles como:

* Capitán
* Coach
* Manager

Estos roles habilitan **foros privados de memoria entre generaciones**.

Por ejemplo:

Un capitán puede dejar mensajes o consejos al siguiente capitán del equipo, creando una **línea de transmisión de liderazgo y experiencia**.

---

## 6. Foros de legado por rol

Cada rol tiene un foro interno donde los miembros pueden compartir conocimiento específico del rol.

Ejemplos:

* estrategias deportivas
* aprendizajes de liderazgo
* consejos organizativos
* cultura del equipo

Esto crea una **memoria institucional interna del club**.

---

# Filosofía del proyecto

Teamline no pretende ser:

* un gestor administrativo de clubes
* un software de gestión deportiva
* un sistema de planificación de entrenamientos

Teamline es **una red social deportiva centrada en la memoria colectiva**.

Su propósito es:

* preservar historias
* fortalecer comunidades
* transmitir conocimiento deportivo entre generaciones.

---

# Arquitectura del proyecto (Actual)

Frontend:

* React
* Vite
* CSS modular
* Lucide Icons

Componentes principales actuales:

* Autenticación (Login / Register)
* Timeline del equipo
* Administración de equipos
* Gestión de miembros
* Roles deportivos
* Sistema de invitaciones

---

# Estructura conceptual de datos

Ejemplo simplificado de estructura:

```
User
 ├ id
 ├ username
 ├ email
 └ teams[]

Team
 ├ id
 ├ name
 ├ members[]
 ├ timeline[]
 └ roles[]

Member
 ├ userId
 ├ role
 ├ activeFrom
 ├ activeTo
 └ status

Post
 ├ id
 ├ author
 ├ content
 ├ date
 ├ likes
 └ comments
```

---

# Futuro del proyecto

Algunas ideas para futuras versiones:

* archivos multimedia en timeline
* estadísticas históricas del equipo
* exploración de generaciones del club
* timeline visual interactivo
* mapas de legado deportivo
* perfiles históricos de jugadores

---

# Objetivo final

Crear una plataforma donde **la historia de los equipos nunca se pierda**.

Teamline busca convertirse en el lugar donde los equipos puedan decir:

> "Aquí está nuestra historia."
