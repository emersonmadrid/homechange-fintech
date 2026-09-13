console.log('sss');
(function ($, undefined) {
    'use strict';
    var Form = function ($element, options) {
        $.extend(this, $.fn.ContenedorLogin.defaults, $element.data(), typeof options == 'object' && options);
        this.setControls({
            form: $element,
            txtemail: $("#txtemail", $element),
            txtclave: $("#txtclave", $element),
            btnLogin: $("#btnLogin", $element),
            btnRegistrarse: $("#btnRegistrarse", $element)

        });
    };
    Form.prototype = {
        constructor: Form,
        init: function () {
            var that = this,
            controls = that.getControls();
            console.log('init');
           
            controls.btnLogin.on('click', function(e) { that.btnLogin_click(this, e); });
            controls.btnRegistrarse.on('click', function(e) { that.btnRegistrarse_click(this, e); });
            that.render();
        },
        render: function () {
            var that = this,
                controls = that.getControls();
        },
        btnRegistrarse_click: function (sender, args) {
            var that = this,
                  controls = that.getControls();
            window.location.href = '/Transactions/HomeMoney/RegistrarCliente';
        },
        btnLogin_click: function (sender, args) {

            var that = this,
            controls = that.getControls();
            that.GetValidarUsuario();

        },
        GetValidarUsuario: function () {

            var that = this,
            controls = that.getControls();

            var usuario = controls.txtemail.val();
            var clave = controls.txtclave.val();

            var varEnt_Usuario_BE = {
                usuario: usuario,
                clave: clave
            };

            var objEnt_Usuario_BE = {
                Ent_Usuario_BE: varEnt_Usuario_BE
            }

            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(objEnt_Usuario_BE),
                async: false,
                url: '/Transactions/HomeMoney/GetValidarUsuario',
                success: function (response) {

                    console.log('Response GetValidarUsuario');
                    console.log(response);

                    if (response.data > 0) {

                        sessionStorage.setItem('idusuario', response.data);
                        window.location.href = '/Transactions/HomeMoney/SeleccionPerfil';
                        //window.location.href = '/Transactions/HomeMoney/SeleccionPerfil?idusuario=' + response.data;
                        // $.post('/Transactions/HomeMoney/SeleccionPerfil?idusuario=' + response.data);

                    } else {
                        //$("#divalertSuccess").removeClass("hide");
                        $("#divalertError").fadeIn(1000);
                        $("#divalertError").fadeOut(5000);
                    }

                },
                error: function (msger) {
                    console.log('Error GetValidarUsuario ', msger);
                    alert("Error interno del servidor o timeout en la base de datos. Por favor revisa tu Web.config.");
                }
            });

        },
        getControls: function () {
            return this.m_controls || {};
        },
        setControls: function (value) {
            this.m_controls = value;
        },
        strUrl: window.location.protocol + '//' + window.location.host
    };
    $.fn.ContenedorLogin = function () {
        var option = arguments[0],
            args = arguments,
            value,
            allowedMethods = [];

        this.each(function () {

            var $this = $(this),
                data = $this.data('ContenedorLogin'),
                options = $.extend({}, $.fn.ContenedorLogin.defaults,
                    $this.data(), typeof option === 'object' && option);

            if (!data) {
                data = new Form($this, options);
                $this.data('RecordEquipment', data);
            }

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }
                value = data[option](args[1]);
            } else {
                // Initialize directly instead of waiting for a missing plugin
                data.init();
                
                if (args[1]) {
                    value = data[args[1]].apply(data, [].slice.call(args, 2));
                }
            }
        });

        return value || this;
    };
    $.fn.ContenedorLogin.defaults = {}
    $('#ContenedorLogin').ContenedorLogin();
})(jQuery);