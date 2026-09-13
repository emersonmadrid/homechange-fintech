using AppHomeWeb.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

// Uncomment if Dapper is installed:
// using Dapper;

namespace AppHomeWeb.Data
{
    public class Banco_DL : IBanco_DL
    {
        private readonly string _cadenaConexion;

        // Constructor Injection for Connection String or Configuration
        public Banco_DL(string cadenaConexion)
        {
            _cadenaConexion = cadenaConexion;
        }

        // Default constructor for backward compatibility until IoC is fully configured
        public Banco_DL()
        {
            _cadenaConexion = new Conexion_DL().CadenaConexion();
        }

        public List<Banco_BE> ListarBanco()
        {
            using (var con = new SqlConnection(_cadenaConexion))
            {
                // Dapper implementation (Requires Dapper NuGet package):
                // return con.Query<Banco_BE>("usp_listar_banco", commandType: CommandType.StoredProcedure).ToList();

                // Clean ADO.NET fallback (in case Dapper is not yet installed)
                var listaBanco = new List<Banco_BE>();
                using (var cmd = new SqlCommand("usp_listar_banco", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listaBanco.Add(new Banco_BE
                            {
                                id_banco = Convert.ToString(reader["id_banco"]),
                                descripcion = Convert.ToString(reader["descripcion"])
                            });
                        }
                    }
                }
                return listaBanco;
            }
        }
    }
}
