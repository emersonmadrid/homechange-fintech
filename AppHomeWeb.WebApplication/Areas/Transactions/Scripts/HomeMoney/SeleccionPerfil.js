var Sessionidusuario = JSON.parse(sessionStorage.getItem("idusuario"));
console.log(Sessionidusuario);

//Sessionidusuario = '1';
Sessionidusuario = '1';

(function ($, undefined) {
    'use strict';
    var Form = function ($element, options) {
        $.extend(this, $.fn.ContenedorSeleccionPerfil.defaults, $element.data(), typeof options == 'object' && options);
        this.setControls({
            form: $element,
            ContenedorPerfil: $('#ContenedorPerfil', $element),      
            btnRegistrarPerfil: $('#btnRegistrarPerfil', $element),
            txtrazonsocial: $('#txtrazonsocial', $element),
            txtRuc: $('#txtRuc', $element)
            //lblmensajeAlerta: $('#lblmensajeAlerta', $element),
            //lblmensajeAlertaSuccess: $('#lblmensajeAlertaSuccess', $element)


        });
    };
    Form.prototype = {
        constructor: Form,
        init: function () {
            var that = this,
            controls = that.getControls();
            controls.btnRegistrarPerfil.on('click', function(e) { that.btnRegistrarPerfil_click(this, e); });
            that.render();
        },
        render: function () {
            var that = this,
                controls = that.getControls();

            that.GetInfoPerfiles();

        },
        CrearControl: {
            Table: function (id, classname) {
                var divTable = document.createElement("table");
                divTable.className = classname;
                divTable.id = id;
                return divTable;
            },
            Div: function (id, classname) {
                var divRow = document.createElement("div");
                divRow.className = classname;
                divRow.id = id;
                return divRow;
            },
            tr: function (id, classname) {
                var divRow = document.createElement("tr");
                divRow.className = classname;
                divRow.id = id;
                return divRow;
            },
            tbody: function (id) {
                var divRow = document.createElement("tbody");
                divRow.id = id;
                return divRow;
            },
            td: function (id, width) {
                var divRow = document.createElement("td");
                divRow.id = id;
                divRow.width = width;
                return divRow;
            },
            thead: function () {
                var divthead = document.createElement("thead");
                return divthead;
            },
            Label: function (id, classname, value) {
                var lab = document.createElement("label");
                lab.className = classname + ' line ';
                lab.id = id;
                lab.innerHTML = '&nbsp;&nbsp;' + value + '&nbsp;&nbsp;';

                return lab;
            },
            ul: function (id, classname) {
                var divRow = document.createElement("ul");
                divRow.className = classname;
                divRow.id = id;
                return divRow;
            },
            li: function (id, classname) {
                var divRow = document.createElement("li");
                divRow.className = classname;
                divRow.id = id;
                return divRow;
            },
            a: function (id, value, classname) {
                var divRow = document.createElement("a");
                divRow.id = id;
                divRow.className = classname
                if (value != '') {
                    divRow.innerHTML = '&nbsp;&nbsp;' + value + '&nbsp;&nbsp;';
                }

                return divRow;
            },
            th: function (value) {
                var divRow = document.createElement("th");
                divRow.innerHTML = '&nbsp;&nbsp;' + value + '&nbsp;&nbsp;';
                return divRow;
            },
            span: function (id, classname) {
                var divRow = document.createElement("span");
                divRow.className = classname;
                divRow.id = id;
                return divRow;
            },
            img: function (id, classname, src) {
                var divRow = document.createElement("img");
                divRow.className = classname;

                divRow.id = id;
                divRow.src = src;
                return divRow;
            },
            h3: function (id, value) {
                var divRow = document.createElement("h3");
                divRow.id = id;
                divRow.innerHTML = '&nbsp;&nbsp;' + value + '&nbsp;&nbsp;';
                return divRow;
            }, h5: function (id, value) {
                var divRow = document.createElement("h5");
                divRow.id = id;
                divRow.innerHTML = '&nbsp;&nbsp;' + value + '&nbsp;&nbsp;';
                return divRow;
            }, p: function (id, classname) {
                var divRow = document.createElement("p");
                divRow.className = classname;
                divRow.id = id;
                return divRow;
            }, button: function (id, classname, value) {
                var divRow = document.createElement("button");
                divRow.innerHTML = '&nbsp;&nbsp;' + value + '&nbsp;&nbsp;';
                divRow.className = classname;
                divRow.id = id;
                return divRow;
            },

        },
        GetInfoPerfiles: function () {

            var that = this,
            controls = this.getControls();

            that.GetPerfilUsuario(function () {

                var divul = '';
                var countTab = 0;
                var divtabcontent = '';
                var tabActiveIn = '';

                $(controls.ContenedorPerfil).empty();

                var strImagenDefault = GetKeyConfig("strImagenDefault");

                var contador = 0;
                $.grep(that.dataListPerfil.listaPerfil, function (Item) {
                    contador = contador + 1;

                    var divbox = $(that.CrearControl.Div('divbox' + Item.id_usuario_perfil, 'col-lg-3 col-md-6')); //armamos fila
                    var divcard = $(that.CrearControl.Div('divcard' + Item.id_usuario_perfil, 'card')); //armamos fila
                    var divcardbody = $(that.CrearControl.Div('divcardbody' + Item.id_usuario_perfil, 'card-body')); //armamos fila
                    var divimg = $(that.CrearControl.img('divimg' + Item.id_usuario_perfil, 'img-fluid rounded-circle w-50 mb-3', strImagenDefault)); //armamos fila
                    var divh3 = $(that.CrearControl.h3('divh3' + Item.id_usuario_perfil, 'Bienvenido')); //armamos fila
                    var divh5 = $(that.CrearControl.h5('divh5' + Item.id_usuario_perfil, Item.nombre_perfil)); //armamos fila
                    var divp = $(that.CrearControl.p('divp' + Item.id_usuario_perfil, 'py-3')); //armamos fila
                    var divflex = $(that.CrearControl.Div('divflex' + Item.id_usuario_perfil, 'd-flex flex-row justify-content-center')); //armamos fila
                    var divp12 = $(that.CrearControl.Div('divp12' + Item.id_usuario_perfil, 'p-12')); //armamos fila
                    var divButton = $(that.CrearControl.button('divButton' + Item.id_usuario_perfil, 'btn btn-info', 'Ingresar')); //armamos fila                   
                    divButton.attr("section", Item.id_usuario_perfil);
                    divButton.addEvent(that, 'click', that.OpenTransacciones_click);
                   

                    divcardbody.append(divimg);
                    divcardbody.append(divh3);
                    divcardbody.append(divh5);
                    divcardbody.append(divp);

                    divp12.append(divButton);
                    divflex.append(divp12);
                    divcardbody.append(divflex);

                    divcard.append(divcardbody);
                    divbox.append(divcard);

                    controls.ContenedorPerfil.append(divbox);

                });

                if (contador < 4) {

                    var strImagenDefaultAgregar = GetKeyConfig("strImagenDefaultAgregar");
                    var divboxAgregar = $(that.CrearControl.Div('divboxAgregar', 'col-lg-3 col-md-6')); //armamos fila
                    var divcardAgregar = $(that.CrearControl.Div('divcardAgregar', 'card')); //armamos fila
                    var divcardbodyAgregar = $(that.CrearControl.Div('divcardbodyAgregar', 'card-body')); //armamos fila
                    var divimgAgregar = $(that.CrearControl.img('divimgAgregar', 'img-fluid rounded-circle w-50 mb-3', strImagenDefaultAgregar)); //armamos fila
                    var divh3Agregar = $(that.CrearControl.h3('divh3divh3Agregar', 'Perfil')); //armamos fila
                    var divh5Agregar = $(that.CrearControl.h5('divh5Agregar', '')); //armamos fila

                    var divpAgregar = $(that.CrearControl.p('divpAgregar' ,'py-3')); //armamos fila
                    var divflexAgregar = $(that.CrearControl.Div('divflexAgregar' , 'd-flex flex-row justify-content-center')); //armamos fila
                    var divp12Agregar = $(that.CrearControl.Div('divp12Agregar' , 'p-12')); //armamos fila
                    var divButtonAgregar = $(that.CrearControl.button('divButtonAgregar', 'btn btn-info', 'Agregar')); //armamos fila
                    divButtonAgregar.attr("data-toggle", "modal");
                    divButtonAgregar.attr("data-target", "#myModal");
                   // divButtonAgregar.addEvent(that, 'click', that.OpenRegistrarPerfil_click);
                   
                 

                 
                    divcardbodyAgregar.append(divimgAgregar);
                  
                    divcardbodyAgregar.append(divh3Agregar);
                    divcardbodyAgregar.append(divh5Agregar);
                    divcardbodyAgregar.append(divpAgregar);
                    divcardAgregar.append(divcardbodyAgregar);
                    divboxAgregar.append(divcardAgregar);

                    divp12Agregar.append(divButtonAgregar);
                    divflexAgregar.append(divp12Agregar);
                    divcardbodyAgregar.append(divflexAgregar);

                    controls.ContenedorPerfil.append(divboxAgregar);
                }

            });

        },
        OpenRegistrarPerfil_click: function () {
            var that = this,
             controls = that.getControls();
             alert('aaaaaa');
        },
        OpenTransacciones_click: function (sender, args) {
            var that = this,
             controls = that.getControls();      
            var UsuarioPerfil = $(sender).attr("section");
            //var session = {
            //    UsuarioPerfil: UsuarioPerfil,
            //    Usuario: Sessionidusuario
            //}


            sessionStorage.setItem('idusuarioperfil', UsuarioPerfil);
            sessionStorage.setItem('idusuario', Sessionidusuario);
            window.location.href = '/Transactions/HomeMoney/Transacciones';

            

        },
        GetPerfilUsuario: function (callback) {

            var that = this,
           controls = this.getControls();

            // showLoading('Cargando información de descartes.');

            var objReqConsultDiscardRTIRequest = {
                strIdUsuario: Sessionidusuario
            };

            console.log('Request GetPerfilUsuario');
            console.log(JSON.stringify(objReqConsultDiscardRTIRequest))

            // controls.btnbuscar.button('loading');
            $.app.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                //async: false,
                url: '/Transactions/HomeMoney/GetPerfilUsuario',
                data: JSON.stringify(objReqConsultDiscardRTIRequest),
                complete: function () {
                    // hideLoading();
                },
                success: function (response) {
                    console.log(response);

                    if (response.data != null) {

                        that.dataListPerfil.listaPerfil = [];

                        if (response.data.ListPerfilUsuario.length > 0) {
                            $.each(response.data.ListPerfilUsuario, function (index, value) {

                                var listaPerfil = {
                                    id_usuario_perfil: "",
                                    nombre_perfil: ""
                                }

                                listaPerfil.id_usuario_perfil = value.id_usuario_perfil,
                                listaPerfil.nombre_perfil = value.nombre_perfil;


                                that.dataListPerfil.listaPerfil.push(listaPerfil);

                            });
                        }

                        console.log("dataListPerfil");
                        console.log(that.dataListPerfil);
                        callback();
                    }
                },
                error: function (msger) {
                    callback();
                    console.log(msger);
                }
            });
        },
        btnRegistrarPerfil_click: function (sender, args) {
            var that = this,
               controls = that.getControls();

            that.GetRegistrarPerfil(function (callback) {

                if (callback == true) {
                    $("#modalLRForm").modal('hide');//ocultamos el modal
                    //$('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll


                    that.GetInfoPerfiles();

                    //controls.lblmensajeAlerta.text('');
                    //$("#divalertErrorRegistrar").css("display", "none");
                    //controls.lblmensajeAlertaSuccess.text('Se registro correctamente');
                    //$("#divalertSuccessRegistrarPerfil").fadeIn(1000);
                    //setInterval(function () { window.location.href = '/Transactions/HomeMoney/Login'; }, 2000);
                    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
                } else {
                    // hideLoading();
                    //controls.lblmensajeAlerta.text('No se pudo registrar, favor intente nuevamente.');
                    //$("#divalertErrorRegistrar").fadeIn(1000);
                }
            });

        },
        validateRegisterForm: function (callback) {

            var that = this,
          controls = this.getControls();
            var Mensaje = '';
            var flag = false;


            var razonsocial = controls.txtrazonsocial.val();
            var ruc = controls.txtRuc.val();


            if (razonsocial == '') {
                Mensaje = 'Debe ingresar razon social';

            } else if (ruc == '') {
                Mensaje = 'Debe ingresar el ruc';
            }

            if (Mensaje != '') {

                flag = true;

                //controls.lblmensajeAlerta.text(Mensaje);
                //$("#divalertErrorRegistrar").fadeIn(1000);
            } else {
                //controls.lblmensajeAlerta.text('');
            }

            callback(flag);
        },
        GetRegistrarPerfil: function (callback) {
            var that = this,
         controls = that.getControls();

            that.validateRegisterForm(function (flag) {

                if (flag) {

                    return false;

                } else {

                    var razonsocial = controls.txtrazonsocial.val();
                    var ruc = controls.txtRuc.val();

                    var varEnt_PerfilUsuario_BE = {
                        id_usuario: Sessionidusuario,
                        nombre: razonsocial,
                        usuario_registro: 1,
                        razon_social: razonsocial,
                        ruc: ruc,
                    };

                    var objEnt_PerfilUsuario_BE = {
                        Ent_PerfilUsuario_BE: varEnt_PerfilUsuario_BE
                    }
                    //showLoading('Procesando, por favor espere.');

                    $.ajax({
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        data: JSON.stringify(objEnt_PerfilUsuario_BE),
                        //async: false,
                        url: '/Transactions/HomeMoney/GetRegistrarPerfilUsuario',
                        success: function (response) {

                            console.log('Response GetRegistrarPerfil');
                            console.log(response);

                            if (response.data > 0) {
                                callback(true);

                            } else {
                                callback(false);
                            }
                        },
                        error: function (msger) {
                            console.log('Error GetRegistrarPerfil ' + msger);
                            callback(false);
                        }
                    });
                }
            });
        },
        dataListPerfil: {
            listaPerfil: []
        },
        getControls: function () {
            return this.m_controls || {};
        },
        setControls: function (value) {
            this.m_controls = value;
        },
        strUrl: window.location.protocol + '//' + window.location.host
    };
    $.fn.ContenedorSeleccionPerfil = function () {
        var option = arguments[0],
            args = arguments,
            value,
            allowedMethods = [];

        this.each(function () {

            var $this = $(this),
                data = $this.data('ContenedorSeleccionPerfil'),
                options = $.extend({}, $.fn.ContenedorSeleccionPerfil.defaults,
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
    $.fn.ContenedorSeleccionPerfil.defaults = {}
    $('#ContenedorSeleccionPerfil').ContenedorSeleccionPerfil();
})(jQuery);