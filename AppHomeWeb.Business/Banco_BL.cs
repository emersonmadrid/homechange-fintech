using AppHomeWeb.Data;
using AppHomeWeb.Entity;
using System.Collections.Generic;

namespace AppHomeWeb.Business
{
    public class Banco_BL : IBanco_BL
    {
        private readonly IBanco_DL _bancoDl;

        public Banco_BL(IBanco_DL bancoDl)
        {
            _bancoDl = bancoDl;
        }

        // Default constructor for backward compatibility until IoC is fully configured
        public Banco_BL()
        {
            _bancoDl = new Banco_DL();
        }

        public List<Banco_BE> ListarBanco()
        {
            return _bancoDl.ListarBanco();
        }
    }
}
