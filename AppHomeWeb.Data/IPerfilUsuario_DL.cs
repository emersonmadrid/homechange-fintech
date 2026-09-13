using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Data
{
    public interface IPerfilUsuario_DL
    {
        List<PerfilUsuario_BE> ListarPerfilUsuario(PerfilUsuario_BE Ent);
        int RegistrarPerfilUsuario(PerfilUsuario_BE Ent);
    }
}
