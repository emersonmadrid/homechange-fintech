/**
 * ============================================================================
 * MODELO (Lógica de Negocio)
 * No tiene conocimiento del DOM (HTML) ni de jQuery.
 * Totalmente testeable y reutilizable.
 * ============================================================================
 */
class CalculadoraCambio {
    constructor() {
        this.precioCompra = 0.0;
        this.precioVenta = 0.0;
        this.tipoCambioMoneda = 0; // 0: SOLES->DOLARES, 1: DOLARES->SOLES
    }

    setTiposCambio(compra, venta) {
        this.precioCompra = parseFloat(compra);
        this.precioVenta = parseFloat(venta);
    }

    toggleMoneda() {
        this.tipoCambioMoneda = this.tipoCambioMoneda === 0 ? 1 : 0;
    }

    calcularDesdeEnvio(montoEntrada) {
        if (!this.isValid(montoEntrada)) return "";
        const monto = parseFloat(montoEntrada);
        
        if (this.tipoCambioMoneda === 0) {
            // SOLES A DOLARES
            return this.round(monto / this.precioVenta);
        } else {
            // DOLARES A SOLES
            return this.round(monto * this.precioCompra);
        }
    }

    calcularDesdeRecibo(montoSalida) {
        if (!this.isValid(montoSalida)) return "";
        const monto = parseFloat(montoSalida);
        
        if (this.tipoCambioMoneda === 0) {
            // SOLES A DOLARES (Inverso)
            return this.round(monto * this.precioVenta);
        } else {
            // DOLARES A SOLES (Inverso)
            return this.round(monto / this.precioCompra);
        }
    }

    isValid(val) {
        const preg = /^([0-9]+\.?[0-9]{0,2})$/;
        return preg.test(val);
    }

    round(num) {
        if (isNaN(num) || !isFinite(num)) return "";
        return +(Math.round(num + "e+2") + "e-2");
    }
}

/**
 * ============================================================================
 * CONTROLADOR (Vista/Eventos)
 * Se encarga estrictamente de escuchar eventos del DOM e invocar al Modelo.
 * ============================================================================
 */
(function ($, undefined) {
    'use strict';
    
    var Form = function ($element, options) {
        $.extend(this, $.fn.ContenedorCambiarAhora.defaults, $element.data(), typeof options == 'object' && options);
        this.setControls({
            form: $element,
            hdidPerfilUsuario: $('#hdidPerfilUsuario', $element),
            idprecioVenta: $('#idprecioVenta', $element),
            idprecioCompra: $('#idprecioCompra', $element),
            idcambiar: $('#idcambiar', $element),
            idresultado: $('#idresultado', $element),
            btncambiarAhora: $('#btncambiarAhora', $element),
            textoPen: $('#textoPen', $element),
            textoUss: $('#textoUss', $element),
            btncambiarMoneda: $('#btncambiarMoneda', $element),
        });

        // Instancia del Modelo de Negocio (Desacoplado)
        this.calculadora = new CalculadoraCambio();
    };
    
    Form.prototype = {
        constructor: Form,
        init: function () {
            var that = this,
                controls = that.getControls();
                
            controls.idcambiar.on('keyup', function(e) { that.keyupCambiar(this, e); });
            controls.idresultado.on('keyup', function(e) { that.keyupResultado(this, e); });
            controls.btncambiarAhora.on('click', function(e) { that.btncambiarAhora_click(this, e); });
            controls.btncambiarMoneda.on('click', function(e) { that.btncambiarMoneda_click(this, e); });
            
            that.render();
        },
        
        render: function () {
            this.GetTipo_Cambio();
        },

        setCambiarAhora: function (montoEntrada) {
            var that = this;
            var obj = {
                monto: montoEntrada,
                tipo: that.calculadora.tipoCambioMoneda
            };
            
            // CSRF Token para peticiones seguras
            var token = $('input[name="__RequestVerificationToken"]').val();
            
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                async: false,
                headers: {
                    'RequestVerificationToken': token
                },
                url: '/Transactions/HomeMoney/registrarMonto',
                // data: JSON.stringify(obj), // Faltaba enviar data si es necesario
                success: function (data) {
                    if (data && data.estado) {
                        window.location.href = '/Transactions/HomeMoney/cuentas';
                    } else {
                        window.location.href = uri + 'inicioRegistro'; // uri debe estar definido globalmente
                    }
                },
                error: function (msger) {
                    console.log('Error cuentas ', msger);
                }
            });
        },

        // Eventos DOM
        btncambiarMoneda_click: function () {
            var controls = this.getControls();
            
            this.calculadora.toggleMoneda();
            
            // Recalcular
            var tempValue = controls.idcambiar.val();
            if (tempValue !== "") {
                controls.idresultado.val(this.calculadora.calcularDesdeEnvio(tempValue));
            }
            
            this.actualizarValoresMoneda();
        },

        btncambiarAhora_click: function () {
            var controls = this.getControls();
            var montoEntrada = controls.idcambiar.val();
            
            if (montoEntrada > 0 && this.calculadora.tipoCambioMoneda != null) {
                this.setCambiarAhora(montoEntrada);
            } else {
                alert("Ingrese monto para continuar");
            }
        },
        
        keyupCambiar: function () {
            var controls = this.getControls();
            var tempValue = controls.idcambiar.val();
            
            if (tempValue === "") {
                controls.idresultado.val("");
            } else if (this.calculadora.isValid(tempValue)) {
                controls.idresultado.val(this.calculadora.calcularDesdeEnvio(tempValue));
            }
        },

        keyupResultado: function () {
            var controls = this.getControls();
            var tempValue = controls.idresultado.val();
            
            if (tempValue === "") {
                controls.idcambiar.val("");
            } else if (this.calculadora.isValid(tempValue)) {
                controls.idcambiar.val(this.calculadora.calcularDesdeRecibo(tempValue));
            }
        },

        actualizarValoresMoneda: function () {
            var controls = this.getControls();
            var htmlIn = "ENVÍAS SOLES";
            var htmlOut = "RECIBES DOLARES";
            
            if (this.calculadora.tipoCambioMoneda === 1) {
                htmlIn = "ENVÍAS DOLARES";
                htmlOut = "RECIBES SOLES";
            }
            
            controls.textoPen.text(htmlIn);
            controls.textoUss.text(htmlOut);
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
                async: false,
                url: '/Transactions/HomeMoney/GetTipo_Cambio',
                success: function (response) {
                    // Programación Defensiva: Validar que la estructura del JSON es la esperada
                    if (response && response.data && response.data.ListTipo_Cambio && response.data.ListTipo_Cambio.length > 0) {
                        var tipoCambio = response.data.ListTipo_Cambio[0];
                        
                        var montoVenta = tipoCambio.monto_venta ? tipoCambio.monto_venta.replace(/,/g, '.') : "0";
                        var montoCompra = tipoCambio.monto_compra ? tipoCambio.monto_compra.replace(/,/g, '.') : "0";
                        
                        // Actualizar DOM
                        controls.idprecioVenta.text(montoVenta);
                        controls.idprecioCompra.text(montoCompra);
                        
                        // Actualizar Modelo
                        that.calculadora.setTiposCambio(montoCompra, montoVenta);
                    } else {
                        console.warn("La estructura JSON del tipo de cambio ha cambiado o no hay datos.");
                    }
                },
                error: function (msger) {
                    console.error('Error GetTipo_Cambio', msger);
                }
            });
        },

        getControls: function () { return this.m_controls || {}; },
        setControls: function (value) { this.m_controls = value; },
        strUrl: window.location.protocol + '//' + window.location.host
    };
    
    $.fn.ContenedorCambiarAhora = function () {
        var option = arguments[0],
            args = arguments,
            value,
            allowedMethods = [];

        this.each(function () {
            var $this = $(this),
                data = $this.data('ContenedorCambiarAhora'),
                options = $.extend({}, $.fn.ContenedorCambiarAhora.defaults, $this.data(), typeof option === 'object' && option);

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
    
    $.fn.ContenedorCambiarAhora.defaults = {};
    $('#ContenedorCambiarAhora').ContenedorCambiarAhora();
})(jQuery);
