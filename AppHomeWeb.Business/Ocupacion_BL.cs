using AppHomeWeb.Data;
using AppHomeWeb.Entity;
using System.Collections.Generic;

namespace AppHomeWeb.Business
{
    public class Ocupacion_BL : IOcupacion_BL
    {

        public List<Ocupacion_BE> ListarOcupacion()
        {
            Ocupacion_DL objOcupacion_DL = new Ocupacion_DL();
            return objOcupacion_DL.ListarOcupacion();
        }
    }
}
