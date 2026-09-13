using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace AppHomeWeb.Business
{
    public class EmailService
    {
        // Configuración quemada para pruebas (idealmente va en Web.config)
        private const string SmtpHost = "smtp.gmail.com";
        private const int SmtpPort = 587;
        private const string SmtpUser = "tucorreo@gmail.com"; 
        private const string SmtpPass = "tu_contraseña_de_aplicacion";

        public async Task EnviarNotificacionOrden(string toEmail, string numeroOrden, decimal monto, string banco, string cuentaBancaria)
        {
            try
            {
                var smtpClient = new SmtpClient(SmtpHost)
                {
                    Port = SmtpPort,
                    Credentials = new NetworkCredential(SmtpUser, SmtpPass),
                    EnableSsl = true,
                };

                string htmlBody = $@"
                    <h2>Hola, tu orden <b>{numeroOrden}</b> ha sido generada.</h2>
                    <p>Para completar tu operación, por favor realiza una transferencia de <b>S/ {monto}</b> a nuestra cuenta empresarial:</p>
                    <ul>
                        <li><b>Banco:</b> {banco}</li>
                        <li><b>Cuenta:</b> {cuentaBancaria}</li>
                        <li><b>Titular:</b> Casa de Cambio SAC</li>
                    </ul>
                    <p>Una vez transferido, ingresa a tu portal y sube la foto de tu voucher.</p>
                    <p>Gracias por confiar en nosotros.</p>
                ";

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(SmtpUser, "Casa de Cambio Online"),
                    Subject = $"Instrucciones para tu Orden {numeroOrden}",
                    Body = htmlBody,
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error al enviar correo SMTP: {ex.Message}");
            }
        }
    }
}
