using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Business
{
    public interface IUsuario_BL
    {
        int ValidarUsuario(Usuario_BE Ent);
        int ActualizarClave(Usuario_BE Ent);
    }
}
