using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Business
{
    public interface ITipo_Cambio_BL
    {
        List<Tipo_Cambio_BE> ListarTipo_Cambio();
        int RegistrarTipo_Cambio(Tipo_Cambio_BE Ent);
    }
}
