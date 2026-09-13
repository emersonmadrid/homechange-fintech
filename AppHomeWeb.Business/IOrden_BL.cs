using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Business
{
    public interface IOrden_BL
    {
        List<Orden_BE> ListarOrdenCliente(Orden_BE Ent);
        int RegistrarOrden(Orden_BE Ent);
    }
}
