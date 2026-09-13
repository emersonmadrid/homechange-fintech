(function ($, undefined) {
    'use strict';
    var Form = function ($element, options) {
        $.extend(this, $.fn.ContenedorMisCuentasBancarias.defaults, $element.data(), typeof options == 'object' && options);
        this.setControls({
            form: $element,
            hdidPerfilUsuario: $('#hdidPerfilUsuario', $element),
            btnAgregarCuentaBancaria: $('#btnAgregarCuentaBancaria', $element),
            cboTipoDocumento: $('#cboTipoDocumento', $element),
            cboMoneda: $('#cboMoneda', $element)
            
        });
    };
    Form.prototype = {
        constructor: Form,
        init: function () {
            var that = this,
            controls = that.getControls();
            console.log('Mis cuentas bancarias');
            controls.btnAgregarCuentaBancaria.on('click', function(e) { that.btnAgregarCuentaBancaria_click(this, e); });
            that.render();
        },
        render: function () {
            var that = this,
                controls = that.getControls();
            that.GetCuentasBancarias();
            that.GetTipo_Documento();
            that.GetTipo_Moneda();
        },
        btnAgregarCuentaBancaria_click: function (sender, args) {
            var that = this,
               controls = that.getControls();

            alert('agregar');

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
        GetTipo_Moneda: function () {

            var that = this,
            controls = that.getControls();

            $(controls.cboMoneda).empty();
            $(controls.cboMoneda).append($('<option>', { value: '', text: 'Seleccionar' }));

            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                //data: JSON.stringify(parameters),
                async: false,
                url: '/Transactions/HomeMoney/GetTipo_Moneda',

                success: function (response) {

                    console.log('Response GetTipo_Moneda');
                    console.log(response);

                    if (($.isEmptyObject(response)) == false) {
                        if (response != null) {

                            $.each(response.data.ListTipo_Documento, function (index, value) {
                                controls.cboMoneda.append($('<option>', { value: value.id_tipo_documento, text: value.descripcion }));
                            });
                        }
                    }
                },
                error: function (msger) {
                    console.log('Error GetTipo_Moneda ' + msger);
                }

            });

        },
        GetCuentasBancarias: function () {

            var that = this,
            controls = that.getControls();         
            var loadTable = '';
            loadTable = loadTable + '<tr>';
            loadTable = loadTable + '<td colspan="6" style="text-align: center;"><div style="padding: 30px 30px 10px 30px;"><img src="/Areas/Transactions/Images/loading.gif" height="45" width="45" /></div></td>';
            loadTable = loadTable + '</tr>';
            $('#tbPackageBodyCuentaList').html(loadTable);


            var idperfilusuario = controls.hdidPerfilUsuario.val();

            var varEnt_Cuenta_Bancaria_BE = {
                id_usuario_perfil: idperfilusuario
            };

            var objEnt_Cuenta_Bancaria_BE = {
                Ent_Cuenta_Bancaria_BE: varEnt_Cuenta_Bancaria_BE
            }

            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(objEnt_Cuenta_Bancaria_BE),
                //async: false,
                url: '/Transactions/HomeMoney/GetCuentaBancaria',

                success: function (response) {

                    console.log('Response GetCuentaBancaria');
                    console.log(response);

                    if (($.isEmptyObject(response)) == false) {
                        if (response != null) {
                            if (response.data.ListCuentaBancaria != null) {
                                if (response.data.ListCuentaBancaria.length > 0) {
                                    that.populateGridCuentaBancaria(response.data.ListCuentaBancaria);
                                } else {
                                    that.populateGridCuentaBancaria(null);
                                }
                            } else {
                                that.populateGridCuentaBancaria(null);
                            }
                        }
                    }
                },
                error: function (msger) {
                    console.log('Error GetCuentaBancaria ' + msger);
                }

            });

        },
        populateGridCuentaBancaria: function (Lista) {
            var that = this;
            var controls = that.getControls();

            $('#tbPackageListCuentaBancaria').find('tbody').html('');

            var table = $('#tbPackageListCuentaBancaria').DataTable();
            table.clear().draw();

            $('#tbPackageListCuentaBancaria').DataTable({
                "scrollY": "100%",
                "scrollCollapse": true,
                "paging": true,
                "searching": true,
                "destroy": true,
                "scrollX": true,
                "sScrollX": "100%",
                "sScrollXInner": "100%",
                "autoWidth": true,
                "order": [[1, "desc"]],
                "lengthMenu": [[10, 15, 20, 25, -1], [10, 15, 20, 25, "Todos"]],
                data: Lista,              
                columns: [
                    {
                        "data": "banco"
                    },
                    {
                        "data": "numero_cuenta"
                    },
                    {
                        "data": "nombre_titular",                        
                    },
                    {
                        "data": "tipomoneda",                       
                    },
                    {
                        "data": "id_cuenta_cliente",
                        "render":
                function (data, type, row, meta) {

                    if (type === 'display') {

                        data = '<center><button type="button" id=' + "btn" + row.id_cuenta_cliente + ' onclick="alert(\'Funcionalidad eliminar en desarrollo\')"' + 'class="btn btn-danger btn-sm" title="Eliminar"> <i class="glyphicon glyphicon-remove"></i>   </button> </center>';

                    }
                    return data;
                }
                    },
                ],
                language: {
                    "sProcessing": "Procesando...",
                    "sLengthMenu": "Mostrar _MENU_ registros",
                    "sZeroRecords": "No se encontraron resultados",
                    "sEmptyTable": "Ningún dato disponible en esta tabla",
                    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix": "",
                    "sSearch": "Buscar:",
                    "sUrl": "",
                    "sInfoThousands": ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                },

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
    $.fn.ContenedorMisCuentasBancarias = function () {
        var option = arguments[0],
            args = arguments,
            value,
            allowedMethods = [];

        this.each(function () {

            var $this = $(this),
                data = $this.data('ContenedorMisCuentasBancarias'),
                options = $.extend({}, $.fn.ContenedorMisCuentasBancarias.defaults,
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
    $.fn.ContenedorMisCuentasBancarias.defaults = {}
    $('#ContenedorMisCuentasBancarias').ContenedorMisCuentasBancarias();
})(jQuery);
