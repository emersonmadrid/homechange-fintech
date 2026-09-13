using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace AppHomeWeb.Data
{
    public static class SqlHelper
    {
        public static List<T> Query<T>(string connectionString, string storedProcedure, Action<SqlCommand> addParameters = null, Func<SqlDataReader, T> map = null)
        {
            var result = new List<T>();
            using (var con = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(storedProcedure, con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                addParameters?.Invoke(cmd);

                con.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        if (map != null)
                        {
                            result.Add(map(reader));
                        }
                    }
                }
            }
            return result;
        }

        public static int ExecuteNonQuery(string connectionString, string storedProcedure, Action<SqlCommand> addParameters = null)
        {
            using (var con = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(storedProcedure, con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                addParameters?.Invoke(cmd);

                con.Open();
                return cmd.ExecuteNonQuery();
            }
        }
    }
}
