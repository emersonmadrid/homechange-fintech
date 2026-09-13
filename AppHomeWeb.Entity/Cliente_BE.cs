namespace AppHomeWeb.Entity
{
    public class Cliente_BE
    {
        public string id_cliente { get; set; }
        public string id_ocupacion { get; set; }
        public int id_tipo_documento { get; set; }
        public int id_tipo_cliente { get; set; }
        public string nombre { get; set; }
        public string apellido_paterno { get; set; }
        public string apellido_materno { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
        public string numero_documento { get; set; }
        public int usuario_registro { get; set; }
        public string usuario { get; set; }
        public string clave { get; set; }

        public string nueva_clave { get; set; }
        public string razon_social { get; set; }
        public string ruc { get; set; }
        public int codigo_perfil { get; set; }

        public int usuario_modificacion { get; set; }







    }
}
