(function ($, undefined) {
    'use strict';
    var Form = function ($element, options) {
        $.extend(this, $.fn.ContenedorOrdenCliente.defaults, $element.data(), typeof options == 'object' && options);
        this.setControls({
            form: $element,
            hdidPerfilUsuario: $('#hdidPerfilUsuario', $element)
        });
    };
    Form.prototype = {
        constructor: Form,
        init: function () {
            var that = this,
            controls = that.getControls();
            console.log('Orden Cliente');
            that.render();
        },
        render: function () {
            var that = this,
                controls = that.getControls();
            that.GetOrdenCliente();
        },
        GetOrdenCliente: function () {

            var that = this,
            controls = that.getControls();

            var loadTable = '';
            loadTable = loadTable + '<tr>';
            loadTable = loadTable + '<td colspan="6" style="text-align: center;"><div style="padding: 30px 30px 10px 30px;"><img src="/Areas/Transactions/Images/loading.gif" height="45" width="45" /></div></td>';
            loadTable = loadTable + '</tr>';
            $('#tbPackageBodyList').html(loadTable);


            var idperfilusuario= controls.hdidPerfilUsuario.val();
            var varEnt_Orden_BE = {
                id_usuario_perfil: idperfilusuario
            };            

            var objEnt_Orden_BE = {
                Ent_Orden_BE: varEnt_Orden_BE
            }
            console.log('Request GetOrdenCliente');
            console.log(objEnt_Orden_BE);

            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(objEnt_Orden_BE),
                //async: false,
                url: '/Transactions/HomeMoney/GetOrdenCliente',

                success: function (response) {

                    console.log('Response GetOrdenCliente');
                    console.log(response);

                    if (($.isEmptyObject(response)) == false) {
                        if (response != null) {
                            if (response.data.ListOrdenCliente != null) {
                                if (response.data.ListOrdenCliente.length > 0) {
                                    that.populateGridOrden(response.data.ListOrdenCliente);
                                } else {
                                    that.populateGridOrden(null);
                                }
                            } else {
                                that.populateGridOrden(null);
                            }
                        }
                    }
                },
                error: function (msger) {
                    console.log('Error GetOrdenCliente ' + msger);
                }

            });

        },
        populateGridOrden: function (Lista) {
            var that = this;
            var controls = that.getControls();

            $('#tbPackageList').find('tbody').html('');

            var table = $('#tbPackageList').DataTable();
            table.clear().draw();

            $('#tbPackageList').DataTable({
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
                createdRow: function(row, data, dataIndex) {
                    var a = $(row).find('td:eq(5)').html();
                    $(row).attr('data-status', a);
                },	
                columns: [
                    {
                        "data": "numero_orden"
                    },
                    {
                        "data": "fecha_registro"
                    },
                    {
                        "data": "monto_envio",                        
                        "render":
                 function (data, type, row, meta) {                   
                  
                     if (type === 'display') {
                     
                         data = '<span class="pull-right">' + row.monto_envio + '</span>';

                     }
                     return data;}
               
                    },
                    {
                        "data": "monto_recibido",
                        "render":
                 function (data, type, row, meta) {

                     if (type === 'display') {

                         data = '<span class="pull-right">' + row.monto_recibido + '</span>';

                     }
                     return data;
                 }
                    },
                    {
                        "data": "tipo_cambio",
                        "render":
                function (data, type, row, meta) {

                    if (type === 'display') {

                        data = '<span class="pull-right">' + row.tipo_cambio + '</span>';

                    }
                    return data;
                }
                    },
                    {
                        "data": "estado_orden"
                 //       ,
                 //       "render":
                 //function (data, type, row, meta) {                   
                  
                 //  if (type === 'display') {
                     
                 //      data = ' <span class="pull-right cancelado">' + row.estado_orden + '</span>';

                 //  }
                 //  return data;
               //}
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
    $.fn.ContenedorOrdenCliente = function () {
        var option = arguments[0],
            args = arguments,
            value,
            allowedMethods = [];

        this.each(function () {

            var $this = $(this),
                data = $this.data('ContenedorOrdenCliente'),
                options = $.extend({}, $.fn.ContenedorOrdenCliente.defaults,
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
    $.fn.ContenedorOrdenCliente.defaults = {}
    $('#ContenedorOrdenCliente').ContenedorOrdenCliente();
})(jQuery);
