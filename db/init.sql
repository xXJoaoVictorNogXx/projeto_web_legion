CREATE TABLE
    IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL
    );

CREATE TABLE 
    IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        birthdate VARCHAR(120) NOT NULL UNIQUE,
        gender VARCHAR(10) NOT NULL,
        race VARCHAR(50) NOT NULL
    );

INSERT INTO users (name, email, password, role) VALUES 
('Administrador Principal', 'admin@escola.com', '$2b$10$AbCdEfGhIjKlMnOpQrStUuVwXyZaBcDeFgHiJkLmNoPqRsTuV', 'ADMINISTRADOR');


CREATE TABLE IF NOT EXISTS pre_matriculas (
    -- Campos de Controle
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE', -- (PENDENTE, APROVADO, REJEITADO)

    -- Seção 1: Dados da Criança
    child_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    gender VARCHAR(50),
    race VARCHAR(50),
    sus_card VARCHAR(100),
    has_health_issues BOOLEAN NOT NULL DEFAULT FALSE,
    health_issues_description TEXT,
    has_government_aid BOOLEAN NOT NULL DEFAULT FALSE,
    government_aid_description TEXT,

    -- Seção 2: Dados do Responsável
    guardian_name VARCHAR(255) NOT NULL,
    guardian_cpf VARCHAR(14) NOT NULL,
    guardian_phone VARCHAR(50),
    guardian_workplace VARCHAR(255),
    guardian_rg VARCHAR(50),

    -- Seção 3: Endereço
    address_street VARCHAR(255),
    address_number VARCHAR(20),
    address_neighborhood VARCHAR(100),
    address_city VARCHAR(100),
    address_state VARCHAR(2),
    address_cep VARCHAR(10),

    -- Seção 4: Documentos da Criança
    birth_certificate_number VARCHAR(100),
    birth_certificate_city VARCHAR(100),
    birth_certificate_registry_office VARCHAR(255),
    birth_certificate_registry_city VARCHAR(100),
    child_cpf VARCHAR(14),
    child_rg VARCHAR(50),
    child_rg_issue_date DATE,
    child_rg_issuing_authority VARCHAR(50),
    
    -- Seção 5: Situação Habitacional (Booleano)
    casa_propria BOOLEAN NOT NULL DEFAULT FALSE,
    casa_alugada BOOLEAN NOT NULL DEFAULT FALSE,
    casa_cedida BOOLEAN NOT NULL DEFAULT FALSE,
    piso_lajota BOOLEAN NOT NULL DEFAULT FALSE,
    piso_chao_batido BOOLEAN NOT NULL DEFAULT FALSE,
    piso_cimento BOOLEAN NOT NULL DEFAULT FALSE,
    moradia_tijolo BOOLEAN NOT NULL DEFAULT FALSE,
    moradia_taipa BOOLEAN NOT NULL DEFAULT FALSE,
    moradia_madeira BOOLEAN NOT NULL DEFAULT FALSE,
    saneamento_fossa BOOLEAN NOT NULL DEFAULT FALSE,
    saneamento_agua_encanada BOOLEAN NOT NULL DEFAULT FALSE,
    saneamento_energia_eletrica BOOLEAN NOT NULL DEFAULT FALSE
);
ALTER TABLE pre_matriculas
ALTER COLUMN casa_alugada SET DEFAULT false;