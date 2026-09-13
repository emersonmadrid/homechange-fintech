using AppHomeWeb.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
namespace AppHomeWeb.Data
{
    public class Tipo_Cambio_DL : ITipo_Cambio_DL
    {
        public List<Tipo_Cambio_BE> ListarTipo_Cambio()
        {
            List<Tipo_Cambio_BE> ListaTipo_Cambio = new List<Tipo_Cambio_BE>();
            Conexion_DL oConectar = new Conexion_DL();

            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {

                    SqlCommand cmd = new SqlCommand("usp_listar_tipo_cambio", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            Tipo_Cambio_BE objTipo_Cambio_BE = new Tipo_Cambio_BE();
                            objTipo_Cambio_BE.monto_compra = Convert.ToString(reader["monto_compra"]);
                            objTipo_Cambio_BE.monto_venta = Convert.ToString(reader["monto_venta"]);

                            ListaTipo_Cambio.Add(objTipo_Cambio_BE);
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
            return ListaTipo_Cambio;
        }

    
        public int RegistrarTipo_Cambio(Tipo_Cambio_BE Ent)
        {
            Conexion_DL oConectar = new Conexion_DL();
            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_registrar_tipo_cambio", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@monto_compra", Ent.monto_compra);
                    cmd.Parameters.AddWithValue("@monto_venta", Ent.monto_venta);
                    con.Open();
                    return cmd.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
        }


        


}
}

