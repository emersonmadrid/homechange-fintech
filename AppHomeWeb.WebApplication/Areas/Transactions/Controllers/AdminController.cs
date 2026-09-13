using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using AppHomeWeb.Business;
using AppHomeWeb.Entity;

namespace AppHomeWeb.WebApplication.Areas.Transactions.Controllers
{
    public class AdminController : Controller
    {
        private readonly ITipo_Cambio_BL _tipoCambioBl;
        private readonly IOrden_BL _ordenBl;
        
        public AdminController(ITipo_Cambio_BL tipoCambioBl, IOrden_BL ordenBl)
        {
            _tipoCambioBl = tipoCambioBl;
            _ordenBl = ordenBl;
        }

        // GET: Transactions/Admin/Dashboard
        public ActionResult Dashboard()
        {
            return View();
        }

        // GET: Transactions/Admin/GestorTipoCambio
        public ActionResult GestorTipoCambio()
        {
            // Obtener el último tipo de cambio
            var lst = _tipoCambioBl.ListarTipo_Cambio();
            ViewBag.TipoCambio = lst.FirstOrDefault();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ActualizarTipoCambio(decimal precioCompra, decimal precioVenta)
        {
            try
            {
                Tipo_Cambio_BE obj = new Tipo_Cambio_BE
                {
                    monto_compra = precioCompra.ToString("0.000", System.Globalization.CultureInfo.InvariantCulture),
                    monto_venta = precioVenta.ToString("0.000", System.Globalization.CultureInfo.InvariantCulture)
                };
                _tipoCambioBl.RegistrarTipo_Cambio(obj);
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error ActualizarTipoCambio: {ex.Message}");
                return Json(new { success = false, message = "Error interno del servidor" });
            }
        }

        // GET: Transactions/Admin/BandejaOrdenes
        public ActionResult BandejaOrdenes()
        {
            // Listar todas las ordenes para mostrarlas en la tabla
            Orden_BE objOrden_BE = new Orden_BE();
            // Suponiendo que ListarOrden trae todas las pendientes
            // ViewBag.Ordenes = _ordenBl.ListarOrden(objOrden_BE);
            return View();
        }

        [HttpPost]
        public ActionResult AprobarOrden(string numeroOrden)
        {
            try
            {
                // Lógica para cambiar estado de orden a COMPLETADO
                // Orden_BE objOrden = new Orden_BE { numero_orden = numeroOrden, estado = "COMPLETADO" };
                // _ordenBl.ActualizarOrden(objOrden);
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error AprobarOrden: {ex.Message}");
                return Json(new { success = false, message = "Error interno" });
            }
        }
    }
}
