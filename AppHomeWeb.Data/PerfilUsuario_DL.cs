using AppHomeWeb.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace AppHomeWeb.Data
{

    public class PerfilUsuario_DL : IPerfilUsuario_DL
    {
        public List<PerfilUsuario_BE> ListarPerfilUsuario(PerfilUsuario_BE Ent)
        {
            List<PerfilUsuario_BE> ListaPerfil = new List<PerfilUsuario_BE>();
            Conexion_DL oConectar = new Conexion_DL();

            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {

                    SqlCommand cmd = new SqlCommand("usp_listar_usuario_perfil", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_usuario", Ent.id_usuario);
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            PerfilUsuario_BE objPerfilUsuario_BE = new PerfilUsuario_BE();
                            objPerfilUsuario_BE.nombre = Convert.ToString(reader["nombre"]);
                            objPerfilUsuario_BE.id_usuario_Perfil = Convert.ToString(reader["id_usuario_perfil"]);

                            ListaPerfil.Add(objPerfilUsuario_BE);
                        }
                    }
                    else
                    {
                        Console.WriteLine("No rows found.");
                    }

                }
                catch (Exception)
                {

                    throw;
                }
                finally
                {
                    if (con.State == ConnectionState.Open)
                    {
                        con.Close();
                    }

                }


            }
            return ListaPerfil;
        }

        public int RegistrarPerfilUsuario(PerfilUsuario_BE Ent)
        {

            Conexion_DL oConectar = new Conexion_DL();
            Cliente_BE objCliente_BE = new Cliente_BE();
            int id_codigo_perfil = 0;
            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_registrar_usuario_perfil", con);
                    cmd.CommandType = CommandType.StoredProcedure;


                    cmd.Parameters.AddWithValue("@id_usuario", Ent.id_usuario);
                    cmd.Parameters.AddWithValue("@nombre", Ent.nombre);
                    cmd.Parameters.AddWithValue("@razon_social", Ent.razon_social);
                    cmd.Parameters.AddWithValue("@ruc", Ent.ruc);
                    cmd.Parameters.AddWithValue("@usuario_registro", Ent.usuario_registro);

                    cmd.Parameters.Add("@codigo", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // set parameter values


                    // open connection and execute stored procedure
                    con.Open();
                    cmd.ExecuteNonQuery();

                    // read output value from @NewId
                    id_codigo_perfil = Convert.ToInt32(cmd.Parameters["@codigo"].Value);
                    con.Close();

                }
                catch (Exception)
                {

                    id_codigo_perfil = 0;
                }
                finally
                {
                    if (con.State == ConnectionState.Open)
                    {
                        con.Close();
                    }

                }
            }
            return id_codigo_perfil;
        }
    }

}
