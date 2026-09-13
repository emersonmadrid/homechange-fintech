using AppHomeWeb.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
namespace AppHomeWeb.Data
{
    public class Tipo_Documento_DL : ITipo_Documento_DL
    {

        public List<Tipo_Documento_BE> ListarTipo_Documento()
        {

            List<Tipo_Documento_BE> ListaTipo_Documento = new List<Tipo_Documento_BE>();
            Conexion_DL oConectar = new Conexion_DL();

            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {

                    SqlCommand cmd = new SqlCommand("usp_listar_tipo_documento", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            Tipo_Documento_BE objTipo_Documento_BE = new Tipo_Documento_BE();
                            objTipo_Documento_BE.id_tipo_documento = Convert.ToString(reader["id_tipo_documento"]);
                            objTipo_Documento_BE.descripcion = Convert.ToString(reader["descripcion"]);

                            ListaTipo_Documento.Add(objTipo_Documento_BE);
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
            return ListaTipo_Documento;
        }

    }
}
