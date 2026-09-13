(function ($, undefined) {
    'use strict';
    var Form = function ($element, options) {
        $.extend(this, $.fn.ContenedorEditarCliente.defaults, $element.data(), typeof options == 'object' && options);
        this.setControls({
            form: $element,
            txtnombre: $('#txtnombre', $element),
            txtape_paterno: $('#txtape_paterno', $element),
            txtape_materno: $('#txtape_materno', $element),
            cboTipoDocumento: $('#cboTipoDocumento', $element),
            txtnum_documento: $('#txtnum_documento', $element),
            cboOcupacion: $('#cboOcupacion', $element),
            txtnum_celular: $('#txtnum_celular', $element),          
            txtemail: $('#txtemail', $element),
            txtcontraseña: $('#txtcontraseña', $element),
            txtnueva_contraseña: $('#txtnueva_contraseña', $element),
            txtconfirmar_contraseña: $('#txtconfirmar_contraseña', $element),
            lblmensajeAlerta: $('#lblmensajeAlerta', $element),
            lblmensajeAlertaSuccess: $('#lblmensajeAlertaSuccess', $element),
            btnRegistrar: $('#btnRegistrar', $element),
            btnCambiar_contraseña: $('#btnCambiar_contraseña', $element),
            hdidPerfilUsuario: $('#hdidPerfilUsuario', $element)

        });
    };
    Form.prototype = {
        constructor: Form,
        init: function () {
            var that = this,
            controls = that.getControls();
            controls.btnRegistrar.on('click', function(e) { that.btnRegistrar_click(this, e); });
            controls.btnCambiar_contraseña.addEvent(that, 'click', that.btnCambiar_contraseña);
            
            that.render();
        },
        render: function () {
            var that = this,
                controls = that.getControls();
            that.GetTipo_Documento();
            that.GetOcupacion();
            that.GetDatoCliente();
            

        },
        GetDatoCliente: function () {

            var that = this,
            controls = that.getControls();

            controls.txtnombre.val('');
            controls.txtape_paterno.val('');
            controls.txtape_materno.val('');
            controls.txtemail.val('');
            controls.txtnum_celular.val('');
            controls.txtnum_documento.val('');

            var idperfilusuario = controls.hdidPerfilUsuario.val();

            var objReqConsultDiscardRTIRequest = {
                strIdUsuario: idperfilusuario
            };

            console.log('Request GetDatoCliente');
            console.log(JSON.stringify(objReqConsultDiscardRTIRequest))

            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(objReqConsultDiscardRTIRequest),
                async: false,
                url: '/Transactions/HomeMoney/GetDatoCliente',
                success: function (response) {

                    console.log('Response GetDatoCliente');
                    console.log(response);
                    if (response.data.ListDatoCliente.length != null) {
                        if (response.data.ListDatoCliente.length > 0) {

                            controls.txtnombre.val(response.data.ListDatoCliente[0].nombre);
                            controls.txtape_paterno.val(response.data.ListDatoCliente[0].apellido_paterno);
                            controls.txtape_materno.val(response.data.ListDatoCliente[0].apellido_materno);
                            controls.txtemail.val(response.data.ListDatoCliente[0].email);
                            controls.txtnum_celular.val(response.data.ListDatoCliente[0].telefono);
                            controls.cboTipoDocumento.val(response.data.ListDatoCliente[0].id_tipo_documento);
                            controls.txtnum_documento.val(response.data.ListDatoCliente[0].numero_documento);
                            controls.cboOcupacion.val(response.data.ListDatoCliente[0].id_ocupacion);
                        }
                    }
                },
                error: function (msger) {
                    console.log('Error GetDatoCliente ' + msger);
                }

            });

        },


       
        btnRegistrar_click: function (sender, args) {
            var that = this,
               controls = that.getControls();

            that.GetActualizarCliente(function (callback) {

                if (callback == true) {
                    hideLoading();

                    controls.lblmensajeAlerta.text('');
                    $("#divalertErrorRegistrar").css("display", "none");
                    controls.lblmensajeAlertaSuccess.text('Se registro correctamente');
                    $("#divalertSuccessRegistrar").fadeIn(1000);
                    

                } else {
                    hideLoading();
                    controls.lblmensajeAlerta.text('No se pudo registrar, favor intente nuevamente.');
                    $("#divalertErrorRegistrar").fadeIn(1000);
                }
            });

        },
        btnCambiar_contraseña: function (sender, args) {
            var that = this,
               controls = that.getControls();

            that.GetCambiarContraseña(function (callback) {

                if (callback == true) {
                    hideLoading();

                    controls.lblmensajeAlerta.text('');
                    $("#divalertErrorRegistrar").css("display", "none");
                    controls.lblmensajeAlertaSuccess.text('Se registro correctamente');
                    $("#divalertSuccessRegistrar").fadeIn(1000);
                    

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
        
        GetActualizarCliente: function (callback) {

            var that = this,
            controls = that.getControls();

            that.validateRegisterForm(function (flag) {

                if (flag) {

                    return false;

                } else {

                   
                    var telefono = controls.txtnum_celular.val();
                    var email = controls.txtemail.val();
                    


                    var varEnt_Cliente_BE = {                       
                        email: email,
                        telefono: telefono,
                        id_cliente: 1,
                        usuario_modificacion: 1                   
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
                        url: '/Transactions/HomeMoney/GetEditarCliente',
                        success: function (response) {

                            console.log('Response GetEditarCliente');
                            console.log(response);

                            if (response.data > 0) {
                                callback(true);

                            } else {
                                callback(false);
                            }
                        },
                        error: function (msger) {
                            console.log('Error GetEditarCliente ' + msger);
                            callback(false);
                        }
                    });
                }
            });
        },


        GetCambiarContraseña: function (callback) {

            var that = this,
            controls = that.getControls();

            that.validateCambiarContrasena(function (flag) {

                if (flag) {

                    return false;

                } else {

                   
                 
                    var clave = controls.txtcontraseña.val();
                    var nueva_clave = controls.txtnueva_contraseña.val();
                    

                    
                    var varEnt_Usuario_BE = {
                        id_usuario :1,
                        clave: clave,
                        nueva_clave: nueva_clave                       
                    };

                    var objEnt_Usuario_BE = {
                        Ent_Usuario_BE: varEnt_Usuario_BE
                    }
                    showLoading('Procesando, por favor espere.');

                    $.ajax({
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        data: JSON.stringify(objEnt_Usuario_BE),
                        //async: false,
                        url: '/Transactions/HomeMoney/GetCambiarContraseña',
                        success: function (response) {

                            console.log('Response GetCambiarContraseña');
                            console.log(response);

                            if (response.data > 0) {
                                callback(true);

                            } else {
                                callback(false);
                            }
                        },
                        error: function (msger) {
                            console.log('Error GetCambiarContraseña ' + msger);
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
        

         
            var telefono = controls.txtnum_celular.val();
            var email = controls.txtemail.val();
            

            if (telefono == '') {
                Mensaje = 'Debe ingresar el telefono';
                
            } else if (email == '') {
                Mensaje = 'Debe ingresar el Email';
                
            }
           

            if (Mensaje != '') {

                
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


        validateCambiarContrasena: function (callback) {

            var that = this,
          controls = this.getControls();
            var Mensaje = '';
            var flag = false;           

            var clave = controls.txtcontraseña.val();
            var nueva_clave = controls.txtnueva_contraseña.val();
            var confirmar_clave = controls.txtconfirmar_contraseña.val();

            if (clave == '') {
                Mensaje = 'Debe ingresar la clave actual';
                
            } else if (nueva_clave == '') {
                Mensaje = 'Debe ingresar la nueva clave';
                
            } else if (confirmar_clave == '') {
                Mensaje = 'Debe confirmar la nueva clave';
               
            } 

            if (Mensaje != '') {

              
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
    $.fn.ContenedorEditarCliente = function () {
        var option = arguments[0],
            args = arguments,
            value,
            allowedMethods = [];

        this.each(function () {

            var $this = $(this),
                data = $this.data('ContenedorEditarCliente'),
                options = $.extend({}, $.fn.ContenedorEditarCliente.defaults,
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
    $.fn.ContenedorEditarCliente.defaults = {}
    $('#ContenedorEditarCliente').ContenedorEditarCliente();
})(jQuery);
