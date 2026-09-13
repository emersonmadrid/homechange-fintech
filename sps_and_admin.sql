USE homemoney;
GO

-- 1. Insertar el Administrador si no existe
IF NOT EXISTS (SELECT 1 FROM Usuario WHERE UsuarioLogin = 'admin')
BEGIN
    INSERT INTO Usuario (UsuarioLogin, ClaveHash, Email, Estado, FechaRegistro) 
    VALUES ('admin', 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=', 'admin@homemoney.com', 1, GETDATE());

    DECLARE @id_usuario INT = SCOPE_IDENTITY();

    INSERT INTO PerfilUsuario (IdUsuario, NombrePerfil)
    VALUES (@id_usuario, 'GERENTE');
END
GO

-- 2. Stored Procedures
CREATE OR ALTER PROCEDURE usp_validar_usuario
    @usuario VARCHAR(50),
    @clave VARCHAR(256)
AS
BEGIN
    SELECT IdUsuario AS id_usuario 
    FROM Usuario 
    WHERE UsuarioLogin = @usuario AND ClaveHash = @clave AND Estado = 1
END
GO

CREATE OR ALTER PROCEDURE usp_listar_tipo_documento
AS
BEGIN
    SELECT IdTipoDocumento AS id_tipo_documento, Descripcion AS descripcion
    FROM TipoDocumento
END
GO

CREATE OR ALTER PROCEDURE usp_listar_banco
AS
BEGIN
    SELECT IdBanco AS id_banco, Descripcion AS descripcion
    FROM Banco
END
GO

CREATE OR ALTER PROCEDURE usp_listar_tipo_cambio
AS
BEGIN
    SELECT TOP 1 MontoCompra AS monto_compra, MontoVenta AS monto_venta
    FROM TipoCambio
    ORDER BY IdTipoCambio DESC
END
GO

CREATE OR ALTER PROCEDURE usp_registrar_tipo_cambio
    @monto_compra DECIMAL(10,4),
    @monto_venta DECIMAL(10,4),
    @ok INT OUTPUT
AS
BEGIN
    INSERT INTO TipoCambio (MontoCompra, MontoVenta, FechaRegistro)
    VALUES (@monto_compra, @monto_venta, GETDATE());
    SET @ok = 1;
END
GO

CREATE OR ALTER PROCEDURE usp_listar_ocupacion
AS
BEGIN
    SELECT IdOcupacion AS id_ocupacion, Descripcion AS descripcion
    FROM Ocupacion
END
GO

CREATE OR ALTER PROCEDURE usp_listar_usuario_perfil
    @id_usuario INT
AS
BEGIN
    SELECT IdPerfilUsuario AS id_usuario_perfil, NombrePerfil AS nombre
    FROM PerfilUsuario
    WHERE IdUsuario = @id_usuario
END
GO

CREATE OR ALTER PROCEDURE usp_registrar_usuario_perfil
    @id_usuario INT,
    @nombre VARCHAR(100),
    @usuario_registro VARCHAR(50) = NULL,
    @razon_social VARCHAR(150) = NULL,
    @ruc VARCHAR(20) = NULL,
    @ok INT OUTPUT
AS
BEGIN
    INSERT INTO PerfilUsuario (IdUsuario, NombrePerfil)
    VALUES (@id_usuario, @nombre);
    SET @ok = SCOPE_IDENTITY();
END
GO

CREATE OR ALTER PROCEDURE usp_registrar_cliente_usuario_perfil
    @id_ocupacion VARCHAR(10) = NULL,
    @id_tipo_documento INT,
    @id_tipo_cliente INT,
    @nombre VARCHAR(100),
    @apellido_paterno VARCHAR(100) = NULL,
    @apellido_materno VARCHAR(100) = NULL,
    @email VARCHAR(100),
    @telefono VARCHAR(20) = NULL,
    @numero_documento VARCHAR(20),
    @usuario_registro VARCHAR(50) = NULL,
    @usuario VARCHAR(50),
    @clave VARCHAR(256),
    @razon_social VARCHAR(150) = NULL,
    @ruc VARCHAR(20) = NULL,
    @id_usuario_out INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar si el correo o documento ya existe
    IF EXISTS(SELECT 1 FROM Usuario WHERE Email = @email OR UsuarioLogin = @usuario)
    BEGIN
        SET @id_usuario_out = -1;
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- 1. Insertar Usuario
        INSERT INTO Usuario (UsuarioLogin, ClaveHash, Email, Telefono, Estado)
        VALUES (@usuario, @clave, @email, @telefono, 1);
        
        DECLARE @id_usuario INT = SCOPE_IDENTITY();

        -- 2. Insertar Cliente
        INSERT INTO Cliente (IdUsuario, IdTipoDocumento, IdOcupacion, IdTipoCliente, NumeroDocumento, Nombre, ApellidoPaterno, ApellidoMaterno, RazonSocial, Ruc)
        VALUES (@id_usuario, @id_tipo_documento, @id_ocupacion, @id_tipo_cliente, @numero_documento, @nombre, @apellido_paterno, @apellido_materno, @razon_social, @ruc);

        -- 3. Insertar PerfilUsuario por defecto
        INSERT INTO PerfilUsuario (IdUsuario, NombrePerfil)
        VALUES (@id_usuario, 'CLIENTE');

        COMMIT TRAN;
        SET @id_usuario_out = @id_usuario;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
            
        SET @id_usuario_out = -1;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE usp_listar_cuenta_bancaria
    @id_usuario_perfil INT
AS
BEGIN
    SELECT c.IdCuentaBancaria AS id_cuenta_cliente, 
           c.NombreTitular AS nombre_titular,
           b.Descripcion AS banco,
           tm.Descripcion AS tipomoneda,
           c.NumeroCuenta AS numero_cuenta
    FROM CuentaBancaria c
    JOIN Banco b ON c.IdBanco = b.IdBanco
    JOIN TipoMoneda tm ON c.IdTipoMoneda = tm.IdTipoMoneda
    WHERE c.IdPerfilUsuario = @id_usuario_perfil
END
GO

CREATE OR ALTER PROCEDURE usp_registrar_cuenta_bancaria
    @id_banco INT,
    @id_tipo_documento INT,
    @id_usuario_perfil INT,
    @numero_cuenta VARCHAR(50),
    @nombre_titular VARCHAR(150),
    @cuenta_propia BIT,
    @usuario_registro VARCHAR(50) = NULL,
    @id_tipo_moneda INT,
    @ok INT OUTPUT
AS
BEGIN
    INSERT INTO CuentaBancaria (IdPerfilUsuario, IdBanco, IdTipoMoneda, IdTipoDocumento, NumeroCuenta, NombreTitular, CuentaPropia)
    VALUES (@id_usuario_perfil, @id_banco, @id_tipo_moneda, @id_tipo_documento, @numero_cuenta, @nombre_titular, @cuenta_propia);
    SET @ok = SCOPE_IDENTITY();
END
GO

CREATE OR ALTER PROCEDURE usp_listar_orden_cliente
    @id_usuario_perfil INT
AS
BEGIN
    SELECT o.IdOrden AS id_orden_Cliente,
           o.NumeroOrden AS numero_orden,
           o.MontoEnvio AS monto_envio,
           o.MontoRecibido AS monto_recibido,
           o.EstadoOrden AS estado_orden,
           o.FechaRegistro AS fecha_registro,
           tc.MontoCompra AS tipo_cambio -- Placeholder, adjust if needed
    FROM Orden o
    JOIN TipoCambio tc ON o.IdTipoCambio = tc.IdTipoCambio
    WHERE o.IdPerfilUsuario = @id_usuario_perfil
END
GO

CREATE OR ALTER PROCEDURE usp_actualizar_usuario
    @id_usuario INT,
    @clave VARCHAR(256),
    @nueva_clave VARCHAR(256),
    @ok INT OUTPUT
AS
BEGIN
    -- Verificar si la clave antigua es correcta
    IF EXISTS(SELECT 1 FROM Usuario WHERE IdUsuario = @id_usuario AND ClaveHash = @clave)
    BEGIN
        UPDATE Usuario SET ClaveHash = @nueva_clave WHERE IdUsuario = @id_usuario;
        SET @ok = 1;
    END
    ELSE
    BEGIN
        SET @ok = 0;
    END
END
GO
