using AppHomeWeb.Data;
using AppHomeWeb.Entity;
using System;

namespace AppHomeWeb.Business
{
    public class Usuario_BL : IUsuario_BL
    {
        public int ValidarUsuario(Usuario_BE Ent_Usuario_BE)
        {
            Usuario_DL objUsuario_DL = new Usuario_DL();
            Ent_Usuario_BE.clave = HashPassword(Ent_Usuario_BE.clave);
            return objUsuario_DL.ValidarUsuario(Ent_Usuario_BE);
        }
        public int ActualizarClave(Usuario_BE Ent_Usuario_BE)
        {
            Usuario_DL objUsuario_DL = new Usuario_DL();
            Ent_Usuario_BE.clave = HashPassword(Ent_Usuario_BE.clave);
            Ent_Usuario_BE.nueva_clave = HashPassword(Ent_Usuario_BE.nueva_clave);
            return objUsuario_DL.ActualizarClave(Ent_Usuario_BE);
        }

        private string HashPassword(string plainText)
        {
            if (string.IsNullOrEmpty(plainText)) return plainText;
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(plainText);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }
    }
}
