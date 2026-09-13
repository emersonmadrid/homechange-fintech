using System.Collections.Generic;
using HELPER_ITEM = AppHomeWeb.WebApplication.Areas.Transactions.Helper.HomeMoneyHelper;

namespace AppHomeWeb.WebApplication.Areas.Transactions.Models.HomeMoneyModel
{
    public class HomeMoneyModel
    {

        public class BancoModel
        {
            public List<HELPER_ITEM.ListBancoHelper> ListBanco { get; set; }

        }
        public class Tipo_DocumentoModel
        {
            public List<HELPER_ITEM.ListTipo_DocumentoHelper> ListTipo_Documento { get; set; }

        }
        public class OcupacionModel
        {
            public List<HELPER_ITEM.ListOcupacionHelper> ListOcupacion { get; set; }

        }
        public class PerfilUsuarioModel
        {
            public List<HELPER_ITEM.ListPerfilUsuarioHelper> ListPerfilUsuario { get; set; }

        }


        public class DatoClienteModel
        {
            public List<HELPER_ITEM.ListDatoClienteHelper> ListDatoCliente { get; set; }

        }


        public class Tipo_CambioModel
        {
            public List<HELPER_ITEM.ListTipo_CambioHelper> ListTipo_Cambio { get; set; }

        }
        public class OrdenClienteModel
        {
            public List<HELPER_ITEM.ListOrdenClienteHelper> ListOrdenCliente { get; set; }

        }

        public class CuentaBancariaModel
        {
            public List<HELPER_ITEM.ListCuentaBancariaHelper> ListCuentaBancaria { get; set; }

        }
    }
}