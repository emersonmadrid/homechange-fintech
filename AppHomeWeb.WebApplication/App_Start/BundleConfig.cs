using System.Web.Optimization;

namespace AppHomeWeb.WebApplication
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, consulte http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            BundleTable.EnableOptimizations = false;
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-ui.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información sobre los formularios. De este modo, estará
            // preparado para la producción y podrá utilizar la herramienta de compilación disponible en http://modernizr.com para seleccionar solo las pruebas que necesite.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));


            bundles.Add(new ScriptBundle("~/bundles/jquery-addon-home").Include(
              "~/Areas/Transactions/Scripts/Addon/jquery.dataTables.min.js",
              "~/Areas/Transactions/Scripts/Addon/jquery.dataTables.select.js",
              "~/Areas/Transactions/Scripts/Addon/jquery.blockUI.js",
              "~/Areas/Transactions/Scripts/Addon/jquery.smartmenus.js",
              "~/Areas/Transactions/Scripts/Addon/jquery.smartmenus.bootstrap.js",
              "~/Areas/Transactions/Scripts/Addon/jquery.numeric.js",
              "~/Areas/Transactions/Scripts/Addon/dataTables.bootstrap.min.js"
          ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/css431").Include(
                   "~/Areas/Transactions/Css/boostrap431.css",
                   "~/Content/site.css",
                   "~/Areas/Transactions/Css/font-awesome.css"));

            bundles.Add(new StyleBundle("~/bundles/Index").Include(
                      "~/Scripts/Index.js"));

            bundles.Add(new StyleBundle("~/bundles/SeleccionPerfil").Include(
                     "~/Areas/Transactions/Scripts/HomeMoney/SeleccionPerfil.js"));

            bundles.Add(new ScriptBundle("~/bundles/HomeMoneyLib")
.Include("~/Areas/Transactions/Scripts/HomeMoney/HomeMoneyLib.js"));

            bundles.Add(new ScriptBundle("~/bundles/Login")
.Include("~/Areas/Transactions/Scripts/HomeMoney/Login.js"));

            bundles.Add(new ScriptBundle("~/bundles/RegistrarCliente")
 .Include("~/Areas/Transactions/Scripts/HomeMoney/RegistrarCliente.js"));

            bundles.Add(new ScriptBundle("~/bundles/Transacciones")
.Include("~/Areas/Transactions/Scripts/HomeMoney/Transacciones.js"));

            bundles.Add(new StyleBundle("~/bundles/HomeMoneyStyles").Include(
                "~/Content/homemoney-modern.css"));

            bundles.Add(new ScriptBundle("~/bundles/HomeMoneyCore").Include(
                "~/Areas/Transactions/Scripts/Addon/jquery.min.js",
                "~/Areas/Transactions/Scripts/Addon/bootstrap.bundle.min.js",
                "~/Areas/Transactions/Scripts/Addon/jquery.cookie.js"
            ));
            bundles.Add(new ScriptBundle("~/bundles/OrdenCliente")
        .Include("~/Areas/Transactions/Scripts/HomeMoney/OrdenCliente.js"));

            bundles.Add(new ScriptBundle("~/bundles/EditarCliente")
       .Include("~/Areas/Transactions/Scripts/HomeMoney/EditarCliente.js"));

            bundles.Add(new ScriptBundle("~/bundles/MisCuentasBancarias")
      .Include("~/Areas/Transactions/Scripts/HomeMoney/MisCuentasBancarias.js"));

            bundles.Add(new ScriptBundle("~/bundles/PanelControl")
     .Include("~/Areas/Transactions/Scripts/HomeMoney/PanelControl.js"));

            bundles.Add(new ScriptBundle("~/bundles/CambiarAhora")
.Include("~/Areas/Transactions/Scripts/HomeMoney/CambiarAhora.js"));


            bundles.Add(new StyleBundle("~/Content/style").Include(
                   "~/Content/style.css"));


        }
    }
}
