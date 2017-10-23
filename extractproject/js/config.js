/**
 * Created by domea on 17-6-2.
 */
'use strict';
define({
    packages: [],
    // urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl:'js/',
    paths: {
        "jquery": '../libs/jquery/dist/jquery',
        "bootstrap":'../libs/bootstrap/dist/js/bootstrap',
        'dhtmlx':'../libs/dhtmlx/codebase/dhtmlx',
        'domReady':'../libs/domReady/domReady',
        'text':'../libs/text/text',
        //'vue':'../libs/vue/dist/vue',
        "ol":'../libs/openlayers/v4.1.1-dist/ol-debug'

    },
    shim: {
        'bootstrap':{
            deps:[
                'jquery',
                'text!../libs/bootstrap/dist/css/bootstrap.css',
                'text!../libs/bootstrap/dist/css/bootstrap-theme.css'
            ]
        },
        'dhtmlx':{
            deps:['text!../libs/dhtmlx/codebase/dhtmlx.css']
        },
        'ol':{
            deps:['text!../libs/openlayers/v4.1.1-dist/ol.css']
        }
    }
});