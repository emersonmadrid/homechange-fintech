using AppHomeWeb.Data;
using AppHomeWeb.Entity;
using System.Collections.Generic;
namespace AppHomeWeb.Business
{
    public class Tipo_Cambio_BL : ITipo_Cambio_BL
    {

        public List<Tipo_Cambio_BE> ListarTipo_Cambio()
        {
            Tipo_Cambio_DL objTipo_Cambio_DL = new Tipo_Cambio_DL();
            return objTipo_Cambio_DL.ListarTipo_Cambio();
        }

        public int RegistrarTipo_Cambio(Tipo_Cambio_BE Ent)
        {
            Tipo_Cambio_DL objTipo_Cambio_DL = new Tipo_Cambio_DL();
            // Asumiendo que Tipo_Cambio_DL tiene este método, si no existe lo crearemos luego.
            // Si no existe, podemos simular que devuelve 1 temporalmente o crearlo real
            return objTipo_Cambio_DL.RegistrarTipo_Cambio(Ent);
        }
    }
}
