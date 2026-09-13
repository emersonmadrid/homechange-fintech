using AppHomeWeb.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;


namespace AppHomeWeb.Data
{
    public class Cuenta_Bancaria_DL : ICuenta_Bancaria_DL
    {
        public List<Cuenta_Bancaria_BE> ListarCuentaBancaria(Cuenta_Bancaria_BE Ent)
        {
            List<Cuenta_Bancaria_BE> ListaOrdenCliente = new List<Cuenta_Bancaria_BE>();
            Conexion_DL oConectar = new Conexion_DL();

            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_listar_cuenta_bancaria", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_usuario_perfil", Ent.id_usuario_perfil);
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            Cuenta_Bancaria_BE objCuenta_Bancaria_BE = new Cuenta_Bancaria_BE();
                            objCuenta_Bancaria_BE.id_cuenta_cliente = Convert.ToString(reader["id_cuenta_cliente"]);
                            objCuenta_Bancaria_BE.banco = Convert.ToString(reader["banco"]);
                            objCuenta_Bancaria_BE.nombre_titular = Convert.ToString(reader["nombre_titular"]);
                            objCuenta_Bancaria_BE.tipomoneda = Convert.ToString(reader["tipomoneda"]);
                            objCuenta_Bancaria_BE.numero_cuenta = Convert.ToString(reader["numero_cuenta"]);
                            ListaOrdenCliente.Add(objCuenta_Bancaria_BE);
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

        public int RegistrarCuentaBancaria(Cuenta_Bancaria_BE Ent)
        {

            Conexion_DL oConectar = new Conexion_DL();
            int id_codigo_bancaria = 0;
            using (SqlConnection con = new SqlConnection(oConectar.CadenaConexion()))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("usp_registrar_cuenta_bancaria", con);
                    cmd.CommandType = CommandType.StoredProcedure;


                    cmd.Parameters.AddWithValue("@id_banco", Ent.id_banco);
                    cmd.Parameters.AddWithValue("@id_tipo_documento", Ent.id_tipo_documento);
                    cmd.Parameters.AddWithValue("@id_usuario_perfil", Ent.id_usuario_perfil);
                    cmd.Parameters.AddWithValue("@numero_cuenta", Ent.numero_cuenta);
                    cmd.Parameters.AddWithValue("@nombre_titular", Ent.nombre_titular);
                    cmd.Parameters.AddWithValue("@cuenta_propia", Ent.cuenta_propia);
                    cmd.Parameters.AddWithValue("@usuario_registro", Ent.usuario_registro);
                    cmd.Parameters.AddWithValue("@id_tipo_moneda", Ent.id_tipo_moneda);


                    cmd.Parameters.Add("@codigo", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // set parameter values


                    // open connection and execute stored procedure
                    con.Open();
                    cmd.ExecuteNonQuery();

                    // read output value from @NewId
                    id_codigo_bancaria = Convert.ToInt32(cmd.Parameters["@codigo"].Value);
                    con.Close();

                }
                catch (Exception)
                {

                    id_codigo_bancaria = 0;
                }
                finally
                {
                    if (con.State == ConnectionState.Open)
                    {
                        con.Close();
                    }

                }
            }
            return id_codigo_bancaria;
        }

    }
}
