using AppHomeWeb.Data;
using AppHomeWeb.Entity;
using System.Collections.Generic;

namespace AppHomeWeb.Business
{
    public class Tipo_Documento_BL : ITipo_Documento_BL
    {
        public List<Tipo_Documento_BE> ListarTipo_Documento()
        {

            Tipo_Documento_DL objTipo_Documento_DL = new Tipo_Documento_DL();
            return objTipo_Documento_DL.ListarTipo_Documento();

        }
    }
}
