# Informe de Cambios del Backend

Fecha de corte: 2026-03-26

## 1. Objetivo del documento

Este documento cumple dos funciones:

- dejar una bitacora historica de cambios del backend;
- registrar decisiones tecnicas, correcciones, simplificaciones, eliminaciones
  y su impacto.

No reemplaza la documentacion tecnica funcional. Su objetivo es responder:

- que se cambio;
- por que se cambio;
- que archivos fueron afectados;
- en que estado quedo el backend.

El alcance de este documento es exclusivamente el backend.

## 2. Formato de registro a usar desde ahora

Cada cambio nuevo del backend debe agregarse tambien a este archivo usando el
siguiente formato:

### Fecha: YYYY-MM-DD

#### Cambio

Descripcion breve y concreta del cambio.

#### Motivo

- razon 1
- razon 2

#### Archivos

- `ruta/archivo_1.py`
- `ruta/archivo_2.py`

#### Impacto

- efecto tecnico o funcional del cambio
- riesgo reducido, simplificacion o nuevo comportamiento

## 3. Estado actual resumido

Hoy el backend puede describirse asi:

- monolito modular en Django;
- SQLite como unica base prevista;
- Docker simplificado;
- rutas mas expresivas;
- apps principales del dominio ya presentes;
- dos modulos nuevos incorporados: `gastos` y `notificaciones`;
- menor complejidad tecnica que en el estado inicial;
- documentacion funcional extensa, pero todavia no completamente alineada con
  todos los cambios recientes.

## 4. Criterios de diseno que quedaron establecidos

- evitar soporte tecnico o infraestructura que no se use realmente;
- priorizar SQLite mientras el proyecto siga en una etapa simple;
- nombrar endpoints con lenguaje obvio para consumo humano;
- no crear mas apps de las necesarias, pero separar dominios cuando el modulo ya
  tiene entidad propia;
- modelar solo lo que el producto necesita hoy, dejando evolucion futura
  abierta;
- reducir archivos y configuraciones accesorias cuando el valor real sea bajo;
- usar este documento como bitacora obligatoria de cambios del backend.

## 5. Linea historica de cambios

### Fecha: 2026-03-26

#### Cambio

Se elimino `backend/.env.example` y se redefinio `.env` como opcional.

#### Motivo

- el backend ya contaba con valores por defecto suficientes para desarrollo
  local;
- el archivo agregaba mantenimiento documental sin ser necesario para arrancar
  el proyecto;
- se busco simplificar el setup.

#### Archivos

- `backend/.env.example`
- `backend/README.md`
- `backend/documentacion/TECHNICAL_DOCUMENTATION.md`

#### Impacto

- se redujo la cantidad de archivos auxiliares;
- la configuracion local paso a depender de defaults reales del proyecto;
- la documentacion de setup se ajusto al comportamiento actual.

### Fecha: 2026-03-26

#### Cambio

Se elimino `backend/entrypoint.sh` y su comportamiento se movio al
`backend/Dockerfile`.

#### Motivo

- el script ya no justificaba una capa separada de mantenimiento;
- el arranque del contenedor podia quedar expresado directamente en el `CMD`.

#### Archivos

- `backend/entrypoint.sh`
- `backend/Dockerfile`
- `backend/README.md`

#### Impacto

- el contenedor del backend sigue aplicando migraciones y levantando Django;
- se simplifico la estructura de arranque en Docker.

### Fecha: 2026-03-26

#### Cambio

Se evito que la documentacion del backend entre en la imagen Docker.

#### Motivo

- no era necesario copiar documentacion al contenedor;
- se busco mantener el contexto de build mas limpio.

#### Archivos

- `backend/.dockerignore`

#### Impacto

- `README.md` y `documentacion/TECHNICAL_DOCUMENTATION.md` dejaron de entrar al build del
  backend;
- la imagen queda mas enfocada en runtime.

### Fecha: 2026-03-26

#### Cambio

Se limpio el soporte a MySQL y se consolido SQLite como unica base prevista.

#### Motivo

- SQLite era la opcion elegida para trabajo local y para el stack actual;
- mantener ramas de configuracion para MySQL agregaba complejidad innecesaria;
- `PyMySQL` generaba errores de arranque cuando no estaba instalado.

#### Archivos

- `backend/config/settings.py`
- `backend/requirements.txt`
- `docker-compose.yml`
- `README.md`
- `backend/README.md`
- `backend/documentacion/TECHNICAL_DOCUMENTATION.md`

#### Impacto

- el backend ya no depende de MySQL;
- se removieron `PyMySQL` y `cryptography` de dependencias;
- `docker-compose.yml` quedo reducido a `backend` y `frontend`;
- la base local y en Docker pasa a ser `backend/db.sqlite3`.

### Fecha: 2026-03-26

#### Cambio

Se corrigio el arranque local del backend para que no dependa de `PyMySQL`
cuando se usa SQLite.

#### Motivo

- `runserver` fallaba por importar `pymysql` en tiempo de carga de settings;
- eso ocurria incluso cuando no se estaba usando MySQL.

#### Archivos

- `backend/config/settings.py`

#### Impacto

- el backend pudo volver a correr correctamente con SQLite;
- ese ajuste luego quedo absorbido por la eliminacion completa del soporte
  MySQL.

### Fecha: 2026-03-26

#### Cambio

Se renombraron rutas de la API para usar nombres mas obvios y consistentes.

#### Motivo

- habia una mezcla de ingles, nombres tecnicos y bases de ruta poco uniformes;
- se busco una API mas expresiva para consumo humano.

#### Archivos

- `backend/config/urls.py`
- `backend/cuentas/urls.py`
- `backend/organizador/urls.py`
- `backend/invitados/urls.py`
- `backend/invitaciones/urls.py`
- `frontend/src/api/auth-client.api.js`
- `frontend/src/api/login.api.js`
- `frontend/src/api/register.api.js`

#### Impacto

- la autenticacion paso a rutas como `crear-usuario`, `iniciar-sesion`,
  `cerrar-sesion` y `mi-perfil`;
- las bases de ruta se reorganizaron en `usuarios`, `organizadores`,
  `invitados` e `invitaciones`;
- el frontend quedo alineado con la nueva nomenclatura.

### Fecha: 2026-03-26

#### Cambio

Se incorporo la app `gastos`.

#### Motivo

- el dominio del proyecto ya necesitaba representar gastos por evento;
- el frontend ya mostraba una seccion visible de control de gastos.

#### Archivos

- `backend/gastos/__init__.py`
- `backend/gastos/apps.py`
- `backend/gastos/models.py`
- `backend/gastos/serializers.py`
- `backend/gastos/views.py`
- `backend/gastos/urls.py`
- `backend/gastos/admin.py`
- `backend/gastos/migrations/0001_initial.py`
- `backend/config/settings.py`
- `backend/config/urls.py`

#### Impacto

- el backend gano un modulo de gastos asociado a eventos;
- se agregaron endpoints, admin y migraciones para el dominio economico.

### Fecha: 2026-03-26

#### Cambio

Se incorporo la app `notificaciones`.

#### Motivo

- hacia falta un modulo especifico para mensajes vinculados a invitados e
  invitaciones;
- era una separacion de dominio razonable frente a seguir cargando la logica en
  otras apps.

#### Archivos

- `backend/notificaciones/__init__.py`
- `backend/notificaciones/apps.py`
- `backend/notificaciones/models.py`
- `backend/notificaciones/serializers.py`
- `backend/notificaciones/views.py`
- `backend/notificaciones/urls.py`
- `backend/notificaciones/admin.py`
- `backend/notificaciones/migrations/0001_initial.py`
- `backend/config/settings.py`
- `backend/config/urls.py`

#### Impacto

- el backend gano un modulo para registrar notificaciones relacionadas con
  invitados e invitaciones;
- quedaron disponibles endpoints y admin para ese flujo.

### Fecha: 2026-03-26

#### Cambio

Se simplifico la app `notificaciones`.

#### Motivo

- la primera version modelaba capacidades mas avanzadas de las que el proyecto
  realmente usa hoy;
- `sms`, `interna`, `fecha_programada` y `fecha_envio` agregaban complejidad sin
  flujo operativo real detras.

#### Archivos

- `backend/notificaciones/models.py`
- `backend/notificaciones/serializers.py`
- `backend/notificaciones/views.py`
- `backend/notificaciones/admin.py`
- `backend/notificaciones/migrations/0002_alter_notificacion_options_and_more.py`

#### Impacto

- la app quedo enfocada en seguimiento basico;
- se limitaron los canales a `email` y `whatsapp`;
- se eliminaron fechas y capacidades que sugerian orquestacion no implementada.

### Fecha: 2026-03-26

#### Cambio

Se simplifico la app `gastos` para alinearla con el frontend.

#### Motivo

- el frontend mostraba un esquema concreto y mas simple para gastos;
- el backend estaba modelando mas detalle del necesario para el estado actual;
- se busco reducir desajuste entre UI y API.

#### Archivos

- `backend/gastos/models.py`
- `backend/gastos/serializers.py`
- `backend/gastos/views.py`
- `backend/gastos/admin.py`
- `backend/gastos/migrations/0002_alter_gasto_options_remove_gasto_categoria_and_more.py`
- `frontend/src/pages/EventDetailPage.jsx`
- `frontend/src/lib/mock-data.js`

#### Impacto

- `Gasto` quedo orientado a:
  `evento`, `concepto`, `pagado_por`, `pagado_por_iniciales`, `monto`;
- se eliminaron `categoria`, `proveedor`, `fecha_gasto`, `estado_pago` y
  `observaciones`;
- la estructura del backend quedo mas coherente con la pantalla de detalle de
  evento.

### Fecha: 2026-03-26

#### Cambio

Se creo un diagrama visual del dominio del backend.

#### Motivo

- hacia falta una representacion compacta de modelos, relaciones y objetos de
  ejemplo;
- servia como apoyo para entender la union entre apps.

#### Archivos

- `backend/diagrams/backend_domain_model.dot`
- `backend/diagrams/backend_domain_model.png`
- `backend/diagrams/backend_domain_model.svg`

#### Impacto

- el backend ahora cuenta con una visualizacion reutilizable del dominio;
- queda una base lista para ser extendida con `gastos` y `notificaciones`.

### Fecha: 2026-03-26

#### Cambio

Se creo este informe historico del backend y se enlazo desde el README.

#### Motivo

- hacia falta dejar trazabilidad de decisiones, correcciones y eliminaciones;
- la documentacion tecnica funcional no estaba pensada como bitacora de
  cambios.

#### Archivos

- `backend/documentacion/BACKEND_CHANGE_REPORT.md`
- `backend/README.md`

#### Impacto

- el backend ahora tiene un registro historico de decisiones;
- desde ahora cada cambio nuevo del backend debe sumarse tambien a este archivo.

### Fecha: 2026-03-26

#### Cambio

Se implementaron permisos reales por rol y por propietario en los modulos de
dominio.

#### Motivo

- hasta este punto los roles existian en el modelo, pero no se aplicaban como
  restriccion efectiva en la API;
- hacia falta impedir que un organizador liste, consulte o modifique recursos de
  otros organizadores;
- tambien hacia falta bloquear referencias cruzadas ajenas al crear o editar
  objetos relacionados.

#### Archivos

- `backend/config/permissions.py`
- `backend/cuentas/serializers.py`
- `backend/cuentas/views.py`
- `backend/organizador/serializers.py`
- `backend/organizador/views.py`
- `backend/invitados/serializers.py`
- `backend/invitados/views.py`
- `backend/invitaciones/serializers.py`
- `backend/invitaciones/views.py`
- `backend/gastos/serializers.py`
- `backend/gastos/views.py`
- `backend/notificaciones/serializers.py`
- `backend/notificaciones/views.py`
- `backend/documentacion/BACKEND_CHANGE_REPORT.md`

#### Impacto

- `administrador` pasa a tener acceso global;
- `organizador` queda limitado a sus propios perfiles, eventos, invitados,
  invitaciones, gastos y notificaciones;
- los querysets de lista y detalle se filtran por propietario;
- las validaciones de serializers impiden asociar objetos ajenos durante altas y
  modificaciones;
- se bloquea la creacion publica de usuarios con rol `administrador`.

### Fecha: 2026-03-26

#### Cambio

Se creo la carpeta `backend/documentacion` y se movio ahi la documentacion
extendida del backend.

#### Motivo

- se busco separar documentacion extensa del resto de archivos operativos del
  backend;
- mejora la organizacion del directorio raiz de `backend`;
- deja `backend/README.md` como punto de entrada breve y las demas piezas
  documentales agrupadas en un solo lugar.

#### Archivos

- `backend/documentacion/BACKEND_CHANGE_REPORT.md`
- `backend/documentacion/TECHNICAL_DOCUMENTATION.md`
- `backend/README.md`
- `backend/.dockerignore`

#### Impacto

- la documentacion del backend queda centralizada en una carpeta dedicada;
- el README pasa a enlazar a la nueva ubicacion;
- Docker sigue excluyendo esa documentacion del build.

### Fecha: 2026-03-26

#### Cambio

Se eliminaron los diagramas generados del backend.

#### Motivo

- se decidio no mantener artefactos visuales generados dentro del backend;
- se busco reducir archivos derivados que no eran necesarios para el flujo actual.

#### Archivos

- `backend/diagrams/`
- `backend/diagrams/backend_domain_model.dot`
- `backend/diagrams/backend_domain_model.png`
- `backend/diagrams/backend_domain_model.svg`
- `backend/documentacion/BACKEND_CHANGE_REPORT.md`

#### Impacto

- el backend deja de incluir diagramas versionados;
- la carpeta `backend/diagrams/` tambien fue removida;
- la estructura documental queda reducida a texto y codigo fuente.

## 6. Relacion actual entre apps

El backend quedo unido por relaciones de dominio claras:

- `User -> PerfilUsuario`
- `User -> PerfilOrganizador`
- `PerfilOrganizador -> Evento`
- `Evento -> Invitado`
- `Evento -> Gasto`
- `Invitado -> Invitacion`
- `Invitado -> Notificacion`
- `Invitacion -> Notificacion` opcional

Lectura funcional:

- `cuentas` aporta identidad y rol;
- `organizador` administra el nucleo operativo del evento;
- `invitados` cuelga de `evento`;
- `invitaciones` cuelga de `invitado`;
- `gastos` cuelga de `evento`;
- `notificaciones` cuelga de `invitado` y puede relacionarse a `invitacion`.

## 7. Pendientes claros

- actualizar por completo `documentacion/TECHNICAL_DOCUMENTATION.md` segun endpoints y
  modelos actuales;
- implementar permisos por rol y por propietario;
- conectar frontend y backend para gastos, invitados, invitaciones y
  notificaciones mas alla de mocks;
- agregar tests sobre reglas de negocio y autorizacion;
- decidir si `notificaciones` quedara como persistencia o si luego tendra envio
  real.
