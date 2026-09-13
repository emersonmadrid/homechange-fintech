using AppHomeWeb.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace AppHomeWeb.Data
{
    public class Cliente_DL : ICliente_DL
    {
        private readonly string _cadenaConexion;

        public Cliente_DL(string cadenaConexion)
        {
            _cadenaConexion = cadenaConexion;
        }

        public Cliente_DL()
        {
            _cadenaConexion = new Conexion_DL().CadenaConexion();
        }

        public int RegistrarCliente(Cliente_BE Ent)
        {
            int id_codigo_perfil = 0;
            

            
            using (var con = new SqlConnection(_cadenaConexion))
            {
                using (var cmd = new SqlCommand("usp_registrar_cliente_usuario_perfil", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_ocupacion", Ent.id_ocupacion);
                    cmd.Parameters.AddWithValue("@id_tipo_documento", Ent.id_tipo_documento);
                    cmd.Parameters.AddWithValue("@id_tipo_cliente", Ent.id_tipo_cliente);
                    cmd.Parameters.AddWithValue("@nombre", Ent.nombre);
                    cmd.Parameters.AddWithValue("@apellido_paterno", Ent.apellido_paterno);
                    cmd.Parameters.AddWithValue("@apellido_materno", Ent.apellido_materno);
                    cmd.Parameters.AddWithValue("@email", Ent.email);
                    cmd.Parameters.AddWithValue("@telefono", Ent.telefono);
                    cmd.Parameters.AddWithValue("@numero_documento", Ent.numero_documento);
                    cmd.Parameters.AddWithValue("@usuario_registro", Ent.usuario_registro);
                    cmd.Parameters.AddWithValue("@usuario", Ent.usuario);
                    cmd.Parameters.AddWithValue("@clave", Ent.clave);
                    cmd.Parameters.AddWithValue("@razon_social", Ent.razon_social);
                    cmd.Parameters.AddWithValue("@ruc", Ent.ruc);

                    var outParam = new SqlParameter("@id_usuario_out", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    cmd.Parameters.Add(outParam);

                    con.Open();
                    cmd.ExecuteNonQuery();
                    if (outParam.Value != DBNull.Value)
                        id_codigo_perfil = Convert.ToInt32(outParam.Value);
                }
            }

            return id_codigo_perfil;
        }

        public int ActualizarCliente(Cliente_BE Ent)
        {
            return SqlHelper.ExecuteNonQuery(_cadenaConexion, "usp_actualizar_cliente", cmd =>
            {
                cmd.Parameters.AddWithValue("@id_cliente", Ent.id_cliente);
                cmd.Parameters.AddWithValue("@telefono", Ent.telefono);
                cmd.Parameters.AddWithValue("@email", Ent.email);
                cmd.Parameters.AddWithValue("@usuario_modificacion", Ent.usuario_modificacion);
            });
        }

        public List<Cliente_BE> ListarDatoCliente(Cliente_BE Ent)
        {
            return SqlHelper.Query<Cliente_BE>(_cadenaConexion, "usp_listar_cliente",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("@id_usuario", Ent.usuario);
                },
                reader => new Cliente_BE
                {
                    nombre = Convert.ToString(reader["nombre"]),
                    apellido_paterno = Convert.ToString(reader["apellido_paterno"]),
                    apellido_materno = Convert.ToString(reader["apellido_materno"]),
                    email = Convert.ToString(reader["email"]),
                    telefono = Convert.ToString(reader["telefono"]),
                    numero_documento = Convert.ToString(reader["numero_documento"]),
                    id_tipo_documento = Convert.ToInt32(reader["id_tipo_documento"]),
                    id_ocupacion = Convert.ToString(reader["id_ocupacion"])
                });
        }
    }
}
