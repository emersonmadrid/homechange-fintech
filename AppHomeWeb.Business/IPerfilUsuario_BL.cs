using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Business
{
    public interface IPerfilUsuario_BL
    {
        List<PerfilUsuario_BE> ListarPerfilUsuario(PerfilUsuario_BE Ent);
        int RegistrarPerfilUsuario(PerfilUsuario_BE Ent);
    }
}
