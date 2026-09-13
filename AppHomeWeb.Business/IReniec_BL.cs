using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Business
{
    public interface IReniec_BL
    {
        Reniec_BE BuscarDNI(string txtDni);
    }
}
