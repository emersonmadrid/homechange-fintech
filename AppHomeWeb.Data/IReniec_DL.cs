using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Data
{
    public interface IReniec_DL
    {
        Reniec_BE BuscarDNI(string txtDni);
    }
}
