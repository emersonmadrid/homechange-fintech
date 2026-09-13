using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Data
{
    public interface ICliente_DL
    {
        int RegistrarCliente(Cliente_BE Ent);
        int ActualizarCliente(Cliente_BE Ent);
        List<Cliente_BE> ListarDatoCliente(Cliente_BE Ent);
    }
}
