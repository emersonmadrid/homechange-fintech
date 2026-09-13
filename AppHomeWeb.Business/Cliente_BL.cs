using AppHomeWeb.Data;
using AppHomeWeb.Entity;
using System.Collections.Generic;

namespace AppHomeWeb.Business
{
    public class Cliente_BL : ICliente_BL
    {
        private readonly ICliente_DL _clienteDl;

        public Cliente_BL(ICliente_DL clienteDl)
        {
            _clienteDl = clienteDl;
        }

        public Cliente_BL()
        {
            _clienteDl = new Cliente_DL();
        }

        public int RegistrarCliente(Cliente_BE Ent)
        {
            if (!string.IsNullOrEmpty(Ent.clave))
            {
                using (var sha256 = System.Security.Cryptography.SHA256.Create())
                {
                    var bytes = System.Text.Encoding.UTF8.GetBytes(Ent.clave);
                    var hash = sha256.ComputeHash(bytes);
                    Ent.clave = System.Convert.ToBase64String(hash);
                }
            }
            return _clienteDl.RegistrarCliente(Ent);
        }

        public int ActualizarCliente(Cliente_BE Ent)
        {
            return _clienteDl.ActualizarCliente(Ent);
        }

        public List<Cliente_BE> ListarDatoCliente(Cliente_BE Ent)
        {
            return _clienteDl.ListarDatoCliente(Ent);
        }
    }
}
