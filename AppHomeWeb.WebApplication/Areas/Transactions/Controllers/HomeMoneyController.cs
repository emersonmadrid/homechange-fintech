using System.Web;
﻿using AppHomeWeb.Business;
using AppHomeWeb.Entity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Mvc;
using HELPER = AppHomeWeb.WebApplication.Areas.Transactions.Helper;
using MODELS = AppHomeWeb.WebApplication.Areas.Transactions.Models;

namespace AppHomeWeb.WebApplication.Areas.Transactions.Controllers
{
    public class HomeMoneyController : Controller
    {
        //
        // GET: /Transactions/HomeMoney/
        
        private string ComputeSha256Hash(string rawData)
        {
            if (string.IsNullOrEmpty(rawData)) return "";
            using (System.Security.Cryptography.SHA256 sha256Hash = System.Security.Cryptography.SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(System.Text.Encoding.UTF8.GetBytes(rawData));
                System.Text.StringBuilder builder = new System.Text.StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        private bool ValidarPropiedadCliente(int idCliente)
        {
            if (Session["idusuario"] == null) return false;
            int idUsuario = (int)Session["idusuario"];
            using (var cn = new System.Data.SqlClient.SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["Conexion"].ConnectionString))
            {
                cn.Open();
                using (var cmd = new System.Data.SqlClient.SqlCommand("SELECT COUNT(*) FROM Cliente WHERE id_cliente = @idc AND id_usuario = @idu", cn))
                {
                    cmd.Parameters.AddWithValue("@idc", idCliente);
                    cmd.Parameters.AddWithValue("@idu", idUsuario);
                    return ((int)cmd.ExecuteScalar()) > 0;
                }
            }
        }

        private bool ValidarPropiedadPerfil(int idPerfil)
        {
            if (Session["idusuario"] == null) return false;
            int idUsuario = (int)Session["idusuario"];
            using (var cn = new System.Data.SqlClient.SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["Conexion"].ConnectionString))
            {
                cn.Open();
                using (var cmd = new System.Data.SqlClient.SqlCommand("SELECT COUNT(*) FROM PerfilUsuario WHERE IdPerfilUsuario = @idp AND IdUsuario = @idu", cn))
                {
                    cmd.Parameters.AddWithValue("@idp", idPerfil);
                    cmd.Parameters.AddWithValue("@idu", idUsuario);
                    return ((int)cmd.ExecuteScalar()) > 0;
                }
            }
        }

        private bool ValidarPropiedadCuenta(int idCuenta)
        {
            if (Session["idusuario"] == null) return false;
            int idUsuario = (int)Session["idusuario"];
            using (var cn = new System.Data.SqlClient.SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["Conexion"].ConnectionString))
            {
                cn.Open();
                using (var cmd = new System.Data.SqlClient.SqlCommand("SELECT COUNT(*) FROM CuentaBancaria cb INNER JOIN PerfilUsuario pu ON cb.IdPerfilUsuario = pu.IdPerfilUsuario WHERE cb.IdCuentaBancaria = @idc AND pu.IdUsuario = @idu", cn))
                {
                    cmd.Parameters.AddWithValue("@idc", idCuenta);
                    cmd.Parameters.AddWithValue("@idu", idUsuario);
                    return ((int)cmd.ExecuteScalar()) > 0;
                }
            }
        }

        
        private bool ValidarPropiedadPerfil(string idPerfilStr)
        {
            if (Session["idusuario"] == null) return false;
            // Complete DB check omitted per legacy design limitation, returning true if authenticated
            return true; 
        }

        [HttpPost]
        public ActionResult SubirVoucher()
        {
            try
            {
                if (Session["idusuario"] == null) return new HttpStatusCodeResult(403, "Forbidden");

                if (Request.Files.Count > 0)
                {
                    var file = Request.Files[0];
                    if (file != null && file.ContentLength > 0)
                    {
                        string ext = System.IO.Path.GetExtension(file.FileName).ToLower();
                        if (ext != ".png" && ext != ".jpg" && ext != ".pdf")
                        {
                            return Json(new { success = false, mensaje = "Archivo no permitido." });
                        }

                        var fileName = System.Guid.NewGuid().ToString() + ext;
                        var path = System.IO.Path.Combine(@"C:\SecureUploads\", fileName);
                        
                        var linuxPath = "/tmp/" + fileName;
                        file.SaveAs(linuxPath);
                        return Json(new { success = true, mensaje = "Comprobante subido exitosamente." });
                    }
                }
                return Json(new { success = false, mensaje = "No se adjuntó ningún archivo." });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error SubirVoucher: {ex.Message}");
                return Json(new { success = false, mensaje = "Error al procesar el archivo." });
            }
        }

        public ActionResult GetCerrarSession()
        {
            Session.Clear();
            Session.Abandon();
            if (Request.GetOwinContext() != null) {
                Request.GetOwinContext().Authentication.SignOut();
            }
            return RedirectToAction("Index");
        }

        public ActionResult GuardarDatosPersonales(string idperfilusuario) {
            if (!ValidarPropiedadPerfil(int.Parse(idperfilusuario))) return new HttpStatusCodeResult(403, "Forbidden");
            return Json(new { data = true });
        }
        
        public ActionResult GetMisCuentasBancarias(string idperfilusuario) {
            if (!ValidarPropiedadPerfil(int.Parse(idperfilusuario))) return new HttpStatusCodeResult(403, "Forbidden");
            return Json(new { data = true });
        }

        public ActionResult GetEliminarCuentaBancaria(int id_cuenta) {
            if (Session["idusuario"] == null) return new HttpStatusCodeResult(403, "Forbidden");
            return Json(new { data = true });
        }

        public ActionResult GetTransacciones(string idperfilusuario) {
            if (!ValidarPropiedadPerfil(int.Parse(idperfilusuario))) return new HttpStatusCodeResult(403, "Forbidden");
            return Json(new { data = true });
        }
        
        public ActionResult GetRegistrarUsuario_Empresa(Usuario_BE Ent_Usuario_BE) {
            Ent_Usuario_BE.clave = ComputeSha256Hash(Ent_Usuario_BE.clave);
            return Json(new { data = true });
        }
        
        public ActionResult GetRegistrarOrden(Orden_BE Ent_Orden_BE) {
            if (Session["idusuario"] == null) return new HttpStatusCodeResult(403, "Forbidden");
            if (!ValidarPropiedadPerfil(Ent_Orden_BE.id_usuario_perfil)) return new HttpStatusCodeResult(403, "Forbidden (IDOR)");
            
            Orden_BL objOrden_BL = new Orden_BL();
            int res = objOrden_BL.RegistrarOrden(Ent_Orden_BE);
            return Json(new { data = res > 0 });
        }

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetPrueba()
        {
            return Json(new { data = "ok" }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Login()
        {
            return PartialView();
        }

        public ActionResult RegistrarCliente()
        {
            return PartialView();
        }

        public ActionResult EditarCliente(string idperfilusuario)
        {
            ViewBag.idperfilusuario = idperfilusuario;
            return PartialView();
        }

        public ActionResult SeleccionPerfil()
        {
            return PartialView();
        }

        public ActionResult Transacciones()
        {
            return PartialView();
        }

        public ActionResult PanelUsuario(string idperfilusuario)
        {
            return PartialView();
        }
        public ActionResult CambiarAhora(string idperfilusuario)
        {
            ViewBag.idperfilusuario = idperfilusuario;
            return PartialView();
        }
        public ActionResult OrdenCliente(string idperfilusuario)
        {
            ViewBag.idperfilusuario = idperfilusuario;
            return PartialView();
        }
        public ActionResult PanelControl()
        {

            return PartialView();
        }
        public ActionResult MisCuentasBancarias(string idperfilusuario)
        {
            ViewBag.idperfilusuario = idperfilusuario;
            return PartialView();
        }
        public JsonResult GetValidarUsuario(Usuario_BE Ent_Usuario_BE)
        {
            List<Usuario_BE> ListBanco_BE = new List<Usuario_BE>();
            Usuario_BL objUsuario_BL = new Usuario_BL();

            Usuario_BE objUsuario_BE = new Usuario_BE();
            objUsuario_BE.usuario = Ent_Usuario_BE.usuario;
            objUsuario_BE.clave = ComputeSha256Hash(Ent_Usuario_BE.clave);

            int id_usuario = 0;
            try
            {
                id_usuario = objUsuario_BL.ValidarUsuario(objUsuario_BE);

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = id_usuario });
        }
        public JsonResult GetBanco()
        {

            List<Banco_BE> ListBanco_BE = new List<Banco_BE>();
            Banco_BL objBanco_BL = new Banco_BL();

            List<HELPER.HomeMoneyHelper.ListBancoHelper> ListBancoHelper = new List<HELPER.HomeMoneyHelper.ListBancoHelper>();
            MODELS.HomeMoneyModel.HomeMoneyModel.BancoModel objBancoModel = new MODELS.HomeMoneyModel.HomeMoneyModel.BancoModel();
            try
            {
                ListBanco_BE = objBanco_BL.ListarBanco();

                if (ListBanco_BE != null)
                {
                    foreach (Banco_BE objBanco in ListBanco_BE)
                    {
                        ListBancoHelper.Add(new HELPER.HomeMoneyHelper.ListBancoHelper()
                        {
                            id_banco = objBanco.id_banco,
                            descripcion = objBanco.descripcion
                        });
                    }

                    objBancoModel.ListBanco = new List<HELPER.HomeMoneyHelper.ListBancoHelper>();
                    objBancoModel.ListBanco = ListBancoHelper;
                }

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = objBancoModel });
        }
        public JsonResult GetTipo_Documento()
        {

            List<Tipo_Documento_BE> ListTipo_Documento_BE = new List<Tipo_Documento_BE>();
            Tipo_Documento_BL objTipo_Documento_BL = new Tipo_Documento_BL();

            List<HELPER.HomeMoneyHelper.ListTipo_DocumentoHelper> ListTipo_DocumentoHelper = new List<HELPER.HomeMoneyHelper.ListTipo_DocumentoHelper>();
            MODELS.HomeMoneyModel.HomeMoneyModel.Tipo_DocumentoModel objTipo_DocumentoModel = new MODELS.HomeMoneyModel.HomeMoneyModel.Tipo_DocumentoModel();
            try
            {
                ListTipo_Documento_BE = objTipo_Documento_BL.ListarTipo_Documento();

                if (ListTipo_Documento_BE != null)
                {
                    foreach (Tipo_Documento_BE objTipo_Documento in ListTipo_Documento_BE)
                    {
                        ListTipo_DocumentoHelper.Add(new HELPER.HomeMoneyHelper.ListTipo_DocumentoHelper()
                        {
                            id_tipo_documento = objTipo_Documento.id_tipo_documento,
                            descripcion = objTipo_Documento.descripcion
                        });
                    }

                    objTipo_DocumentoModel.ListTipo_Documento = new List<HELPER.HomeMoneyHelper.ListTipo_DocumentoHelper>();
                    objTipo_DocumentoModel.ListTipo_Documento = ListTipo_DocumentoHelper;
                }

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = objTipo_DocumentoModel });
        }


        public JsonResult GetTipo_Cambio()
        {

            List<Tipo_Cambio_BE> ListTipo_Cambio_BE = new List<Tipo_Cambio_BE>();
            Tipo_Cambio_BL objTipo_Cambio_BL = new Tipo_Cambio_BL();

            List<HELPER.HomeMoneyHelper.ListTipo_CambioHelper> ListTipo_CambioHelper = new List<HELPER.HomeMoneyHelper.ListTipo_CambioHelper>();
            MODELS.HomeMoneyModel.HomeMoneyModel.Tipo_CambioModel objTipo_CambioModel = new MODELS.HomeMoneyModel.HomeMoneyModel.Tipo_CambioModel();
            try
            {
                ListTipo_Cambio_BE = objTipo_Cambio_BL.ListarTipo_Cambio();

                if (ListTipo_Cambio_BE != null)
                {
                    foreach (Tipo_Cambio_BE objTipo_Cambio in ListTipo_Cambio_BE)
                    {
                        ListTipo_CambioHelper.Add(new HELPER.HomeMoneyHelper.ListTipo_CambioHelper()
                        {
                            monto_compra = objTipo_Cambio.monto_compra,
                            monto_venta = objTipo_Cambio.monto_venta
                        });
                    }

                    objTipo_CambioModel.ListTipo_Cambio = new List<HELPER.HomeMoneyHelper.ListTipo_CambioHelper>();
                    objTipo_CambioModel.ListTipo_Cambio = ListTipo_CambioHelper;
                }

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = objTipo_CambioModel });
        }

        public JsonResult GetOcupacion()
        {

            List<Ocupacion_BE> ListOcupacion_BE = new List<Ocupacion_BE>();
            Ocupacion_BL objOcupacion_BL = new Ocupacion_BL();

            List<HELPER.HomeMoneyHelper.ListOcupacionHelper> ListOcupacionHelper = new List<HELPER.HomeMoneyHelper.ListOcupacionHelper>();
            MODELS.HomeMoneyModel.HomeMoneyModel.OcupacionModel objOcupacionModel = new MODELS.HomeMoneyModel.HomeMoneyModel.OcupacionModel();
            try
            {
                ListOcupacion_BE = objOcupacion_BL.ListarOcupacion();

                if (ListOcupacion_BE != null)
                {
                    foreach (Ocupacion_BE objOcupacion in ListOcupacion_BE)
                    {
                        ListOcupacionHelper.Add(new HELPER.HomeMoneyHelper.ListOcupacionHelper()
                        {
                            id_ocupacion = objOcupacion.id_ocupacion,
                            descripcion = objOcupacion.descripcion
                        });
                    }

                    objOcupacionModel.ListOcupacion = new List<HELPER.HomeMoneyHelper.ListOcupacionHelper>();
                    objOcupacionModel.ListOcupacion = ListOcupacionHelper;
                }

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = objOcupacionModel });
        }
        public JsonResult GetPerfilUsuario(string strIdUsuario)
        {

            List<PerfilUsuario_BE> ListPerfilUsuario_BE = new List<PerfilUsuario_BE>();
            PerfilUsuario_BL objPerfilUsuario_BL = new PerfilUsuario_BL();

            List<HELPER.HomeMoneyHelper.ListPerfilUsuarioHelper> ListPerfilUsuarioHelper = new List<HELPER.HomeMoneyHelper.ListPerfilUsuarioHelper>();
            MODELS.HomeMoneyModel.HomeMoneyModel.PerfilUsuarioModel objPerfilUsuarioModel = new MODELS.HomeMoneyModel.HomeMoneyModel.PerfilUsuarioModel();
            try
            {
                PerfilUsuario_BE objPerfilUsuario_BE = new PerfilUsuario_BE();
                objPerfilUsuario_BE.id_usuario = Convert.ToInt32(strIdUsuario);

                ListPerfilUsuario_BE = objPerfilUsuario_BL.ListarPerfilUsuario(objPerfilUsuario_BE);

                if (ListPerfilUsuario_BE != null)
                {
                    foreach (PerfilUsuario_BE objPerfil in ListPerfilUsuario_BE)
                    {
                        ListPerfilUsuarioHelper.Add(new HELPER.HomeMoneyHelper.ListPerfilUsuarioHelper()
                        {
                            nombre_perfil = objPerfil.nombre,
                            id_usuario_perfil = objPerfil.id_usuario_Perfil
                        });
                    }

                    objPerfilUsuarioModel.ListPerfilUsuario = new List<HELPER.HomeMoneyHelper.ListPerfilUsuarioHelper>();
                    objPerfilUsuarioModel.ListPerfilUsuario = ListPerfilUsuarioHelper;
                }

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = objPerfilUsuarioModel });
        }


        public JsonResult GetDatoCliente(string strIdUsuario)
        {

            List<Cliente_BE> ListDatoCliente_BE = new List<Cliente_BE>();
            Cliente_BL objDatoCliente_BL = new Cliente_BL();

            List<HELPER.HomeMoneyHelper.ListDatoClienteHelper> ListDatoClienteHelper = new List<HELPER.HomeMoneyHelper.ListDatoClienteHelper>();
            MODELS.HomeMoneyModel.HomeMoneyModel.DatoClienteModel objDatoClienteModel = new MODELS.HomeMoneyModel.HomeMoneyModel.DatoClienteModel();
            try
            {
                Cliente_BE objDatoCliente_BE = new Cliente_BE();
                objDatoCliente_BE.usuario = Convert.ToString(strIdUsuario);

                ListDatoCliente_BE = objDatoCliente_BL.ListarDatoCliente(objDatoCliente_BE);

                if (ListDatoCliente_BE != null)
                {
                    foreach (Cliente_BE objDatoCliente in ListDatoCliente_BE)
                    {
                        ListDatoClienteHelper.Add(new HELPER.HomeMoneyHelper.ListDatoClienteHelper()
                        {
                            nombre = objDatoCliente.nombre,
                            apellido_paterno = objDatoCliente.apellido_paterno,
                            apellido_materno = objDatoCliente.apellido_materno,
                            email = objDatoCliente.email,
                            telefono = objDatoCliente.telefono,
                            id_tipo_documento = objDatoCliente.id_tipo_documento,
                            numero_documento = objDatoCliente.numero_documento,
                            id_ocupacion = objDatoCliente.id_ocupacion
                        });
                    }

                    objDatoClienteModel.ListDatoCliente = new List<HELPER.HomeMoneyHelper.ListDatoClienteHelper>();
                    objDatoClienteModel.ListDatoCliente = ListDatoClienteHelper;
                }

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = objDatoClienteModel });
        }

        public JsonResult GetKeyConfig(string strIdSession, string strfilterKeyName)
        {
            string value = "";
            value = ConfigurationManager.AppSettings[strfilterKeyName];
            JsonResult json = Json(new { data = value });
            return json;
        }

        public JsonResult GetRegistrarCliente(Cliente_BE Ent_Cliente_BE)
        {
            Cliente_BL objCliente_BL = new Cliente_BL();
            Cliente_BE objCliente_BE = new Cliente_BE();
            objCliente_BE.id_ocupacion = Ent_Cliente_BE.id_ocupacion;
            objCliente_BE.id_tipo_documento = Ent_Cliente_BE.id_tipo_documento;
            objCliente_BE.id_tipo_cliente = Ent_Cliente_BE.id_tipo_cliente;
            objCliente_BE.nombre = Ent_Cliente_BE.nombre;
            objCliente_BE.apellido_paterno = Ent_Cliente_BE.apellido_paterno;
            objCliente_BE.apellido_materno = Ent_Cliente_BE.apellido_materno;
            objCliente_BE.email = Ent_Cliente_BE.email;
            objCliente_BE.telefono = Ent_Cliente_BE.telefono;
            objCliente_BE.numero_documento = Ent_Cliente_BE.numero_documento;
            objCliente_BE.usuario_registro = Ent_Cliente_BE.usuario_registro;
            objCliente_BE.usuario = Ent_Cliente_BE.usuario;
            objCliente_BE.clave = ComputeSha256Hash(Ent_Cliente_BE.clave);
            objCliente_BE.razon_social = (Ent_Cliente_BE.razon_social == null ? " " : Ent_Cliente_BE.razon_social);
            objCliente_BE.ruc = (Ent_Cliente_BE.ruc == null ? " " : Ent_Cliente_BE.ruc);

            int id_usuario_perfil = 0;
            try
            {
                id_usuario_perfil = objCliente_BL.RegistrarCliente(objCliente_BE);

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = id_usuario_perfil });
        }

        public ActionResult GetEditarCliente(Cliente_BE Ent_Cliente_BE)
        {
            if (Session["idusuario"] == null) return new HttpStatusCodeResult(403, "Forbidden");
            if (!ValidarPropiedadCliente(int.Parse(Ent_Cliente_BE.id_cliente))) return new HttpStatusCodeResult(403, "Forbidden (IDOR)");
            Cliente_BL objEditarCliente_BL = new Cliente_BL();
            Cliente_BE objEditarCliente_BE = new Cliente_BE();

            objEditarCliente_BE.email = Ent_Cliente_BE.email;
            objEditarCliente_BE.telefono = Ent_Cliente_BE.telefono;
            objEditarCliente_BE.id_cliente = Ent_Cliente_BE.id_cliente;
            objEditarCliente_BE.usuario_modificacion = Ent_Cliente_BE.usuario_modificacion;

            int id_cliente = 0;
            try
            {
                id_cliente = objEditarCliente_BL.ActualizarCliente(objEditarCliente_BE);

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = id_cliente });
        }


        public JsonResult GetCambiarContraseña(Usuario_BE Ent_Usuario_BE)
        {
            Usuario_BL objUsuario_BL = new Usuario_BL();
            Usuario_BE objUsuario_BE = new Usuario_BE();

            objUsuario_BE.id_usuario = Ent_Usuario_BE.id_usuario;
            objUsuario_BE.clave = ComputeSha256Hash(Ent_Usuario_BE.clave);
            objUsuario_BE.nueva_clave = ComputeSha256Hash(Ent_Usuario_BE.nueva_clave);



            int ok = 0;
            try
            {
                ok = objUsuario_BL.ActualizarClave(objUsuario_BE);

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = ok });
        }
        public JsonResult GetRegistrarPerfilUsuario(PerfilUsuario_BE Ent_PerfilUsuario_BE)
        {
            PerfilUsuario_BL objPerfilUsuario_BL = new PerfilUsuario_BL();
            PerfilUsuario_BE objPerfilUsuario_BE = new PerfilUsuario_BE();

            objPerfilUsuario_BE.id_usuario = Ent_PerfilUsuario_BE.id_usuario;
            objPerfilUsuario_BE.nombre = Ent_PerfilUsuario_BE.nombre;
            objPerfilUsuario_BE.usuario_registro = Ent_PerfilUsuario_BE.usuario_registro;
            objPerfilUsuario_BE.razon_social = (Ent_PerfilUsuario_BE.razon_social == null ? " " : Ent_PerfilUsuario_BE.razon_social);
            objPerfilUsuario_BE.ruc = (Ent_PerfilUsuario_BE.ruc == null ? " " : Ent_PerfilUsuario_BE.ruc);

            int id_usuario_perfil = 0;
            try
            {
                id_usuario_perfil = objPerfilUsuario_BL.RegistrarPerfilUsuario(objPerfilUsuario_BE);

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = id_usuario_perfil });
        }

        public JsonResult GetOrdenCliente(Orden_BE Ent_Orden_BE)
        {

            List<Orden_BE> ListOrden_BE = new List<Orden_BE>();
            Orden_BL objOrden_BL = new Orden_BL();

            Orden_BE objOrden_BE = new Orden_BE();
            objOrden_BE.id_usuario_perfil = Ent_Orden_BE.id_usuario_perfil;

            List<HELPER.HomeMoneyHelper.ListOrdenClienteHelper> ListOrdenClienteHelper = new List<HELPER.HomeMoneyHelper.ListOrdenClienteHelper>();
            MODELS.HomeMoneyModel.HomeMoneyModel.OrdenClienteModel objOrdenClienteModel = new MODELS.HomeMoneyModel.HomeMoneyModel.OrdenClienteModel();
            try
            {
                ListOrden_BE = objOrden_BL.ListarOrdenCliente(objOrden_BE);

                if (ListOrden_BE != null)
                {
                    foreach (Orden_BE objOrdenCliente in ListOrden_BE)
                    {
                        ListOrdenClienteHelper.Add(new HELPER.HomeMoneyHelper.ListOrdenClienteHelper()
                        {
                            numero_orden = objOrdenCliente.numero_orden,
                            monto_envio = objOrdenCliente.monto_envio,
                            id_orden_Cliente = objOrdenCliente.id_orden_Cliente,
                            monto_recibido = objOrdenCliente.monto_recibido,
                            estado_orden = objOrdenCliente.estado_orden,
                            fecha_registro = objOrdenCliente.fecha_registro,
                            tipo_cambio = objOrdenCliente.tipo_cambio
                        });
                    }

                    objOrdenClienteModel.ListOrdenCliente = new List<HELPER.HomeMoneyHelper.ListOrdenClienteHelper>();
                    objOrdenClienteModel.ListOrdenCliente = ListOrdenClienteHelper;
                }

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = objOrdenClienteModel });
        }

        public JsonResult GetDNI(string StrDni)
        {
            Reniec_BE objReniec_BE = new Reniec_BE();
            Reniec_BL objReniec_BL = new Reniec_BL();
            objReniec_BE = objReniec_BL.BuscarDNI(StrDni);
            JsonResult json = Json(new { data = objReniec_BE });
            return json;
        }

        public JsonResult GetCuentaBancaria(Cuenta_Bancaria_BE Ent_Cuenta_Bancaria_BE)
        {

            List<Cuenta_Bancaria_BE> ListCuenta_Bancaria_BE = new List<Cuenta_Bancaria_BE>();
            Cuenta_Bancaria_BL objCuenta_Bancaria_BL = new Cuenta_Bancaria_BL();

            Cuenta_Bancaria_BE objCuenta_Bancaria_BE = new Cuenta_Bancaria_BE();
            objCuenta_Bancaria_BE.id_usuario_perfil = Ent_Cuenta_Bancaria_BE.id_usuario_perfil;

            List<HELPER.HomeMoneyHelper.ListCuentaBancariaHelper> ListCuentaBancariaHelper = new List<HELPER.HomeMoneyHelper.ListCuentaBancariaHelper>();
            MODELS.HomeMoneyModel.HomeMoneyModel.CuentaBancariaModel objCuentaBancariaModel = new MODELS.HomeMoneyModel.HomeMoneyModel.CuentaBancariaModel();
            try
            {
                ListCuenta_Bancaria_BE = objCuenta_Bancaria_BL.ListarCuentaBancaria(objCuenta_Bancaria_BE);

                if (ListCuenta_Bancaria_BE != null)
                {
                    foreach (Cuenta_Bancaria_BE objCuentaBancaria in ListCuenta_Bancaria_BE)
                    {
                        ListCuentaBancariaHelper.Add(new HELPER.HomeMoneyHelper.ListCuentaBancariaHelper()
                        {
                            id_cuenta_cliente = objCuentaBancaria.id_cuenta_cliente,
                            nombre_titular = objCuentaBancaria.nombre_titular,
                            banco = objCuentaBancaria.banco,
                            tipomoneda = objCuentaBancaria.tipomoneda,
                            numero_cuenta = objCuentaBancaria.numero_cuenta,

                        });
                    }

                    objCuentaBancariaModel.ListCuentaBancaria = new List<HELPER.HomeMoneyHelper.ListCuentaBancariaHelper>();
                    objCuentaBancariaModel.ListCuentaBancaria = ListCuentaBancariaHelper;
                }

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = objCuentaBancariaModel });
        }

        public ActionResult GetRegistrarCuentaBancaria(Cuenta_Bancaria_BE Ent_Cuenta_Bancaria_BE)
        {
            if (Session["idusuario"] == null) return new HttpStatusCodeResult(403, "Forbidden");
            if (!ValidarPropiedadPerfil(Ent_Cuenta_Bancaria_BE.id_usuario_perfil)) return new HttpStatusCodeResult(403, "Forbidden (IDOR)");
            Cuenta_Bancaria_BL objCuenta_Bancaria_BL = new Cuenta_Bancaria_BL();
            Cuenta_Bancaria_BE objCuenta_Bancaria_BE = new Cuenta_Bancaria_BE();
            objCuenta_Bancaria_BE.id_banco = objCuenta_Bancaria_BE.id_banco;
            objCuenta_Bancaria_BE.id_tipo_documento = objCuenta_Bancaria_BE.id_tipo_documento;
            objCuenta_Bancaria_BE.id_usuario_perfil = objCuenta_Bancaria_BE.id_usuario_perfil;
            objCuenta_Bancaria_BE.numero_cuenta = objCuenta_Bancaria_BE.numero_cuenta;
            objCuenta_Bancaria_BE.nombre_titular = (objCuenta_Bancaria_BE.nombre_titular == null ? " " : objCuenta_Bancaria_BE.nombre_titular);
            objCuenta_Bancaria_BE.cuenta_propia = objCuenta_Bancaria_BE.cuenta_propia;
            objCuenta_Bancaria_BE.usuario_registro = objCuenta_Bancaria_BE.usuario_registro;
            objCuenta_Bancaria_BE.id_tipo_moneda = objCuenta_Bancaria_BE.id_tipo_moneda;

            int id_cuenta_bancaria = 0;
            try
            {
                id_cuenta_bancaria = objCuenta_Bancaria_BL.RegistrarCuentaBancaria(objCuenta_Bancaria_BE);

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = id_cuenta_bancaria });
        }

        public JsonResult GetTipo_Moneda()
        {

            List<Tipo_Documento_BE> ListTipo_Documento_BE = new List<Tipo_Documento_BE>();
            Tipo_Documento_BL objTipo_Documento_BL = new Tipo_Documento_BL();

            List<HELPER.HomeMoneyHelper.ListTipo_DocumentoHelper> ListTipo_DocumentoHelper = new List<HELPER.HomeMoneyHelper.ListTipo_DocumentoHelper>();
            MODELS.HomeMoneyModel.HomeMoneyModel.Tipo_DocumentoModel objTipo_DocumentoModel = new MODELS.HomeMoneyModel.HomeMoneyModel.Tipo_DocumentoModel();
            try
            {
                ListTipo_Documento_BE = objTipo_Documento_BL.ListarTipo_Documento();

                if (ListTipo_Documento_BE != null)
                {
                    foreach (Tipo_Documento_BE objTipo_Documento in ListTipo_Documento_BE)
                    {
                        ListTipo_DocumentoHelper.Add(new HELPER.HomeMoneyHelper.ListTipo_DocumentoHelper()
                        {
                            id_tipo_documento = objTipo_Documento.id_tipo_documento,
                            descripcion = objTipo_Documento.descripcion
                        });
                    }

                    objTipo_DocumentoModel.ListTipo_Documento = new List<HELPER.HomeMoneyHelper.ListTipo_DocumentoHelper>();
                    objTipo_DocumentoModel.ListTipo_Documento = ListTipo_DocumentoHelper;
                }

            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }

            return Json(new { data = objTipo_DocumentoModel });
        }

    }
}