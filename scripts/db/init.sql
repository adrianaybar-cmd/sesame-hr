-- Estructura base del schema (referencia, la ORM real se hará con Prisma)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de tenants
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'starter',
    installed_addons TEXT[] DEFAULT ARRAY['control_horario','tareas','ausencias'],
    logo_url TEXT,
    primary_color VARCHAR(7),
    timezone VARCHAR(50) DEFAULT 'Europe/Madrid',
    locale VARCHAR(5) DEFAULT 'es-ES',
    country VARCHAR(2) DEFAULT 'ES',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(email, tenant_id)
);

-- Datos demo
INSERT INTO tenants (id, name, slug, plan, installed_addons) VALUES
('tenant-demo-0001-0000-000000000000', 'Acme Corp SL', 'acme-corp', 'growth',
ARRAY['sesame_ai','control_horario','tareas','ausencias','bolsa_horas','comunicados','organigrama','formacion','reclutamiento']);

INSERT INTO users (id, tenant_id, email, name, role) VALUES
('user-admin-0001-0000-000000000000', 'tenant-demo-0001-0000-000000000000', 'admin@sesame.hr', 'Admin Demo', 'admin'),
('user-emp-0001-0000-000000000000', 'tenant-demo-0001-0000-000000000000', 'employee@sesame.hr', 'Employee Demo', 'employee');
