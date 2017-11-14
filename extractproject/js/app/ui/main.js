var small_Map;
var tempMap;
/**
 * Created by domea on 17-6-2.
 */
define(['jquery','dhtmlx','ol','../gis/mapControls','../scheme/scheme','../project/open','../gis/mapProduce'],function ($,dhtmlx,ol,mapControl,schemeObject,open,mapProduce) {    var _test=function(){
        window.dhx4.skin = 'material';
        var main_layout = new dhtmlXLayoutObject(document.body, '2U');

        var leftDiv = main_layout.cells('a');
        leftDiv.setWidth('200');
        leftDiv.fixSize(1,0);
        leftDiv.hideHeader();
        leftDiv.attachHTMLString('<div id="jstreeDiv" class="fileList" style="width:100%;height:100%;overflow:auto;background:black;padding-top:10px;float:left"></div>');  //左侧的文件列表
        //leftDiv.attachHTMLString('<div id="treeboxbox_tree" class="fileList">文件列表</div>');  //左侧的文件列表
        //var tree=new dhtmlXTreeObject("treeboxbox_tree","100%","100%",0);
        //tree.setImagePath("codebase/imgs/");
        //tree.enableDragAndDrop(false);
        //tree.enableTreeLines(false);
        //tree.setImageArrays("plus","","","","./csh_bluebooks/plus.gif");
        ////设置通用展开图示:
        //tree.setImageArrays("minus","","","","./csh_bluebooks/minus.gif");
        ////通用收起图示:
        //tree.setStdImages("./csh_bluebooks/book.gif",
        //    "./csh_bluebooks/folderOpen.gif","./csh_bluebooks/folderClosed.gif");
        //tree.loadJSONObject({id:0,
        //        item:[
        //            {id:1,text:"first",userdata:[{name:'url',content:'http://g.cn#1'}]},
        //            {id:2, text:"middle",userdata:[{name:'url',content:'http://g.cn#2'}],
        //                item:[
        //                    {id:"21", text:"child",userdata:[{name:'url',content:'http://g.cn#3'}]}
        //                ]},
        //            {id:3,text:"last",userdata:[{name:'url',content:'空'}]}
        //        ]
        //    }
        //);
        

        var rightDiv = main_layout.cells('b');
        rightDiv.hideHeader();

        //界面参数
        var ribbon_1 = rightDiv.attachRibbon({
            skin : "material", icons_path : "./img/", items : [
                    {id : "project", text : "工程", text_pos : "buttom", type : "block", mode : "cols", list : [
                    {id : "close", text : "关闭",img : "close.png",isbig : true,  type : "button"},
                    {id : "open", text : "打开",img : "submit.png", isbig : true, type : "button"},
                    {id : "export", text : "导入/导出",img : "import.png",isbig : true,  type : "button"}
                    //{id : "save", text : "保存",img : "import.png",isbig : true,  type : "button"}
                ]},
                {id : "tools", text : "工具", text_pos : "buttom", type : "block", mode : "cols", list : [
                    {id : "zoomIn", text : "放大",img:"big.png",isbig : true, type : "button"},
                    {id : "zoomOut", text : "缩小",img:"small.png",isbig : true, type : "button"},
                    {id : "translate", text : "平移",img : "move.png", isbig : true, type : "button"},
                    {id : "fullView", text : "全图",img:"allimage.png",isbig : true, type : "button"},
                    {id : "associatedDisplay", text : "关联",img:"view_connect.png",isbig : true, type : "button"}
                    //{id : "oneRatioOne", text : "1:1显示", img : "1show.png", isbig : true, type : "button"},
                    //{id : "group_1", text : "group_1", type : "group", list : [
                    //    {id : "contrast", text : "对比度", type : "text"},
                    //    {id : "hue", text : "", type : "slider",  size : 100, min : -180, max : 180,value:0, step : 1, margin : 10}
                    //]},
                    //{id : "group_2", text : "group_2", type : "group", list : [
                    //
                    //    {id : "sharpening", text : "锐&nbsp&nbsp&nbsp化", type : "text"},
                    //    {id : "chroma", text : "", type : "slider", size : 100, min : 0, max : 100,value:100, step : 1, margin : 10}
                    //]},
                    //{id : "group_3", text : "group_2", type : "group", list : [
                    //
                    //    {id : "light", text : "亮&nbsp&nbsp&nbsp度", type : "text"},
                    //    {id : "lightness", text : "", type : "slider", size : 100, min : 0, max : 100,value:100, step : 1, margin : 10}
                    //]}

                ]},
                {id : "edit", text : "编辑", text_pos : "buttom", type : "block", mode : "cols", list : [

                    {id : "addPoint", text : "添加点",img:"plus_point.png", isbig : true, type : "button"},
                    {id : "stabPoint", text : "刺点",img:"hit_point.png", isbig : true, type : "button"},
                    {id : "modifyPoint", text : "修改点",img:"change_point.png", isbig : true, type : "button"},
                    {id : "deleteSingle", text : "删除点",img:"delete_point.png",isbig : true, type : "button"},
                    {id : "deleteAll", text : "删除所有点", img:"delete_all_point.png",isbig : true,type : "button"},
                    //{id : "delete", text : "删除",img:"删除点48px.png", isbig : true, type : "buttonSelect", items : [
                    //    {type : "item", buttonid : "deleteSingle",img:"删除点22px.png", text : "删除点"},
                    //    {type : "item", buttonid : "deleteAll",img:"删除所有点22px.png", text : "删除所有点"}
                    //]},
                    //{id : "autoPrediction", text : "自动预测",img:"auto.png",isbig : true, type : "button"},
                    //{id : "associatedDisplay", text : "关联显示",img:"view_connect.png",isbig : true, type : "button"}

                ]},
                {id : "collectMode", text : "采集规划方式", text_pos : "buttom", type : "block", mode : "cols", list : [

                    {id : "goalProgram", text : "目标规划",img:"auto_match.png", isbig : true, type : "button"},
                    {id : "evenProgram", text : "均匀规划",img:"network.png", isbig : true, type : "button"},
                    {id : "freeProgram", text : "自由规划",img:"network.png", isbig : true, type : "button"}
                ]},
                {id : "process", text : "处理", text_pos : "buttom", type : "block", mode : "cols", list : [

                    {id : "pointHeight", text : "特征点高程获取",img:"auto_match.png", isbig : true, type : "button"},
                    {id : "pointDraw", text : "特征点提取精化",img:"auto_match.png", isbig : true, type : "button"},
                    {id : "pointProduce", text : "特征点数据生成",img:"network.png", isbig : true, type : "button"}
                ]}
            ]
        });
        var layout_1 = rightDiv.attachLayout('2E');
        var cell_1 = layout_1.cells('a');
        cell_1.hideHeader();
        var layout_2 = cell_1.attachLayout('3L');

        var cell_6 = layout_2.cells('a');
        cell_6.fixSize(1,0);
        cell_6.hideHeader();
        cell_6.setWidth('1390');
        //添加地图容器、试图控制选项卡
        cell_6.attachHTMLString('<div id="mapShow">' +
        '<div class="showMapTemplate">'+
        '<div class="list-container">'+
        '<ul class="main-view">'+
        '<li  class="name mainView"  >主视图</li>'+
        '<li class="number tabLi" >'+
        '<span class="idName"></span>'+
        '<span class="delete">&times;</span>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div class="sub-view">'+
        '<div class="mapMainContainer" id="mapMainContainer"></div>' +
        '<div class="idMapContainer"></div>'+
        '</div>'+
        '</div>' +
        '</div>');

        var cell_7 = layout_2.cells('b');
        cell_7.fixSize(0,1);
        cell_7.hideHeader();
        cell_7.attachHTMLString('<div id="small_map" style="width:100%;height:100%"></div>');


        var cell_8 = layout_2.cells('c');
        cell_8.fixSize(0,1);
        cell_8.hideHeader();
        cell_8.attachHTMLString('<div id="attribute_table">' +
            '<ul class="attribute_attr">' +
            '<li>属性:</li>' +
            '<li>图幅编号:</li>' +
            '<li>测区时间:</li>' +
            '<li>测区名称:</li>' +
            '<li>像空点编号:</li>' +
            '<li>平面坐标系:</li>' +
            '<li>高程坐标系:</li>' +
            '<li>人员:</li>' +
            '<li>级别:</li>' +
            '<li>精度:</li>' +
            '<li>采集规划:</li>' +
            '<li>控制点种类:</li>' +
            '</ul>' +
            '<ul class="attribute_value">' +
            '<li>值</li>' +
            '<li id="GRAPHID">1</li>' +
            '<li id="PRODUCTIONDATE">1</li>' +
            '<li id="ZONENAME">1</li>' +
            '<li id="FEATUREID">1</li>' +
            '<li id="PLANECOORDINATESYSTEM">1</li>' +
            '<li id="HEIGHTCOORDINATESYSTEM">1</li>' +
            '<li id="PERSON">1</li>' +
            '<li id="LEVEL">1</li>' +
            '<li id="RESOLUTION">1</li>' +
            '<li id="METHOD">1</li>' +
            '<li id="CONTROLPOINTSORT">1</li>' +
            '</ul>' +
            '</div>'
        );


        var cell_2 = layout_1.cells('b');
        cell_2.setText('点信息');
        cell_2.setHeight('250');
        cell_2.fixSize(0,1);
        var grid_3 = cell_2.attachGrid();
        grid_3.setIconsPath('./codebase/imgs/');
        grid_3.setHeader(["序号","点ID","经度","纬度","高程"]);
        grid_3.setColTypes("ro,ro,edtxt,edtxt,edtxt");
        grid_3.enableMultiselect(true);
    //grid_3.enableMultiline(true);

        grid_3.setColSorting('str,str,str,str,str');
        grid_3.setInitWidths('*,*,*,*,*');
        grid_3.init();
        //grid_3.load('./data/grid.xml','xml');

        var data={
            rows:[
                { id:1, data: ["1", "1","经度000","纬度000","111"]},
                { id:2, data: ["2", "2","经度000","纬度000","111"]},
                { id:3, data: ["3", "3","经度000","纬度000","111"]},
                { id:4, data: ["4", "4","经度000","纬度000","111"]}
            ]
        };
        grid_3.parse(data,function(){
            //alert(1);
        },"json");


        //存储每个创建的小地图，用于地图联动
       var mapLinkMove = [];
       //创建小地图
        var creatDiv = function(){
            $("#small_map").empty();   //小地图地图容器每次创建前将前一次的小地图清空
            mapLinkMove = [];
            var mapCount = parseInt(arr[0].mapCount);
            for(var i=0;i<mapCount;i++){
                $("#small_map").append('<div class="tabContent" id="tabContent'+ i+'"><div class="ol-mouse-position"></div></div>');
                var smallMap =  mapControl.createSmallMap("ol-mouse-position","tabContent"+i);  // 调用地图，第一个参数，鼠标移动控件挂载点，第二个参数：地图控件挂载点
                mapLinkMove.push(smallMap);
            }
            i=null;
        };

        var mapCount;
        var arr = [];
         //每次单击一行，取得那一行的信息
        grid_3.attachEvent('onRowSelect', function(rId, cInd){
            var obj = {};
            obj.id = rId;   //行ID
            obj.mapCount =  grid_3.cells(rId,3).getValue();  //取得重叠度
            if(!arr[0]){      // 第一次选择一行
                arr.push(obj);
            }else{     //判断选择的这一行是否已经存在了
                if(parseInt(arr[0].id) === parseInt(obj.id)){
                   return arr;
                }else{
                    arr.pop(arr[0]);
                    arr.push(obj);
                }
            }
            // $(".tabLi").css({"display":"block"});   //选择一行，显示其对应的选项卡
            $('.idName').html(rId);              // 将选择的那一行显示到选项卡
            creatDiv();       //创建每副小地图容器，并且调用地图
            return arr;
        });

        var status_1 = layout_1.attachStatusBar();
        //主视图鼠标移动显示经纬度控件挂载点
        status_1.setText('<div id="post11"><div class="ol-mouse-position2"></div></div>');
        $("#post11").css({
            "position": "relative",
            "top": "0",
            "left": "80%",
            "width": "240px",
            "height": "30px",
            "line-height":"30px",
            "text-align":"center"
        });

        //主视图和分视图是否显示
        var $mainViewFlag = true;
        var $subViewFlag = true;
        var tabChange = function(){  //切换主视图、分视图
            $(".mainView").on('click',function(){
                $subViewFlag = false;
                if($mainViewFlag){
                    return;
                }else{
                    $mainViewFlag = true;
                    $(this).addClass('name');
                    $(".tabLi").removeClass('name');
                    $('.mapMainContainer').css({"display":"block"});
                    $(".idMapContainer").css({"display":"none"});
                }
            });
            $(".tabLi").on('click',function(){
                $mainViewFlag = false;
                if($subViewFlag){
                    return;
                }else{
                    $subViewFlag = true;
                    $(this).addClass('name');
                    $(".mainView").removeClass('name').addClass('number');
                    $(".idMapContainer").css({"display":"block"});
                    $('.mapMainContainer').css({"display":"none"});
                }
            });
            //删除分视图
            $(".delete").on('click',function(e){
                e.stopPropagation();
                e.preventDefault();
                $subViewFlag = false;
                $(".tabLi").removeClass('name').fadeOut();
                $(".mainView").addClass('name');
                $('.mapMainContainer').css({"display":"block"});
                $(".idMapContainer").empty().fadeOut();
            })
        };
        function overView(){
            var small_Map = new ol.Map({
            layers: [
                //默认调取瓦片地图
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target:"small_map",
            controls: ol.control.defaults({
                attribution: false,
                rotate: false,
                zoom: false
            }).extend([
                new ol.control.MousePosition({
                    coordinateFormat: ol.coordinate.createStringXY(4),
                    projection: 'EPSG:4326',
                    className:"ol-mouse-position",
                    target:"small_map"
                })
            ]),
            view: new ol.View({
                projection:'EPSG:4326',
                center: [104.06, 30.67],
                zoom: 3,
                minZoom:2,
                maxZoom:18,
                maxResolution:0.703125
            })
        });
        small_Map.on('moveend',function(event){
              tempMap.mapMainContainer.setView(small_Map.getView());
              tempMap.mapMainContainer.getView().setZoom(small_Map.getView().getZoom());
        }); 
        tempMap.mapMainContainer.on('moveend',function(event){
              small_Map.setView(tempMap.mapMainContainer.getView());
              small_Map.getView().setZoom(tempMap.mapMainContainer.getView().getZoom())
        }); 
        }
        $(function(){
            //参数1：主视图地图 鼠标移动控件内容(经纬度)挂载点，参数2：地图id挂载点，参数三：将控件放到目标位置挂载点
            tempMap = mapControl.createMap("ol-mouse-position2","mapMainContainer","post11");
            tabChange(); //调用
            overView();
    });
    
        //var grid_2 ;
        //var cell_3 = layout_1.cells('c');
        //cell_3.setText('影像列表');
        //cell_3.setHeight('200');
        //cell_3.fixSize(0,1);
        //
        // grid_2 = cell_3.attachGrid();
        //grid_2.setIconsPath('./codebase/imgs/');
        //
        //grid_2.setHeader(["","点ID","影像ID","影像名称","有效","X","Y"]);
        //grid_2.setColTypes("ro,ro,ro,ro,ro,ro,ro");
        //
        //grid_2.setColSorting('str,str,str,str,str,str,str');
        //grid_2.setInitWidths('*,*,*,*,*,*,*');
        //grid_2.init();
        //grid_2.load('./data/grid.xml','xml');

        //监听锐化、对比度、亮度值是否改变
       var __listenValue = function (){
           ribbon_1.attachEvent("onValueChange",function(id,value){
               //改变处理地图，默认处理主视图，处理小地图 请判断添加代码
               mapControl.changeColor(id,value,"mapMainContainer")
           });
       };
        ribbon_1.attachEvent("onValueChange",function(id,value){
            //改变处理地图，默认处理主视图，处理小地图 请判断添加代码
            mapControl.changeColor(id,value,"mapMainContainer")
        });
        //监听菜单是否点击了
        ribbon_1.attachEvent("onClick", function(id) {
            switch(id){
                case "open":
                  open.showProjectDialog();
                    break;
                case "close":
                    //console.log(id);
                    break;
                case "export":
                    mapControl.export({
                        eventName:"onClick"
                    });
                    break;
 				case "goalProgram":
                    mapControl.targetScheme("goalProgram");
                    break;
                case "evenProgram":
                    mapControl.targetSchemeEven("evenProgram");
                     break;
                case "freeProgram":
                    mapControl.targetSchemeFree("freeProgram");
                    break;
                case "zoomIn":
                    $("#mapMainContainer").css({"cursor":"crosshair"});
                    mapControl.zoomIn({
                         eventName:"onClick",
                         arg: []
                     });
                    break;
                case "zoomOut":
                    $("#mapMainContainer").css({"cursor":"crosshair"});
                    mapControl.zoomOut({
                        eventName:"onClick"
                      //  arg: [id,"mapMainContainer"]
                    });
                    break;
                case "fullView":
                    mapControl.fullView({
                        eventName:"onClick"
                        //arg: [id,mapId]
                    });
                    break;
                case "translate":
                    $(".mapMainContainer").css({"cursor":"move"});
                    mapControl.translate({
                        eventName:"onClick"
                        //arg: [id,mapId]
                    });
                    break;
                //case "oneRatioOne":
                //    mapControl.oneRatioOne({
                //        eventName:"onClick"
                //        //arg: [id,mapId]
                //    });
                //    break;
                case "addPoint":
                    $(".mapMainContainer").css({"cursor":"default"});
                    mapControl.addPoint({
                        eventName:"onClick",
                        arg: [grid_3]
                    });
                    break;
                case "stabPoint":
                   // $(".mapMainContainer").css({"cursor":"crosshair"});
                    $(".mapMainContainer").css({"cursor":"default"});
                    mapControl.stabPoint({
                        eventName:"onClick",
                        arg: [grid_3]
                    });
                    break;
                case "modifyPoint":
                    $(".mapMainContainer").css({"cursor":"pointer"});
                    mapControl.modifyPoint({
                        eventName:"onClick",
                        arg: [grid_3]
                    });
                    break;
                case "deleteSingle":
                    mapControl.deleteSinglePoint({
                        eventName:"onClick",
                        arg: [grid_3]
                    });
                    break;
                case "deleteAll":
                    mapControl.deleteAllPoint({
                        eventName:"onClick",
                        arg: [grid_3]
                    });
                    break;
                case "goalProgram":

                    break;
                case "evenProgram":

                    break;
                case "freeProgram":

                    break;
                //case "save":
                //    mapProduce.saveDate({
                //        eventName:"onClick",
                //        arg: [grid_3]
                //    });
                //    break;
                case "pointHeight":
                    mapProduce.pointHeight({
                        eventName:"onClick",
                        arg: [grid_3]
                    });
                    break;
                case "pointDraw":
                    mapProduce.pointDraw({
                        eventName:"onClick",
                        arg: [grid_3,cell_8]
                    });
                    break;
                case "pointProduce":
                    mapProduce.pointProduce({
                        eventName:"onClick"
                    });
                    break;
                //case "autoPrediction":
                //    $(".autoMatch").addClass("autoMatchLoading").fadeIn(500);
                //    //这里写的只是测试加载动画，真实情况要从后台处理数据进度判断动画消失的时间
                //    setTimeout(function(){
                //        $(".autoMatch").removeClass('.autoMatchLoading').fadeOut(500);
                //    },10000);
                //    break;
                //case "associatedDisplay":
                //    mapControl.mapLinkMove({
                //        eventName:"onclick",
                //        args:[mapLinkMove]
                //    });
                //    break;
                //case "autoMatch":
                //    $(".autoMatch").addClass("autoMatchLoading").fadeIn(500);
                //    //这里写的只是测试加载动画，真实情况要从后台处理数据进度判断动画消失的时间
                //    setTimeout(function(){
                //        $(".autoMatch").removeClass('.autoMatchLoading').fadeOut(500);
                //    },10000);
                //
                //    break;
                //case "blockAdjustment":
                //    //console.log(id);
                //    break;
            }
        });

        ribbon_1.attachEvent('onCheck', function(id, state){
           switch(id){
               case "imageRange":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "imageControl":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "controlPoint":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "linkPoint":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "checkPoint":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "pointID":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "contrast":
                   console.log(state);
                   if(state){
                       __listenValue();
                   }
                   break;
               case "sharpening":
                   if(state){
                       __listenValue();
                   }
                   break;
               case "light":
                   if(state){
                       __listenValue();
                   }
                   break;
           }
        });
    //监听点信息列表,并编辑后保存至全局
    grid_3.attachEvent("onEditCell",function(stage,rowId,cellIndex,newValue,oldValue){
        if ((stage==2)&&(newValue!=oldValue)){
            alert("Cell with id="+rowId+" and index="+cellIndex+" was edited");
            dataMain.FeaturePoint.Property.forEach(function(item,index){
                if(item.POINTID==rowId){
                    if(cellIndex==2){
                        item.LONRANGE=grid_3.cells(rowId, cellIndex).getValue();
                        //console.log(item.active);
                    }else if(cellIndex==3){
                        item.LATRANGE=grid_3.cells(rowId, cellIndex).getValue();
                    }else if(cellIndex==4){
                        item.HEIGHT=grid_3.cells(rowId, cellIndex).getValue();
                    }
                }
            });
            return true;
        }
        console.log(dataMain);
        return true;
    });
    };
    return {
        test:_test
    };
});