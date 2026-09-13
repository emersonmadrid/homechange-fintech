using System;
using System.Net;
using System.Web.Helpers;
using System.Web.Mvc;

namespace AppHomeWeb.WebApplication.App_Start
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class ValidateAjaxAntiForgeryTokenAttribute : FilterAttribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationContext filterContext)
        {
            var request = filterContext.HttpContext.Request;

            if (request.HttpMethod == WebRequestMethods.Http.Post)
            {
                if (request.IsAjaxRequest())
                {
                    var antiForgeryCookie = request.Cookies[AntiForgeryConfig.CookieName];
                    var cookieValue = antiForgeryCookie != null ? antiForgeryCookie.Value : null;
                    // Validate from header
                    AntiForgery.Validate(cookieValue, request.Headers["RequestVerificationToken"]);
                }
                else
                {
                    // Regular form post
                    AntiForgery.Validate();
                }
            }
        }
    }
}
 