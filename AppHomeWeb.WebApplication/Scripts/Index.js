console.log('Hola');
(function ($, undefined) {
    'use strict';
    var Form = function ($element, options) {
        $.extend(this, $.fn.ContenedorIndex.defaults, $element.data(), typeof options == 'object' && options);
        this.setControls({
            form: $element,
            idprecioVenta: $('#idprecioVenta', $element),
            idprecioCompra: $('#idprecioCompra', $element)
                 
        });
    };
    Form.prototype = {
        constructor: Form,
        init: function () {
            var that = this,
            controls = that.getControls();
            console.log('Init');
         
            that.render();
        },
        render: function () {
            var that = this,
                controls = that.getControls();
            that.GetTipo_Cambio();
          
            

        },
        SaveSubscription_click: function (sender, args) {

            var that = this,
            controls = that.getControls();

            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                //data: JSON.stringify(parameters),
                async: false,
                url: '/Transactions/HomeMoney/GetPrueba',
                success: function (response) {
                    console.log('Response GetTipo_Cambio');
                    console.log(response);                    
                },
                error: function (msger) {
                    console.log('Error GetTipo_Cambio ' + msger);
                }

            });
        },
        GetTipo_Cambio: function () {

            var that = this,
                controls = that.getControls();

            controls.idprecioVenta.text('');
            controls.idprecioCompra.text('');


            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                //data: JSON.stringify(parameters),
                async: false,
                url: '/Transactions/HomeMoney/GetTipo_Cambio',
                success: function (response) {

                    console.log('Response GetTipo_Cambio');
                    console.log(response);

                    if (response.data.ListTipo_Cambio.length != null) {
                        if (response.data.ListTipo_Cambio.length > 0) {

                            controls.idprecioVenta.text(response.data.ListTipo_Cambio[0].monto_venta);
                            controls.idprecioCompra.text(response.data.ListTipo_Cambio[0].monto_compra);
                        }
                    }
                },
                error: function (msger) {
                    console.log('Error GetTipo_Cambio ' + msger);
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
    $.fn.ContenedorIndex = function () {
        var option = arguments[0],
            args = arguments,
            value,
            allowedMethods = [];

        this.each(function () {

            var $this = $(this),
                data = $this.data('ContenedorIndex'),
                options = $.extend({}, $.fn.ContenedorIndex.defaults,
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

                var timeReady = setInterval(function () {
                    if (!!$.fn.addEvent) {
                        clearInterval(timeReady);
                        data.init();
                    }
                }, 100);

                if (args[1]) {
                    value = data[args[1]].apply(data, [].slice.call(args, 2));
                }
            }
        });

        return value || this;
    };
    $.fn.ContenedorIndex.defaults = {}
    $('#ContenedorIndex').ContenedorIndex();
})(jQuery);