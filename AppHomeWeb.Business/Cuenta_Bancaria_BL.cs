using AppHomeWeb.Data;
using AppHomeWeb.Entity;
using System.Collections.Generic;

namespace AppHomeWeb.Business
{
    public class Cuenta_Bancaria_BL : ICuenta_Bancaria_BL
    {
        public List<Cuenta_Bancaria_BE> ListarCuentaBancaria(Cuenta_Bancaria_BE Ent)
        {
            Cuenta_Bancaria_DL objCuenta_Bancaria_DL = new Cuenta_Bancaria_DL();
            return objCuenta_Bancaria_DL.ListarCuentaBancaria(Ent);
        }

        public int RegistrarCuentaBancaria(Cuenta_Bancaria_BE Ent)
        {
            Cuenta_Bancaria_DL objCuenta_Bancaria_DL = new Cuenta_Bancaria_DL();
            return objCuenta_Bancaria_DL.RegistrarCuentaBancaria(Ent);
        }
    }
}
