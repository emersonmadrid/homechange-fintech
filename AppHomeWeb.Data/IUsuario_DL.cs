using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Data
{
    public interface IUsuario_DL
    {
        int ValidarUsuario(Usuario_BE Ent);
        int ActualizarClave(Usuario_BE Ent);
    }
}
