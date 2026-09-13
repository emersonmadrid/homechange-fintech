namespace AppHomeWeb.Entity
{
    public class Orden_BE
    {
        public int id_usuario_perfil { get; set; }
        public string numero_orden { get; set; }
        public string id_orden_Cliente { get; set; }
        public string fecha_registro { get; set; }
        public string monto_envio { get; set; }
        public string monto_recibido { get; set; }
        public string tipo_cambio { get; set; }
        public string estado_orden { get; set; }
        public int id_cuenta_bancaria { get; set; }
        public string ruta_voucher { get; set; }

    }
}
