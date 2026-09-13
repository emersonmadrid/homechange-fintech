using System;
using System.Collections.Generic;
using AppHomeWeb.Entity;

namespace AppHomeWeb.Data
{
    public interface ICuenta_Bancaria_DL
    {
        List<Cuenta_Bancaria_BE> ListarCuentaBancaria(Cuenta_Bancaria_BE Ent);
        int RegistrarCuentaBancaria(Cuenta_Bancaria_BE Ent);
    }
}
