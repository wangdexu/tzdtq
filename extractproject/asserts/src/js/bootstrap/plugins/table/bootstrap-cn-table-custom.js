
(function ($) {
    'use strict';

    $.fn.bootstrapTable.locales['zh-CN'] = {
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return '总共 ' + totalRows + ' 条记录';
        }
    };

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);

})(jQuery);