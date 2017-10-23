/**
 * Created by domea on 17-6-2.
 */
'use strict';
(function(root){
    require(["config"], function(config){
        requirejs.config(config);
        require(['app/ui/main','domReady!'], function(ui){
            ui.test();
        });
    });
})(this);