using AppHomeWeb.Entity;
using System;
using System.IO;
using System.Net;

namespace AppHomeWeb.Data
{
    public class Reniec_DL : IReniec_DL
    {
        public Reniec_BE BuscarDNI(string txtDni)
        {

            string URL = "https://api.reniec.cloud/dni/" + txtDni;
            Reniec_BE respuesta = new Reniec_BE();
            try
            {
                var web_reques = (HttpWebRequest)System.Net.WebRequest.Create(URL);
                // Get the response.  
                WebResponse response = web_reques.GetResponse();

                // Get the stream containing content returned by the server. 
                // The using block ensures the stream is automatically closed. 
                using (Stream dataStream = response.GetResponseStream())
                {

                    // Open the stream using a StreamReader for easy access.  
                    StreamReader reader = new StreamReader(dataStream);

                    string resultado = reader.ReadToEnd();
                    string jsonviene = Convert.ToString(resultado);
                    respuesta = Newtonsoft.Json.JsonConvert.DeserializeObject<Reniec_BE>(jsonviene);

                }
                response.Close();

            }
            catch (Exception ex)
            {

            }

            return respuesta;

        }
    }
}
