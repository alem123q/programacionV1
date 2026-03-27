# Documentacion Tecnica del Backend

## 1. Descripcion general del sistema

### Problema que resuelve

El backend implementa la capa de negocio y persistencia para una plataforma de gestion de eventos. El sistema centraliza:

- registro y autenticacion de usuarios;
- administracion de perfiles de organizador;
- creacion y mantenimiento de eventos;
- gestion de invitados por evento;
- generacion y seguimiento basico de invitaciones.

### Proposito principal

El objetivo principal es exponer una API REST para que un cliente web pueda operar el ciclo de gestion de eventos desde la creacion del organizador hasta el seguimiento de invitados e invitaciones.

### Usuarios del sistema

Los usuarios identificables desde el modelo actual son:

- organizadores: crean su cuenta, disponen de perfil organizador y administran eventos, invitados e invitaciones;
- administradores: el rol existe en el modelo de `PerfilUsuario`, pero no hay reglas de autorizacion implementadas que otorguen capacidades diferenciales en la API;
- operadores internos: no aparecen como actor tecnico explicito, aunque el panel `/admin/` de Django esta habilitado para administracion manual.

## 2. Arquitectura

### Tipo de arquitectura

La implementacion corresponde a un monolito modular construido con Django y Django REST Framework.

### Descripcion conceptual

La aplicacion se organiza en apps Django por dominio:

- `cuentas`: autenticacion, registro y perfil base del usuario;
- `organizador`: perfil del organizador y eventos;
- `invitados`: invitados asociados a un evento;
- `invitaciones`: invitaciones asociadas uno a uno con invitados.

La API expone endpoints HTTP JSON sobre una base de datos relacional SQLite en desarrollo. La autenticacion se resuelve con sesiones de Django, por lo que la API depende de cookies de sesion y del flujo tradicional de login/logout del framework.

### Componentes principales e interacciones

1. Cliente frontend
   Consume la API REST y mantiene la sesion del usuario mediante cookie.

2. Capa HTTP / API
   Implementada con `APIView` y vistas genericas de DRF (`ListCreateAPIView`, `RetrieveUpdateDestroyAPIView`).

3. Capa de serializacion
   Los serializers validan payloads y transforman modelos a JSON.

4. Capa de dominio / persistencia
   Modelos Django con relaciones relacionales simples:
   `User -> PerfilUsuario -> PerfilOrganizador -> Evento -> Invitado -> Invitacion`.

5. Base de datos
   SQLite configurada directamente en `settings.py`.

### Diagrama conceptual simplificado

```text
Frontend
   |
   v
Django REST API
   |
   +-- cuentas
   |    +-- registro / login / logout / perfil
   |
   +-- organizador
   |    +-- perfiles de organizador
   |    +-- eventos
   |
   +-- invitados
   |    +-- invitados por evento
   |
   +-- invitaciones
        +-- invitaciones por invitado
   |
   v
SQLite
```

## 3. Tecnologias utilizadas

### Lenguajes, frameworks y librerias

- Python 3.8+ como requisito declarado en `README.md`;
- Django 6.0.3;
- Django REST Framework 3.17.1;
- `django-cors-headers` 4.9.0;
- `python-decouple` 3.8 declarado como dependencia, pero no utilizado en la configuracion efectiva observada.

### Base de datos

- SQLite (`django.db.backends.sqlite3`);
- archivo local `db.sqlite3` dentro de `backend/`.

### Infraestructura

Implementacion observada:

- servidor de desarrollo de Django;
- CORS habilitado para `localhost:3000`, `localhost:5173`, `127.0.0.1:3000` y `127.0.0.1:5173`;
- sin evidencia en el repositorio de Docker, Docker Compose, Kubernetes, CI/CD, reverse proxy, colas o despliegue cloud.

## 4. API / Endpoints

### Consideraciones generales

- Base URL: `/api/`
- Formato de intercambio: JSON
- Autenticacion por defecto: `SessionAuthentication`
- Permiso por defecto: `IsAuthenticated`
- Paginacion global: `PageNumberPagination` con `PAGE_SIZE = 10`
- Endpoints publicos: registro, login y vistas resumen de modulos
- Para operaciones `POST`, `PUT`, `PATCH` y `DELETE` autenticadas con sesion, Django puede requerir `CSRF token` si el cliente usa cookies de sesion

### 4.1 Cuentas

#### POST `/api/cuentas/register/`

- Metodo: `POST`
- Descripcion: registra un usuario, crea `PerfilUsuario`, opcionalmente `PerfilOrganizador`, e inicia sesion automaticamente.
- Autenticacion requerida: no

Body:

```json
{
  "username": "ana.eventos",
  "email": "ana@example.com",
  "password": "Segura123",
  "first_name": "Ana",
  "last_name": "Perez",
  "rol": "organizador",
  "empresa": "Eventos Andinos",
  "telefono": "+54-351-555-0101"
}
```

Respuesta 201:

```json
{
  "mensaje": "Usuario registrado correctamente",
  "usuario": {
    "id": 1,
    "username": "ana.eventos",
    "email": "ana@example.com",
    "first_name": "Ana",
    "last_name": "Perez",
    "perfil": {
      "id": 1,
      "rol": "organizador"
    },
    "perfil_organizador": {
      "id": 1,
      "usuario": 1,
      "empresa": "Eventos Andinos",
      "telefono": "+54-351-555-0101"
    }
  }
}
```

Parametros:

- Body:
  - `username` string, obligatorio
  - `email` string, obligatorio
  - `password` string, obligatorio, minimo 8
  - `first_name` string, opcional
  - `last_name` string, opcional
  - `rol` enum: `organizador` | `administrador`
  - `empresa` string, obligatorio si `rol=organizador`
  - `telefono` string, opcional

Codigos de error posibles:

- `400 Bad Request`: datos invalidos, username duplicado, email duplicado, empresa faltante para organizador

Ejemplo de error:

```json
{
  "empresa": [
    "La empresa es obligatoria para organizadores"
  ]
}
```

#### POST `/api/cuentas/login/`

- Metodo: `POST`
- Descripcion: autentica credenciales y crea sesion.
- Autenticacion requerida: no

Body:

```json
{
  "username": "ana.eventos",
  "password": "Segura123"
}
```

Respuesta 200:

```json
{
  "mensaje": "Sesion iniciada correctamente",
  "usuario": {
    "id": 1,
    "username": "ana.eventos",
    "email": "ana@example.com",
    "first_name": "Ana",
    "last_name": "Perez",
    "perfil": {
      "id": 1,
      "rol": "organizador"
    },
    "perfil_organizador": {
      "id": 1,
      "usuario": 1,
      "empresa": "Eventos Andinos",
      "telefono": "+54-351-555-0101"
    }
  }
}
```

Codigos de error posibles:

- `400 Bad Request`: payload invalido
- `401 Unauthorized`: credenciales invalidas

Ejemplo de error 401:

```json
{
  "detalle": "Credenciales inválidas"
}
```

#### POST `/api/cuentas/logout/`

- Metodo: `POST`
- Descripcion: invalida la sesion actual.
- Autenticacion requerida: si

Headers:

- Cookie de sesion
- `X-CSRFToken` cuando aplique

Respuesta 200:

```json
{
  "mensaje": "Sesion cerrada correctamente"
}
```

Codigos de error posibles:

- `401 Unauthorized`: sin sesion autenticada
- `403 Forbidden`: CSRF faltante o invalido

#### GET `/api/cuentas/me/`

- Metodo: `GET`
- Descripcion: devuelve el usuario autenticado y su perfil base.
- Autenticacion requerida: si

Respuesta 200:

```json
{
  "usuario": {
    "id": 1,
    "username": "ana.eventos",
    "email": "ana@example.com",
    "first_name": "Ana",
    "last_name": "Perez",
    "perfil": {
      "id": 1,
      "rol": "organizador"
    },
    "perfil_organizador": {
      "id": 1,
      "usuario": 1,
      "empresa": "Eventos Andinos",
      "telefono": "+54-351-555-0101"
    }
  },
  "perfil": {
    "id": 1,
    "rol": "organizador"
  }
}
```

Codigos de error posibles:

- `401 Unauthorized`

### 4.2 Organizador

#### GET `/api/organizador/`

- Metodo: `GET`
- Descripcion: endpoint resumen del modulo.
- Autenticacion requerida: no

Respuesta 200:

```json
{
  "aplicacion": "organizador",
  "descripcion": "Modulo base para la gestion de organizadores y eventos",
  "recursos": [
    "perfiles de organizador",
    "eventos"
  ]
}
```

#### GET `/api/organizador/perfiles/`
#### POST `/api/organizador/perfiles/`

- Metodo: `GET`, `POST`
- Descripcion: lista o crea perfiles de organizador.
- Autenticacion requerida: si

Body POST:

```json
{
  "usuario": 1,
  "empresa": "Eventos Andinos",
  "telefono": "+54-351-555-0101"
}
```

Respuesta GET 200:

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "usuario": 1,
      "empresa": "Eventos Andinos",
      "telefono": "+54-351-555-0101"
    }
  ]
}
```

Respuesta POST 201:

```json
{
  "id": 1,
  "usuario": 1,
  "empresa": "Eventos Andinos",
  "telefono": "+54-351-555-0101"
}
```

Codigos de error posibles:

- `400 Bad Request`: payload invalido
- `401 Unauthorized`

#### GET `/api/organizador/perfiles/{id}/`
#### PUT `/api/organizador/perfiles/{id}/`
#### PATCH `/api/organizador/perfiles/{id}/`
#### DELETE `/api/organizador/perfiles/{id}/`

- Metodo: `GET`, `PUT`, `PATCH`, `DELETE`
- Descripcion: consulta, actualiza o elimina un perfil de organizador.
- Autenticacion requerida: si

Codigos de error posibles:

- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`

#### GET `/api/organizador/eventos/`
#### POST `/api/organizador/eventos/`

- Metodo: `GET`, `POST`
- Descripcion: lista o crea eventos.
- Autenticacion requerida: si

Body POST:

```json
{
  "organizador": 1,
  "titulo": "Expo Tecnologia 2026",
  "descripcion": "Encuentro de proveedores y clientes",
  "fecha_evento": "2026-05-10T18:00:00Z",
  "ubicacion": "Cordoba Capital",
  "capacidad": 300,
  "estado": "publicado"
}
```

Respuesta POST 201:

```json
{
  "id": 1,
  "organizador": 1,
  "titulo": "Expo Tecnologia 2026",
  "descripcion": "Encuentro de proveedores y clientes",
  "fecha_evento": "2026-05-10T18:00:00Z",
  "ubicacion": "Cordoba Capital",
  "capacidad": 300,
  "estado": "publicado"
}
```

Codigos de error posibles:

- `400 Bad Request`
- `401 Unauthorized`

#### GET `/api/organizador/eventos/{id}/`
#### PUT `/api/organizador/eventos/{id}/`
#### PATCH `/api/organizador/eventos/{id}/`
#### DELETE `/api/organizador/eventos/{id}/`

- Metodo: `GET`, `PUT`, `PATCH`, `DELETE`
- Descripcion: consulta, actualiza o elimina un evento.
- Autenticacion requerida: si

Codigos de error posibles:

- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`

### 4.3 Invitados

#### GET `/api/invitados/`

- Metodo: `GET`
- Descripcion: endpoint resumen del modulo.
- Autenticacion requerida: no

Respuesta 200:

```json
{
  "aplicacion": "invitados",
  "descripcion": "Modulo para administrar invitados y sus respuestas",
  "recursos": [
    "invitados",
    "estados de asistencia"
  ]
}
```

#### GET `/api/invitados/lista/`
#### POST `/api/invitados/lista/`

- Metodo: `GET`, `POST`
- Descripcion: lista o crea invitados.
- Autenticacion requerida: si

Body POST:

```json
{
  "evento": 1,
  "nombre": "Carlos Gomez",
  "email": "carlos@example.com",
  "telefono": "+54-351-555-0202",
  "cantidad_acompanantes": 2,
  "estado_asistencia": "pendiente",
  "observaciones": "Vegetariano"
}
```

Respuesta POST 201:

```json
{
  "id": 1,
  "evento": 1,
  "nombre": "Carlos Gomez",
  "email": "carlos@example.com",
  "telefono": "+54-351-555-0202",
  "cantidad_acompanantes": 2,
  "estado_asistencia": "pendiente",
  "observaciones": "Vegetariano"
}
```

Codigos de error posibles:

- `400 Bad Request`: payload invalido o restriccion de unicidad `evento + email`
- `401 Unauthorized`

#### GET `/api/invitados/lista/{id}/`
#### PUT `/api/invitados/lista/{id}/`
#### PATCH `/api/invitados/lista/{id}/`
#### DELETE `/api/invitados/lista/{id}/`

- Metodo: `GET`, `PUT`, `PATCH`, `DELETE`
- Descripcion: consulta, actualiza o elimina un invitado.
- Autenticacion requerida: si

Codigos de error posibles:

- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`

### 4.4 Invitaciones

#### GET `/api/invitaciones/`

- Metodo: `GET`
- Descripcion: endpoint resumen del modulo.
- Autenticacion requerida: no

Respuesta 200:

```json
{
  "aplicacion": "invitaciones",
  "descripcion": "Modulo para administrar el envio y seguimiento de invitaciones",
  "recursos": [
    "invitaciones",
    "canales de envio",
    "codigos de acceso"
  ]
}
```

#### GET `/api/invitaciones/lista/`
#### POST `/api/invitaciones/lista/`

- Metodo: `GET`, `POST`
- Descripcion: lista o crea invitaciones.
- Autenticacion requerida: si

Body POST:

```json
{
  "invitado": 1,
  "canal_envio": "email",
  "estado": "enviada",
  "fecha_envio": "2026-05-01T12:00:00Z",
  "mensaje_personalizado": "Te esperamos en el evento"
}
```

Respuesta POST 201:

```json
{
  "id": 1,
  "invitado": 1,
  "canal_envio": "email",
  "estado": "enviada",
  "codigo_acceso": "550e8400-e29b-41d4-a716-446655440000",
  "fecha_envio": "2026-05-01T12:00:00Z",
  "mensaje_personalizado": "Te esperamos en el evento"
}
```

Codigos de error posibles:

- `400 Bad Request`: payload invalido o intento de crear mas de una invitacion para el mismo invitado
- `401 Unauthorized`

#### GET `/api/invitaciones/lista/{id}/`
#### PUT `/api/invitaciones/lista/{id}/`
#### PATCH `/api/invitaciones/lista/{id}/`
#### DELETE `/api/invitaciones/lista/{id}/`

- Metodo: `GET`, `PUT`, `PATCH`, `DELETE`
- Descripcion: consulta, actualiza o elimina una invitacion.
- Autenticacion requerida: si

Codigos de error posibles:

- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`

## 5. Modelo de datos

### Entidades principales

#### User

Se utiliza el modelo de usuario por defecto de Django.

Campos consumidos por la API:

- `id`
- `username`
- `email`
- `first_name`
- `last_name`

#### PerfilUsuario

- `id`
- `usuario` (`OneToOne -> User`)
- `rol` (`organizador`, `administrador`)

#### PerfilOrganizador

- `id`
- `usuario` (`OneToOne -> User`)
- `empresa`
- `telefono`

#### Evento

- `id`
- `organizador` (`ForeignKey -> PerfilOrganizador`)
- `titulo`
- `descripcion`
- `fecha_evento`
- `ubicacion`
- `capacidad`
- `estado` (`borrador`, `publicado`, `cancelado`)

#### Invitado

- `id`
- `evento` (`ForeignKey -> Evento`)
- `nombre`
- `email`
- `telefono`
- `cantidad_acompanantes`
- `estado_asistencia` (`pendiente`, `confirmado`, `rechazado`)
- `observaciones`

Restriccion:

- unico por par `evento + email`

#### Invitacion

- `id`
- `invitado` (`OneToOne -> Invitado`)
- `canal_envio` (`email`, `whatsapp`, `link`)
- `estado` (`pendiente`, `enviada`, `entregada`, `abierta`, `vencida`)
- `codigo_acceso` (`UUID`, unico, solo lectura en API)
- `fecha_envio`
- `mensaje_personalizado`

### Relaciones entre entidades

```text
User 1 --- 1 PerfilUsuario
User 1 --- 1 PerfilOrganizador
PerfilOrganizador 1 --- N Evento
Evento 1 --- N Invitado
Invitado 1 --- 1 Invitacion
```

### Ejemplo de estructura

```json
{
  "usuario": {
    "id": 1,
    "username": "ana.eventos"
  },
  "perfil_usuario": {
    "id": 1,
    "rol": "organizador"
  },
  "perfil_organizador": {
    "id": 1,
    "empresa": "Eventos Andinos"
  },
  "evento": {
    "id": 10,
    "titulo": "Expo Tecnologia 2026"
  },
  "invitado": {
    "id": 25,
    "email": "carlos@example.com"
  },
  "invitacion": {
    "id": 12,
    "codigo_acceso": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

## 6. Autenticacion y autorizacion

### Mecanismo utilizado

El backend utiliza autenticacion por sesion de Django a traves de `SessionAuthentication`.

Implicancias tecnicas:

- no hay JWT;
- no hay OAuth2;
- el login crea sesion server-side;
- el cliente debe reenviar la cookie de sesion;
- para metodos no seguros, puede requerirse token CSRF.

### Roles y permisos

Roles modelados:

- `organizador`
- `administrador`

Estado actual de autorizacion:

- el permiso global de la API es `IsAuthenticated`;
- algunos endpoints se exponen como publicos con `AllowAny`;
- no hay clases de permiso por rol;
- no existe filtrado por propietario del recurso;
- un usuario autenticado puede operar sobre recursos de otros usuarios si conoce sus IDs.

Esta observacion es un hallazgo importante de arquitectura y seguridad: el sistema modela roles pero todavia no los aplica en autorizacion efectiva.

## 7. Flujo de negocio

### Caso de uso 1: registro de organizador

1. El cliente envía `POST /api/cuentas/register/`.
2. El serializer valida unicidad de username y email.
3. Si el rol es `organizador`, exige `empresa`.
4. Se crea el usuario de Django.
5. Se crea `PerfilUsuario`.
6. Si corresponde, se crea `PerfilOrganizador`.
7. Se inicia sesion automaticamente.
8. Se devuelve el usuario serializado.

### Caso de uso 2: autenticacion y recuperacion de perfil

1. El cliente envía `POST /api/cuentas/login/`.
2. Django autentica username y password.
3. Si la autenticacion es valida, se crea sesion.
4. El cliente consulta `GET /api/cuentas/me/`.
5. La API devuelve usuario, rol y perfil organizador si existe.

### Caso de uso 3: alta de evento

1. El cliente autenticado crea o reutiliza un `PerfilOrganizador`.
2. Envía `POST /api/organizador/eventos/` con el ID del organizador.
3. DRF valida el payload contra `EventoSerializer`.
4. Se persiste el evento.
5. El recurso queda disponible para CRUD posterior.

### Caso de uso 4: gestion de invitados

1. El cliente autenticado envía `POST /api/invitados/lista/`.
2. Se valida el ID del evento.
3. Se valida la unicidad `evento + email`.
4. Se crea el invitado con estado inicial de asistencia.

### Caso de uso 5: generacion de invitacion

1. El cliente autenticado envía `POST /api/invitaciones/lista/`.
2. Se valida el ID del invitado.
3. Django genera `codigo_acceso` UUID automaticamente.
4. Se persiste la invitacion en relacion uno a uno con el invitado.

## 8. Testing

### Tipos de tests implementados

No se encontraron archivos de tests ni suites automatizadas en `backend/`.

Estado observado:

- sin `pytest`;
- sin `unittest` especifico del proyecto;
- sin `APITestCase`;
- sin evidencia de cobertura automatizada.

### Instrucciones para ejecutarlos

Actualmente no hay tests del backend para ejecutar.

Comando estandar esperado una vez incorporados:

```bash
python manage.py test
```

### Cobertura esperada

No hay una meta de cobertura declarada en el repositorio. Como linea base recomendada para este dominio:

- tests unitarios de serializers y validaciones;
- tests de integracion de endpoints criticos;
- tests de permisos por propietario y por rol;
- tests de regresion sobre restricciones de unicidad y relaciones uno a uno.

## 9. Performance y escalabilidad

### Estrategias aplicadas

Implementado actualmente:

- `select_related` en vistas de lista/detalle para reducir consultas N+1 en relaciones inmediatas;
- paginacion global con tamano fijo de 10 elementos.

### Posibles cuellos de botella

- SQLite limita concurrencia y escalabilidad horizontal;
- no existe cache;
- no existe procesamiento asincrono para envio de invitaciones;
- no existen filtros, indices explicitos adicionales ni estrategias de consulta por volumen;
- la autorizacion por IDs directos puede derivar en acceso transversal a datos, lo que dificulta escalado seguro multiusuario.

## 10. Manejo de errores

### Estructura de errores

Se observan dos patrones:

1. Errores de DRF por validacion:

```json
{
  "campo": [
    "detalle del error"
  ]
}
```

2. Error manual en login:

```json
{
  "detalle": "Credenciales inválidas"
}
```

No hay una capa estandarizada de errores de dominio con codigo interno, correlacion o contrato uniforme.

### Logging y monitoreo

No se observaron configuraciones explicitas de:

- `LOGGING` en Django;
- integracion con Sentry, Datadog, Prometheus o servicios equivalentes;
- health checks;
- metricas de aplicacion;
- trazabilidad distribuida.

## 11. Deployment

### Instrucciones para levantar el proyecto localmente

Desde `backend/`:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

URL base local:

```text
http://localhost:8000
```

### Variables de entorno necesarias

No hay un `.env.example` versionado. El backend puede iniciar sin `.env` porque
`config/settings.py` define valores por defecto para desarrollo.

Si hace falta sobrescribir la configuracion local, se puede crear un `.env`
manual con variables como:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8080
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8080
```

Observacion de auditoria:

- esas variables si se consumen en `config/settings.py` mediante `python-decouple`;
- si no existe `.env`, se usan defaults orientados a desarrollo local con SQLite;
- el proyecto ya no contempla configuracion MySQL en el codigo ni en Docker Compose.

### Proceso de despliegue

No existe en el repositorio un proceso de despliegue documentado ni artefactos de infraestructura de produccion.

Lo que no se pudo verificar por codigo:

- proveedor cloud;
- pipeline CI/CD;
- estrategia de migraciones en produccion;
- manejo de secretos;
- balanceo de carga;
- terminacion TLS;
- backups.

## 12. Decisiones tecnicas

### Justificacion de tecnologias y enfoques elegidos

Decisiones inferibles por implementacion:

- Django + DRF simplifican un backend CRUD con autenticacion incorporada;
- apps separadas por dominio favorecen modularidad dentro de un monolito;
- SQLite reduce complejidad para desarrollo inicial;
- sesion server-side simplifica integracion con un frontend web mismo-origen o con CORS controlado.

### Trade-offs considerados

- Sesiones vs JWT:
  - ventaja: menor complejidad inicial;
  - costo: dependencia de cookies, CSRF y menor flexibilidad para clientes externos o mobile.

- Monolito modular vs microservicios:
  - ventaja: simplicidad operativa y menor costo de coordinacion;
  - costo: escalado independiente por dominio no disponible.

- SQLite vs PostgreSQL/MySQL:
  - ventaja: arranque rapido en local;
  - costo: poca robustez para concurrencia, observabilidad y operacion productiva.

- CRUD generico de DRF vs servicios de dominio mas ricos:
  - ventaja: velocidad de desarrollo;
  - costo: reglas de negocio, permisos y contratos de error quedan poco expresivos.

## Hallazgos de auditoria

### Fortalezas

- estructura modular clara por dominio;
- modelo de datos simple y entendible;
- API REST consistente para operaciones CRUD;
- paginacion y optimizacion basica de consultas presentes;
- registro transaccional en creacion de usuario.

### Riesgos y brechas

- sin tests automatizados;
- sin permisos por rol ni por propietario;
- autenticacion por sesion sin documentacion operativa de CSRF para clientes;
- variables de entorno declaradas pero no aplicadas;
- `SECRET_KEY` hardcodeada y `DEBUG=True`;
- sin logging, monitoreo ni estrategia de errores uniforme;
- sin evidencia de despliegue productivo ni infraestructura;
- sin filtros por recurso ni versionado de API.

## Preguntas necesarias para completar la documentacion

1. Cual es el entorno objetivo de produccion: VPS, Docker, PaaS, Kubernetes u otro?
2. La aplicacion debe seguir usando sesiones de Django o se planea JWT para clientes SPA/mobile?
3. Existen reglas de autorizacion por rol o por propietario que todavia no fueron implementadas?
4. Se espera que un organizador solo vea sus propios eventos, invitados e invitaciones?
5. Existe una politica formal de manejo de errores para estandarizar respuestas?
6. Se utiliza algun sistema de logging o monitoreo fuera del repositorio?
7. Hay procesos reales de envio de emails o WhatsApp asociados a `Invitacion`, o por ahora el modelo es solo persistencia?
8. Existe un proveedor de base de datos de produccion distinto de SQLite?
9. Hay pipeline CI/CD, ejecucion de migraciones automatica y gestion de secretos fuera del codigo?
10. Existe una estrategia de testing esperada por el equipo y un umbral de cobertura minimo?
11. Se requiere versionado de API o compatibilidad hacia atras con clientes existentes?
12. Que consumidores externos usan esta API ademas del frontend incluido en el repositorio?

## Alcance de esta documentacion

Esta documentacion fue elaborada a partir del codigo fuente presente en el repositorio y constituye una mezcla de:

- documentacion descriptiva de lo efectivamente implementado;
- auditoria tecnica de riesgos y omisiones;
- inferencias controladas sobre comportamiento estandar de Django REST Framework.

No se pudo ejecutar validacion funcional completa del backend en este entorno porque Django no estaba instalado al momento de la auditoria.
