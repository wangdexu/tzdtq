var folderUrl = "http://www.userdata.geovis.ai/user_data/favorites/getFavoritesinfobyParentID";
var baseUrl = "http://192.168.4.221:8283/";
//上传地址
var url = "http://192.168.4.3:8808/image-service/manager/sliceUpload.action";
// 通知地址
var checkUrl = "http://192.168.4.3:8808/image-service/manager/sliceCheck.action";
//合并地址
var unifyUrl = "http://192.168.4.3:8808/image-service/manager/sliceUnify.action";
var tempData;
var tempId;

define(['jquery','dhtmlx','ol','../scheme/scheme'],function($,dhl,ol,scheme){
    var _showProjectDialog = function (){
    //    scheme.clearMap();
       function getFormContent() {
            return $("#formTemplate").html();
        }
        var singleButtons = [];
        singleButtons.push({id:"startIncButId",name:"确定",order:2,halign:"right",callback:function(){loadleftTree();return false}});
        singleButtons.push({id:"sendMessageButId",name:"取消",order:1,halign:"right",callback:function(){cancelNet();return false}}); 
        var showPar = {
            zIndex:1024,
            width:500,
            height:510,  
            title:'文件目录',
            content:getFormContent,
            singleButtons:singleButtons,
            isButtonGroupsAfter:true,
            operatePosition:"bottom",
            isDragable:true
        }
        noModalService("modal-9","show",showPar);
        $(".nomodal-body.mCustomScrollbar")[0].style.height='429px';
        $(".nomodal-body.mCustomScrollbar")[0].style.background='#ffffff';
        $("#mCSB_1_container")[0].style.height='419px';
        loadTree();
        clickTree();
    }
    function loadleftTree(){
        event.stopPropagation();
        var ids = tempId;
        //获取任务目录
        $.ajax({
            url:baseUrl+"api/fs/listbydirid/"+ids,
            type:"get",
            data:"",
            async: false,
            success:function(childdata){
                    $("#jstreeDiv").empty();
                    var childData = childdata;
                    
                    childData.forEach(function (c){
                        if(c.type == "dir"){
                            $('<li class="nav_item clearfix wjj_leftbs" id="' + c.id + '" title="' + c.path + '" data-pid="' + c.id + '"  data-id="' + c.id + '" data-type="0">' +
                                '<i></i>' +
                                '<u></u>' +
                                '<p style="color:black">' + c.path + '</p>' +
                                '<div id="par' + c.id + '" class="nav_item_sWrap clearfix"></div>' +
                                '</li>').appendTo($("#jstreeDiv"));
                        }else{
                            var fileType = c.path.substring(c.path.lastIndexOf(".")+1);
                            if(fileType=="tiff"||fileType=="tif"){
                                $('<li style="margin-left: 20px;" class="nav_item clearfix wjj_leftbs" data-text="'+c.path+'" data-type="'+c.type+'" data-url="'+c.url+'" title="' + c.path + '" data-pid="' + c.id + '"  data-id="' + c.id + '" data-type="1">' +
                                    //'<i></i>' +
                                    //'<u></u>' +
                                '<input  type="checkbox" class="last_level"/>'+
                                '<p style="color:black">' + c.path + '</p>' +
                                '<div id="par' + c.id + '" class="nav_item_sWrap clearfix"></div>' +
                                '</li>').appendTo($("#jstreeDiv"));
                            }
                        }
                   });
            },
            error: function (e) {
                if(e.status == "401"){
                    getSession();
                }
            }
        });
        clickLeftTree();
    }
    function clickLeftTree(){
        // 文件夹点击展开
	    $("#jstreeDiv").delegate(".nav_item", "click", function() {
			$(this).children(".nav_item_sWrap").toggle();
			$(this).children("i").toggleClass("navWrapActive");
			$(this).children("p").attr("class","selected");
		})
        var treeClickDiv;
    	$("#jstreeDiv").delegate(".wjj_leftbs", "click", function(event) {
            event.stopPropagation();
            var ids = $(this).attr("id");
            var dataType = $(this)[0].dataset.type;
            if(dataType == 0){
                treeClickDiv = $("#par"+ids);
                $.ajax({
                    url:baseUrl+"api/fs/listbydirid/"+ids,
                    type:"get",
                    data:"",
                    async: false,
                    success:function(childdata){
                        treeClickDiv.empty();
                        var childData = childdata;
                        childData.forEach(function (c) {
                            if(c.type == "dir"){
                                $('<li class="nav_item clearfix wjj_leftbs" id="' + c.id + '" title="' + c.path + '" data-pid="' + c.id + '"  data-id="' + c.id + '" data-type="0">' +
                                    '<i></i>' +
                                    '<u></u>' +
                                    '<p>' + c.path + '</p>' +
                                    '<div id="par' + c.id + '" class="nav_item_sWrap clearfix"></div>' +
                                    '</li>').appendTo(treeClickDiv);
                            }else{
                                $('<li style="margin-left: 20px;" class="nav_item clearfix wjj_leftbs" data-text="'+c.path+'" data-type="'+c.type+'" data-url="'+c.url+'" title="' + c.path + '" data-pid="' + c.id + '"  data-id="' + c.id + '" data-type="1">' +
                                        //'<i></i>' +
                                        //'<u></u>' +
                                    '<input  type="checkbox" class="last_level"/>'+
                                    '<p>' + c.path + '</p>' +
                                    '<div id="par' + c.id + '" class="nav_item_sWrap clearfix"></div>' +
                                    '</li>').appendTo(treeClickDiv);
                            }
                        })
                    },
                    error: function (e) {
                        if(e.status == "401"){
                            getSession();
                        }
                    }
                })
            }else{
                var text = $(this)[0].dataset.text;
                var type = $(this)[0].dataset.type;
                var url = $(this)[0].dataset.url;
                var data = {
                    "node":{
                        "original":{ "text":text,
                            "type":type,
                            "url":url}
                    }
                };
                var tempType
                if(data.node.original.text !=undefined && data.node.original.text != null){
                    var typeArr = data.node.original.text.split(".");
                    tempType = typeArr[typeArr.length-1];
                }
                if(data.node.original.type != "url"){
                    if(tempType == "gcp" || tempType == "rpb" || tempType == "tie" || tempType == "text" || tempType == "db" || tempType == "txt" || tempType == "aux" || tempType == "rrd"){
                        data.node.original.type = "text";
                    }else if(tempType.toLowerCase() == "tiff" || tempType.toLowerCase() == "tif" || tempType.toLowerCase() == "shp"){
                        data.node.original.type = "url";
                    }else if(tempType == "xml"){
                        data.node.original.type = "xml";
                    }else if(tempType == "json"){
                        data.node.original.type = "json";
                    }else if(tempType == "jpg"){
                        data.node.original.type = "jpg";
                    }
                }
                //勾选框
                clickObject=this;
                var number=$(this).children("p").html().split("_")[3];
                $("p:contains("+number+")").prev().prop("checked",false);
                if(data.node.original.type != "url"){
                    map=undefined;
                    $(".last_level").prop("checked",false);
                }
                $(this).children(".last_level").prop("checked",true);
                if(data.node.original.type == "file"){
                    // lookText(data.node.original.text)
                }else if(data.node.original.type == "url"){
                    var path = data.node.original.url;
                    var url =  path.split("?")[0];
                    var theRequest = new Object();
                    if (path.indexOf("?") != -1) {
                        var str = path.substr(1);
                        var strs = str.split("&");
                        for(var i = 0; i < strs.length; i ++) {
                            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
                        }
                    }
                    var imgType = "image/png";
                    var layer = theRequest.layers;
                    var bbox;
                    if(theRequest.bbox != undefined){
                        bbox = theRequest.bbox.split(",");
                    }
                    lookUrl(url,layer,bbox,"wms",imgType);
                    //lookUrl("","","","wms");
                }else if(data.node.original.type == "text"){
                    // var path = data.node.original.url;
                    //var path = "aaa.text";
                    // lookText(path)
                }else if(data.node.original.type == "xml"){
                    // var path = data.node.original.url;
                    //var path = "installer.xml";
                    // lookXml(path)
                }else if(data.node.original.type == "json"){
                    // var path = data.node.original.url;
                    // var path = "installer.xml";
                    // lookJson(path)
                }else if(data.node.original.type == "jpg"){
                    // var path = data.node.original.url;
                    //var path = "installer.xml";
                    // lookJpg(path)
                }
            }

        })
    }
    //查看txt文件
    function lookText(path){
        var pathArr = path.split("?");
        var pathId = pathArr[1].split("=")[1];
        $.ajax({
            url: "http://"+pathArr[0],
            type: "post",
            data:{"id":pathId,"token":"张三"},
            success: function (data) {
                var textarea = document.createElement("textarea");
                textarea.style.width = "100%";
                textarea.style.height = "98%";
                textarea.style.paddingLeft = "10px";
                textarea.style.border = "none";
                textarea.innerHTML = data;
                $("#preview").empty();
                $("#preview").append(textarea);
            },
            error: function (e) {
                if(e.status == "401"){
                    getSession();
                }
            }
        })

    }
    //查看json文件
    function lookJson(path){
        var pathArr = path.split("?");
        var pathId = pathArr[1].split("=")[1];
        $.ajax({
            url: "http://"+pathArr[0],
            type: "post",
            data:{"id":pathId,"token":"张三"},
            success: function (data) {
                data = formatJson(data);
                var textarea = document.createElement("textarea");
                textarea.style.width = "100%";
                textarea.style.height = "98%";
                textarea.style.paddingLeft = "10px";
                textarea.style.border = "none";
                textarea.innerHTML = data;
                $("#preview").empty();
                $("#preview").append(textarea);
            },
            error: function (e) {
                if(e.status == "401"){
                    getSession();
                }
            }
        })

    }
    //查看xml文件
    function lookXml(path){
        var pathArr = path.split("?");
        var pathId = pathArr[1].split("=")[1];
        $.ajax({
            url: "http://"+pathArr[0],
            type: "post",
            data:{"id":pathId,"token":"张三"},
            success: function (data) {
                //data = formatXml(data);
                var textarea = document.createElement("textarea");
                textarea.style.width = "100%";
                textarea.style.height = "98%";
                textarea.style.paddingLeft = "10px";
                textarea.style.border = "none";
                textarea.innerHTML = data;
                $("#preview").empty();
                //$("#preview").html(data);
                $("#preview").append(textarea);
                //if(data.code == "0"){
                //    //loadFlowById();
                //    alert("成功");
                //}else{
                //    alert("失败");
                //}
            },
            error: function (e) {
                if(e.status == "401"){
                    getSession();
                }
            }
        })
    }
    //查看影像服务
    function lookUrl(path,layers,bbox,type,imgType){
        var projection = ol.proj.get('EPSG:4326');
        var projectionExtent = projection.getExtent();
        var size = ol.extent.getWidth(projectionExtent) / 256;
        var resolutions = new Array(14);
        var matrixIds = new Array(14);
        for (var z = 0; z < 14; ++z) {
            // generate resolutions and matrixIds arrays for this WMTS
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
        }
        if(type == "wms"){
           $("#mapMainContainer").empty();
           var map = new ol.Map({
                target: "mapMainContainer",
                controls: ol.control.defaults().extend([
                    new ol.control.MousePosition({
                        coordinateFormat: ol.coordinate.createStringXY(4),
                        projection: 'EPSG:4326',
                    })
                ]),
                view: new ol.View({
                    projection: 'EPSG:4326',
                    center:[bbox[0]-0.0001,bbox[1]-0.2],
                    zoom: 10,
                    minZoom: 8,
                    maxZoom: 15
                })
            });
            // }
            var layer =   new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url:path,
                    params: {'LAYERS': layers,'FORMAT':imgType,'VERSION':'1.1.1',SRS: 'EPSG:4326', TRANSPARENT:false,QUERYTYPE:"phasetile",OPATICY:0.7//'TILED': true,
                    },
                    serverType: 'geoserver'
                    ,projection:"EPSG:4326"
                })
            });
            map.addLayer(layer);
        }
    }
     //查看jpg文件
    function lookJpg(path){
        var pathArr = path.split("?");
        var pathId = pathArr[1].split("=")[1];
        var eleAppend = document.getElementById("preview");
        window.URL = window.URL || window.webkitURL;
        if (typeof history.pushState == "function") {
            var xhr = new XMLHttpRequest();
            xhr.open("post", "http://"+pathArr[0]+"?id="+pathId+"&token=张三", true);
            xhr.responseType = "blob";
            xhr.onload = function() {
                if (this.status == 200) {
                    var blob = this.response;
                    var img = document.createElement("img");
                    img.style.width = "100%";
                    //img.style.height = "100%";
                    img.style.paddingLeft = "5px";
                    img.onload = function(e) {
                        window.URL.revokeObjectURL(img.src); // 清除释放
                    };
                    img.src = window.URL.createObjectURL(blob);
                    $("#preview").empty();
                    eleAppend.appendChild(img);
                }
            }
            xhr.send();
        } else {
            eleAppend.innerHTML = '<p style="color:#cd0000;">浏览器不给力，还是早点回去给孩子喂奶吧~</p>';
        }

    }
    function loadTree(){
        var uploadFileType = "";
        // 声明文件排序类型
        var initUserId = "";
        var orderTypeFlag = "";
        var acctoken = localStorage.getItem("geovis_token");
        	$(".wenjianContCont").html("");
            $(".dl_list").html("");
            $(".left_nav").html("");
            $(".copyWrapToggle").html("");
            $(".moveWrapToggle").html("");
            var token = "";
            $.ajax({
                url: baseUrl + 'user/querytoken',
                type: "get",
                data: "",
                async: false,
                success: function (data) {
                    if (data.code == 0) {
                        token = data.token;
                    }
                },
                error: function (e) {
                }
            })
            //	token = "RIwEs5MZM5ZIMl+65zqEHyP86XbWysP8iRcO5H+zcYd1Wg3e/JcjIZwYGe5Uyx1StAlLq788gQh60prYqhAkvAfaoxp+yjPGPveFcqFktMtLsKdyUmntFenwWudPDGGSMVlMeow9nVuMUg/1gpgOf3Ow2qCJQmwT2kDyrF1F6SQ=";
            $.ajax({
                url: folderUrl,
                type: "post",
                data:{"parentId":"-2","orderType":orderTypeFlag,"token":token},
                success: function (res) {
                    if(res.status == "true"){
                        var datas = res.item.items;
                        initUserId = datas[0].userId;
                        for(var i in datas){
                            $("body").attr("data-userId",datas[0].userId);
                            if(datas[i].type==1&&datas[i].type=="1"){
                                // 获取我的资源文件夹部分

                                // 文件夹缩略模式
                                $("<div class='wenjianjia wenjian_common wjj_bs' id='"+datas[i].id+"' title='"+datas[i].name+"' data-pid='"+datas[i].parentID+"' data-id='"+datas[i].metadata+"' data-descirbe='"+datas[i].descirbe+"' data-createTime='"+datas[i].createTime+"' data-editTime='"+datas[i].editTime+"' data-userName='"+datas[i].userName+"' data-type='0' data-editType='"+datas[i].editType+"'>" +
                                        "					<img src='./img/wenjianjia.png' alt=''>" +
                                        "							<p style='color:black'>'"+datas[i].name+"'</p>" +
                                        "							<u></u>" +
                                        "							</div>"

                                ).appendTo($(".wenjianContCont"));
                                // 文件夹列表模式
                                $('<ul class="dl_list_common clearfix wjj_bs" id="'+datas[i].id+'" title="'+datas[i].name+'" data-pid="'+datas[i].parentID+'"  data-id="'+datas[i].metadata+'" data-descirbe="'+datas[i].descirbe+'" data-createTime="'+datas[i].createTime+'" data-editTime="'+datas[i].editTime+'" data-userName="'+datas[i].userName+'" data-type="0" data-editType="'+datas[i].editType+'">' +
                                        '							<li class="dl_check"></li>' +
                                        '							<li><img src="./img/wenjianjia.png" alt=""><p style="color:black">${datas[i].name}</p></li>' +
                                        '							<li>------</li>' +
                                        '							<li>'+datas[i].createTime+'</li>' +
                                        '							<li>------</li>' +
                                        '							</ul>'

                                ).appendTo($(".dl_list"));
                                // 文件夹左侧树模式
                                $('<li class="nav_item clearfix wjj_leftbs" id="'+datas[i].id+'" title="'+datas[i].name+'" data-pid="'+datas[i].parentID+'"  data-id="'+datas[i].metadata+'" data-descirbe="'+datas[i].descirbe+'" data-createTime="'+datas[i].createTime+'" data-editTime="'+datas[i].editTime+'" data-userName="'+datas[i].userName+'" data-type="0" data-editType="$'+datas[i].editType+'">' +
                                        '							<i></i>' +
                                        '							<u></u>' +
                                        '							<p style="color:black">'+datas[i].name+'</p>' +
                                        '							<div class="nav_item_sWrap clearfix"></div>' +
                                        '							</li>'

                                ).appendTo($(".left_nav"));
                                // 复制中的文件夹目录
                                $('<li class="nav_item clearfix wjj_leftbs" id="'+datas[i].id+'" title="'+datas[i].name+'" data-pid="'+datas[i].parentID+'"  data-id="'+datas[i].metadata+'" data-type="0" data-editType="'+datas[i].editType+'">' +
                                        '							<i></i>' +
                                        '							<u></u>' +
                                        '							<p style="color:black">'+datas[i].name+'</p>' +
                                        '							<div class="nav_item_sWrap clearfix"></div>' +
                                        '							</li>'

                                ).appendTo($(".copyWrapToggle"));
                                // 移动中的文件夹目录
                                $('	 <li class="nav_item clearfix wjj_leftbs" id="'+datas[i].id+'" title="'+datas[i].name+'" data-pid="'+datas[i].parentID+'"  data-id="'+datas[i].metadata+'" data-type="0" data-editType="'+datas[i].editType+'">' +
                                        '							<i></i>' +
                                        '							<u></u>' +
                                        '							<p style="color:black">'+datas[i].name+'</p>' +
                                        '							<div class="nav_item_sWrap clearfix"></div>' +
                                        '							</li>'

                                ).appendTo($(".moveWrapToggle"));
                            }else if(datas[i].type==0&&datas[i].type=="0"){
                                //获取我的资源文件部分
                                // 文件缩略模式
                                $('<div class="wenjianjia wenjian_common wj_bs" id="'+datas[i].id+'" data-type="'+datas[i].dataType+'" title="'+datas[i].name+'" data-pid="'+datas[i].parentID+'"  data-id="'+datas[i].metadata+'" data-descirbe="'+datas[i].descirbe+'" data-createTime="'+datas[i].createTime+'" data-editTime="'+datas[i].editTime+'" data-userName="'+datas[i].userName+'">' +
                                        '							<img src="./img/${datas[i].dataType}.png" alt="">' +
                                        '							<p style="color:black">'+datas[i].name+'</p>' +
                                        '							<i class="wenjian_fb${datas[i].isRelease}"></i>' +
                                        '							<u></u>' +
                                        '							</div>'

                                ).appendTo($(".wenjianContCont"));
                                // 文件列表模式
                                $('<ul class="dl_list_common clearfix wj_bs" id="'+datas[i].id+'"data-type="'+datas[i].dataType+'" title="'+datas[i].name+'" data-pid="'+datas[i].parentID+'"  data-id="'+datas[i].metadata+'" data-descirbe="'+datas[i].descirbe+'" data-createTime="'+datas[i].createTime+'" data-editTime="'+datas[i].editTime+'" data-userName="'+datas[i].userName+'">' +
                                        '							<li class="dl_check"></li>' +
                                        '							<li><img src="./img/${datas[i].dataType}.png" alt=""><p style="color:black">${datas[i].name}</p><u class="dl_fb${datas[i].isRelease}"></u></li>' +
                                        '							<li>'+datas[i].dataType+'</li>' +
                                        '							<li>'+datas[i].createTime+'</li>' +
                                        '							<li>------</li>' +
                                        '							</ul>'

                                ).appendTo($(".dl_list"));
                            }

                        }
                    }else if(res.status == "false"){
                        var txt=  res.message;
        //				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
        //				alert(txt);
        //				getSession();
                    }
                },
                error: function (e) {
                    if(e.status == "401"){
                        getSession();
                    }
                }
	    })
    }
    function clickTree(){
        	//弹出提示框
        function openWindow(a,b) {
            if(b){
                $(".openWindow").find(".right").css("background","url('./img/icon.png') 100% no-repeat")
            }else{
                $(".openWindow").find(".right").css("background","url('./img/icon2.png') 100% no-repeat")
            }
            $(".openWindow .info").html(a);
            $(".openWindow").show(300).delay(1500).hide(300);
        }
        //用户退出登录
        $(".exit").click(function(){
            window.location.href = "http://192.168.44.15:8010/webos"
        })

        //去掉展开框的左侧标示
        function deleteXialaIcon(){
            $(".nav_item_sWrap").each(function(){
                $(this).siblings("i").css("visibilituy","hidden");
            })
        }

        // 左侧点击展开
        $(".left_nav").delegate(".nav_item", "click", function() {
                $(this).children(".nav_item_sWrap").toggle();
                $(this).children("i").toggleClass("navWrapActive");
                $(this).children("p").attr("class","selected");
            })

        // 排序点击
        $("#paixu_my").click(function() {
            $(".paixu_my").toggle();
        });

        // 按照名称排序
        $(".paixu_my li").eq(0).click(function() {
            orderTypeFlag = "Name";
            var idsss = $(".nav_title").attr("data-currentpid");
            if (idsss == "-2") {
                initCata();
            } else {
                $(".left_nav #" + idsss).trigger("click");
            }
            $(".paixu_my").toggle();
        });

        // 按照类型排序
        $(".paixu_my li").eq(1).click(function() {
            orderTypeFlag = "Type";
            var idsss = $(".nav_title").attr("data-currentpid");
            if (idsss == "-2") {
                initCata();
            } else {
                $(".left_nav #" + idsss).trigger("click");
            }
            $(".paixu_my").toggle();
        });

        // 按照时间排序
        $(".paixu_my li").eq(2).click(function() {
            orderTypeFlag = "createTime";
            var idsss = $(".nav_title").attr("data-currentpid");
            if (idsss == "-2") {
                initCata();
            } else {
                $(".left_nav #" + idsss).trigger("click");
            }
            $(".paixu_my").toggle();
        });

        // 按照大小排序
        $(".paixu_my li").eq(3).click(function() {
            orderTypeFlag = "fileSize";
            var idsss = $(".nav_title").attr("data-currentpid");
            if (idsss == "-2") {
                initCata();
            } else {
                $(".left_nav #" + idsss).trigger("click");
            }
            $(".paixu_my").toggle();
        })

        // 发布展开
        // $(".zy_fb_common i").click(function(e){
        // 	// e.stopPropagation();
        // 	$(this).siblings("ul").toggle();
        // 	$(this).toggleClass("fbActive");
        // })

        // 缩略图&&列表切换
        $(".suolue_toggle").click(function() {
            if ($(".wenjianContCont").css("display") == "block") {
                $(".wenjianContCont").hide();
                $(".wenjianContHead").hide();
                $(".download_ml").show();
                $(this).attr("src", "./img/2_suolue.png")
            } else {
                $(".download_ml").hide();
                $(".wenjianContCont").show();
                $(".wenjianContHead").show();
                $(this).attr("src", "./img/list.png")
            }
        })

        // 列表模式

        // 全选点击
        var LBcheckAll_flag = 0;

        $(".dl_title li").eq(0).click(function() {
            if (LBcheckAll_flag == 0) {
                $(".dl_check").addClass("checkedActive");
                $(this).addClass("checkedActive");
                LBcheckAll_flag = 1;
                //缩略联动
                $(".wenjianContCont .wenjian_common u").addClass("SLCheckedActive");
                $(".wenjianContHead img").attr("src", "./img/2_copy.png");
                SLcheckAll_flag = 1;
            } else {
                $(".dl_check").removeClass("checkedActive");
                $(this).removeClass("checkedActive");
                LBcheckAll_flag = 0;
                //缩略联动
                $(".wenjianContCont .wenjian_common u").removeClass("SLCheckedActive");
                $(".wenjianContHead img").attr("src", "./img/2_square.png");
                SLcheckAll_flag = 0;
            }
        })

        // 单选点击
        $(".dl_list").delegate(".dl_check", "click", function() {
            if ($(this).hasClass("checkedActive")) {
                $(this).removeClass("checkedActive");
                $(".dl_title li").eq(0).removeClass("checkedActive");
                //联动缩略
                var ids = $(this).parent().attr("id");
                $(".wenjianContCont #" + ids + " u").removeClass("SLCheckedActive");
                $(".wenjianContHead img").attr("src", "./img/2_copy.png");
            } else {
                $(this).addClass("checkedActive");
                //联动缩略
                var ids = $(this).parent().attr("id");
                $(".wenjianContCont #" + ids + " u").addClass("SLCheckedActive");
            }
        })


        //单击元素
        $(".dl_list").delegate(".dl_list_common", "click", function() {
            $(".dl_list_common").removeClass("listCommonActive");
            $(this).addClass("listCommonActive");
            var ids = $(this).attr("id");
            var dataId = $(this).attr("data-id");
            var types = $(this).attr("data-type");
            var userName = "";
            var createTime = "";
            var editTime = "";
            var fileName = "";
            $(".wenjianjiaDetail").hide();
            $(".wenjianjubu_gc").hide();
            $(".wenjianjubu_yx").hide();
            $(".wenjian_sl").hide();
            $(".select_total").hide();
            $(".wenjian_other").hide();
            $(".nav_title").attr("data-targetId", ids);

        })

        // 双击列表目录里的文件夹
        $(".dl_list").delegate(".wjj_bs", "dblclick", function() {
            var ids = $(this).attr("id");
            $(".left_nav #" + ids).trigger("click");
        })

        //缩略图模式

        //全选点击
        var SLcheckAll_flag = 0;
        $(".wenjianContHead img").click(function() {
            if (SLcheckAll_flag == 0) {
                $(this).attr("src", "./img/2_copy.png");
                $(".wenjianjia u").addClass("SLCheckedActive")
                $(".wenjianItem u").addClass("SLCheckedActive");
                SLcheckAll_flag = 1;
                //联动list元素
                $(".dl_check").addClass("checkedActive");
                $(".dl_title li").eq(0).addClass("checkedActive");
                LBcheckAll_flag = 1;
            } else {
                $(this).attr("src", "./img/2_square.png");
                $(".wenjianjia u").removeClass("SLCheckedActive");
                $(".wenjianItem u").removeClass("SLCheckedActive");
                SLcheckAll_flag = 0;
                //联动list元素
                $(".dl_check").removeClass("checkedActive");
                $(".dl_title li").eq(0).removeClass("checkedActive");
                LBcheckAll_flag = 0;
            }
        })

        //单选点击
        $(".wenjianContCont").delegate(".wenjian_common u", "click", function() {
            if ($(this).hasClass("SLCheckedActive")) {
                $(this).removeClass("SLCheckedActive");
                $(".wenjianContHead img").attr("src", "./img/2_square.png");
                //联动列表
                var ids = $(this).parent().attr("id");
                $(".dl_list #" + ids + " .dl_check").removeClass("checkedActive");
                $(".dl_title li").eq(0).removeClass("checkedActive");
            } else {
                $(this).addClass("SLCheckedActive");
                //联动列表
                var ids = $(this).parent().attr("id");
                $(".dl_list #" + ids + " .dl_check").addClass("checkedActive");
            }
        })

        // 单击元素
        $(".wenjianContCont").delegate(".wenjian_common", "click", function() {
            $(".wenjian_common").removeClass("listCommonActive");
            $(this).addClass("listCommonActive");
            var ids = $(this).attr("id");
            var dataId = $(this).attr("data-id");
            var types = $(this).attr("data-type");
            var userName = "";
            var createTime = "";
            var editTime = "";
            var fileName = "";
            $(".wenjianjiaDetail").hide();
            $(".wenjianjubu_gc").hide();
            $(".wenjianjubu_yx").hide();
            $(".wenjian_sl").hide();
            $(".select_total").hide();
            $(".wenjian_other").hide();
            $(".nav_title").attr("data-targetId", ids);
        })

        // 双击缩略目录中文件夹
        $(".wenjianContCont").delegate(".wjj_bs", "dblclick", function() {
            var ids = $(this).attr("id");
            $(".left_nav #" + ids).trigger("click");
        })

        // 异步上传文件方法
        function doUpload() {
            var formData = new FormData($("#uploadForm")[0]);
            $.ajax({
                url: 'http://192.168.44.56:8080/image-service/manager/uploadFile.action',
                type: 'POST',
                data: formData,
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                success: function(returndata) {
                    openWindow("文件上传成功",true);
                },
                error: function(returndata) {
                    openWindow("文件上传失败",false);
                }
            });
        }

        //同名处理函数
        //var check = function(all,type,index){
        //	   var newName = index==0?type:`${type}(${index})`;
        //	   // console.debug(abc);
        //	   if(all.some(v=>{
        //	       return v===newName;
        //	   })){
        //	       return check(all,type,index+1);
        //	   }else{
        //	       return newName;
        //	   }
        //	}

        // 新增文件夹
        $(".wjjCreat").click(function() {
            var pids = $(".nav_title").attr("data-currentpid");
            var userId = $("body").attr("data-userId");
            var ids = $(".wenjianContCont p");
            var c = "新建文件夹";
            var abc = [];
            for(var i = 0 ; i < ids.length ; i ++ ){
                abc.push(ids[i].innerHTML);
            };
            var newName = check(abc,c,0);
        })

        //左侧文件夹展开
        $(".left_nav").delegate(".wjj_leftbs", "click", function(event) {
            event.stopPropagation();
            var ids = $(this).attr("id");
            var $that = $(this).find(".nav_item_sWrap");
            // 将被点击的元素的id存入新建文件夹按钮中的data-currentPid属性中，用于防止当前文件夹中是空，拿不到pid这个问题
            $(".nav_title").attr("data-currentpid", ids);
            $(".left_nav .wjj_leftbs").children("p").css("color", "#333").removeClass("activeFlag1");
            $(this).children("p").css("color", "#333").addClass("activeFlag1");
            var token = "";
            $.ajax({
                url: baseUrl + 'user/querytoken',
                contentType:"application/x-www-form-urlencoded;charset=UTF-8",
                type: "get",
                data: "",
                async: false,
                success: function (data) {
                    if (data.code == 0) {
                        token = data.token;
                    }
                },
                error: function (e) {

                }
            })
            $.ajax({
                url: folderUrl,
                type: "post",
                data:{"parentId": ids,"token":token},
                success: function (res) {
                    tempData = res.item.items;
                    if(res.item.items.length!=0){
                        tempId = res.item.items[0].parentID;
                    }
                    $(".wenjianContCont").html("");
                    $(".dl_list").html("");
                    $that.html("");
                    for (var i in tempData) {
                        // 是否是文件夹
                        if (tempData[i].type=="1") {
                            // 文件夹缩略模式
                            $('<div class="wenjianjia wenjian_common wjj_bs" id="' + tempData[i].id + '" title="' + tempData[i].name + '" data-pid="' + tempData[i].parentID + '" data-id="' + tempData[i].Metadata + '" data-descirbe="' + tempData[i].descirbe + '" data-createTime="' + tempData[i].createTime + '" data-editTime="' + tempData[i].editTime + '" data-userName="' + tempData[i].userName + '" data-type="0">' +
                                '							<img src="./img/wenjianjia.png" alt="">' +
                                '							<p style="color:black">' + tempData[i].name + '</p>' +
                                '							<u></u>' +
                                '							</div>'
                            ).appendTo($(".wenjianContCont"));
                            // 文件夹列表模式
                            $('<ul class="dl_list_common clearfix wjj_bs" id="' + tempData[i].id + '" title="' + tempData[i].name + '" data-pid="' + tempData[i].parentID + '"  data-id="' + tempData[i].Metadata + '" data-descirbe="' + tempData[i].descirbe + '" data-createTime="' + tempData[i].createTime + '" data-editTime="' + tempData[i].editTime + '" data-userName="' + tempData[i].userName + '" data-type="0">' +
                                '							<li class="dl_check"></li>' +
                                '							<li><img src="./img/wenjianjia.png" alt=""><p style="color:black">' + tempData[i].name + '</p></li>' +
                                '							<li>------</li>' +
                                '							<li>' + tempData[i].createTime + '</li>' +
                                '							<li>------</li>' +
                                '							</ul>').appendTo($(".dl_list"));
                            // 文件夹左侧树模式
                            $('<li class="nav_item clearfix wjj_leftbs" id="' + tempData[i].id + '" title="' + tempData[i].name + '" data-pid="' + tempData[i].parentID + '"  data-id="' + tempData[i].Metadata + '" data-descirbe="' + tempData[i].descirbe + '" data-createTime="' + tempData[i].createTime + '" data-editTime="' + tempData[i].editTime + '" data-userName="' + tempData[i].userName + '" data-type="0">' +
                                '							<i></i>' +
                                '							<u></u>' +
                                '							<p style="color:black">' + tempData[i].name + '</p>' +
                                '							<div class="nav_item_sWrap clearfix"></div>' +
                                '							</li>').appendTo($that);
                        } else if (tempData[i].type=="0") {
                            // 文件渲染
                            // 文件缩略模式
                            $('<div class="wenjianjia wenjian_common wj_bs" id="'+tempData[i].id+'" data-type="'+tempData[i].dataType+'" title="'+tempData[i].name+'" data-pid="'+tempData[i].parentID+'"  data-id="'+tempData[i].Metadata+'" data-descirbe="'+tempData[i].descirbe+'" data-createTime="'+tempData[i].createTime+'" data-editTime="'+tempData[i].editTime+'" data-userName="'+tempData[i].userName+'">' +
                                '							<img src="./img/'+tempData[i].dataType+'.png" alt="">' +
                                '							<p style="color:black">'+tempData[i].name+'</p>' +
                                '							<i class="wenjian_fb'+tempData[i].isRelease+'"></i>' +
                                '							<u></u>' +
                                '							</div>').appendTo($(".wenjianContCont"));
                            // 文件夹列表模式
                            $('<ul class="dl_list_common clearfix wj_bs" id="'+tempData[i].id+'"data-type="'+tempData[i].dataType+'" title="'+tempData[i].name+'" data-pid="'+tempData[i].parentID+'"  data-id="'+tempData[i].Metadata+'" data-descirbe="'+tempData[i].descirbe+'" data-createTime="'+tempData[i].createTime+'" data-editTime="'+tempData[i].editTime+'" data-userName="'+tempData[i].userName+'">' +
                                '							<li class="dl_check"></li>' +
                                '							<li><img src="./img/'+tempData[i].dataType+'.png" alt=""><p style="color:black">'+tempData[i].name+'</p><u class="dl_fb'+tempData[i].isRelease+'"></u></li>' +
                                '							<li>'+tempData[i].dataType+'</li>' +
                                '							<li>'+tempData[i].createTime+'</li>' +
                                '							<li>------</li>' +
                                '							</ul>').appendTo($(".dl_list"));
                        };
                    };
                },
                error: function (e) {
                    if(e.status == "401"){
                        getSession();
                    }
                }
            })

            function getSession() {
                var tempUrl = window.location.href.split("?")[1];
                if(tempUrl != undefined){
                    location.href = "/user/login?redirect=/pixelfactory/views/task/task.html?"+tempUrl;
                }else{
                    location.href = "/user/login?redirect=/pixelfactory/views/task/task.html";
                }
            }
        });
        // 文件单击查看属性

        //点击我的资源回到初始
        $(".nav_title").click(function() {
            $(".nav_title").attr("data-currentpid", "-1");
            initCata();
        })

        // 点击全部资源回到初始
        $(".backAll").click(function(){
            $(".nav_title").trigger("click");
        })

        //发布到点击发布，提交审核
        $("#zy_fb").click(function() {
            if ($(".download_ml").css("display") == "none") {
                var uList = $(".wenjianContCont").find("u.SLCheckedActive");
            } else {
                var uList = $(".download_ml").find("li.checkedActive");
            }
            var userId = $("body").attr("data-userId");
            if(!uList.length){
                openWindow("请勾选需要发布的文件",false);
                return false;
            }
                // 多个文件发布提交审核
                var singleId;
                var ids;
                var metaidArr = [];
                var idArr = [];
                for (var i = 0; i < uList.length; i++) {
                    // 如果多选文件中存在文件夹
                    if (/wjj_bs/i.test(uList[i].parentElement.className)) {
                        openWindow("无法发布文件夹",false);
                        return;
                    } else {
                        var a = $(uList[i]).parent().attr("data-id");
                        var b = $(uList[i]).parent().attr("id");
                        // var pids = $(".nav_title").attr("data-currentpid");
                        var name = $(uList[i]).parent().find("p").text();
                        metaidArr.push(a);
                        idArr.push(b);
                        singleId = metaidArr.join(",");
                        ids = idArr.join(",");
                        // singleId += a + ",";
                    }
                };
                // GV.Center.Data.publish({"metadataidlist": singleId,"approvalUserId": userId,"ids":ids,"approvalStatus": 2,"approvalOpinion": 'agreessTest',"UserId": '1',
    //          "UserName": '',"Name": '',"Type": '',"ParentID": '',"Descirbe": '',"Viewpoint": '',"Geometry": '',"Metadata": '',"editType": '',"img": ''}).then(res=>{
                // 	openWindow("发布成功,等待审核")
                // });
                var beans = {
                        "metadataidlist":singleId,"approvalUserId":userId,"approvalStatus":2,"approvalOpinion":"agreessTest","ids":ids,"token":acctoken
                    };
                var publishUrl = "http://192.168.4.225:9090/sg_server/service/publish";
                $.ajax({
                    type: "post",
                    dataType: "json",
                    async: true,
                    url: publishUrl,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(beans),
                    success: function(data) {
                        openWindow("已成功提交发布审核",true)
                    },
                    error: function(data){
                        openWindow("提交发布审核失败",false)
                    }
                });
        });

        //添加收藏
        $("#zy_correct").click(function() {
            if ($(".download_ml").css("display") == "none") {
                var uList = $(".wenjianContCont").find("u.SLCheckedActive");
            } else {
                var uList = $(".download_ml").find("li.checkedActive");
            }
            var userId = $("body").attr("data-userId");

            if (uList.length == 1) {
                // 单个文件收藏
                var singleId = uList.parent().attr("data-id");
                var name = uList.parent().find("p").text();
                if (singleId == "null" || singleId == "") {
                    // 如果选中文件夹
                    openWindow("无法收藏文件夹",false)
                } else {
                    //GV.Center.Data.addFavoritesInfo({"Name":name,"Type":3,"ParentID":-4,"Metadata":singleId}).then(res=>{
                    //	openWindow("收藏成功",true)
                    //})
                };
            } else {
                // 多个文件收藏
                var singleId = '';
                var datas = [];
                for (var i = 0; i < uList.length; i++) {
                    // 如果多选文件中存在文件夹
                    if (!$(uList[i]).parent().attr("data-id")||$(uList[i]).parent().attr("data-id")=="null"||$(uList[i]).parent().attr("data-id")=="undefined") {
                        openWindow("无法收藏文件夹",false);
                        return false;
                    } else {
                        var a = $(uList[i]).parent().attr("data-id");
                        var b = $(uList[i]).parent().find("p").text();
                        datas.push({"Name": b,"ParentID": "-4","Type": "3","Metadata": a})
                    }
                };
                datas = JSON.stringify(datas);
                //GV.Center.Data.addFavoritesInfoList({"filemanagerList":datas}).then(res=>{
                //		openWindow("收藏成功",true)
                //})
            
            }
        });

        //删除
        $("#zy_delate").click(function() {
            if ($(".download_ml").css("display") == "none") {
                var uList = $(".wenjianContCont").find("u.SLCheckedActive");
            } else {
                var uList = $(".download_ml").find("li.checkedActive");
            };
            // 多个文件删除
            var singleId = '';
            if (uList.length == 1) {
                singleId = uList.parent().attr("id") + ",";
            } else if (uList.length > 1) {
                for (var i = 0; i < uList.length; i++) {
                    var a = $(uList[i]).parent().attr("id");
                    singleId += (a + ",");
                };
            };
            //GV.Center.Data.removeFavoritesInfo(singleId).then(res=>{
            //// GV.Center.Data.removeFavoritesInfo({"ids":singleId}).then(res=>{
            //		var idss = $(".wenjianContCont").find("u.SLCheckedActive").parent();
            //		$(".wenjianContCont").find("u.SLCheckedActive").parent().remove();
            //		$(".download_ml").find("li.checkedActive").parent().remove();
            //		for (var i = 0; i < idss.length; i++) {
            //			var idsa = $(idss[i]).attr("id");
            //			var a = $(".left_nav").find("#" + idsa);
            //			a.remove();
            //		}
            //	})

        });

        //点击返回上一级
        $(".ToolPosWrap p").eq(0).click(function() {
            var ids = $(".nav_title").attr("data-currentpid");
            if($(this).hasClass("searchBack")){
                if(ids=="-2"){
                    $(".nav_title").trigger("click");
                }else{
                    $(".left_nav").find("#"+ids).trigger("click");
                };
                $(".searchBack").removeClass("searchBack");
                $(".zy_input").val("");
            }else{
                if (ids == -2) {
                    return false;
                } else {
                    //GV.Center.Data.getFavoritesinfoByID(ids).then(res=>{
                    //	var datas = res.item.items[0];
                    //	var parentID1 = datas.parentID;
                    //	if (parentID1 == -2) {
                    //		$(".nav_title").trigger("click");
                    //	} else {
                    //		$(".left_nav").find("#" + parentID1).trigger("click");
                    //		$(".left_nav").find("#" + parentID1).children(".nav_item_sWrap").toggle();
                    //		$(".left_nav").find("#" + parentID1).children("i").toggleClass("navWrapActive");
                    //	}
                    //})
                }
            }
        });

        // 搜索框右侧条件切换触发右侧筛选条件
        $("#zy_search_button").change(function() {
            var options = $(this).find("option:selected");
            var texts = options.text();
            var ids = $(".nav_title").attr("data-currentpid");
            $(".wj_total").hide();
            switch (texts) {
                case "全部":
                    $(".search_base").show();
                    $(".search_yx").hide();
                    $(".search_sl").hide();
                    $(".search_gc").hide();
                    break;
                case "影像检索":
                    $(".search_base").show();
                    $(".search_yx").show();
                    $(".search_sl").hide();
                    $(".search_gc").hide();
                    $(".zy_input").val("");
                    break;
                case "矢量检索":
                    $(".search_base").show();
                    $(".search_sl").show();
                    $(".search_gc").hide();
                    $(".search_yx").hide();
                    $(".zy_input").val("");
                    break;
                case "高程检索":
                    $(".search_base").show();
                    $(".search_gc").show();
                    $(".search_yx").hide();
                    $(".search_sl").hide();
                    $(".zy_input").val("");
                    break;
            };
            $.ajax({
                type: "get",
                dataType: "json",
                async: true,
                url: "http://192.168.44.5:8080/favorites_server/favorites/querySearchBar",
                data: {
                    "parentId": ids,
                    "zyzxtype": texts,
                    "token": acctoken
                },
                success: function(data) {
                    var datas = data.zyzxById.items;
                    $(".wenjianContCont").html("");
                    $(".dl_list").html("");
                    //for (var i in datas) {
                    //	// 是否是文件夹
                    //	if (datas[i].lxid == 200010035138101) {
                    //		// 文件夹缩略模式
                    //		$(`
                    //				<div class="wenjianjia wenjian_common wjj_bs" id="${datas[i].id}" data-type="${datas[i].zyzxtype}" title="${datas[i].scjmc}" data-pid="${datas[i].parentID}"  data-id="${datas[i].dataID}">
                    //					<img src="./img/wenjianjia.png" alt="">
                    //					<p>${datas[i].scjmc}</p>
                    //					<i class="wenjian_fb${datas[i].release2}"></i>
                    //					<u></u>
                    //				</div>
                    //			`).appendTo($(".wenjianContCont"));
                    //		// 文件夹列表模式
                    //		$(`
                    //				<ul class="dl_list_common clearfix wjj_bs" id="${datas[i].id}"data-type="${datas[i].zyzxtype}" title="${datas[i].scjmc}" data-pid="${datas[i].parentID}"  data-id="${datas[i].dataID}">
                    //					<li class="dl_check"></li>
                    //					<li><img src="./img/wenjianjia.png" alt=""><p>${datas[i].scjmc}</p><u class="dl_fb${datas[i].release2}"></u></li>
                    //					<li>${datas[i].zyzxtype}</li>
                    //					<li>${datas[i].time}</li>
                    //					<li>${datas[i].fileSize}</li>
                    //				</ul>
                    //			`).appendTo($(".dl_list"));
                    //	} else if (datas[i].lxid == 200010035138103) {
                    //		// 文件渲染
                    //		$(`
                    //				<div class="wenjianjia wenjian_common wj_bs" id="${datas[i].id}" data-type="${datas[i].zyzxtype}" title="${datas[i].scjmc}" data-pid="${datas[i].parentID}"  data-id="${datas[i].dataID}">
                    //					<img src="./img/img.png" alt="">
                    //					<p>${datas[i].scjmc}</p>
                    //					<i class="wenjian_fb${datas[i].release2}"></i>
                    //					<u></u>
                    //				</div>
                    //			`).appendTo($(".wenjianContCont"));
                    //		// 文件夹列表模式
                    //		$(`
                    //				<ul class="dl_list_common clearfix wj_bs" id="${datas[i].id}"data-type="${datas[i].zyzxtype}" title="${datas[i].scjmc}" data-pid="${datas[i].parentID}"  data-id="${datas[i].dataID}">
                    //					<li class="dl_check"></li>
                    //					<li><img src="./img/img.png" alt=""><p>${datas[i].scjmc}</p><u class="dl_fb${datas[i].release2}"></u></li>
                    //					<li>${datas[i].zyzxtype}</li>
                    //					<li>${datas[i].time}</li>
                    //					<li>${datas[i].fileSize}</li>
                    //				</ul>
                    //			`).appendTo($(".dl_list"));
                    //	}
                    //};

                },
            })

        })

        // 下载列表toggle
        $("#zy_dl i").click(function() {
                $(".download_list").toggle();
            })
            // 下载列表关闭
        $(".dll_x").click(function() {
                $(".download_list").hide();
            })
            //属性值修改
        $(".wj_total div").click(function() {
            var parentss = $(this).parent();
            var targetIds = $(".nav_title").attr("data-targetId");
            var pids = $(".nav_title").attr("data-currentpid");
            var MetaDataId = $(".wenjianContCont").find("#"+targetIds).attr("data-id");
            var fileName;
            if (parentss.hasClass("wenjian_sl")) {
                // 矢量影像数据信息修改
                data["scjxx_FolderProperties.zyzxtype"] = "矢量数据";
                data["scjxx_FolderProperties.parentID"] = $(".nav_title").attr("data-currentpid");
                data["scjxx_FolderProperties.scjmc"] = parentss.find("#wenjian_sl_Title").val();
                data["scjxx_FolderProperties.blc"] = parentss.find("#wj_sl_blc option:selected").text();
                data["scjxx_FolderProperties.tyxx"] = parentss.find("#wj_sl_ty option:selected").text();
                data["scjxx_FolderProperties.keyword"] = parentss.find("#wj_sl_gjz").val();
                data["scjxx_FolderProperties.sszt"] = parentss.find("#wj_sl_sszt option:selected").text();
            } else if (parentss.hasClass("wenjianjubu_yx")) {
                // 影像数据信息信息修改
                var ccc = parentss.find("#wj_yx_Title").val();
                fileName = parentss.find("#wj_yx_Title").attr("value");
                var wxlx = parentss.find("#wj_yx_wxlx option:selected").text();
                var yxlx = parentss.find("#wj_yx_yxlx option:selected").text();
                var yxjb = parentss.find("#wj_yx_yxjb option:selected").text();
                var tyxx = parentss.find("#wj_yx_tyxx option:selected").text();
                var gjz = parentss.find("#wj_yx_key").val();
                var fbl = parentss.find("#wj_yx_fbl option:selected").text();
                var rpc = parentss.find("#wj_yx_rpc option:selected").text();
                //GV.Center.Data.getMetaData({"id":MetaDataId}).then(res=>{
                //		var imageUrl = "http://192.168.4.3:8808/image-service/" + res.queryPath;
                //		var imageParam = JSON.parse(res.queryParams);
                //		for(var p in imageParam){
                //			imageUrl += "?" + p + "=" + imageParam[p] + "&";
                //		};
                //		imageUrl = imageUrl +  "token=" + acctoken;
                //		$.ajax({
                //			url: imageUrl,
                //			type: 'get',
                //			async: true,
                //			cache: false,
                //			processData: false,
                //			success: function(data){
                //				var yxId = data.id;
                //				var daaa = {"imageName":ccc,"id":yxId,"satelliteId":wxlx,"mapProjection":tyxx,"resolution":fbl};
                //				var daas = JSON.stringify(daaa);
                //				var datadata = {
                //						"imageMeta": daas
                //					};
                //				var updateUrl = "http://192.168.4.3:8808/image-service/image/manage/update?token"+acctoken
                //				$.ajax({
                //					url: updateUrl,
                //					type: 'post',
                //					dataType: "json",
                //					async: true,
                //					cache: false,
                //					contentType: "application/x-www-form-urlencoded",
                //					data: datadata,
                //					success: function(data){
                //						openWindow("修改成功",true)
                //					}
                //				});
                //			}
                //		});
                //});
                //// 目录信息修改
                //GV.Center.Data.editFavoritesInfo({"id":targetIds,"Name":ccc}).then(res=>{
                //
                //});
            } else if (parentss.hasClass("wenjianjubu_gc")) {
                // 局部高程数据信息修改
                data["scjxx_FolderProperties.zyzxtype"] = "高程数据";
                data["scjxx_FolderProperties.parentID"] = $(".nav_title").attr("data-currentpid");
                data["scjxx_FolderProperties.scjmc"] = parent.find("#wj_gc_title").val();
                data["scjxx_FolderProperties.wgdx"] = parent.find("#wj_gc_gw option:selected").text();
                data["scjxx_FolderProperties.tyxx"] = parent.find("#wj_gc_ty option:selected").text();
                data["scjxx_FolderProperties.keyword"] = parent.find("#wj_gc_gjz").val();
                data["scjxx_FolderProperties.resolution"] = parent.find("#wj_gc_fbl option:selected").text();
            } else if (parentss.hasClass("wenjianjiaDetail")) {
                // 文件夹数据信息
                var ccc = parentss.find("#wenjianjiaDetailTitle").val();
                //GV.Center.Data.editFavoritesInfo({"id":targetIds,"Name":ccc}).then(res=>{
                //
                //});
            } else if(parentss.hasClass("wenjian_other")){
                //其他基础数据信息
            };
            var ids_name = $(".wenjianContCont p");
            var abc = [];
            for(var i = 0 ; i < ids_name.length ; i ++ ){
                abc.push(ids_name[i].innerHTML);
            };
            ccc = check(abc,ccc,0);

            var targetId = $(".nav_title").attr("data-targetId");
            var target1 = $(".wenjianContCont").find("#" + targetIds);
            var target2 = $(".dl_list").find("#" + targetIds);
            var target3 = $(".left_nav").find("#" + targetIds);

            target1.find("p").html(ccc);
            target2.find("p").html(ccc);
            target3.find("p").html(ccc);
        });
        // 搜索 文字输入搜索
        $(".zy_input").on("input", function() {
            $(".ToolPosWrap p").eq(0).addClass("searchBack");
            var texts = $(this).val();
            var ids = $(".nav_title").attr("data-currentpid");
            if(texts==""){
                initCata();			
            }else{
                $.ajax({
                    type: "get",
                    dataType: "json",
                    async: false,
                    url: "http://192.168.44.5:8080/user_data/favorites/searchFavoritesinfo",
                    data: {
                        "isPublic": 0,
                        "searchbarCond.Name": texts,
                        "token": acctoken
                    },
                    // data: {"parentId":ids,"scjmc":texts},
                    success: function(data) {
                        var datas = data.item.items;
                        $(".wenjianContCont").html("");
                        $(".dl_list").html("");
                        //for (var i in datas) {
                        //	// 是否是文件夹
                        //	if(datas[i].type==1&&datas[i].type=="1"){
                        //// 获取我的资源文件夹部分
                        //
                        //	// 文件夹缩略模式
                        //	$(`
                        //		<div class="wenjianjia wenjian_common wjj_bs" id="${datas[i].id}" title="${datas[i].name}" data-pid="${datas[i].parentID}" data-id="${datas[i].metadata}" data-descirbe="${datas[i].descirbe}" data-createTime="${datas[i].createTime}" data-editTime="${datas[i].editTime}" data-userName="${datas[i].userName}" data-type="0" data-editType="${datas[i].editType}">
                        //			<img src="./img/wenjianjia.png" alt="">
                        //			<p>${datas[i].name}</p>
                        //			<u></u>
                        //		</div>
                        //	`).appendTo($(".wenjianContCont"));
                        //	// 文件夹列表模式
                        //	$(`
                        //		<ul class="dl_list_common clearfix wjj_bs" id="${datas[i].id}" title="${datas[i].name}" data-pid="${datas[i].parentID}"  data-id="${datas[i].metadata}" data-descirbe="${datas[i].descirbe}" data-createTime="${datas[i].createTime}" data-editTime="${datas[i].editTime}" data-userName="${datas[i].userName}" data-type="0" data-editType="${datas[i].editType}">
                        //			<li class="dl_check"></li>
                        //			<li><img src="./img/wenjianjia.png" alt=""><p>${datas[i].name}</p></li>
                        //			<li>------</li>
                        //			<li>${datas[i].createTime}</li>
                        //			<li>------</li>
                        //		</ul>
                        //	`).appendTo($(".dl_list"));
                        //	}else if(datas[i].type==0&&datas[i].type=="0"){
                        //		//获取我的资源文件部分
                        //			// 文件缩略模式
                        //			$(`
                        //				<div class="wenjianjia wenjian_common wj_bs" id="${datas[i].id}" data-type="${datas[i].dataType}" title="${datas[i].name}" data-pid="${datas[i].parentID}"  data-id="${datas[i].metadata}" data-descirbe="${datas[i].descirbe}" data-createTime="${datas[i].createTime}" data-editTime="${datas[i].editTime}" data-userName="${datas[i].userName}">
                        //					<img src="./img/${datas[i].dataType}.png" alt="">
                        //					<p>${datas[i].name}</p>
                        //					<i class="wenjian_fb${datas[i].isRelease}"></i>
                        //					<u></u>
                        //				</div>
                        //			`).appendTo($(".wenjianContCont"));
                        //			// 文件列表模式
                        //			$(`
                        //				<ul class="dl_list_common clearfix wj_bs" id="${datas[i].id}"data-type="${datas[i].dataType}" title="${datas[i].name}" data-pid="${datas[i].parentID}"  data-id="${datas[i].metadata}" data-descirbe="${datas[i].descirbe}" data-createTime="${datas[i].createTime}" data-editTime="${datas[i].editTime}" data-userName="${datas[i].userName}">
                        //					<li class="dl_check"></li>
                        //					<li><img src="./img/${datas[i].dataType}.png" alt=""><p>${datas[i].name}</p><u class="dl_fb${datas[i].isRelease}"></u></li>
                        //					<li>${datas[i].dataType}</li>
                        //					<li>${datas[i].createTime}</li>
                        //					<li>------</li>
                        //				</ul>
                        //			`).appendTo($(".dl_list"));
                        //	}
                        //};
                    },
                });
            };
            $("#zy_search_button").val("全部");
        });
        

        //搜索 高级条件搜索
        $(".search_commit").click(function() {
            var type = $("#zy_search_buttton option:selected").text();
            var datas = [];
            if (type == "影像检索") {
                datas.keyword = $("#search_cs_keywords").val();
                datas.scjmc = $("#search_cs_name").val();
                // 摘要 waiting
                datas.DESCRIBE2 = $("#search_cs_zy").val();
                datas.extend = $("#search_cs_more").val();
                datas.specialType = $("#search_cs_zt option:selected").text();
                // waiting 纬度上
                // waiting 纬度下
                // waiting 纬度左
                // waiting 纬度右
                // waiting 采集时间start
                // waiting 采集时间end
                // waiting 入库时间start
                // waiting 入库时间end
                datas.resolution = $("#search_fbl option:selected").text();
                // waiting 云量
                datas = $("#search_yl option:selected").text();
                datas.SatelliteType = $("#search_wxxh").val();
                // waiting 载荷类型
                // waiting 产品等级

            }
        });

        // 复制列表toggle
        $(".copyTo").click(function(event) {
            if($(".moveWrap").is(':visible')){
                toggleState($(".moveTo")[0],"clicked");
            }
                $(".copyWrap").toggle();
                $(".moveWrap").hide();
            })
        //复制列表中文件夹展开
        $(".copyWrap").delegate(".wjj_leftbs", "click", function(event) {
            event.stopPropagation();
            $(this).children(".nav_item_sWrap").toggle();
            $(this).children("i").toggleClass("copyWrapActive");
            var ids = $(this).attr("id");
            var $that = $(this).find(".nav_item_sWrap");
            // 将被点击的元素的id存入新建文件夹按钮中的data-currentPid属性中，用于防止当前文件夹中是空，拿不到pid这个问题
            $(".copyTo").attr("data-currentpid", ids);
            $(".copyWrap").find("p").css("color", "#000");
            $(".copyTitle div").css("color","#000");
            $(this).children("p").css("color", "#009999");
            $(".copyTo").attr("data-currentid",ids);
            //GV.Center.Data.getFavoritesinfoByParentID({"parentId": ids}).then(res=>{
            //	var datas = res.item.items;
            //	$that.html("");
            //		for (var i in datas) {
            //			// 是否是文件夹
            //			if (!datas[i].metadata||datas[i].metadata==""||datas[i].metadata=="undefined") {
            //				// 文件夹左侧树模式
            //				$(`
            //				<li class="nav_item clearfix wjj_leftbs" id="${datas[i].id}" title="${datas[i].name}" data-pid="${datas[i].parentID}"  data-id="${datas[i].Metadata}" data-descirbe="${datas[i].descirbe}" data-createTime="${datas[i].createTime}" data-editTime="${datas[i].editTime}" data-userName="${datas[i].userName}" data-type="0">
            //					<i></i>
            //					<u></u>
            //					<p>${datas[i].name}</p>
            //					<div class="nav_item_sWrap clearfix"></div>
            //				</li>
            //					`).appendTo($that);
            //			}
            //		};
            //});
        });

        // 复制列表top”我的资源“点击事件
        $(".copyWrap").delegate(".copyTitle div","click",function(){
            $(".copyWrap").find("p").css("color","#000");
            // $("copyWrap").find(".activeFlag1").removeClass("activeFlag1");
            $(".copyTitle div").css("color","#009999");
            $(".copyTo").attr("data-currentid","-1");
        })

        //点击确定复制
        $(".copySure").click(function() {
            var uList = '';
            if ($(".download_ml").css("display") == "none") {
                uList = $(".wenjianContCont").find("u.SLCheckedActive");
            } else {
                uList = $(".download_ml").find("li.checkedActive");
            };
            // 声明需要传给后台的json
            var datas = {ids:''};
            // 判断是否勾选文件夹
            if(uList.length==0){
                openWindow("请勾选文件",false);
                return false;
            }else{
                for (var i = 0; i < uList.length; i++) {
                    var a = $(uList[i]).parent().attr("id");
                    datas.ids += a + ",";
                };
            };
            // 判断是否选中目录
            datas.pid = $(".copyTo").attr("data-currentid");
            if(!datas.pid){
                openWindow("请选择需要复制到的目录",false);
                return false;
            };
            // 判断是否复制到当前目录
            if($(".nav_title").attr("data-currentpid")==datas.pid&&datas.pid&&$(".nav_title").attr("data-currentpid")){
                openWindow("不允许复制到当前目录",false);
                return false;
            };

            //GV.Center.Data.copyFavoritesInfo ({"ids":datas.ids,"parentId":datas.pid}).then(res=>{
            //	$(".copyWrap").hide();
            //});
        });

        // 移动列表toggle
        $(".moveTo").click(function() {
            if($(".copyWrap").is(':visible')){
                toggleState($(".copyTo")[0],"clicked");
            }
            $(".moveWrap").toggle();
            $(".copyWrap").hide();
        })
        //移动列表中文件夹展开
        $(".moveWrap").delegate(".wjj_leftbs", "click", function(event) {
            event.stopPropagation();
            $(this).children(".nav_item_sWrap").toggle();
            $(this).children("i").toggleClass("moveWrapActive");
            var ids = $(this).attr("id");
            var $that = $(this).find(".nav_item_sWrap");
            // 将被点击的元素的id存入新建文件夹按钮中的data-currentPid属性中，用于防止当前文件夹中是空，拿不到pid这个问题
            $(".moveTo").attr("data-currentpid", ids);
            $(".moveWrap").find("p").css("color", "#000");
            $(".moveTitle div").css("color","#000");
            $(this).children("p").css("color", "#009999");
            $(".moveTo").attr("data-currentid",ids);
            //GV.Center.Data.getFavoritesinfoByParentID({"parentId": ids}).then(res=>{
            //	var datas = res.item.items;
            //	$that.html("");
            //		for (var i in datas) {
            //			// 是否是文件夹
            //			if (!datas[i].metadata||datas[i].metadata==""||datas[i].metadata=="undefined") {
            //				// 文件夹左侧树模式
            //				$(`
            //				<li class="nav_item clearfix wjj_leftbs" id="${datas[i].id}" title="${datas[i].name}" data-pid="${datas[i].parentID}"  data-id="${datas[i].Metadata}" data-descirbe="${datas[i].descirbe}" data-createTime="${datas[i].createTime}" data-editTime="${datas[i].editTime}" data-userName="${datas[i].userName}" data-type="0">
            //					<i></i>
            //					<u></u>
            //					<p>${datas[i].name}</p>
            //					<div class="nav_item_sWrap clearfix"></div>
            //				</li>
            //					`).appendTo($that);
            //			}
            //		};
            //});
        });
        
        // 移动列表top”我的资源“点击事件
        $(".moveWrap").delegate(".moveTitle div","click",function(){
            $(".moveWrap").find("p").css("color","#000");
            $(".moveTitle div").css("color","#009999");
            $(".moveTo").attr("data-currentid","-1");
        })

        //点击确定移动
        $(".moveSure").click(function() {
            var uList = '';
            if ($(".download_ml").css("display") == "none") {
                uList = $(".wenjianContCont").find("u.SLCheckedActive");
            } else {
                uList = $(".download_ml").find("li.checkedActive");
            };
            // 声明需要传给后台的json
            var datas = {ids:""};
            // 判断是否勾选文件夹
            if(uList.length==0){
                openWindow("请勾选文件",false);
                return false;
            }else{
                for (var i = 0; i < uList.length; i++) {
                    var a = $(uList[i]).parent().attr("id");
                    datas.ids += a + ",";
                };
            };
            // 判断是否选中目录
            datas.pid = $(".moveTo").attr("data-currentid");
            if(!datas.pid){
                openWindow("请选择需要移动到的目录",false);
                return false;
            };
            // 判断是否移动到当前目录
            if($(".nav_title").attr("data-currentpid")==datas.pid&&datas.pid&&$(".nav_title").attr("data-currentpid")){
                openWindow("不允许移动到当前目录",false);
                return false;
            };
            // var idsStr = JSON.stringify(datas.ids);
            //GV.Center.Data.moveFavoritesInfoList({"ids":datas.ids,"parentId":datas.pid}).then(res=>{
            //	for (var i = 0; i < uList.length; i++) {
            //			$(uList[i]).parent().remove()
            //		};
            //	$(".moveWrap").hide();
            //});
        });

        // 共享人员列表
        $(".shareTo").click(function() {
            $(".shareWrapToggle").html("");
            $(".shareWrap").toggle();
            $(".copyWrap").hide();
            $(".moveWrap").hide();
            // 获取部门目录
            $.ajax({
                type: "post",
                dataType: "json",
                url: "https://192.168.4.225:8443/user_oauth/admin/privilege/operation_getDeptTree.action",
                async: false,
                data: {
                    "token":acctoken
                },
                success: function(data) {
                    var datas = data.items;
                    //for (var i in datas) {
                    //	$(`
                    //			<li class="nav_item clearfix wjj_leftbs" id="${datas[i].id}">
                    //				<i></i>
                    //				<p>${datas[i].bmmc}</p>
                    //				<div class="nav_item_sWrap clearfix"></div>
                    //			</li>
                    //		`).appendTo($(".shareWrapToggle"));
                    //};
                    //$(`
                    //	<li class="nav_item clearfix wjj_leftbs" id="bm_others">
                    //		<i></i>
                    //		<p>其他</p>
                    //		<div class="nav_item_sWrap clearfix"></div>
                    //	</li>
                    //`).appendTo($(".shareWrapToggle"));
                },
                error: function() {
                    openWindow("部门列表获取失败",false)
                }
            });
            $.ajax({
                type: "get",
                dataType: "json",
                url: "https://192.168.4.225:8443/user_oauth/admin/privilege/operation_queryuser",
                async: false,
                data: {
                    "token":acctoken
                },
                success: function(data) {
                    var datas = data.jsonQueryResult.items;
                    for (var i in datas) {
                        if(!datas[i].bmzz){
                            var target = $("#bm_others>.nav_item_sWrap")
                        }else{
                            var target = $(".shareWrapToggle").find("#" + datas[i].bmzz.id + ">.nav_item_sWrap");
                        }
                        //$(`
                        //		<li class="nav_item clearfix wjj_leftbs" id="${datas[i].id}">
                        //			<div class="admin_unselect"></div>
                        //			<i></i>
                        //			<p>${datas[i].yhxm}</p>
                        //			<div class="nav_item_sWrap clearfix"></div>
                        //		</li>
                        //	`).appendTo(target);
                    }
                },
                error: function() {
                    openWindow("人员列表获取失败",false)
                }
            });
            // 对分享人员中的没有下级的人员进行小箭头删除
            var goal = $(".shareWrapToggle").find(".nav_item_sWrap");
            goal.each(function(i){
                if($(this).html() == ""){
                    $(this).siblings("i").css("visibility","hidden");
                }
            })
        });
        //共享人员列表的多选勾选
        $(".shareWrapToggle").delegate(".admin_unselect","click",function(){
            $(this).toggleClass("admin_selected");
        })

        //共享列表中文件夹展开
        $(".shareWrapToggle").delegate(".wjj_leftbs", "click", function(event) {
            event.stopPropagation();
            $(this).children(".nav_item_sWrap").toggle();
            $(this).children("i").toggleClass("shareWrapActive");
            var ids = $(this).attr("id");
            var $that = $(this).find(".nav_item_sWrap");
            // 将被点击的元素的id存入新建文件夹按钮中的data-currentPid属性中，用于防止当前文件夹中是空，拿不到pid这个问题
            $(".shareTo").attr("data-currentpid", ids);
            $(".shareWrap").find("p").css("color", "#000");
            $(".shareTitle div").css("color","#000");
            $(this).children("p").css("color", "#009999");
            $(".shareTo").attr("data-currentid",ids);
        });
        
    

        //点击确定共享
        $(".shareSure").click(function() {  
            var uList = '';
            if ($(".download_ml").css("display") == "none") {
                uList = $(".wenjianContCont").find("u.SLCheckedActive");
            } else {
                uList = $(".download_ml").find("li.checkedActive");
            };
            // 声明需要传给后台的json
            var datas = {metaids:"",ids:""};
            // 判断是否勾选文件夹
            if(uList.length==0){
                openWindow("请勾选文件",false);
                return false;
            }else{
                for (var i = 0; i < uList.length; i++) {
                    var a = $(uList[i]).parent().attr("id");
                    var b = $(uList[i]).parent().attr("data-id");
                    // datas.ids.push(a);
                    datas.ids += a + ",";
                    datas.metaids += b + ",";
                    if($(uList[i]).parent().hasClass("wjj_bs")){
                        $(".shareWrap").toggle();
                        openWindow("无法共享文件夹",false);
                        return false;
                    }
                };
            };
            // 判断是否选中目录
            datas.pid = $(".shareTo").attr("data-currentid");
            var sele_parent = $(".admin_selected").parent();
            var sele_uList = "";
            for(var i=0 ; i<sele_parent.length; i++){
                sele_uList += sele_parent[i].getAttribute("id") + ",";
            };
            datas.moreAdminList = sele_uList;
            if(!datas.moreAdminList){
                openWindow("请勾选需要共享到的人员",false);
                return false;
            };
            var userId = $("body").attr("data-userid");
            var beans = {"metadataIdList":datas.metaids,"initiateUserId":userId,"sharedUserIdList":datas.moreAdminList,"ids":datas.ids,"token":acctoken}
            var sendUrl = "http://192.168.4.225:9090/sg_server/service/sendDataObject";
            $.ajax({
                type: "post",
                dataType: "json",
                async: false,
                url: sendUrl,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(beans),
                success: function(data){
                    openWindow("共享成功",true);
                    $(".shareWrap").toggle();
                },
                error: function(data){
                    openWindow("共享失败",false)
                }
            })
        });

        //状态转换
        function toggleState(item,state1,state2){
            var oItem = $(item);
            var count;
            state1 == undefined? console.error("no state to toggle"):count = 1;
            state2 == undefined? count = 1: count = 2;

            //只传入了一个类名，状态转换为给item添加或移除这个类名
            if(count == 1){
                if(oItem.hasClass(state1)){
                    oItem.removeClass(state1);
                }else{
                    oItem.addClass(state1);
                }
            //传入了两个类名，状态转换为这两个类名之间转换
            }else if(count == 2){
                if(oItem.hasClass(state1)){
                    oItem.removeClass(state1);
                    oItem.addClass(state2);
                }else{
                    oItem.removeClass(state2);
                    oItem.addClass(state1);
                }
            }
        }

        // 文件上传新增入库
        function addUpload(data){
            var ids = data.metadataId;
            var pids = $(".nav_title").attr("data-currentpid");
            var names = data.imageName;
            // 对所上传的文件进行目录添加
            //GV.Center.Data.addFavoritesInfo({"ParentID":pids,"dataType":uploadFileType,"isRelease":1,"Metadata":data.metadataId,"Name":data.imageName,"Type":0,"Descirbe":'',"Viewpoint":'',"Geometry":'',"editType":0,"img":''}).then(res=>{
                //$(".wj_bs p").each(function(){
                //		if($(this).attr("id")){
                //			$(this).parent().attr("id",res.item.items[0].id).attr("data-type",uploadFileType).attr("data-pid",pids).attr("data-id",ids)
                //		}
                //	})
            //});
        };


        var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

        // 文件上传
        $(function(){

        function turnSocket(upload,check,unify){
            uploader.option("server",upload);
            // url = "http://192.168.44.57:8081/Liu0802WebUploader/upload";
            checkUrl = check;
            unifyUrl = unify;
        }

            var $ = jQuery;
            var $list = $('.wenjianContCont');
            // var $btn = $('#ctlBtn');
            var state = 'pending';
            var _extensions ='*';
            var _mimeTypes ='*';
            var chunkSize = 50*1024*1024;
            var uploader;
    // 		WebUploader.Uploader.register({
    // 	    "before-send-file": "beforeSendFile",  // 整个文件上传前
    // 	    "before-send": "beforeSend",           // 每个分片上传前
    // 	    "after-send-file": "afterSendFile"     // 分片上传完毕
    // 	 },
    // 	 {
    //     beforeSendFile: function (file) { 

    //         // console.log("beforeSendFile",file); 
    //         var deferred = WebUploader.Deferred();
    //         var start = new Date().getTime();  
    //         (new WebUploader.Uploader()).md5File(file, 0, 5*1024*1024)
    //         .progress(
    //                     function(percentage) {
    //                         $("#" + file.id).find("span.state").text(
    //                                 "正在获取文件信息...");
    //                     })

    //         .then(function(val){  
    //             file.chunksTotal = Math.ceil(file.size / chunkSize);
    //             file.fileMd5 = val;
    //             // 重命名
    //             var ids = $(".wenjianContCont p");
    // 			var totalName = [];
    // 			for(var i = 0 ; i < ids.length ; i ++ ){
    // 				totalName.push(ids[i].innerHTML);
    // 			};
    //             file.originName = check(totalName,file.name,0);
    //             file.uniqueFileName = MD5(file.name+start);
    //             file.status = "progress";

    //             deferred.resolve();  

    //         });  
    //         return deferred.promise();
    //     }
    //     , beforeSend: function (block) {
    //         // console.log("beforeSend",block);
    //         // 重命名flag_waiting
    //         turnSocket(block.file.url,block.file.checkUrl,block.file.unifyUrl);
    //         this.owner.options.formData.fileMd5 = block.file.fileMd5;
    //         var arr = block.file.originName.split(".");
    //         var suffix = arr[arr.length-1];
    //         arr[arr.length-1] = block.file.fileMd5;
    //         // block.file.name = arr.join(".")+"."+"part"+block.chunk+"."+suffix;
    //         //分片验证是否已传过，用于断点续传

    //         var deferred = WebUploader.Deferred();
    //         $.ajax({
    //             type: "POST",
    //             url: checkUrl,
    //             data: {
    //                 chunk: block.chunk,
    //                 fileMd5: block.file.fileMd5,
    //                 mimeTypes: fileType
    //                 // fileFileName: block.file.originName,
    //                 // size: block.end - block.start,
    //                 // uniqueFileName: block.file.uniqueFileName
    //             },
    //             cache: false,
    //             async: false,  // 同步
    //             timeout: 1000, //todo 超时的话，只能认为该分片未上传过
    //             dataType: "json"
    //         }).then(function (data, textStatus, jqXHR) {
    //             block.file.name = arr.join(".")+"."+"part"+block.chunk+"."+suffix;
                
    //             if (data.is_exists) { //若存在，返回失败给WebUploader，表明该分块不需要上传
    //                 deferred.reject();
    //             } else {
    //                 deferred.resolve();
    //             }
    //         }, function (jqXHR, textStatus, errorThrown) { //任何形式的验证失败，都触发重新上传
    //             block.file.name = arr.join(".")+"."+"part"+block.chunk+"."+suffix;
    //             deferred.resolve();
                
    //         });
    //         return deferred.promise();

    //     }
    //     , afterSendFile: function (file) {
    //     // console.log("afterSendFile",file);

    //         var chunksTotal = file.chunksTotal;
    //         if(chunksTotal >1){

    //             //合并请求
    //             var deferred = WebUploader.Deferred();
    //             $.ajax({
    //                 type: "POST",
    //                 url: unifyUrl,
    //                 data: {
    //                     // type: "merge",
    //                     fileMd5: file.fileMd5,
    //                     // fileFileName: file.originName,
    //                     name: file.originName,
    //                 	mimeTypes: fileType
    //                     // chunks: chunksTotal,
    //                     // size: file.size,
    //                     // uniqueFileName: file.uniqueFileName
    //                 },
    //                 cache: false,
    //                 async: false,  // 同步
    //                 dataType: "json"
    //             }).then(function (data, textStatus, jqXHR) {
    //                 // 业务逻辑...
    //                 addUpload(data);
    //                 deferred.resolve();  
    //             }, function (jqXHR, textStatus, errorThrown) {
    //                 console.log("merge error",arguments);
    //                 uploader.trigger('uploadError');
    //                 deferred.reject();
    //             });
    //             return deferred.promise();

    //         }
    //     }
    // });

            // uploader = WebUploader.create( {
            // 	auto : false, // 是否自动上传
            // 	pick : {
            // 		id : '#picker',
            // 		label : '点击选择文件',
            // 		multiple : true
            // 	// 默认为true，就是可以多选
            // 	},
            // 	swf : 'public/Uploader.swf',
            // 	// fileVal:'multiFile', //自定义file的name属性，我用的版本是0.1.5 ,打开客户端调试器发现生成的input
            // 	// 的name 没改过来。
            // 	// 名字还是默认的file,但不是没用哦。虽然客户端名字没改变，但是提交到到后台，是要用multiFile 这个对象来取文件的，用file
            // 	// 是取不到文件的
            // 	server : url,
            // 	duplicate : true,// 是否可重复选择同一文件
            // 	resize : false,

            // 	compress : null,
            // 	chunked : true, // 分片处理
            // 	chunkSize : chunkSize, // 每片50M,经过测试，发现上传1G左右的视频大概每片50M速度比较快的，太大或者太小都对上传效率有影响
            // 	chunkRetry : false,// 如果失败，则不重试
            // 	threads : 1,// 上传并发数。允许同时最大上传进程数。
            // 	// runtimeOrder: 'flash',
            // 	disableGlobalDnd : true,
            // 	accept: {      
            //         title: '视频文件上传',  //文字描述
            //         extensions: _extensions,     //允许的文件后缀，不带点，多个用逗号分割。,jpg,png,
            //         mimeTypes: _mimeTypes,      //多个用逗号分割。
            //     }
            // });

        /** 实现webupload hook，触发上传前，中，后的调用关键 **/

            
            // uploader.on( 'filesQueued', function( file ) {
            //     uploader.upload();
            // });
            // // 文件上传过程中创建进度条实时显示。
            // uploader.on( 'uploadProgress', function( file, percentage ) {
            //     var $li = $( '#'+file.id ),
            //         $percent = $li.parent().find('.mask_progress');

            //     $li.find('p.state').text('上传中');
            //     $percent.css( 'width', percentage * 100 + '%' );
            // });

        

            // uploader.on( 'uploadSuccess', function( file ) {

            //     $( '#'+file.id ).find('p.state').text('已上传');
            // });
            // uploader.on( 'uploadAccept', function(object,res){
            // 	console.log(object);
            // 	if(object.chunks <= 1 ){
            // 		addUpload(res);
            // 	}
            // });
            // uploader.on('uploadBeforeSend', function(obj, data, headers) {
            //     $.extend(headers, {
            // 		"Access-Control-Request-Method": "POST"
            //     });
            // });

            // uploader.on( 'uploadError', function( file ) {
            //     console.log("uploadError",arguments);
            //     $( '#'+file.id ).find('p.state').text('上传出错');
            // });

            // uploader.on( 'uploadComplete', function( file ) {
            //     $( '#'+file.id ).parent().find('.box_progress').fadeOut();
            //     $( '#'+file.id ).parent().removeClass("uploading");
            // });

            // uploader.on( 'all', function( type ) {
            //     if ( type === 'startUpload' ) {
            //         state = 'uploading';
            //     } else if ( type === 'stopUpload' ) {
            //         state = 'paused';
            //     } else if ( type === 'uploadFinished' ) {
            //         state = 'done';
            //     }
            // //     if ( state === 'uploading' ) {
            // //         $btn.text('暂停上传');
            // //     } else {
            // //         $btn.text('开始上传');
            // //     }
            // });

            // 当有文件添加进来的时候
            // uploader.on( 'fileQueued', function( file ) {
            // 	file.url = url;
            // 	file.checkUrl = checkUrl;
            // 	file.unifyUrl = unifyUrl;
            // 	// var fileName = file.name.substr(0,7)+"...";

            // 	var ids = $(".wenjianContCont p");
            // 	var c = file.name;
            // 	var abc = [];
            // 	for(var i = 0 ; i < ids.length ; i ++ ){
            // 		abc.push(ids[i].innerHTML);
            // 	};
            // 	var fileName = check(abc,c,0);
            // // GV.Center.Data.addFavoritesInfo({"Name":newName,"Type":1,"ParentID":pids,"dataType":0}).then(res=>{
            // // 	var data = res.item.items[0];
            // // })

            //     var $li = $('<div class="wenjianjia wenjian_common wj_bs uploading" id="200010035297352" data-type="null" title="'+file.name+'" data-pid="200010035297351" data-id="cd17f7be-1df4-4c6c-afdf-ad18081323cd">'+
            // 		'<div class="close"></div>'+
            // 		'<img src="./img/'+uploadFileType+'.png" alt="">'+
            // 		'<p id = "'+file.id+'">'+fileName+'</p>'+
            // 		'<i class="wenjian_fb1"></i>'+
            // 		'<i class="icon pause"></i>'+
            // 		'<u></u>'+
            // 	'</div>');

            //     $li.find(".pause").click(function(event){
            //         toggleState(this,"paused");
            //         var oFile = uploader.getFile(file.id);

            //         if(oFile.getStatus() == "progress"){
            //             console.log("暂停命令",oFile);
            //             // oFile.status = "interrupt";
            //             // uploader.stop(oFile);
            //             // oFile.setStatus("interrupt")
            //             oFile.setStatus("");
            //             // uploader.stop(file.id);
            //         }else if(oFile.getStatus() == ""){
            //             console.log("继续命令",oFile);
            //             // oFile.status = "progress";
            //             // oFile.setStatus("progress");
            //             uploader.upload(oFile);
            //         }
                    
            //         return false;
            //     });
            //     $li.find(".close").click(function(event){
            //     	var oFile = uploader.getFile(file.id);
            //     	var r=confirm("是否确认取消上传？");
            // 		if (r==true){
            // 			uploader.cancelFile(oFile);
            // 			$li.remove();
            // 	    }
            // 	  	else{
            // 	    	return false;
            // 	    }
            // 	    return false;
            //     });
            //     $list.append($li);
            //     $percent = $('<div class="box_progress">'+
            //             '<div class="mask_progress" style="width:0%;"></div>'+
            //             '</div>').appendTo( $li );

            // });
        
            $(".toolsjdr").click(function(){
                $(".inputWrap").toggle();
                // $("#picker>div>label")[0].click();
            });
            
            $(".dataCreat").click(function(){
                $(".jichuWrap").toggle();
                // $("#picker>div>label")[0].click();
            });
            // 局部影像文件上传
            $(".yx_upload").click(function(){

                // uploader.option("server","http://192.168.4.3:8808/image-service/manager/sliceUpload.action");
                url = "http://192.168.4.3:8808/image-service/manager/sliceUpload.action?token="+acctoken;
                checkUrl = "http://192.168.4.3:8808/image-service/manager/sliceCheck.action?token"+acctoken;
                unifyUrl = "http://192.168.4.3:8808/image-service/manager/sliceUnify.action?token"+acctoken;
                fileType = "['png']";
                turnSocket(url,checkUrl,unifyUrl);
                uploadFileType = "局部影像";
                $("#picker>div>label")[0].click();
                // $(".inputWrap").toggle();
            });
            // 局部矢量文件上传
            $(".sl_upload").click(function(){
                // uploader.option("server","http://192.168.44.57:8081/Liu0802WebUploader/upload");
                url = "http://192.168.44.57:8081/Liu0802WebUploader/upload";
                checkUrl = "http://192.168.44.57:8081/Liu0802WebUploader/check";
                unifyUrl = "http://192.168.44.57:8081/Liu0802WebUploader/merge";
                turnSocket(url,checkUrl,unifyUrl);
                uploadFileType = "局部矢量";
                $("#picker>div>label")[0].click();
                // $(".inputWrap").toggle();
            });
            // 局部高程文件上传
            $(".gc_upload").click(function(){
                // uploader.option("server","http://192.168.4.3:8808/image-service/manager/sliceUpload.action");
                // checkUrl = "http://192.168.4.3:8808/image-service/manager/sliceCheck.action";
                // unifyUrl = "http://192.168.4.3:8808/image-service/manager/sliceUnify.action";
                // checkUrl = "http://192.168.44.3:8080/image-service/manager/sliceCheck.action";
                // unifyUrl = "http://192.168.44.3:8080/image-service/manager/sliceUnify.action";
                // uploadFileType = "局部高程";
                // $("#picker>div>label")[0].click();
                // $(".inputWrap").toggle();
                url = "http://192.168.4.3:8808/image-service/manager/sliceUpload.action";
                checkUrl = "http://192.168.4.3:8808/image-service/manager/sliceCheck.action";
                unifyUrl = "http://192.168.4.3:8808/image-service/manager/sliceUnify.action";
                fileType = "['tiff']";
                turnSocket(url,checkUrl,unifyUrl);
                uploadFileType = "局部高程";
                $("#picker>div>label")[0].click();
            });
            // 基础数据文件上传
            $(".jc_upload").click(function(){
                uploader.option("server","http://192.168.4.3:8808/image-service/manager/sliceUpload.action");
                checkUrl = "http://192.168.4.3:8808/image-service/manager/sliceCheck.action";
                unifyUrl = "http://192.168.4.3:8808/image-service/manager/sliceUnify.action";
                checkUrl = "http://192.168.44.3:8080/image-service/manager/sliceCheck.action";
                unifyUrl = "http://192.168.44.3:8080/image-service/manager/sliceUnify.action";
                uploadFileType = "局部高程";
                $("#picker>div>label")[0].click();
            });
        });

        // 右侧弹出小g图标，返回webOS首页
        $(".minig").click(function(){
            window.location.href = "http://www.baidu.com";
        });

        $(".toolBtn").click(function(){
            // toggleState(this,"clicked");
        });
    }
    return {
        showProjectDialog:_showProjectDialog,
    }
});

