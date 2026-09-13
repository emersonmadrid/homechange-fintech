using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Business
{
    public interface ICuenta_Bancaria_BL
    {
        List<Cuenta_Bancaria_BE> ListarCuentaBancaria(Cuenta_Bancaria_BE Ent);
        int RegistrarCuentaBancaria(Cuenta_Bancaria_BE Ent);
    }
}
