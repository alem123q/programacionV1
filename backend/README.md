# EventFlow Backend

Backend API for EventFlow built with Django and Django REST Framework using SQLite.

See also:

- `documentacion/BACKEND_CHANGE_REPORT.md` for a historical report of backend decisions and corrections.
- `documentacion/TECHNICAL_DOCUMENTATION.md` for extended technical documentation.

## 📋 Requirements

- Python 3.8+
- pip
- Docker y Docker Compose opcionalmente para levantar todo el stack

## 🐳 Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Servicios:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8000`

El contenedor del backend aplica migraciones automáticamente al iniciar y luego levanta Django en `0.0.0.0:8000`.
La base de datos se guarda en `backend/db.sqlite3`.

## 🚀 Setup

### 1. Create and Activate Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Create Environment Variables (Optional)

Create a local `.env` only if you need to override the default development settings.

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## 📁 Project Structure

```
backend/
├── config/          # Project settings
├── api/             # API application
├── manage.py        # Django management script
├── requirements.txt # Python dependencies
└── .env             # Optional local environment variables
```

## 🔌 API Endpoints

- Admin panel: `http://localhost:8000/admin/`
- API root: `http://localhost:8000/api/`

## 🛠️ Installed Packages

- **Django** - Web framework
- **Django REST Framework** - API toolkit
- **django-cors-headers** - CORS support
- **python-decouple** - Environment variables

## 📝 Notes

- Make sure the frontend is running on port 3000 or 5173 (configured in CORS settings)
- The database is SQLite for local development and Docker
- Never commit `.env` file to version control
