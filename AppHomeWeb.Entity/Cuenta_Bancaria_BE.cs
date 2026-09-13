namespace AppHomeWeb.Entity
{
    public class Cuenta_Bancaria_BE
    {
        public int id_usuario_perfil { get; set; }
        public string id_cuenta_cliente { get; set; }
        public string banco { get; set; }
        public string nombre_titular { get; set; }
        public string tipomoneda { get; set; }
        public string numero_cuenta { get; set; }
        public int id_banco { get; set; }
        public int id_tipo_documento { get; set; }
        public string cuenta_propia { get; set; }
        public int usuario_registro { get; set; }
        public int id_tipo_moneda { get; set; }


    }
}
