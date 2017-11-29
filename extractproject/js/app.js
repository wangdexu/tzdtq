/**
 * Created by domea on 17-6-2.
 */
'use strict';
(function(root){
    require(["config"], function(config){
        requirejs.config(config);
        window.restUrl = 'http://192.168.31.233:5000/';
        window.projectUrl = 'http://192.168.31.230:5000/';
        window.dataurl = 'http://192.168.4.221:2666';
        require(['app/ui/main','domReady!'], function(ui){
            ui.test();
        });
    });
})(this);