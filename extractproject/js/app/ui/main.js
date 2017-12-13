var small_Map;
var tempMap;
var dataDisplay;
var windowGrid;
//主视图添加预测的点
//var mainAddPoint;
/**
 * Created by domea on 17-6-2.
 */
define(['jquery','dhtmlx','ol','../gis/mapControls','../scheme/scheme','../project/open','../gis/mapProduce'],function ($,dhtmlx,ol,mapControl,scheme,open,mapProduce) {
    var _test=function(){
        document.oncontextmenu = function(){
            return false;
        }
        window.dhx4.skin = 'material';
        var main_layout = new dhtmlXLayoutObject(document.body, '2U');

        var leftDiv = main_layout.cells('a');
        leftDiv.setWidth('200');
        leftDiv.fixSize(1,0);
        leftDiv.hideHeader();
        leftDiv.attachHTMLString('<label class="leftLabel">PROJECT</label><div id="jstreeDiv" class="fileList" style="width:100%;height:100%;overflow:auto;background:black;padding-top:10px;float:left"></div>');  //左侧的文件列表
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
                    {id : "open", text : "打开",img : "submit.png", isbig : true, type : "button"},
                    {id : "export", text : "导入/导出",img : "import.png",isbig : true,  type : "button"},
                        {id : "save", text : "保存",img : "save.png",isbig : true,  type : "button"},
                    {id : "close", text : "关闭",img : "close.png",isbig : true,  type : "button"}
                ]},
                {id : "tools", text : "工具", text_pos : "buttom", type : "block", mode : "cols", list : [
                    {id : "zoomIn", text : "放大",img:"big.png",isbig : true, type : "button"},
                    {id : "zoomOut", text : "缩小",img:"small.png",isbig : true, type : "button"},
                    {id : "translate", text : "平移",img : "move.png", isbig : true, type : "button"},
                    {id : "fullView", text : "全图",img:"allimage.png",isbig : true, type : "button"},
                    {id : "associatedDisplay", text : "关联",img:"view_connect.png",isbig : true, type : "buttonTwoState"}
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
                    {id : "stabPoint", text : "刺点",img:"hit_point.png", isbig : true, type : "buttonTwoState"},
                    {id : "modifyPoint", text : "修改点",img:"change_point.png", isbig : true, type : "buttonTwoState"},
                    {id : "deleteSingle", text : "删除点",img:"delete_point.png",isbig : true, type : "buttonTwoState"},
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
                    {id : "freeProgram", text : "自由规划",img:"free-plan.png", isbig : true, type : "button"}
                ]},
                {id : "process", text : "处理", text_pos : "buttom", type : "block", mode : "cols", list : [

                    {id : "pointHeight", text : "特征点高程获取",img:"auto_match.png", isbig : true, type : "button"},
                    {id : "pointDraw", text : "特征点提取精化",img:"auto_match.png", isbig : true, type : "button"},
                    {id : "pointProduce", text : "特征点切片入库",img:"network.png", isbig : true, type : "button"},
                    {id : "groundProduce", text : "大地控制点制备",img:"network.png", isbig : true, type : "button"},
                    {id : "photoProduce", text : "相片控制点制备",img:"network.png", isbig : true, type : "button"}
                ]}
            ]
        });
        var systemKey = getUrlParam("systemkey");
        if(systemKey == "yx"){
            ribbon_1.hide("groundProduce");
            ribbon_1.hide("photoProduce");
        }else if(systemKey == "dd"){
            ribbon_1.hide("collectMode");
            ribbon_1.hide("pointProduce");
            //ribbon_1.hide("pointDraw");
            ribbon_1.hide("photoProduce");
        }else if(systemKey == "xp"){
            ribbon_1.hide("collectMode");
            ribbon_1.hide("pointProduce");
            ribbon_1.hide("pointDraw");
            ribbon_1.hide("groundProduce");
        }

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
            '<li>像控点编号:</li>' +
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
            '<li id="GRAPHID"></li>' +
            '<li id="PRODUCTIONDATE"></li>' +
            '<li id="ZONENAME"></li>' +
            '<li id="FEATUREID"></li>' +
            '<li id="PLANECOORDINATESYSTEM"></li>' +
            '<li id="HEIGHTCOORDINATESYSTEM"></li>' +
            '<li id="PERSON"></li>' +
            '<li id="LEVEL"></li>' +
            '<li id="RESOLUTION"></li>' +
            '<li id="METHOD"></li>' +
            '<li id="CONTROLPOINTSORT"></li>' +
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
        windowGrid = grid_3;
        //grid_3.load('./data/grid.xml','xml');

        //var data={
        //    rows:[
        //        { id:1, data: ["1", "1","经度000","纬度000","111"]},
        //        { id:2, data: ["2", "2","经度000","纬度000","111"]},
        //        { id:3, data: ["3", "3","经度000","纬度000","111"]},
        //        { id:4, data: ["4", "4","经度000","纬度000","111"]}
        //    ]
        //};
        //grid_3.parse(data,function(){
        //    //alert(1);
        //},"json");


        //存储每个创建的小地图，用于地图联动
       //var mapLinkMove = [];
       ////创建小地图
       // var creatDiv = function(){
       //     $("#small_map").empty();   //小地图地图容器每次创建前将前一次的小地图清空
       //     mapLinkMove = [];
       //     var mapCount = parseInt(arr[0].mapCount);
       //     for(var i=0;i<mapCount;i++){
       //         $("#small_map").append('<div class="tabContent" id="tabContent'+ i+'"><div class="ol-mouse-position"></div></div>');
       //         var smallMap =  mapControl.createSmallMap("ol-mouse-position","tabContent"+i);  // 调用地图，第一个参数，鼠标移动控件挂载点，第二个参数：地图控件挂载点
       //         mapLinkMove.push(smallMap);
       //     }
       //     i=null;
       // };

        var mapCount;
        var arr = [];
         //每次单击一行，取得那一行的信息
        grid_3.attachEvent('onRowSelect', function(rId, cInd){
            $(".mapMainContainer").css({"cursor": "default"});
            ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
            mapControl.removeAdd();                                 //移除刺点关联
            ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
            mapControl.removeEdit();                                //移除修改关联
            var arr = [];
            var lon =  parseFloat(grid_3.cells(rId,2).getValue());  //取得经度
            var lat =  parseFloat(grid_3.cells(rId,3).getValue());  //取得纬度

            arr.push(lon);
            arr.push(lat);
            console.log(arr);
            //让小图的中心点跟着点列表数据联动
            var map=open.funReturnmin();
            var view = map.getView();
            // 移动中心点
            view.setCenter(ol.proj.transform(arr, 'EPSG:4326', 'EPSG:4326'));
            //console.log("jack");
            //map.render();

            mapControl.highLight(rId);
        });







        var status_1 = layout_1.attachStatusBar();
        //主视图鼠标移动显示经纬度控件挂载点
    status_1.setText("<progress style='float: left; class='progress'  id='progressBar' value='' max='100'></progress></div><div id='post11'><div class='ol-mouse-position2'></div></div>");
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
        //var tabChange = function(){  //切换主视图、分视图
        //    $(".mainView").on('click',function(){
        //        $subViewFlag = false;
        //        if($mainViewFlag){
        //            return;
        //        }else{
        //            $mainViewFlag = true;
        //            $(this).addClass('name');
        //            $(".tabLi").removeClass('name');
        //            $('.mapMainContainer').css({"display":"block"});
        //            $(".idMapContainer").css({"display":"none"});
        //        }
        //    });
        //    $(".tabLi").on('click',function(){
        //        $mainViewFlag = false;
        //        if($subViewFlag){
        //            return;
        //        }else{
        //            $subViewFlag = true;
        //            $(this).addClass('name');
        //            $(".mainView").removeClass('name').addClass('number');
        //            $(".idMapContainer").css({"display":"block"});
        //            $('.mapMainContainer').css({"display":"none"});
        //        }
        //    });
        //    //删除分视图
        //    $(".delete").on('click',function(e){
        //        e.stopPropagation();
        //        e.preventDefault();
        //        $subViewFlag = false;
        //        $(".tabLi").removeClass('name').fadeOut();
        //        $(".mainView").addClass('name');
        //        $('.mapMainContainer').css({"display":"block"});
        //        $(".idMapContainer").empty().fadeOut();
        //    })
        //};
        //function overView(){
        //    //var small_Map = open.funReturn();
        //    var small_Map = new ol.Map({
        //    layers: [
        //        //默认调取瓦片地图
        //        new ol.layer.Tile({
        //            source: new ol.source.OSM()
        //        })
        //    ],
        //    target:"small_map",
        //    controls: ol.control.defaults({
        //        attribution: false,
        //        rotate: false,
        //        zoom: false
        //    }).extend([
        //        new ol.control.MousePosition({
        //            coordinateFormat: ol.coordinate.createStringXY(4),
        //            projection: 'EPSG:4326',
        //            className:"ol-mouse-position",
        //            target:"small_map"
        //        })
        //    ]),
        //    view: new ol.View({
        //        projection:'EPSG:4326',
        //        center: [104.06, 30.67],
        //        zoom: 3,
        //        minZoom:2,
        //        maxZoom:18,
        //        maxResolution:0.703125
        //    })
        //});
        //small_Map.on('moveend',function(event){
        //      tempMap.mapMainContainer.setView(small_Map.getView());
        //      tempMap.mapMainContainer.getView().setZoom(small_Map.getView().getZoom());
        //});
        //    console.log(small_Map);
        //    console.log(tempMap.mapMainContainer);
        //tempMap.mapMainContainer.on('moveend',function(event){
        //      small_Map.setView(tempMap.mapMainContainer.getView());
        //      small_Map.getView().setZoom(tempMap.mapMainContainer.getView().getZoom())
        //});
        //}
    //    $(function(){
    //        //参数1：主视图地图 鼠标移动控件内容(经纬度)挂载点，参数2：地图id挂载点，参数三：将控件放到目标位置挂载点
    //        tempMap = mapControl.createMap("ol-mouse-position2","mapMainContainer","post11");
    //        tabChange(); //调用
    //        overView();
    //});
    
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
                  //open.showProjectDialog();
                    open.openProject();
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    break;
                case "close":
                    //_removeState();
                    if
                    (confirm("您确定要关闭本系统吗？")){
                        window.opener=null;
                        window.open('','_self');
                        window.close();
                    }
                    else{}
                    console.log(id);
                    break;
                case "export":
                    mapControl.export({
                        eventName:"onClick"
                    });
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    break;
 				case "goalProgram":
                    mapControl.targetScheme("goalProgram");
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    break;
                case "evenProgram":
                    mapControl.targetSchemeEven("evenProgram");
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                     break;
                case "freeProgram":
                    mapControl.targetSchemeFree("freeProgram");
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    break;
                case "zoomIn":
                    $("#mapMainContainer").css({"cursor":"crosshair"});
                    mapControl.zoomIn({
                         eventName:"onClick",
                         arg: []
                     });
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    break;
                case "zoomOut":
                    $("#mapMainContainer").css({"cursor":"crosshair"});
                    mapControl.zoomOut({
                        eventName:"onClick"
                      //  arg: [id,"mapMainContainer"]
                    });
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    break;
                case "fullView":
                    mapControl.fullView({
                        eventName:"onClick"
                        //arg: [id,mapId]
                    });
                    scheme.removeDraw();        //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    break;
                case "translate":
                    $(".mapMainContainer").css({"cursor":"move"});
                    //mapControl.translate({
                    //    eventName:"onClick"
                    //    //arg: [id,mapId]
                    //});
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
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
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    break;
                //case "stabPoint":
                //   // $(".mapMainContainer").css({"cursor":"crosshair"});
                //    $(".mapMainContainer").css({"cursor":"default"});
                //    mapControl.stabPoint({
                //        eventName:"onClick",
                //        arg: [grid_3]
                //    });
                //    break;
                //case "modifyPoint":
                //    $(".mapMainContainer").css({"cursor":"pointer"});
                //    mapControl.modifyPoint({
                //        eventName:"onClick",
                //        arg: [grid_3]
                //    });
                //    break;
                case "deleteSingle":
                    mapControl.deleteSinglePoint({
                            eventName:"onClick",
                            arg: [grid_3]
                        });
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    break;
                case "deleteAll":
                    mapControl.deleteAllPoint({
                        eventName:"onClick",
                        arg: [grid_3]
                    });
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
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
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    break;
                case "pointDraw":
                    mapProduce.pointDraw({
                        eventName:"onClick",
                        arg: [grid_3,cell_8,open]
                    });
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    break;
                case "pointProduce":
                    mapProduce.pointProduce({
                        eventName:"onClick"
                    });
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    mapControl.removeDelete();
                    break;
                case "save":
                    mapProduce.save({
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
                //    mapControl.associatedDisplay({
                //        eventName:"onclick",
                //        args:[]
                //    });
                //    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                //    mapControl.removeAdd();                                 //移除刺点关联
                //    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                //    mapControl.removeEdit();                                //移除修改关联
                //    $(".mapMainContainer").css({"cursor": "default"});
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
        ribbon_1.attachEvent("onStateChange", function(id, value){
            //your code here
            switch(id){
                case "stabPoint":
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    //mapControl.removeDelete();
                    //smallMap.removeEdit();
                    //smallMap.removeDelete();
                    if(value == true) {
                        $(".mapMainContainer").css({"cursor": "crosshair"});
                        // $(".mapMainContainer").css({"cursor":"default"});
                        mapControl.stabPoint({
                            eventName: "onClick",
                            arg: [grid_3]
                        });
                        //$("." + mapId).css({"cursor": "crosshair"});
                        //smallMap.addPoint({
                        //    eventNme: "onClick",
                        //    arg: [id, grid_2, mapId, _returnAddPoint, pointId]
                        //});

                    }else{
                        $(".mapMainContainer").css({"cursor": "default"});
                        //mapControl.removeInteraction();
                        mapControl.removeAdd();                                 //移除刺点关联
                        //smallMap.removeAdd(mapId);
                    }
                    break;
                case "modifyPoint":
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    //mapControl.removeDelete();
                    //smallMap.removeAdd(mapId);
                    //smallMap.removeDelete();
                    if(value == true) {
                        $(".mapMainContainer").css({"cursor": "default"});
                        mapControl.modifyPoint({
                            eventName: "onClick",
                            arg: [grid_3]
                        });
                        //smallMap.editPoint({
                        //    eventNme: "onClick",
                        //    arg: [id, grid_2, mapId, _returnEditPoint, grid3Detail[pointId], pointId]
                        //});
                    }else{
                        $(".mapMainContainer").css({"cursor": "default"});
                        mapControl.removeEdit();                                //移除修改关联
                        //smallMap.removeAdd(mapId);
                    }
                    break;
                case "deleteSingle":
                    mapControl.deleteSinglePoint({
                        eventName:"onClick",
                        arg: [grid_3]
                    });
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    $(".mapMainContainer").css({"cursor": "default"});
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    break;
                case "associatedDisplay":
                    ribbon_1.setItemState("stabPoint", "false", "");        //让刺点按钮弹起来
                    mapControl.removeAdd();                                 //移除刺点关联
                    ribbon_1.setItemState("modifyPoint", "false", "");      //让修改按钮弹起来
                    mapControl.removeEdit();                                //移除修改关联
                    scheme.removeDraw();                                    //去除目标规划的鼠标圆点
                    if(value == true) {
                        $(".mapMainContainer").css({"cursor": "pointer"});
                        mapControl.associatedDisplay({
                            eventName: "onClick",
                            arg: []
                        });
                        //console.log("ji");
                    }else{
                        $(".mapMainContainer").css({"cursor": "default"});
                        mapControl.association();
                        //console.log("jiao");
                    }
                    break;
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
            dataMain.FeaturePoint.forEach(function(item,index){
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

    //监听点列表右键事件
    var dPid;
    grid_3.attachEvent("onRightClick", function(id,ind,obj){
        dPid = id;
        var $pointIdPop = $("#deletepointIdPop");
        $pointIdPop.css({"display":"block"}).fadeIn(500);    //透明蒙层，用于只能操作删除弹出层
        $("#deleteContainer").addClass("popContainer").fadeIn(500); // 显示删除弹出层
        console.log(1);
        //drapableObj($pointIdPop);                               //弹出层可以拖拽
        $(".deletePointPopClose").on('click',function(){     //删除弹出层
            $pointIdPop.css({"display":"none"}).fadeOut(500);
            $("#deleteContainer").removeClass("popContainer").fadeOut(500);
        });
        $("#changeDelete").on('click',function(){     //删除弹出层
            $pointIdPop.css({"display":"none"}).fadeOut(500);
            $("#deleteContainer").removeClass("popContainer").fadeOut(500);
        });
        $("#commitDelete").on('click',function(){     //删除弹出层
            $pointIdPop.css({"display":"none"}).fadeOut(500);
            $("#deleteContainer").removeClass("popContainer").fadeOut(500);
            if(undefined != grid_3.getSelectedRowId()){
                var pointArr = grid_3.getSelectedRowId().split(",");
                pointArr.forEach(function(item){
                    var pointId = grid_3.cells(item, 1).getValue();
                    mapControl.deletePoint(grid_3,pointId);
                })
            }else{
                var pointId = grid_3.cells(dPid, 1).getValue();
                mapControl.deletePoint(grid_3,pointId);
            }

        });
    });



    //点信息数据显示函数
    dataDisplay=function(dataInfor){
        var dataArr = dataInfor.FeaturePoint;
        //生成点信息数据
        var data= {
            rows: []
        };
        var shu=dataArr.length;
        for(var i=1;i<=shu;i++){
            data.rows.push({ id:dataArr[i-1].POINTID, data: [i,i,dataArr[i-1].LONRANGE,dataArr[i-1].LATRANGE,dataArr[i-1].HEIGHT]});
        }
        grid_3.clearAll();                      //加载前先清空列表的内容
        grid_3.parse(data,function(){               //加载数据到列表
                                                            //alert(1);
        },"json");
        attrInformation(1);
    };





            grid_3.attachEvent('onRowSelect', function(rId, cInd){          //监听点信息列表点击事件
                attrInformation(rId);                                               //调用属性信息数据显示函数
                console.log(1);
            });
            function attrInformation(id) {                                          //属性信息数据显示函数
                var dataChild = dataMain.FeaturePoint[id-1];
                $("#GRAPHID").empty().append(dataChild.GRAPHID);
                $("#PRODUCTIONDATE").empty().append(dataChild.PRODUCTIONDATE);
                $("#ZONENAME").empty().append(dataChild.ZONENAME);
                $("#FEATUREID").empty().append(dataChild.FEATUREID);
                $("#PLANECOORDINATESYSTEM").empty().append(dataChild.PLANECOORDINATESYSTEM);
                $("#HEIGHTCOORDINATESYSTEM").empty().append(dataChild.HEIGHTCOORDINATESYSTEM);
                $("#PERSON").empty().append(dataChild.PERSON);
                $("#LEVEL").empty().append(dataChild.LEVEL);
                $("#RESOLUTION").empty().append(dataChild.RESOLUTION);
                $("#METHOD").empty().append(dataChild.METHOD);
                $("#CONTROLPOINTSORT").empty().append(dataChild.CONTROLPOINTSORT);
            }

        //添加点在图上的十字标记
         mainAddPoint = function(map,leftTable,mainX,mainY,id){

            //console.log("焦科");
            //if(undefined == controlPointLayer){
            //    controlPointLayer = new ol.layer.Vector({
            //        source: new ol.source.Vector(),
            //        style:new ol.style.Style({
            //            image:new ol.style.Icon({
            //                anchor: [10,10],
            //                anchorXUnits: 'pixels',
            //                anchorYUnits: 'pixels',
            //                imgSize:[21,21],
            //                src:"img/21px.png"
            //            })
            //        }),
            //        wrapX: false
            //    });
            //    map.addLayer(controlPointLayer); //将图层添加到目标之上
            //}
            //if(undefined == checkPointLayer){
            //    checkPointLayer = new ol.layer.Vector({
            //        source: new ol.source.Vector(),
            //        style:new ol.style.Style({
            //            image:new ol.style.Icon({
            //                anchor: [10,10],
            //                anchorXUnits: 'pixels',
            //                anchorYUnits: 'pixels',
            //                imgSize:[21,21],
            //                src:"img/21px.png"
            //            })
            //        }),
            //        wrapX: false
            //    });
            //    map.addLayer(checkPointLayer); //将图层添加到目标之上
            //}
            if(undefined == linkPointLayer) {
                linkPointLayer = new ol.layer.Vector({
                    source: new ol.source.Vector(),
                    style: new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [10, 10],
                            anchorXUnits: 'pixels',
                            anchorYUnits: 'pixels',
                            imgSize: [21, 21],
                            src: "img/21px.png"
                        })
                    }),
                    wrapX: false
                });
                map.addLayer(linkPointLayer); //将图层添加到目标之上
            }


            var point = [mainX,mainY];
            var pointFeature = new ol.Feature({
                geometry:new ol.geom.Point(point),
                style:new ol.style.Style({
                    image:new ol.style.Icon({
                        anchor: [10,10],
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        imgSize:[21,21],
                        src:"img/21px.png"
                    })
                })
            });
            var pointID = id;//leftTable.cells(id, 1).cell.innerHTML;
            pointFeature.setId(pointID);
            //if(leftTable.cells(id, 2).getValue() == "ControlPoint"){
            //    controlPointLayer.getSource().addFeature(pointFeature);
            //    controlPointLayer.id = pointID;
            //    pointLayerArr.push(controlPointLayer);
            //}else if(leftTable.cells(id, 2).getValue() == "CheckPoint"){
            //    checkPointLayer.getSource().addFeature(pointFeature);
            //    checkPointLayer.id = pointID;
            //    pointLayerArr.push(checkPointLayer);
            //}else if(leftTable.cells(id, 2).getValue() == "TiePoint"){
            linkPointLayer.getSource().addFeature(pointFeature);
            linkPointLayer.id = pointID;
            //    pointLayerArr.push(linkPointLayer);
            //}
            //
            ////pointLayer.id = pointID;
            ////pointLayerArr.push(pointLayer);
            //给每个刺点显示其点ID的容器
            $('#pop').append('<div id="pop'+pointID+'" style="color: red">&nbsp;'+pointID+'</div>');

            var pop = new ol.Overlay({
                element:document.getElementById('pop'+pointID), //挂载点
                position: point,    //设置其位置
                positioning: 'top-left'   //显示位置的方向
            });
            var singlePoint={};
            singlePoint.id = pointID;
            singlePoint.singlePointtCoordinateX = __mapCoordinateFixed4(pointID[0]);

            singlePoint.singlePointtCoordinateY =__mapCoordinateFixed4(pointID[1]);
            //points.push(singlePoint);
            map.addOverlay(pop);  // 地图添加
            //popArr.push(pop);   // 存储点的ol.Overlay 对象
        }
        function getUrlParam(name){
            var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null){
                return unescape(r[2])
            }else{
                return null;
            }
        }
    };
    return {
        test:_test
    };
});