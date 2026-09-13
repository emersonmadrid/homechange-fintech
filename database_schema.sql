-- ==============================================================================
-- Script de Reconstrucción de Base de Datos (AppHomeWeb)
-- Motor: SQL Server
-- Descripción: Genera las tablas relacionales basadas en los modelos C# (BE)
-- ==============================================================================

CREATE DATABASE homemoney;
GO

USE homemoney;
GO

-- 1. Tablas de Catálogo (Dominios)
CREATE TABLE TipoDocumento (
    IdTipoDocumento INT IDENTITY(1,1) PRIMARY KEY,
    Descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE Ocupacion (
    IdOcupacion VARCHAR(10) PRIMARY KEY, -- Manteniendo el VARCHAR según Ocupacion_BL.cs (id_ocupacion string)
    Descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE Banco (
    IdBanco INT IDENTITY(1,1) PRIMARY KEY, -- Convertido a INT para mejor E-R, aunque en el modelo diga string id_banco
    Descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE TipoMoneda (
    IdTipoMoneda INT IDENTITY(1,1) PRIMARY KEY,
    Descripcion VARCHAR(20) NOT NULL,
    Simbolo VARCHAR(5) NOT NULL
);

CREATE TABLE TipoCambio (
    IdTipoCambio INT IDENTITY(1,1) PRIMARY KEY,
    MontoCompra DECIMAL(10,4) NOT NULL,
    MontoVenta DECIMAL(10,4) NOT NULL,
    FechaRegistro DATETIME DEFAULT GETDATE()
);

-- 2. Tabla Principal de Usuarios
CREATE TABLE Usuario (
    IdUsuario INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioLogin VARCHAR(50) NOT NULL UNIQUE,
    ClaveHash VARCHAR(256) NOT NULL, -- Preparado para Phase 3 (Seguridad)
    Email VARCHAR(100) NOT NULL UNIQUE,
    Telefono VARCHAR(20),
    Estado BIT DEFAULT 1,
    FechaRegistro DATETIME DEFAULT GETDATE()
);

-- 3. Tabla de Clientes (Relación 1:1 con Usuario)
CREATE TABLE Cliente (
    IdCliente INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario INT NOT NULL,
    IdTipoDocumento INT NOT NULL,
    IdOcupacion VARCHAR(10),
    IdTipoCliente INT NOT NULL, -- 1: Persona, 2: Empresa
    NumeroDocumento VARCHAR(20) NOT NULL UNIQUE,
    Nombre VARCHAR(100),
    ApellidoPaterno VARCHAR(100),
    ApellidoMaterno VARCHAR(100),
    RazonSocial VARCHAR(150),
    Ruc VARCHAR(20),
    
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
    FOREIGN KEY (IdTipoDocumento) REFERENCES TipoDocumento(IdTipoDocumento),
    FOREIGN KEY (IdOcupacion) REFERENCES Ocupacion(IdOcupacion)
);

-- 4. Perfiles de Usuario (Relación 1:N o 1:1 dependiendo de negocio)
CREATE TABLE PerfilUsuario (
    IdPerfilUsuario INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario INT NOT NULL,
    NombrePerfil VARCHAR(100) NOT NULL, -- Ej: Admin, ClienteRegular
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

-- 5. Cuentas Bancarias del Cliente
CREATE TABLE CuentaBancaria (
    IdCuentaBancaria INT IDENTITY(1,1) PRIMARY KEY,
    IdPerfilUsuario INT NOT NULL,
    IdBanco INT NOT NULL,
    IdTipoMoneda INT NOT NULL,
    IdTipoDocumento INT NOT NULL,
    NumeroCuenta VARCHAR(50) NOT NULL,
    NombreTitular VARCHAR(150) NOT NULL,
    CuentaPropia BIT DEFAULT 1, -- (string en código, convertido a BIT)
    FechaRegistro DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (IdPerfilUsuario) REFERENCES PerfilUsuario(IdPerfilUsuario),
    FOREIGN KEY (IdBanco) REFERENCES Banco(IdBanco),
    FOREIGN KEY (IdTipoMoneda) REFERENCES TipoMoneda(IdTipoMoneda),
    FOREIGN KEY (IdTipoDocumento) REFERENCES TipoDocumento(IdTipoDocumento)
);

-- 6. Órdenes / Transacciones (El "Agujero Negro" resuelto)
CREATE TABLE Orden (
    IdOrden INT IDENTITY(1,1) PRIMARY KEY,
    IdPerfilUsuario INT NOT NULL,
    NumeroOrden VARCHAR(50) NOT NULL UNIQUE,
    MontoEnvio DECIMAL(18,2) NOT NULL,
    MontoRecibido DECIMAL(18,2) NOT NULL,
    IdTipoCambio INT NOT NULL,
    EstadoOrden VARCHAR(20) DEFAULT 'PENDIENTE', -- PENDIENTE, COMPLETADO, CANCELADO
    FechaRegistro DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (IdPerfilUsuario) REFERENCES PerfilUsuario(IdPerfilUsuario),
    FOREIGN KEY (IdTipoCambio) REFERENCES TipoCambio(IdTipoCambio)
);

-- 7. Datos Semilla (Para que el sistema funcione al iniciar)
-- Movido a seed_catalogos.sql
GO
