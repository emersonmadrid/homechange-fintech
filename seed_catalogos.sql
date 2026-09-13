USE homemoney;
GO

-- Seed Ocupacion
INSERT INTO Ocupacion (IdOcupacion, Descripcion) VALUES ('1', 'Empleado');
INSERT INTO Ocupacion (IdOcupacion, Descripcion) VALUES ('2', 'Independiente');
INSERT INTO Ocupacion (IdOcupacion, Descripcion) VALUES ('3', 'Estudiante');
INSERT INTO Ocupacion (IdOcupacion, Descripcion) VALUES ('4', 'Jubilado');
INSERT INTO Ocupacion (IdOcupacion, Descripcion) VALUES ('5', 'Otro');

-- Seed Banco
INSERT INTO Banco (Descripcion) VALUES ('BCP');
INSERT INTO Banco (Descripcion) VALUES ('Interbank');
INSERT INTO Banco (Descripcion) VALUES ('BBVA');
INSERT INTO Banco (Descripcion) VALUES ('Scotiabank');

-- Seed TipoMoneda
INSERT INTO TipoMoneda (Descripcion, Simbolo) VALUES ('Soles', 'S/');
INSERT INTO TipoMoneda (Descripcion, Simbolo) VALUES ('Dolares', '$');

-- Seed TipoDocumento
INSERT INTO TipoDocumento (Descripcion) VALUES ('DNI');
INSERT INTO TipoDocumento (Descripcion) VALUES ('CE');
INSERT INTO TipoDocumento (Descripcion) VALUES ('Pasaporte');

-- Seed TipoCambio (latest rates)
INSERT INTO TipoCambio (MontoCompra, MontoVenta) VALUES (3.750, 3.780);
GO
