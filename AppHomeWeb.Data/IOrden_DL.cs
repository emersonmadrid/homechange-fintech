using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Data
{
    public interface IOrden_DL
    {
        List<Orden_BE> ListarOrdenCliente(Orden_BE Ent);
        int RegistrarOrden(Orden_BE Ent);
    }
}
