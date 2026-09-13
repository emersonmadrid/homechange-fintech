using AppHomeWeb.Data;
using AppHomeWeb.Entity;
using System.Collections.Generic;

namespace AppHomeWeb.Business
{
    public class PerfilUsuario_BL : IPerfilUsuario_BL
    {
        public List<PerfilUsuario_BE> ListarPerfilUsuario(PerfilUsuario_BE Ent)
        {
            PerfilUsuario_DL objPerfilUsuario_DL = new PerfilUsuario_DL();
            return objPerfilUsuario_DL.ListarPerfilUsuario(Ent);
        }

        public int RegistrarPerfilUsuario(PerfilUsuario_BE Ent)
        {
            PerfilUsuario_DL objPerfilUsuario_DL = new PerfilUsuario_DL();
            return objPerfilUsuario_DL.RegistrarPerfilUsuario(Ent);
        }
    }
}
