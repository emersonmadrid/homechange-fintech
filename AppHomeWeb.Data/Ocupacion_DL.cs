using AppHomeWeb.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace AppHomeWeb.Data
{
    public class Ocupacion_DL : IOcupacion_DL
    {
        public List<Ocupacion_BE> ListarOcupacion()
        {
            List<Ocupacion_BE> ListaOcupacion = new List<Ocupacion_BE>();
            Conexion_DL oConectar = new Conexion_DL();

            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {

                    SqlCommand cmd = new SqlCommand("usp_listar_ocupacion", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            Ocupacion_BE objOcupacion_BE = new Ocupacion_BE();
                            objOcupacion_BE.id_ocupacion = Convert.ToString(reader["id_ocupacion"]);
                            objOcupacion_BE.descripcion = Convert.ToString(reader["descripcion"]);

                            ListaOcupacion.Add(objOcupacion_BE);
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
            return ListaOcupacion;
        }

    }
}
