(function ($, undefined) {
    'use strict';
    var Form = function ($element, options) {
        $.extend(this, $.fn.ContenedorRegistrarCliente.defaults, $element.data(), typeof options == 'object' && options);
        this.setControls({
            form: $element,
            txtnombre: $('#txtnombre', $element),
            txtape_paterno: $('#txtape_paterno', $element),
            txtape_materno: $('#txtape_materno', $element),
            cboTipoDocumento: $('#cboTipoDocumento', $element),
            txtnum_documento: $('#txtnum_documento', $element),
            cboOcupacion: $('#cboOcupacion', $element),
            txtnum_celular: $('#txtnum_celular', $element),
            cboPersonaPublica: $('#cboPersonaPublica', $element),
            txtemail: $('#txtemail', $element),
            txtclave: $('#txtclave', $element),
            txtconfirmar: $('#txtconfirmar', $element),
            btnRegistrar: $('#btnRegistrar', $element),
            lblmensajeAlerta: $('#lblmensajeAlerta', $element),
            lblmensajeAlertaSuccess: $('#lblmensajeAlertaSuccess', $element)
        });
    };
    Form.prototype = {
        constructor: Form,
        init: function () {
            var that = this,
            controls = that.getControls();
            controls.btnRegistrar.on('click', function(e) { that.btnRegistrar_click(this, e); });
            controls.cboTipoDocumento.on('change', function(e) { that.changeTipoDocumento(this, e); });
            that.render();
        },
        render: function () {
            var that = this,
                controls = that.getControls();
            that.GetTipo_Documento();
            that.GetOcupacion();
            that.GetPersonaPublica();

        },
        changeTipoDocumento: function () {
            var that = this,
            controls = that.getControls();           

            var strTipoBusqueda = controls.cboTipoDocumento.val();
            var strDNI = GetKeyConfig("strDNI");

            if (strTipoBusqueda == strDNI) {
                $(controls.txtnum_documento).off("keypress");
                that.addEventKeyPress(controls.txtnum_documento);
            } 
            else {                
                $(controls.txtnum_documento).off("keypress");               
            }
            //controls.ddlSearchType.selectpicker('refresh');
        },
        addEventKeyPress: function (Control) {
            var that = this,
            controls = that.getControls();

            console.log('llegue');
            $(Control).keyup(function (event) {
                var filterNumber = controls.txtnum_documento.val().trim().length;             
                         
                if (filterNumber == 8) {

                    controls.txtnombre.val('');
                    controls.txtape_paterno.val('');
                    controls.txtape_materno.val('');

                    var parameters = {
                        StrDni: controls.txtnum_documento.val().trim()                    
                    };
                            $.ajax({
                                type: 'POST',
                                contentType: "application/json; charset=utf-8",
                                dataType: 'json',
                                data: JSON.stringify(parameters),
                                async: false,
                                url: '/Transactions/HomeMoney/GetDNI',

                                success: function (response) {

                                    console.log('Response GetDNI');
                                    console.log(response);

                                    if (($.isEmptyObject(response)) == false) {
                                        if (response != null) {

                                            controls.txtnombre.val(response.data.nombres);
                                            controls.txtape_paterno.val(response.data.apellido_paterno);
                                            controls.txtape_materno.val(response.data.apellido_materno);
                                        }
                                    } else {
                                        controls.txtnombre.val('');
                                        controls.txtape_paterno.val('');
                                        controls.txtape_materno.val('');
                                    }
                                },
                                error: function (msger) {
                                    console.log('Error GetDNI ' + msger);
                                }

                            });
                } else {
                    controls.txtnombre.val('');
                    controls.txtape_paterno.val('');
                    controls.txtape_materno.val('');
                }


                return true;
            });

           

        },
        btnRegistrar_click: function (sender, args) {
            var that = this,
               controls = that.getControls();

            that.GetRegistrarCliente(function (callback) {

                if (callback == true) {
                    hideLoading();

                    controls.lblmensajeAlerta.text('');
                    $("#divalertErrorRegistrar").css("display", "none");
                    controls.lblmensajeAlertaSuccess.text('Se registro correctamente');
                    $("#divalertSuccessRegistrar").fadeIn(1000);
                    setInterval(function () { window.location.href = '/Transactions/HomeMoney/Login'; }, 2000);

                } else {
                    hideLoading();
                    controls.lblmensajeAlerta.text('No se pudo registrar, favor intente nuevamente.');
                    $("#divalertErrorRegistrar").fadeIn(1000);
                }
            });

        },
        GetTipo_Documento: function () {

            var that = this,
            controls = that.getControls();

            $(controls.cboTipoDocumento).empty();
            $(controls.cboTipoDocumento).append($('<option>', { value: '', text: 'Seleccionar' }));

            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                //data: JSON.stringify(parameters),
                async: false,
                url: '/Transactions/HomeMoney/GetTipo_Documento',

                success: function (response) {

                    console.log('Response GetTipo_Documento');
                    console.log(response);

                    if (($.isEmptyObject(response)) == false) {
                        if (response != null) {

                            $.each(response.data.ListTipo_Documento, function (index, value) {
                                controls.cboTipoDocumento.append($('<option>', { value: value.id_tipo_documento, text: value.descripcion }));
                            });
                        }
                    }
                },
                error: function (msger) {
                    console.log('Error GetTipo_Documento ' + msger);
                }

            });

        },
        GetOcupacion: function () {

            var that = this,
            controls = that.getControls();

            $(controls.cboOcupacion).empty();
            $(controls.cboOcupacion).append($('<option>', { value: '', text: 'Seleccionar' }));

            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                //data: JSON.stringify(parameters),
                async: false,
                url: '/Transactions/HomeMoney/GetOcupacion',

                success: function (response) {

                    console.log('Response GetOcupacion');
                    console.log(response);

                    if (($.isEmptyObject(response)) == false) {
                        if (response != null) {

                            $.each(response.data.ListOcupacion, function (index, value) {
                                controls.cboOcupacion.append($('<option>', { value: value.id_ocupacion, text: value.descripcion }));
                            });
                        }
                    }
                },
                error: function (msger) {
                    console.log('Error GetOcupacion ' + msger);
                }

            });

        },
        GetPersonaPublica: function () {

            var that = this,
            controls = that.getControls();

            $(controls.cboPersonaPublica).empty();
            $(controls.cboPersonaPublica).append($('<option>', { value: 'No', text: 'No' }));
            $(controls.cboPersonaPublica).append($('<option>', { value: 'Si', text: 'Si' }));


        },
        GetRegistrarCliente: function (callback) {

            var that = this,
            controls = that.getControls();

            that.validateRegisterForm(function (flag) {

                if (flag) {

                    return false;

                } else {

                    var nombre = controls.txtnombre.val();
                    var apepat = controls.txtape_paterno.val();
                    var apemat = controls.txtape_materno.val();
                    var tipodocumento = controls.cboTipoDocumento.val();
                    var numdoc = controls.txtnum_documento.val();
                    var ocupacion = controls.cboOcupacion.val();
                    var perpublica = controls.cboPersonaPublica.val();
                    var telefono = controls.txtnum_celular.val();
                    var email = controls.txtemail.val();
                    var clave = controls.txtclave.val();


                    var varEnt_Cliente_BE = {
                        id_ocupacion: ocupacion,
                        id_tipo_documento: tipodocumento,
                        id_tipo_cliente: 1,
                        nombre: nombre,
                        apellido_paterno: apepat,
                        apellido_materno: apemat,
                        email: email,
                        telefono: telefono,
                        numero_documento: numdoc,
                        usuario_registro: 0,
                        usuario: email,
                        clave: clave,
                        razon_social: "",
                        ruc: "",
                    };

                    var objEnt_Cliente_BE = {
                        Ent_Cliente_BE: varEnt_Cliente_BE
                    }
                    showLoading('Procesando, por favor espere.');

                    $.ajax({
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        data: JSON.stringify(objEnt_Cliente_BE),
                        //async: false,
                        url: '/Transactions/HomeMoney/GetRegistrarCliente',
                        success: function (response) {

                            console.log('Response GetRegistrarCliente');
                            console.log(response);

                            if (response.data > 0) {
                                callback(true);

                            } else {
                                callback(false);
                            }
                        },
                        error: function (msger) {
                            console.log('Error GetRegistrarCliente ' + msger);
                            callback(false);
                        }
                    });
                }
            });
        },
        validateRegisterForm: function (callback) {

            var that = this,
          controls = this.getControls();
            var Mensaje = '';
            var flag = false;
            var Panel = 0;

            var nombre = controls.txtnombre.val();
            var apepat = controls.txtape_paterno.val();
            var apemat = controls.txtape_materno.val();
            var tipodocumento = controls.cboTipoDocumento.val();
            var numdoc = controls.txtnum_documento.val();
            var ocupacion = controls.cboOcupacion.val();
            var perpublica = controls.cboPersonaPublica.val();
            var telefono = controls.txtnum_celular.val();
            var email = controls.txtemail.val();
            var clave = controls.txtclave.val();

            if (nombre == '') {
                Mensaje = 'Debe ingresar el nombre';
                Panel = 0;
            } else if (apepat == '') {
                Mensaje = 'Debe ingresar el apellido paterno';
                Panel = 0;
            } else if (apemat == '') {
                Mensaje = 'Debe ingresar el apellido materno';
                Panel = 0;
            } else if (tipodocumento == '') {
                Mensaje = 'Seleccione tipo de documento';
                Panel = 0;
            } else if (numdoc == '') {
                Mensaje = 'Debe ingresar el numero de documento';
                Panel = 0;
            } else if (ocupacion == '') {
                Mensaje = 'Seleccione ocupación';
                Panel = 0;
            } else if (email == '') {
                Mensaje = 'Debe ingresar un email';
                Panel = 1;
            } else if (email.indexOf('@', 0) == -1 || email.indexOf('.', 0) == -1) {
                Mensaje = 'El email introducido no es correcto.';
                Panel = 1;
            } else if (clave == '') {
                Mensaje = 'Debe ingresar una clave';
                Panel = 1;
            }

            if (Mensaje != '') {

                if (Panel == 0) {
                    $("#DivDatosCuenta").removeClass("active in");
                    $("#DivDatosCliente").addClass("active in");

                } else {
                    $("#DivDatosCuenta").addClass("active in");
                    $("#DivDatosCliente").removeClass("active in");
                }
                flag = true;

                controls.lblmensajeAlerta.text(Mensaje);
                $("#divalertErrorRegistrar").fadeIn(1000);
                //$("#divalertErrorRegistrar").fadeOut(6000);

                //alert(Mensaje, 'Guardar');
            } else {
                controls.lblmensajeAlerta.text('');
            }

            callback(flag);
        },
        getControls: function () {
            return this.m_controls || {};
        },
        setControls: function (value) {
            this.m_controls = value;
        },
        strUrl: window.location.protocol + '//' + window.location.host
    };
    $.fn.ContenedorRegistrarCliente = function () {
        var option = arguments[0],
            args = arguments,
            value,
            allowedMethods = [];

        this.each(function () {

            var $this = $(this),
                data = $this.data('ContenedorRegistrarCliente'),
                options = $.extend({}, $.fn.ContenedorRegistrarCliente.defaults,
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
                // Initialize directly
                data.init();


                if (args[1]) {
                    value = data[args[1]].apply(data, [].slice.call(args, 2));
                }
            }
        });

        return value || this;
    };
    $.fn.ContenedorRegistrarCliente.defaults = {}
    $('#ContenedorRegistrarCliente').ContenedorRegistrarCliente();
})(jQuery);
