+function ($) {
  'use strict';
  var NoModal = function (element, options) {
    this.options             = options;
    this.$body               = $(document.body);
    this.$element            = $(element);
    this.isShown             = null;
    this.zIndex = 1024;
    this.orginalWidth = null;
    this.originalHeight = null; 
    this.init();
  }
 
  NoModal.DEFAULTS = {
    width: 550,
    height: 180
  } 
  
  NoModal.prototype.init = function() {
  	this.$element.addClass("nomodal").addClass("mCustomScrollbar").data("mcsTheme","dark");
  	this.orginalWidth = this.options["width"];
  	this.originalHeight = this.options["height"];
  	this.$element.css("width",this.orginalWidth +"px").css("height",this.originalHeight + "px");
  	var noDialogHtml = ['<div class="nomodal-dialog" >',
			'<div class="nomodal-content">',
				'<div class="nomodal-header">',
					'<button type="button" class="close">&times;</button>',
					'<h4 class="nomodal-title">选择人员</h4>',
				'</div>',
				'<div class="nomodal-body">',
	            '</div>',
				'<div class="nomodal-footer">',
					'<button type="button" class="btn btn-white" id="closeButId">关闭</button>',
					'<button type="button" class="btn btn-info" id="saveButId">确定</button>',
				'</div>',
			'</div>'].join('');
	this.$dialog = $(noDialogHtml);
	this.$dialogBody = this.$dialog.find(".nomodal-body");
	this.$title = this.$dialog.find(".nomodal-title");
	this.$buttonSection = this.$dialog.find(".nomodal-footer");
	this.$element.append(this.$dialog);
	var that = this;
	this.$buttonSection.children().each(function(i,e) {
		var id =$(e).attr("id");
		$(e).attr("id",id +"_" + that.$element.attr("id"));
	});
	this.$body.append(this.$element);
  }

NoModal.prototype.show = function (args) {
    if (this.isShown) return;
    var content = args["content"];
    var width = args["width"];
    var height = args["height"];
    var title = args["title"];
    var beforeShowFunc = args["beforeShowFunc"];
    var zIndex = args["zIndex"];;
    if (args) {
    	if (width) {
    		this.orginalWidth = width;
    	}
    	if (height) {
    		this.originalHeight = height;
    	}
    	if (content) {
    		if (typeof content == 'string') {
    		   this.$dialogBody.append($(content));
    		} else if (typeof content == 'function') {
    			this.$dialogBody.append(content());
    		}
    	} 
    	if (title) {
    		this.$title.text(title);
    	}
    	if (zIndex) {
    		this.zIndex = zIndex;
    	}
    }
    var that = this;
    this.isShown = true;
    this.$element.css("z-index",this.zIndex);
    this.$element.on('click', function(event){
		 var target = $(event.target);
		 var classList = target.attr('class') ? target.attr('class').split(' ') : [];
         if (classList.indexOf('close') != -1 || classList.indexOf('closeBut') != -1 ) {
			that.hide();
		 }    	   
	});
	$("#closeButId_" + this.$element.attr("id")).click("click",function(e) {
		 that.hide();
	});
	$("#saveButId_"  + this.$element.attr("id")).click("click",function(e) {
		 that.hide();
    });
    if (beforeShowFunc) {
    	beforeShowFunc();
    }
    this.$element.show();
    this.adjustDialog({currentWidth:$(window).width(),currentHeight:$(window).height()});
    this.$element.mCustomScrollbar({axis:"y",autoHideScrollbar:true,autoExpandScrollbar:true});

}

NoModal.prototype.hide = function () {
    if (!this.isShown) {
    	return;
    }
    this.isShown = false;
    this.$element.off("click");
    this.$element.hide();
    this.$body.find("#" + this.$element.attr("id")).remove();

}

NoModal.prototype.adjustDialog = function (args) {
           	     var offsetHeight = args["currentHeight"];
		     	 var offsetWidth = args["currentWidth"];
		     	 var left = 0;
		     	 var right = 0;
		     	 if (offsetWidth > this.orginalWidth) {
		     	 	left = right = (offsetWidth - this.orginalWidth)/2;
		     	 	this.$element.css("width",this.orginalWidth+"px");
		     	 } else {
		     	 	this.$element.css("width",offsetWidth+"px");
		     	 }
		     	  	
		     	
		     	 this.$element.css("left",left+"px").css("right",right+"px");
		     	 var top = 0;
		     	 var bottom = 0;
		     	 if (offsetHeight > this.originalHeight ) {
		     	 	top = bottom = (offsetHeight - this.originalHeight)/2;
		     	 	this.$element.css("height",this.originalHeight+"px");
		     	 }  else {
		     	 	this.$element.css("height",offsetHeight+"px");
		     	 }
		     	 this.$element.css("top",top+"px");
}

function Plugin(option,args) {
	return this.each(function () {
        var $this   = $(this)
        if ($this.attr("id")) {
        	
        }
        var data    = $this.data('custom.nomodal')
        var options = $.extend({}, NoModal.DEFAULTS, typeof option == 'object' && option)
        if (!data) $this.data('custom.nomodal', (data = new NoModal(this, options)))
        if (typeof option == 'string') {
      	   data[option](args) 
        } else if (options.show) {
      	  data.show(args)
        }
    })
}

$.fn.nomodal         = Plugin
$.fn.nomodal.Constructor = NoModal

function NoModalService(id,option,args) {
	var $noModal = $(document.body).find("#" + id);
	if ($noModal.length <= 0) {
		$noModal = $("<div id=''></div>").attr('id',id);
	}
	$noModal.nomodal(option,args);
}
window.noModalService  = NoModalService

$(window).resize(function() {
      $(document.body).find(".nomodal").each(function(i,e) {
      	     $(e).nomodal("adjustDialog",{currentWidth:$(window).width(),currentHeight:$(window).height()})
      });
});

}(jQuery);
