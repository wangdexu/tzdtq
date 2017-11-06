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
    this.dialogWidth = null;
    this.dialogHeight = null;
    this.defaultCloseFunc = null;
    this.buttonGroups = [];
    this.isButtonGroupsAfter = true;
    this.operatePosition = "bottom";
    this.isDragable = false;
    this.singleButtons = [{id:"closeButId",name:"关闭",callback:function(){return true}},{id:"sureButId",name:"确认",callback:function(){return true}}];
    this.init();
  }

NoModal.DEFAULTS = {
    width: 550,
    height: 180
} 
NoModal.prototype.init = function() {
	//nomodal-operation
	this.$element.addClass("nomodal");
	var noDialogHtml = ['<div class="nomodal-dialog" >',
			'<div class="nomodal-content">',
				'<div class="nomodal-header">',
					'<button type="button" class="close">&times;</button>',
					'<h4 class="nomodal-title">选择人员</h4>',
				'</div>',
				'<div class="nomodal-operation">',
				    '<div class="nomodal-operation-left">',
				    '</div>',
				    '<div class="nomodal-operation-right">',
				    '</div>',
			   '</div>',
				'<div class="nomodal-body">',
	            '</div>',
				'<div class="nomodal-footer">',
				     '<div class="nomodal-footer-left">',
				    '</div>',
				    '<div class="nomodal-footer-right">',
				    '</div>',
				'</div>',
			'</div></div>'].join('');
	this.$dialog = $(noDialogHtml);
	this.$dialogBody = this.$dialog.find(".nomodal-body");
	this.$dialogBody.addClass("mCustomScrollbar").data("mcsTheme","dark");
	this.$title = this.$dialog.find(".nomodal-title");
	this.$buttonSection = this.$dialog.find(".nomodal-footer");
	this.$element.append(this.$dialog);
	this.$body.append(this.$element);
}

NoModal.prototype.show = function (args) {
	if (this.isShown) return;
    var content = args["content"];
    var width = args["width"];
    var height = args["height"];
    var title = args["title"];
    var beforeShowFunc = args["beforeShowFunc"];
    var zIndex = args["zIndex"];
    var buttonGroupsPar = args["buttonGroups"];
    var singleButtonsPar = args["singleButtons"];
    var defaultCloseFuncPar =args["defaultCloseFunc"];
    var isButtonGroupsAfterPar = args["isButtonGroupsAfter"];
    var operatePositionPar = args["operatePosition"];
    var isDragablePar =args["isDragable"];
    if (width) {
    	this.dialogWidth = width;
    }
    if (height) {
    	this.dialogHeight = height;
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
    if (singleButtonsPar) {
    	this.singleButtons = singleButtonsPar;
    }
    if (defaultCloseFuncPar) {
    	this.defaultCloseFunc = defaultCloseFuncPar;
    }    
    if (operatePositionPar) {
    	this.operatePosition = operatePositionPar;
    }
    if (this.operatePosition == "top") {
    	this.$buttonSection = this.$dialog.find(".nomodal-operation");
      	this.$buttonSection.show();
        this.$dialog.find(".nomodal-footer").hide();
	} else {
	  	this.$buttonSection.show();
        this.$dialog.find(".nomodal-operation").hide();
	}
	if (buttonGroupsPar) {
		this.buttonGroups = buttonGroupsPar;
	}
    this.isButtonGroupsAfter = typeof isButtonGroupsAfterPar == "undefined"?  true:isButtonGroupsAfterPar;
    this.isDragable = typeof isDragablePar == "undefined"?  false:isDragablePar;
    this.originalHeight = this.dialogHeight - 115;
    this.orginalWidth = this.dialogWidth;
    var that = this;
    
    this.singleButtons.sort(function(obj1, obj2){
    	var order1 = typeof obj1["order"] == "undefined" ? 0 : obj1["order"];
    	var order2 = typeof obj2["order"] == "undefined" ? 0 : obj2["order"];
    	if (order1  < order2) {
    	    return -1;
    	}
    	if (order1  > order2) {
    	    return 1;
    	}
    	return 0;    	
    });  
    this.leftSingleButtonArray = [];
    this.rightSingleButtonArray = [];
    $.each(this.singleButtons, function(i,e) {
    	var $but = $('<button type="button" class="btn  btn-info btn-sm"></button>');
    	$but.attr("id",e["id"] + "_" + that.$element.attr("id"));
    	$but.text(e["name"]);
    	$but.click("click",function(butEle) {
		    var isHide = true;
		    if (e["callback"]) {
		    	isHide = e["callback"]();
		    }
		    if (isHide) {
		    	that.hide();
		    }
	    });
	    $but.data("halign",e["halign"]);
	    if (e["halign"] == "left") {
	        that.leftSingleButtonArray.push($but);	
	    } else {
	        that.rightSingleButtonArray.push($but);
	    }
    });
    
    this.leftButtonGroupsArray = [];
    this.rightButtonGroupsArray = [];
    
    if (this.buttonGroups.length > 0) {
    	this.buttonGroups.sort(function(obj1, obj2){
    	  var order1 = typeof obj1["order"] == "undefined" ? 0 : obj1["order"];
    	  var order2 = typeof obj2["order"] == "undefined" ? 0 : obj2["order"];
    	  if (order1  < order2) {
    	     return -1;
    	  }
    	  if (order1  > order2) {
    	     return 1;
    	  }
    	  return 0;    	
        }); 
    	$.each(this.buttonGroups, function(i,e) {
    		var buttonGroupHtml = ['<div class="btn-group  dropup" style="margin-left: 4px;margin-right: 3px;">',
							          '<button type="button" class="btn  btn-info btn-sm">更多操作</button>',
							          '<button type="button" class="btn  btn-info btn-sm dropdown-toggle" data-toggle="dropdown">',
							              '<span class="caret"></span>',
							             '<span class="sr-only">切换下拉菜单</span>',
							          '</button>',
							          '<ul class="dropdown-menu dropdown-menu-right" role="menu">',
							          '</ul>',
						        '</div>'].join('');
		     var $buttonGroup = $(buttonGroupHtml);
		     var $ulGroup = $buttonGroup.find("ul");
		     $buttonGroup.attr("id",e["id"] + "_" + that.$element.attr("id"));
		     $buttonGroup.find("button").first().text(e["name"]);
		     $buttonGroup.data("halign",e["halign"]);
	         if (e["halign"] == "left") {
	            that.leftButtonGroupsArray.push($buttonGroup);
	            $ulGroup.removeClass("dropdown-menu-right");
	         } else {
	    	    that.rightButtonGroupsArray.push($buttonGroup);
	         }
		     if (that.operatePosition == "top") {
			    $buttonGroup.removeClass("dropup");
		     }
		     
		     e.buttons.sort(function(obj1, obj2){
    	       var order1 = typeof obj1["order"] == "undefined" ? 0 : obj1["order"];
    	       var order2 = typeof obj2["order"] == "undefined" ? 0 : obj2["order"];
    	       if (order1  < order2) {
    	         return -1;
    	       }
    	       if (order1  > order2) {
    	         return 1;
    	       }
    	      return 0;    	
            }); 
        
		     $.each(e.buttons,function(i,buttonEle) {
			    var dropDownButHtml = ['<li role="presentation">',
							         '<a role="menuitem" tabindex="-1" href="javascript:void(0);"></a>',
							      '</li>',
							     ].join('');
			    var $dropDownBut = $(dropDownButHtml);
			    $dropDownBut.find("a").attr("id",buttonEle["id"] + "_" + that.$element.attr("id")).text(buttonEle["name"]).click(function(drowDownButEle){
				      var isHide = true;
		              if (buttonEle["callback"]) {
		    	          isHide = buttonEle["callback"]();
		              }
		              if (isHide) {
		    	         that.hide();
		              }
			    });
			    $ulGroup.append($dropDownBut);
		   });                                                          
    	});
    }
    
	this.$element.css("z-index",this.zIndex);
    this.$element.on('click', function(event){
		 var target = $(event.target);
		 var classList = target.attr('class') ? target.attr('class').split(' ') : [];
         if (classList.indexOf('close') != -1) {
			var isClose = true;
			if (that.defaultCloseFunc)  {
				isClose = that.defaultCloseFunc();
			}
			if (isClose) {
				that.hide();
			}
		 }    	   
	});
    if (beforeShowFunc) {
    	beforeShowFunc();
    }
    this.$dialogBody.css("width",this.orginalWidth +"px").css("height",this.originalHeight + "px");
    if (this.isDragable) {
       this.$element.draggable();
    }
    this.$element.show();
    this.isShown = true;
    this.adjustDialog({currentWidth:$(window).width(),currentHeight:$(window).height()});
    this.$dialogBody.mCustomScrollbar({axis:"y",autoHideScrollbar:true,autoExpandScrollbar:true});
    this.adjustOperationBut();
   
}


NoModal.prototype.adjustOperationBut = function() {
	
	var that = this;
	var currentWidth = parseInt(this.$element.css("width"));
	if (that.operatePosition == "top") {
	  this.$leftButtonSection = this.$dialog.find(".nomodal-operation-left");
	  this.$rightButtonSection = this.$dialog.find(".nomodal-operation-right");
	} else {
	  this.$leftButtonSection = this.$dialog.find(".nomodal-footer-left");
	  this.$rightButtonSection = this.$dialog.find(".nomodal-footer-right");
	}
	this.$leftButtonSection.css("width",(currentWidth/2) + "px");
	this.$rightButtonSection.css("left",(currentWidth/2) + "px");
	this.$rightButtonSection.css("width",(currentWidth/2 - 15) + "px");
	
	var hasLeftBut = false;
	$.each(this.leftSingleButtonArray, function(i,e) {
		that.$leftButtonSection.append(e); 
		hasLeftBut = true;
    });
    
    $.each(this.leftButtonGroupsArray, function(i,e) {  
    	that.$leftButtonSection.append(e);    
    	hasLeftBut = true;
    });
    
    $.each(this.rightSingleButtonArray, function(i,e) {
		that.$rightButtonSection.append(e);                    
    });
    
    $.each(this.rightButtonGroupsArray, function(i,e) {  
    	that.$rightButtonSection.append(e);                                                          
    });
    
    if (!hasLeftBut) {
    	this.$rightButtonSection.css("margin-top","0px");
    }
    
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
		     	 var isAdjustCor = typeof args["isAdjustCor"] == "undefined" ? true:args["isAdjustCor"];
		     	 var left = 0;
		     	 var right = 0;
		     	 if (offsetWidth > this.dialogWidth) {
		     	 	left = right = (offsetWidth - this.dialogWidth)/2;
		     	 	this.$element.css("width",this.dialogWidth+"px");
		     	 	this.$dialogBody.css("width",this.dialogWidth+"px");
		     	 } else {
		     	 	this.$element.css("width",offsetWidth+"px");
		     	 	this.$dialogBody.css("width",offsetWidth+"px");
		     	 }
		     	 if (isAdjustCor) {
		     	    this.$element.css("left",left+"px").css("right",right+"px");
		     	 }
		     	 
		     	 var top = 0;
		     	 var bottom = 0;
		     	 if (offsetHeight > this.dialogHeight ) {
		     	 	top = bottom = (offsetHeight - this.dialogHeight)/2;
		     	 	this.$element.css("height",this.dialogHeight+"px");
		     	 	this.$dialogBody.css("height",(this.dialogHeight - 115)+"px");
		     	 }  else {
		     	 	this.$element.css("height",offsetHeight+"px");
		     	 	this.$dialogBody.css("height",(offsetHeight - 115)+"px");
		     	 }
		     	 if (isAdjustCor) {
		     	    this.$element.css("top",top+"px");	
		     	 }
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
	$(".nomodal-body.mCustomScrollbar")[0].style.height = "120px";
}
window.noModalService  = NoModalService

$(window).resize(function() {
      $(document.body).find(".nomodal").each(function(i,e) {
      	     $(e).nomodal("adjustDialog",{currentWidth:$(window).width(),currentHeight:$(window).height(),isAdjustCor:true});
      	     $(e).nomodal("adjustOperationBut");
      });
});


}(jQuery);
