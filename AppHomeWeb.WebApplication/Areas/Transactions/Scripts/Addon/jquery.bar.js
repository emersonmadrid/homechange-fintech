(function ($) {

    $.fn.bar = function (options) {
        var opts = $.extend({}, $.fn.bar.defaults, options);
        return this.each(function () {

            $this = $(this);
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

            if ($('.jbar').length) $.fn.bar.removebar();

            if (o.hide) timeout = setTimeout('$.fn.bar.removebar()', o.time);

            switch (o.type) {
                case 'success':
                    o.icon = o.icon || 'ok';
                    o.header = o.header || '&Eacute;xito';
                    o.message = o.message || '&Eacute;xito';
                    break;
                case 'info':
                    o.icon = o.icon || 'info-sign';
                    o.header = o.header || 'Informaci&oacute;n';
                    o.message = o.message || 'Informaci&oacute;n';
                    break;
                case 'warning':
                    o.icon = o.icon || 'warning-sign';
                    o.header = o.header || 'Alerta';
                    o.message = o.message || 'Alerta';
                    break;
                case 'danger':
                    o.icon = o.icon || 'remove';
                    o.header = o.header || 'Error';
                    o.message = o.message || 'Error';
                    break;
                default:
                    break;
            }

            var _message_span = $(document.createElement('span')).addClass('jbar-content').empty().append("<i class='glyphicon glyphicon-" + o.icon + "'></i> <strong>" + o.header + "!</strong> " + o.message);
            _message_span.css({ "color": o.color });

            var _wrap_bar;

            if (o.fixed) {

                (o.position == 'bottom') ?
                _wrap_bar = $(document.createElement('div')).addClass(o.noremove + ' jbar-bottom') :
                _wrap_bar = $(document.createElement('div')).addClass(o.noremove + ' jbar-top-fixed');
                _wrap_bar.css({ "position": "fixed", "left": "auto", "right": "auto", "z-index": "2" });

            } else {

                (o.position == 'bottom') ?
                _wrap_bar = $(document.createElement('div')).addClass(o.noremove + ' jbar-bottom') :
                _wrap_bar = $(document.createElement('div')).addClass(o.noremove + ' jbar-top');
                _wrap_bar.css({ "position": "absolute", "left": "0", "right": "0" });

            }

            _wrap_bar.css({ "background-color": o.background_color, "border-color": o.border_color });

            if (o.removebutton) {
                var _remove_cross = $(document.createElement('button')).addClass('close').append('<i class="ace-icon fa fa-times"></i>');
                _remove_cross.click(function (e) { $.fn.bar.removebar(); })
            }
            else {
                _wrap_bar.css({ "cursor": "pointer" });
                _wrap_bar.click(function (e) { $.fn.bar.removebar(); })
            }
            _wrap_bar.append(_message_span).append(_remove_cross).hide().appendTo($this).slideDown('fast');

            if (o.complete && typeof (o.complete) === "function") o.complete();

        });
    };
    var timeout;
    $.fn.bar.removebar = function () {
        if ($('.jbar').length) {
            clearTimeout(timeout);
            $('.jbar').slideUp('fast', function () {
                $(this).remove();
            });

        }
    };
    $.fn.bar.defaults = {
        background_color: '#FFFFFF',
        border_color: '#FFF',
        color: '#000',
        position: 'top',
        removebutton: false,
        noremove: 'jbar',
        hide: true,
        time: 5000,
        type: 'success',
        icon: undefined,
        header: undefined,
        fixed: false
    };

})(jQuery);