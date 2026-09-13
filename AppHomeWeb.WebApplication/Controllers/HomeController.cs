using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace AppHomeWeb.WebApplication.Controllers
{
    public class HomeController : Controller
    {
        private const string API_KEY = "3faf6ab2337f14be7207a8a5";
        private const string API_URL = "https://v6.exchangerate-api.com/v6/";
        // Reemplaza con tu API Key

        public ActionResult Index()
        {
            decimal exchangeRate = GetExchangeRate();
            ViewBag.ExchangeRate = exchangeRate; // Enviar el tipo de cambio a la vista
            return View();
        }
        private decimal GetExchangeRate()
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    string response = client.DownloadString($"{API_URL}{API_KEY}/latest/USD");
                    JObject json = JObject.Parse(response);
                    return json["conversion_rates"]["PEN"].Value<decimal>(); // Obtiene el tipo de cambio
                }
            }
            catch (Exception ex)
            {
                return 0; // En caso de error, devuelve 0
            }
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}