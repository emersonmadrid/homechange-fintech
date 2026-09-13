using AppHomeWeb.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;


namespace AppHomeWeb.Data
{
    public class Orden_DL : IOrden_DL
    {
        public List<Orden_BE> ListarOrdenCliente(Orden_BE Ent)
        {
            List<Orden_BE> ListaOrdenCliente = new List<Orden_BE>();
            Conexion_DL oConectar = new Conexion_DL();

            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {

                    SqlCommand cmd = new SqlCommand("usp_listar_orden_cliente", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_usuario_perfil", Ent.id_usuario_perfil);
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            Orden_BE objOrden_BE = new Orden_BE();
                            objOrden_BE.numero_orden = Convert.ToString(reader["orden"]);
                            objOrden_BE.id_orden_Cliente = Convert.ToString(reader["id_orden_Cliente"]);
                            objOrden_BE.fecha_registro = Convert.ToString(reader["fecha_registro_orden"]);
                            objOrden_BE.monto_envio = Convert.ToString(reader["monto_envio"]);
                            objOrden_BE.monto_recibido = Convert.ToString(reader["monto_recibido"]);
                            objOrden_BE.tipo_cambio = Convert.ToString(reader["tipo_cambio"]);
                            objOrden_BE.estado_orden = Convert.ToString(reader["estado_orden"]);
                            if (reader["ruta_voucher"] != DBNull.Value) objOrden_BE.ruta_voucher = Convert.ToString(reader["ruta_voucher"]);
                            ListaOrdenCliente.Add(objOrden_BE);
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
            return ListaOrdenCliente;
        }

        public int RegistrarOrden(Orden_BE Ent)
        {
            int rpta = 0;
            Conexion_DL oConectar = new Conexion_DL();

            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_registrar_orden_cliente", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    
                    cmd.Parameters.AddWithValue("@id_perfil_usuario", Ent.id_usuario_perfil);
                    cmd.Parameters.AddWithValue("@monto_envio", Convert.ToDecimal(Ent.monto_envio));
                    cmd.Parameters.AddWithValue("@monto_recibido", Convert.ToDecimal(Ent.monto_recibido));
                    cmd.Parameters.AddWithValue("@id_tipo_cambio", Convert.ToInt32(Ent.tipo_cambio));
                    cmd.Parameters.AddWithValue("@id_cuenta_bancaria", Ent.id_cuenta_bancaria);
                    cmd.Parameters.AddWithValue("@ruta_voucher", string.IsNullOrEmpty(Ent.ruta_voucher) ? (object)DBNull.Value : Ent.ruta_voucher);

                    con.Open();
                    rpta = cmd.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    throw;
                }
            }
            return rpta;
        }
    }
}
