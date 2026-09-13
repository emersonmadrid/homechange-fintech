using AppHomeWeb.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
namespace AppHomeWeb.Data
{
    public class Usuario_DL : IUsuario_DL
    {
        public int ValidarUsuario(Usuario_BE Ent)
        {
            List<Usuario_BE> ListaUsuario = new List<Usuario_BE>();
            Conexion_DL oConectar = new Conexion_DL();
            int id_usuario = 0;

            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_validar_usuario", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@usuario", Ent.usuario);
                    cmd.Parameters.AddWithValue("@clave", Ent.clave);
                    //borrar comentario
                    con.Open();

                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {

                            id_usuario = Convert.ToInt32(reader["id_usuario"]);

                        }
                    }
                    else
                    {
                        id_usuario = 0;
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

            return id_usuario;
        }
        public int ActualizarClave(Usuario_BE Ent)
        {

            Conexion_DL oConectar = new Conexion_DL();
            Usuario_BE objUsuario_BE = new Usuario_BE();
            int id_usuario = 0;
            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_actualizar_usuario", con);
                    cmd.CommandType = CommandType.StoredProcedure;



                    cmd.Parameters.AddWithValue("@id_usuario", Ent.id_usuario);
                    cmd.Parameters.AddWithValue("@clave", Ent.clave);
                    cmd.Parameters.AddWithValue("@nueva_clave", Ent.nueva_clave);


                    cmd.Parameters.Add("@ok", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // set parameter values


                    // open connection and execute stored procedure
                    con.Open();
                    cmd.ExecuteNonQuery();

                    // read output value from @NewId
                    id_usuario = Convert.ToInt32(cmd.Parameters["@ok"].Value);
                    con.Close();

                }
                catch (Exception)
                {

                    id_usuario = 0;
                }
                finally
                {
                    if (con.State == ConnectionState.Open)
                    {
                        con.Close();
                    }

                }
            }
            return id_usuario;
        }
    }
}
