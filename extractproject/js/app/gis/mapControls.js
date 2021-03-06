var gpcData;
define(['jquery','dhtmlx','ol','../scheme/scheme','../project/open'],function($,dhl,ol,scheme,open){    //定义地图接口变量，全局使用
    var map,smallMap;
    var center = [108.93, 34.27]; //设置地图默认的中心点(西安)
    var points = [];//存储添加的点
    var coordinates; //存储最后一个添加点或者最后一个修改添加点经纬度的值

    /**
     * 锐化处理的参数一些相关操作
     *
     * Color manipulation functions below are adapted from
     * https://github.com/d3/d3-color.
     */
    var Xn = 0.950470;
    var Yn = 1;
    var Zn = 1.088830;
    var t0 = 4 / 29;
    var t1 = 6 / 29;
    var t2 = 3 * t1 * t1;
    var t3 = t1 * t1 * t1;
    var twoPi = 2 * Math.PI;
    //随机生成唯一字符串函数
    function _uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
    /**
     * Convert an RGB pixel into an HCL pixel.
     * @param {Array.<number>} pixel A pixel in RGB space.
     * @return {Array.<number>} A pixel in HCL space.
     */
    function rgb2hcl(pixel) {
        var red = rgb2xyz(pixel[0]);
        var green = rgb2xyz(pixel[1]);
        var blue = rgb2xyz(pixel[2]);

        var x = xyz2lab(
            (0.4124564 * red + 0.3575761 * green + 0.1804375 * blue) / Xn);
        var y = xyz2lab(
            (0.2126729 * red + 0.7151522 * green + 0.0721750 * blue) / Yn);
        var z = xyz2lab(
            (0.0193339 * red + 0.1191920 * green + 0.9503041 * blue) / Zn);

        var l = 116 * y - 16;
        var a = 500 * (x - y);
        var b = 200 * (y - z);

        var c = Math.sqrt(a * a + b * b);
        var h = Math.atan2(b, a);
        if (h < 0) {
            h += twoPi;
        }

        pixel[0] = h;
        pixel[1] = c;
        pixel[2] = l;

        return pixel;
    }

    /**
     * Convert an HCL pixel into an RGB pixel.
     * @param {Array.<number>} pixel A pixel in HCL space.
     * @return {Array.<number>} A pixel in RGB space.
     */
    function hcl2rgb(pixel) {
        var h = pixel[0];
        var c = pixel[1];
        var l = pixel[2];

        var a = Math.cos(h) * c;
        var b = Math.sin(h) * c;

        var y = (l + 16) / 116;
        var x = isNaN(a) ? y : y + a / 500;
        var z = isNaN(b) ? y : y - b / 200;

        y = Yn * lab2xyz(y);
        x = Xn * lab2xyz(x);
        z = Zn * lab2xyz(z);

        pixel[0] = xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
        pixel[1] = xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
        pixel[2] = xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

        return pixel;
    }

    function xyz2lab(t) {
        return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
    }

    function lab2xyz(t) {
        return t > t1 ? t * t * t : t2 * (t - t0);
    }

    function rgb2xyz(x) {
        return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    function xyz2rgb(x) {
        return 255 * (x <= 0.0031308 ?
            12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    }

    var raster = new ol.source.Raster({
        sources: [new ol.source.OSM()],
        operation: function(pixels, data) {
            var hcl = rgb2hcl(pixels[0]);

            var h = hcl[0] + Math.PI * data.hue / 180;
            if (h < 0) {
                h += twoPi;
            } else if (h > twoPi) {
                h -= twoPi;
            }
            hcl[0] = h;

            hcl[1] *= (data.chroma / 100);
            hcl[2] *= (data.lightness / 100);

            return hcl2rgb(hcl);
        },
        lib: {
            rgb2hcl: rgb2hcl,
            hcl2rgb: hcl2rgb,
            rgb2xyz: rgb2xyz,
            lab2xyz: lab2xyz,
            xyz2lab: xyz2lab,
            xyz2rgb: xyz2rgb,
            Xn: Xn,
            Yn: Yn,
            Zn: Zn,
            t0: t0,
            t1: t1,
            t2: t2,
            t3: t3,
            twoPi: twoPi
        }
    });

    var controlId = {
        'hue':{'value':0},
        'chroma':{'value':100},
        'lightness':{'value':100}
    };
    raster.on('beforeoperations', function(event) {
        var data = event.data;
        for (var id in controlId) {
            data[id] = Number(controlId[id].value);
        }
    });
    /**
     * 锐化处理的参数一些相关操作结束
     *
     * Color manipulation functions below are adapted from
     * https://github.com/d3/d3-color.
     */
    var mapTemp = {};
    var rasterTemp = {};

    //创建主视图的地图，禁用了双击放大、旋转
    var _creatMap = function(positionControl,target,mouseControlTarget){
        map = new ol.Map({
            interactions: ol.interaction.defaults({
                //默认不能双击、滚轮放大
                doubleClickZoom: false,
                //mouseWheelZoom: false,
                //shiftDragZoom: false,
                //pinchZoom:false,
                //默认Alt+Shift不能旋转
                altShiftDragRotate:false,
                pinchRotate:false
                //dragPan:false
            }),
            layers: [
               //默认调取瓦片地图
                new ol.layer.Image({
                source: raster
                }),
               // 调取geoservice的图，成功后，会覆盖默认的图层

               // new ol.layer.Tile({
               //     source: new ol.source.TileWMS({
               //         url: 'http://maps.opengeo.org/geowebcache/service/wms',
               //         params: {
               //             'VERSION': '1.1.1',
               //             tiled: true,
               //             STYLES: '',
               //             LAYERS: 'bluemarble'
               //         }
               //     })
               // })

                 //new ol.layer.Tile({
                 //   source: new ol.source.TileWMS({
                 //   url: url,
                 //   params: {
                 //       'LAYERS': 'GF2_PMS1_E113.6_N40.3_20160308_L1A0001458078-MSS1_oc_GSImageSharpenDistribut_RSUniformColor_11704_png',
                 //       'FORMAT':'image/png',
                 //       'VERSION':'1.1.1',
                 //       SRS: 'EPSG:4326',
                 //       TRANSPARENT:false,QUERYTYPE:"phasetile",OPATICY:0.7//'TILED': true,
                 //       }
                 //    })
                 //})
            ],
            target:target,
            controls: ol.control.defaults({ //控件全部不能用
                attribution: false,
                rotate: false,
                zoom: false
            }).extend([
                new ol.control.MousePosition({  //鼠标移动控件

                    coordinateFormat: ol.coordinate.createStringXY(4),
                    projection: 'EPSG:4326',
                    className:positionControl,  //显示坐标内容挂载点
                    target:mouseControlTarget    //鼠标移动控件挂载点
                })
            ]),
            view: new ol.View({
                projection:'EPSG:4326',
                center:center,
                zoom: 4,
                minZoom:3,
                maxZoom:25,
                maxResolution:0.703125
            })
        });

        mapTemp[target] = map;
        rasterTemp[target] = raster;
        return mapTemp;
    };
    function _targetScheme(themeName){
        var imgMap = open.funReturn();
        //var imgMap = map;
        var box = open.returnBox();
        scheme.targetScheme(imgMap,themeName,box);
    }
    
    function _targetSchemeEven(themeName){
        var imgMap = open.funReturn();
        //var imgMap = map;
        var box = open.returnBox();
        scheme.targetSchemeEven(imgMap,themeName,box);
    }
    function _targetSchemeFree(themeName){
        var imgMap = open.funReturn();
        //var imgMap = map;
        var box = open.returnBox();
        scheme.targetSchemeFree(imgMap,themeName,box);
    }
    var _changeColor = function(id,data,mapId) {
        controlId[id].value = data;
        rasterTemp[mapId].changed();
    };



    //创建小窗口的地图，模拟使用瓦片地图
    var _createSmallMap = function(positionControl,target){
     //return  smallMap = open.funReturn();
     return  smallMap = new ol.Map({
            layers: [
                //默认调取瓦片地图
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target:target,
            controls: ol.control.defaults({
                attribution: false,
                rotate: false,
                zoom: false
            }).extend([
                new ol.control.MousePosition({
                    coordinateFormat: ol.coordinate.createStringXY(4),
                    projection: 'EPSG:4326',
                    className:positionControl,
                    target:target
                })
            ]),
            view: new ol.View({
                projection:'EPSG:4326',
                center: [104.06, 30.67],
                zoom: 5,
                minZoom:2,
                maxZoom:25,
                maxResolution:0.703125
            })
        });
    };

    //处理中心点的位置
    //var __setMapCenter = function(){
    //    if(hasPointFlag){ //默认设置最后一次修改点作为地图中心点
    //        map.getView().setCenter(coordinates);
    //    }else{
    //        map.getView().setCenter(center);
    //    }
    //};

    //处理地图坐标，默认保留四位小数
    var __mapCoordinateFixed4 = function(target) {
        //console.log(target);
       return  (Math.round(target *1000000000))/1000000000;
    };


    // 初始化一个拉框控件
    var dragZoom = new ol.interaction.DragZoom({
        condition: ol.events.condition.always,
        out:false // 此处为设置拉框完成时放大还是缩小
    });
     dragZoom.setActive(false); //开始不允许拉框
    ////拉框放大地图
    //var _zoomIn= function(){
    //    map.removeInteraction(dragZoom);  //进入移除之前的拉框交互
    //    map.addInteraction(dragZoom);    //添加拉框交互
    //    dragZoom.out_ = false;          //拉框放大
    //    dragZoom.setActive(true);       //设置可以拉框
    //
    //   // __setMapCenter();
    //   // map.getView().setZoom(map.getView().getZoom()+1);
    //};
    ////拉框缩小试图
    //var _zoomOut= function(){
    //    map.removeInteraction(dragZoom);
    //    map.addInteraction(dragZoom);
    //    dragZoom.out_ = true;
    //    dragZoom.setActive(true);
    //
    //
    //  //  __setMapCenter();
    //  //  map.getView().setZoom(map.getView().getZoom()-1);
    //};
    var _zoomIn = function(data){
        var map=open.funReturn();
        map.getView().getZoom();
        map.getView().setZoom(map.getView().getZoom()+1);
    }
    //缩小
    var _zoomOut = function(data){
        var map=open.funReturn();
        map.getView().setZoom(map.getView().getZoom()-1);
    }
    //全图
    var _fullView = function(){
        var map=open.funReturn();
        map.removeInteraction(dragZoom);  //移除拉框
       // __setMapCenter();
        map.getView().setZoom(10);   //设置放大级别为3
        var arr=open.funReturnarr();
        map.getView().setCenter(ol.proj.transform(arr, 'EPSG:4326', 'EPSG:4326'));
        //console.log(arr);
    }
    //1:1显示
    var _oneRatioOne = function(){
        var map=open.funReturn();
        map.removeInteraction(dragZoom);
      //  __setMapCenter();
        map.getView().setZoom(16);     //设置放大1:1,具体要看实际需求是多少，最好设置变量，方便修改维护
    };
    //平移
    //var _translate = function(){
        //map.removeInteraction(dragZoom);   //
    //    var drapPan = new ol.interaction.DragPan();  //设置鼠标抓取拖拽
    //    map.addInteraction(drapPan);                //添加交互
    //};
    //关联
    //var _associatedDisplay = function(){
    //    console.log("jack");
    //    //小图跟着大图动,联动
    //    var tempMap=open.funReturn();
    //    var small_Map=open.funReturnmin();
    //    small_Map.on('moveend',function(event){
    //        tempMap.setView(small_Map.getView());
    //        tempMap.getView().setZoom(small_Map.getView().getZoom()-2);
    //    });
    //    tempMap.on('moveend',function(event){
    //        small_Map.setView(tempMap.getView());
    //        small_Map.getView().setZoom(tempMap.getView().getZoom()+2)
    //    });
    //};
    var _remove;
    var _associatedDisplay = function(argList){
        //console.log("jack");
        //小图跟着大图动,联动
        argList.arg[0];
        var tempMap=open.funReturn();
        var small_Map=open.funReturnmin();
//         small_Map.on('moveend',function(event){
//             tempMap.setView(small_Map.getView());
// //             tempMap.getView().setZoom(small_Map.getView().getZoom()-2);
//         });
         _remove=function(event){
//             small_Map.setView(tempMap.getView());
            var arr=tempMap.getView().getCenter();
            small_Map.getView().setCenter(ol.proj.transform(arr, 'EPSG:4326', 'EPSG:4326'));
            small_Map.getView().setZoom(tempMap.getView().getZoom()+2);
            //console.log(arr);
            //small_Map.render();
            //tempMap.render();
//             small_Map.getView().setZoom(tempMap.getView().getZoom()+2)
        };
        tempMap.on('moveend',_remove);
    };

    var source =  new ol.source.Vector({  //矢量图层
        features:new ol.Collection(),
        wrapX: false   //放大、缩小都显示为一张图
    });


    //var pointLayer = null;


    var draw = null;
    var pointLayerArr = [];
    var _funReturnPointLayerArr = function(){
        return pointLayerArr;
    }
    //创建绘制图层
    var __createPointLayer = function(){

        var pointLayer = new ol.layer.Vector({
            source:source,
            style:function(feature) {
                return [
                    new ol.style.Style({
                        image:new ol.style.Icon({
                            anchor: [10,10],
                            anchorXUnits: 'pixels',
                            anchorYUnits: 'pixels',
                            imgSize:[21,21],
                            src:"img/21px.png"
                        })
                        //geometry:function(feature){
                        //    var coordinates = feature.getGeometry().getCoordinates()[0];
                        //    return feature.getGeometry();
                        //}
                    })
                ]
            }
        });
        return pointLayer;
    };

    //绘制一个点
    var __drawPoint = function(pointLayer){
        draw = new ol.interaction.Draw({
            type: 'Point',
            source: pointLayer.getSource(),
            style:function(feature) {
                return [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 2
                        }),
                        image:new ol.style.Icon({
                            anchor: [10,10],
                            anchorXUnits: 'pixels',
                            anchorYUnits: 'pixels',
                            imgSize:[21,21],
                            src:"img/21px.png"
                        })
                        //geometry:function(feature){
                        //    var coordinates = feature.getGeometry().getCoordinates()[0];
                        //    return feature.getGeometry();
                        //}
                    })
                ]
            }
        });
        return draw;
    };

    //刺一个点
    //定义一个对象，存储当前添加的点
    var index = 0;
    var popArr = [];
    var _stabPoint = function(argList) {
        var map=open.funReturn();
        var smallMap = open.funReturnmin();
        if(draw != undefined && draw != null){
            map.removeInteraction(draw);
        }
        map.removeInteraction(modify);
        var  leftTable = argList.arg[0]; //获取第一个参数
        var fun = argList.arg[1];
        //if(pointLayer==null){ //只创建一次添加点图层
        var pointLayer = __createPointLayer(); //调用绘制点图层
        map.addLayer(pointLayer); //将图层添加到目标之上
        smallMap.addLayer(pointLayer);
        __drawPoint(pointLayer);           //绘制一个点
        //}
        map.addInteraction(draw);   //添加交互

        //没点时，获取最大的行号、点ID号
        //if(orderList.length<=0 && pointIdList.length <= 0) {
        if (leftTable.getRowsNum() > 0) {
            leftTable.forEachRow(function (id) {  //循环每一行
                leftTable.forEachCell(id, function (cellObj, index) {  //循环每一行的每一个cell,每个cell的id为index，对象为cellObj
                    if (index === 0) {
                        orderList.push(cellObj.getValue() == undefined ? 0 : cellObj.getValue());
                    }
                    if (index === 1) {
                        pointIdList.push(cellObj.getValue() == undefined ? 0 : cellObj.getValue());
                    }
                });
            });
        } else {
            orderList.push(0);
            pointIdList.push(0);
        }
        //}

        //监听一个点绘制完成，获取坐标
        var singlePoint = {};
        singlePoint.id = "";
        singlePoint.singlePointtCoordinateX ="";
        singlePoint.singlePointtCoordinateY = "";
        draw.on('drawend',function(event){
            event.preventDefault();
            event.stopPropagation();
            singlePoint = {};

            var numOrder = Math.max.apply(null,orderList) + 1;  // 获取最大的加1
            var pointID= Math.max.apply(null,pointIdList) + 1;
            orderList = [];   //置空，只保留最大值
            pointIdList = [];
            orderList.push(numOrder);
            pointIdList.push(pointID);
            coordinates = event.feature.getGeometry().getCoordinates();   //获取坐标
            //添加一行信息  序号，点ID，点类型。。。。。。。
            var rowData = [numOrder,pointID,__mapCoordinateFixed4(coordinates[0]),__mapCoordinateFixed4(coordinates[1]),""];
            leftTable.addRow(numOrder,rowData,false);  //行的ID 与序号号值是一样的
            if(undefined == gpcData){
                gpcData = {"data":[]};
                gpcData.data.push({"pointid":pointID,"x":__mapCoordinateFixed4(coordinates[0]),"y":__mapCoordinateFixed4(coordinates[1]),"z":0})
            }else{
                gpcData.data.push({"pointid":pointID,"x":__mapCoordinateFixed4(coordinates[0]),"y":__mapCoordinateFixed4(coordinates[1]),"z":0})
            }
            pointLayer.id = pointID;
            pointLayerArr.push(pointLayer);
            event.feature.setId(pointID);  //给每个点（要素）添加一个唯一的ID值
            singlePoint.id = pointID;
            singlePoint.singlePointtCoordinateX = __mapCoordinateFixed4(coordinates[0]);
            singlePoint.singlePointtCoordinateY =__mapCoordinateFixed4(coordinates[1]);
            points.push(singlePoint);   //所有点的存储集合

//焦科,临时用用
//            console.log(points);
            var indexExample={
                "GRAPHID": "H50E002023",
                "PLANECOORDINATESYSTEM": "WGS84",
                "POINTID": "",
                "CONTROLPOINTSORT": "影像控制点",
                "PRODUCTIONDATE": "2017-11-09 14:09:07",
                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
                "LATRANGE": "",
                "PRODUCTIONUNIT": "",
                "DATASIZE": "1024",
                "RESOLUTION": "0.000160",
                "METHOD": "自由规划",
                "LEVEL": "",
                "FEATUREID": "H50E002023-20171109140907-1",
                "HEIGHTCOORDINATESYSTEM": "WGS84",
                "HEIGHT": "",
                "DATAFORMAT": "tif",
                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
                "UNIT": "度",
                "ZONE": "50",
                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
                "LONRANGE": "",
                "MAPPROJECTION": "WGS84",
                "ZONENAME": ""
            };
            indexExample.POINTID=singlePoint.id;
            indexExample.LONRANGE=singlePoint.singlePointtCoordinateX;
            indexExample.LATRANGE=singlePoint.singlePointtCoordinateY;
            dataMain.FeaturePoint.splice(-1,0,indexExample);
            //console.log(dataMain.FeaturePoint.Property);

            //

            //给每个刺点显示其点ID的容器
            $('#pop').append('<div id="pop'+index+'" style="color: red">&nbsp;'+pointID+'</div>');

            var pop = new ol.Overlay({
                element:document.getElementById('pop'+index), //挂载点
                position: coordinates,    //设置其位置
                positioning: 'top-left'   //显示位置的方向
            });
            smallMap.addOverlay(pop);
            map.addOverlay(pop);  // 地图添加

            popArr.push(pop);   // 存储点的ol.Overlay 对象
            index++;
            map.removeInteraction(draw);  //移除交互
            //fun([singlePoint.singlePointtCoordinateX,singlePoint.singlePointtCoordinateY],points);
            var args = {"arg":[leftTable,fun]};
            _stabPoint(args);
        });
    };

   //处理表格前列的最大值
    var pointType = ['Tiepoint','Controlpoint','Checkpoint']; //点类型
    var FLAGTRUE = 1;    //有效
    var FLAGFALSE = 0;   //无效
    var orderList = [] ;
    var pointIdList = [];

    //removeAdd方法
    var _removeAdd = function(){
        var map = open.funReturn();
        if(map != undefined){
            map.removeInteraction(draw);  //移除交互
        }
    };
    //removeEdit方法
    var _removeEdit = function(){
        var map = open.funReturn();
        if(map != undefined){
            map.removeInteraction(modify);  //移除交互
        }

    };
    //removeDelete方法
    var _removeDelete = function(){
        var map = open.funReturn();
        if(map != undefined){
            map.removeInteraction(selectPoint);  //移除交互
        }
    }
    //association方法
    var _association = function(){
        var map = open.funReturn();
        if(map != undefined){
            map.removeEventListener("moveend",_remove);  //移除关联监听
        }
        //console.log("jiaoke");
    };
    //添加一个点,就是添加一条空数据，手动填入数据
    var _addPoint = function(argList){
     var  leftTable = argList.arg[0]; //获取第一个参数
        if(orderList.length<=0 && pointIdList.length <= 0) {
            if (leftTable.getRowsNum() > 0) {
                leftTable.forEachRow(function (id) {  //循环每一行
                    leftTable.forEachCell(id, function (cellObj, index) {  //循环每一行的每一个cell,每个cell的id为index，对象为cellObj
                        if (index === 0) {
                            orderList.push(cellObj.getValue() == undefined ? 0 : cellObj.getValue());
                        }
                        if (index === 1) {
                            pointIdList.push(cellObj.getValue() == undefined ? 0 : cellObj.getValue());
                        }
                    });
                });
            } else {
                orderList.push(0);
                pointIdList.push(0);
            }
        }

       var numOrder = Math.max.apply(null,orderList) + 1;
       var pointID= Math.max.apply(null,pointIdList) + 1;
        orderList = [];
        pointIdList = [];
        orderList.push(numOrder);
        pointIdList.push(pointID);
        var rowData = [numOrder,pointID,"","",""];
        leftTable.addRow(numOrder,rowData,false);
        //焦科,临时用用
        console.log(points);
        var indexExample={
            "GRAPHID": "H50E002023",
            "PLANECOORDINATESYSTEM": "WGS84",
            "POINTID": "1",
            "CONTROLPOINTSORT": "影像控制点",
            "PRODUCTIONDATE": "2017-11-09 14:09:07",
            "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
            "LATRANGE": "",
            "PRODUCTIONUNIT": "",
            "DATASIZE": "1024",
            "RESOLUTION": "0.000160",
            "METHOD": "自由规划",
            "LEVEL": "",
            "FEATUREID": "H50E002023-20171109140907-1",
            "HEIGHTCOORDINATESYSTEM": "WGS84",
            "HEIGHT": "",
            "DATAFORMAT": "tif",
            "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
            "UNIT": "度",
            "ZONE": "50",
            "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
            "LONRANGE": "",
            "MAPPROJECTION": "WGS84",
            "ZONENAME": ""
        };
        indexExample.POINTID=pointID;
        dataMain.FeaturePoint.splice(-1,0,indexExample);
        console.log(dataMain.FeaturePoint);
    };
    //点击主视图的界面点
    var _clickPoint= function(data){
        var map=open.funReturn();
        if(popArr.length<=0){
            //alert("当前没有点可以修改！");
        }else{
            //map.removeInteraction(draw);  //移除交互
            var features = pointLayerArr;//pointLayer.getSource().getFeatures();   //得到地图所有的 features
            var leftTable = data.arg[0];
            var selectedPointID ;
            var selectPoint = new ol.interaction.Select(
                {"hitTolerance":20}
            );   //实例化交互选择，操作要素
            map.addInteraction(selectPoint);
            selectPoint.on('select',function(event){
                event.preventDefault();
                event.stopPropagation();
                if(undefined != event.selected[0]) {
                    console.log(event.selected);
                    console.log(selectPoint);
                    event.selected[0].setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [10, 10],
                            anchorXUnits: 'pixels',
                            anchorYUnits: 'pixels',
                            imgSize: [21, 21],
                            src: "img/21px.png"
                        })
                        //geometry:function(feature){
                        //    var coordinates = feature.getGeometry().getCoordinates()[0];
                        //    return feature.getGeometry();
                        //}
                        
                    }));
                    selectedPointID = event.selected[0].getId();   // 得到选择的要素的id值

                    var arr = [];
                    var lon =  parseFloat(leftTable.cells(selectedPointID,2).getValue());  //取得经度
                    var lat =  parseFloat(leftTable.cells(selectedPointID,3).getValue());  //取得纬度

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
                    leftTable.setRowColor(selectedPointID,"#EEEEEE");

                    _highLight(selectedPointID);

                }
            });
        }
        //map.removeInteraction(modify);  //移除交互
    };
    //修改点操作
    var modify;
    var _modifyPoint = function(data) {
        var map=open.funReturn();
        if(popArr.length<=0){
            //alert("当前没有点可以修改！");
        }else{
            map.removeInteraction(draw);  //移除交互
            var features = pointLayerArr;//pointLayer.getSource().getFeatures();   //得到地图所有的 features
            var leftTable = data.arg[0];
            var selectedPointID ;
            var selectPoint = new ol.interaction.Select(
                {"hitTolerance":20}
            );   //实例化交互选择，操作要素
            map.addInteraction(selectPoint);
            selectPoint.on('select',function(event){
                event.preventDefault();
                event.stopPropagation();
                if(undefined != event.selected[0]) {
                    console.log(event.selected);
                    console.log(selectPoint);
                    event.selected[0].setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [10, 10],
                            anchorXUnits: 'pixels',
                            anchorYUnits: 'pixels',
                            imgSize: [21, 21],
                            src: "img/21px.png"
                        })
                        //geometry:function(feature){
                        //    var coordinates = feature.getGeometry().getCoordinates()[0];
                        //    return feature.getGeometry();
                        //}
                    }));
                    selectedPointID = event.selected[0].getId();   // 得到选择的要素的id值
                    //console.log(features.length);
                    //new ol.interaction.Select();   //实例化交互选择，操作要素
                    //map.removeInteraction(selectPoint);           //移除交互
                }
            });
            modify = new ol.interaction.Modify({            // 修改要素
                features:selectPoint.getFeatures()
            });
            map.addInteraction(modify);                //添加修改交互

            modify.on('modifyend',function(event){     //修改完成后，将修改的要素坐标更新到 points中
                event.preventDefault();
                event.stopPropagation();
                //map.removeInteraction(modify);
                var x=event.mapBrowserEvent.coordinate[0];   //当鼠标松开时，获取当前点坐标
                x =__mapCoordinateFixed4(x);
                var y=event.mapBrowserEvent.coordinate[1];
                y = __mapCoordinateFixed4(y);
                for(var i=0;i<points.length;i++){          //将当前修改点的坐标替换掉原来的坐标
                    if(points[i].id === selectedPointID){
                        points[i].singlePointtCoordinateX = x;
                        points[i].singlePointtCoordinateY = y;
                        popArr[i].setPosition([x,y]);         //将当前点的显示id 跟着修改点变化
                    }
                }
                for (var i = 0; i < features.length; i++) {
                    if (selectedPointID == features[i].id) {
                        $("#pop" + (features[i].id - 1) + "").css({display: "block",color:"red"});
                    }
                }
                leftTable.forEachRow(function(id){
                    leftTable.forEachCell(id,function(cellObj,index){
                        if(index == 1){
                            if(cellObj.getValue() == selectedPointID){
                                leftTable.cells(id, 2).cell.innerHTML = x;//leftTable.cells(id, 1).cell.innerHTML;
                                leftTable.cells(id, 3).cell.innerHTML = y;
                                //保存数据
                                dataMain.FeaturePoint.forEach(function(item,index){
                                    if(item.POINTID==id){
                                            item.LONRANGE=x;
                                            item.LATRANGE=y;
                                    }
                                });
                                //console.log(dataMain.FeaturePoint);


                            }
                        }
                    });
                });
                //var rowData = [numOrder,selectedPointID,pointType,overlap,"1",x,y,"0"];
                //leftTable.addRow(i,rowData,false);  //行的ID 与序号号值是一样的
                i = null;
            },this);//可以传入函数名，不使用匿名函数

        }
        //map.removeInteraction(modify);  //移除交互
    };
    //修改列表更新点
    var _editListPoint = function(x,y,id){
        var selectedPointID = parseInt(id);
        for(var i=0;i<points.length;i++){          //将当前修改点的坐标替换掉原来的坐标
            if(points[i].id === selectedPointID){
                points[i].singlePointtCoordinateX = x;
                points[i].singlePointtCoordinateY = y;
                popArr[i].setPosition([x,y]);         //将当前点的显示id 跟着修改点变化
            }
        }
        var features = pointLayerArr;
        for(var i=0;i<features.length;i++) {
            if (selectedPointID === parseInt(features[i].id)) {
                features[i].getSource().getFeatureById(selectedPointID).setGeometry(new ol.geom.Point([x,y]));
            }
        }
    }

    //拖拽函数
    var drapableObj = function(obj){
        obj.on("mousedown",function(event){
            event.stopPropagation();
            /* 获取需要拖动节点的坐标 */
            var offset_x = $(this)[0].offsetLeft;//x坐标
            var offset_y = $(this)[0].offsetTop;//y坐标
            /* 获取当前鼠标的坐标 */
            var mouse_x = event.pageX;
            var mouse_y = event.pageY;
            /* 绑定拖动事件 */
            /* 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素 */
            $(document).on("mousemove",function(ev){
                ev.stopPropagation();
                /* 计算鼠标移动了的位置 */
                var _x = ev.pageX - mouse_x;
                var _y = ev.pageY - mouse_y;
                /* 设置移动后的元素坐标 */
                var now_x = (offset_x + _x ) ;
                var now_y = (offset_y + _y );
                obj.css({
                    top:now_y + "px",
                    left:now_x + "px"
                });
            });
        });
        /* 当鼠标左键松开，接触事件绑定 */
        $(document).on("mouseup",function(event){
            event.stopPropagation();
            $(this).off("mousemove");
        });
    };
    var  importLeftTable;
    //导入导出
    var gpcData ;
    var fileName = "newGcp";
    var _export = function(argList){
        importLeftTable = argList.arg[0];
        var $exportPop = $("#exportIdPop");
        $exportPop.css({"display":"block"}).fadeIn(500);    //透明蒙层
        $("#popExport").addClass("popContainer").fadeIn(500); // 显示删除弹出层
        drapableObj($exportPop);                               //弹出层可以拖拽
        $(".exportPop").on('click',function(){     //删除弹出层
            $exportPop.css({"display":"none"}).fadeOut(500);
            $("#popExport").removeClass("popContainer").fadeOut(500);
        });
        $("#export").on('click',function(){
            var gcpJsonData = gpcData;
            var str = "";
            name =  fileName;
            gcpJsonData.data.forEach(function (item){
                str = str+item.pointid+"  "+item.x+"  "+item.y+"  "+item.z+"\r\n"
            })
            doSave(str, "text/latex", name+".gcp");
        })

        function doSave(value, type, name) {
            var blob;
            if (typeof window.Blob == "function") {
                blob = new Blob([value], {type: type});
            } else {
                var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
                var bb = new BlobBuilder();
                bb.append(value);
                blob = bb.getBlob(type);
            }
            var URL = window.URL || window.webkitURL;
            var bloburl = URL.createObjectURL(blob);
            var anchor = document.createElement("a");
            if ('download' in anchor) {
                anchor.style.visibility = "hidden";
                anchor.href = bloburl;
                anchor.download = name;
                document.body.appendChild(anchor);
                var evt = document.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                anchor.dispatchEvent(evt);
                document.body.removeChild(anchor);
            } else if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, name);
            } else {
                location.href = bloburl;
            }
        }

        $("#file").on('change',function(evt){
            var files = evt.target.files; // FileList object
            if(files[0])
            {
                fileName = files[0].name;
                var reader = new FileReader();
                reader.readAsText(files[0]);
                reader.onload = loaded;
            }
        })
        var a=new Array();


        var fileString;
        function loaded(evt) {
            fileString = evt.target.result;
            fileString=fileString.replace(/\r\n/g,"&");
            fileString=fileString.replace(/\r/g,"&");
            fileString=fileString.replace(/\n/g,"&");
            //alert(fileString);

        }
        $("#import").on('click',function(){
            //var data = fileString;
            var rediskey=_uuid();
            var data = {
                "rediskey":rediskey,
                "gcp":""+fileString,
                "xmlid":[selectDomData.xmlid]
            };



            $.ajax({
                url:window.projectUrl+"ControlPointImport",
                type:"post",
                contentType: "application/json",
                //dataType:'jsonp',
                data:JSON.stringify(data),
                async: false,
                success:function(data){
                    if(data=="SUCCESS"){
                        time();
                    }else{
                        alert("高程-数据获取失败!");
                        console.log(data);
                    }
                },
                error: function () {
                    alert("高程-数据获取失败!")
                }
            });
            function time(){
                console.log(1);
                var time=window.setInterval(function(){
                    $.ajax({
                        url: window.projectUrl+"ControlPointImportProcess",
                        type: "post",
                        data:JSON.stringify({"rediskey":rediskey}),
                        //dataType: 'JSPON',
                        success: function (data) {
                            console.log(data);
                            $("#progressBar").val(data);
                            if(data<100) {
                                console.log(data);
                            }else{
                                $.ajax({
                                    url:window.projectUrl+"ControlPointImportResult",
                                    type:"post",
                                    contentType: "application/json",
                                    //dataType:'jsonp',
                                    data:JSON.stringify({"rediskey":rediskey}),
                                    async: false,
                                    success:function(data){
                                        console.log(data);
                                        gpcData = data;
                                        gpcData.data.forEach(function(item){
                                            _importAdd(item.pointid,item.x,item.y,item.z)
                                        })
                                    },
                                    error: function (e) {
                                        if(e.status == "401"){
                                            //getSession();
                                        }
                                    }
                                })
                                window.clearInterval(time);
                            }
                        },
                        error: function () {
                            console.log("点列表进程,请求失败");
                        }
                    });
                },500);
            }






        })
    };
    //导入添加列表信息
    var _importAdd = function(pointid,x,y,z){
        var  leftTable = importLeftTable; //获取第一个参数
        if(orderList.length<=0 && pointIdList.length <= 0) {
            if (leftTable.getRowsNum() > 0) {
                leftTable.forEachRow(function (id) {  //循环每一行
                    leftTable.forEachCell(id, function (cellObj, index) {  //循环每一行的每一个cell,每个cell的id为index，对象为cellObj
                        if (index === 0) {
                            orderList.push(cellObj.getValue() == undefined ? 0 : cellObj.getValue());
                        }
                        if (index === 1) {
                            pointIdList.push(cellObj.getValue() == undefined ? 0 : cellObj.getValue());
                        }
                    });
                });
            } else {
                orderList.push(0);
                pointIdList.push(0);
            }
        }

        var numOrder = Math.max.apply(null,orderList) + 1;
        var pointID= Math.max.apply(null,pointIdList) + 1;
        orderList = [];
        pointIdList = [];
        orderList.push(numOrder);
        pointIdList.push(pointID);
        var rowData = [numOrder,pointID,pointType[1],"",FLAGTRUE,x,y,z];
        leftTable.addRow(numOrder,rowData,false);
        importToId[pointID] = pointid;
    }
    //删除单点操作
    //var _deleteSinglePoint = function(data){
    //    var leftTable = data.arg[0];
    //    var $pointIdPop = $("#pointIdPop");
    //    if(popArr.length<=0){
    //        alert("当前没有点可以删除！");
    //    }else{
    //        var selectedPointID ;
    //        var selectPoint = new ol.interaction.Select();   //实例化交互选择，操作要素
    //        map.addInteraction(selectPoint);
    //        selectPoint.on('select',function(event){
    //            event.preventDefault();
    //            event.stopPropagation();
    //            event.selected[0].setStyle(new ol.style.Style({
    //                stroke: new ol.style.Stroke({
    //                    color: '#ffcc33',
    //                    width: 10
    //                }),
    //                image:new ol.style.Icon({
    //                    anchor: [10,10],
    //                    anchorXUnits: 'pixels',
    //                    anchorYUnits: 'pixels',
    //                    imgSize:[21,21],
    //                    src:"img/21px.png"
    //                })
    //            }));
    //            selectedPointID = event.selected[0].getId();   // 得到选择的要素的id值
    //            map.removeInteraction(selectPoint);           //移除交互
    //            var features = pointLayer.getSource().getFeatures();   //得到地图所有的 features
    //            for(var i=0;i<i<features.length;i++){
    //                    if(selectedPointID === parseInt(features[i].getId())){
    //                        pointLayer.getSource().removeFeature(features[i]);  //移除要删除的features
    //                        map.removeOverlay(popArr[i]);                    //移除其对应的点ID显示层
    //                        popArr.splice(i,1);                        //将对应存储的features 删除
    //                        points.splice(i,1);                        //将对应的点信息删除
    //                        // $(this).val("null");                     //输入框置空
    //
    //                         leftTable.forEachRow(function(id){
    //                            leftTable.forEachCell(id,function(cellObj,index){
    //                                if(index == 1){
    //                                    if(cellObj.getValue() == selectedPointID){
    //                                        leftTable.deleteRow(id);
    //                                    }
    //                                }
    //                            });
    //                        });
    //                    }
    //            }
    //             i= null;
    //        });
    //    }
    //};
    //删除单点操作
    //var _deleteSinglePoint = function(argList){
    //    var features = pointLayerArr;//pointLayer.getSource().getFeatures();   //得到地图所有的 features
    //    var datalist=argList.arg[0].getSelectedRowId(0).split(",");         //获得选中行的所有行id集合
    //    argList.arg[0].deleteSelectedRows();
    //    console.log(datalist);
    //    for (var i = 0; i < features.length; i++) {
    //        datalist.forEach(function(value){
    //        if (value == features[i].id) {
    //            features[i].getSource().removeFeature(features[i].getSource().getFeatureById(features[i].id));
    //            $("#pop"+(features[i].id-1)+"").remove();
    //            pointLayerArr.splice(i,1);
    //        }
    //        });
    //    };
    //    dataMain.FeaturePoint.forEach(function(item,index){
    //        datalist.forEach(function(value){
    //            _deletePoint(argList.arg[0],value);
    //            if(item.POINTID==value){
    //                dataMain.FeaturePoint.splice(index,1);
    //            }
    //        });
    //    });
    //};

    var selectPoint;
    var _deleteSinglePoint = function(data){
        map.removeInteraction(draw);  //移除交互
        var leftTable = data.arg[0];
        //var $pointIdPop = $("#pointIdPop");
        if(popArr.length<=0){
            //alert("当前没有点可以删除！");
        }else{
            var features = pointLayerArr;//pointLayer.getSource().getFeatures();   //得到地图所有的 features
            var selectedPointID ;
            selectPoint = new ol.interaction.Select(
                {"hitTolerance":20}
            );   //实例化交互选择，操作要素
            map.addInteraction(selectPoint);
            selectPoint.on('select',function(event){
                event.preventDefault();
                event.stopPropagation();
                if(undefined != event.selected[0]){
                    event.selected[0].setStyle(new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#FB8383',
                            width: 0
                        })
                        //,
                        //image:new ol.style.Icon({
                        //    anchor: [10,10],
                        //    anchorXUnits: 'pixels',
                        //    anchorYUnits: 'pixels',
                        //    imgSize:[21,21],
                        //    src:"img/21px.png"
                        //})
                        //geometry:function(feature){
                        //    var coordinates = feature.getGeometry().getCoordinates()[0];
                        //    return feature.getGeometry();
                        //}
                    }));
                    selectedPointID = event.selected[0].getId();   // 得到选择的要素的id值
                    //map.removeInteraction(selectPoint);           //移除交互
                    var deleteIds = [];
                    for(var i=0;i<features.length;i++){
                        if(selectedPointID === parseInt(features[i].id)){
                            //features[i].getSource().removeFeature(features[i].getSource());  //移除要删除的features

                            //var f = features[i];
                            //    f.getSource().clear();
                            deleteIds.push(i);
                            features[i].setVisible(false);
                            map.removeOverlay(features[i]);
                            //features[i].getSource().getFeatures().clear();
                            features[i].getSource().removeFeature(features[i].getSource().getFeatureById(selectedPointID));
                            features[i].getSource().changed();
                            map.removeOverlay(popArr[i]);                    //移除其对应的点ID显示层

                            //popArr.splice(i,1);                        //将对应存储的features 删除
                            //points.splice(i,1);                        //将对应的点信息删除
                            //$(this).val("null");                     //输入框置空

                            leftTable.forEachRow(function(id){
                                leftTable.forEachCell(id,function(cellObj,index){
                                    if(index == 1){
                                        if(cellObj.getValue() == selectedPointID){
                                            leftTable.deleteRow(id);
                                            $("#mapArr"+id).css("display","none");
                                        }
                                    }
                                });
                            });
                            dataMain.data.forEach(function(item){
                                if(item.pointid == selectedPointID){
                                    item.active = 0;
                                }
                            })
                            for(var i=0;i<gpcData.data.length;i++){
                                var item = gpcData.data[i];
                                if(item.pointid = importToId[selectedPointID]){
                                    gpcData.data.splice(i,1)
                                }
                            }
                        }
                        //deleteIds.forEach(function(id){
                        //    pointLayerArr.splice(id,1);
                        //})

                    }
                }
                map.updateSize();
                map.changed();
                $(".mapMainContainer").css({"cursor": "pointer"});
            })
        }
    };
    //让十字标高亮
    var _highLight = function(selectedPointID) {
        var map = open.funReturn();
        map.removeInteraction(draw);  //移除交互
        //var $pointIdPop = $("#pointIdPop");
        var features = pointLayerArr;//pointLayer.getSource().getFeatures();   //得到地图所有的 features
        console.log(features.length);
        //new ol.interaction.Select();   //实例化交互选择，操作要素
        for (var i = 0; i < features.length; i++) {
            if (selectedPointID == features[i].id) {
                $("#pop"+(features[i].id-1)+"").css({color:"#009999"});
                features[i].getSource().getFeatureById(features[i].id).setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#047FF3',
                        width: 2
                    }),
                    image: new ol.style.Icon({
                        anchor: [10, 10],
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        imgSize: [21, 21],
                        src: "img/2_xuanzhong.png"
                    })
                }));
            }else{
                $("#pop"+(features[i].id-1)+"").css({color:"red"});
                features[i].getSource().getFeatureById(features[i].id).setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#047FF3',
                        width: 2
                    }),
                    image: new ol.style.Icon({
                        anchor: [10, 10],
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        imgSize: [21, 21],
                        src: "img/21px.png"
                    })
                }));
            }
        }
    }
    //右键删除单点操作
    var _deletePoint = function(leftTable,selectedPointID){
        var map=open.funReturn();
        map.removeInteraction(draw);  //移除交互
        //var $pointIdPop = $("#pointIdPop");
        var features = pointLayerArr;//pointLayer.getSource().getFeatures();   //得到地图所有的 features
        //new ol.interaction.Select();   //实例化交互选择，操作要素
        for(var i=0;i<features.length;i++){
            if(selectedPointID == features[i].id){
                //features[i].getSource().removeFeature(features[i].getSource());  //移除要删除的features
                //pointLayer.getSource().getFeatures().clear()
                //var f = features[i];
                //    f.getSource().clear();
                //    f.clear();
                map.removeLayer(features[i]);
                //features[i].getSource().getFeatures().clear();
                features[i].getSource().removeFeature(features[i].getSource().getFeatureById(selectedPointID));
                $("#pop"+(features[i].id-1)+"").remove();
                map.removeOverlay(popArr[i]);                    //移除其对应的点ID显示层
                pointLayerArr.splice(i,1);
                //popArr.splice(i,1);                        //将对应存储的features 删除
                //points.splice(i,1);                        //将对应的点信息删除
                $(this).val("null");                     //输入框置空

                leftTable.forEachRow(function(id){
                    leftTable.forEachCell(id,function(cellObj,index){
                        if(index == 1){
                            if(cellObj.getValue() == selectedPointID){
                                leftTable.deleteRow(id);
                            }
                        }
                    });
                });
                dataMain.FeaturePoint.forEach(function(item,index){
                    if(item.pointid == selectedPointID){
                        dataMain.FeaturePoint.splice(index,1);
                    }
                })
            }
        }
    };
    //删除全部点
    //var _deleteAllPoint = function(data){
    //
    //    if(popArr.length<=0){
    //        alert("当前没有点可以删除！");
    //    }else{
    //        var leftTable = data.arg[0];
    //        //将界面上所有的的features删除
    //        pointLayer.getSource().clear();
    //        var i=0;
    //        // 移除所有的Overlay
    //        while(i<popArr.length){
    //            map.removeOverlay(popArr[i]);
    //            i++;
    //        }
    //        //释放内存
    //        i = null;
    //        //全删置空，没有关于点的相关信息
    //        popArr = [];
    //        points = [];
    //        leftTable.clearAll()
    //    }
    //};
    //删除全部点
    var _deleteAllPoint = function(argList){
        var features = pointLayerArr;//pointLayer.getSource().getFeatures();   //得到地图所有的 features
        for (var i = 0; i < features.length; i++) {
                    features[i].getSource().removeFeature(features[i].getSource().getFeatureById(features[i].id));
                    $("#pop"+(features[i].id-1)+"").remove();
        };
        pointLayerArr=[];
        dataMain.FeaturePoint=[];
        argList.arg[0].clearAll();
        orderList = [];
        pointIdList = [];

    };
    var _mapLinkMove = function(argList){
        var mapLinkMove = argList.arg[0];
        for(var i=0;i<mapLinkMove.length;i++){
            mapLinkMove[i].setView(smallMap.getView());
        }
         i = null;
       // mapLinkMove = null;
    };
    return {
        createMap:_creatMap,
        createSmallMap:_createSmallMap,
        zoomIn:_zoomIn,
        zoomOut:_zoomOut,
        oneRatioOne:_oneRatioOne,
        fullView:_fullView,
        //translate:_translate,
        stabPoint:_stabPoint,
        addPoint:_addPoint,
        modifyPoint:_modifyPoint,
        deleteSinglePoint:_deleteSinglePoint,
        changeColor:_changeColor,
        deleteAllPoint:_deleteAllPoint,
        mapLinkMove:_mapLinkMove,
        export:_export,
	    targetScheme:_targetScheme,
        targetSchemeEven:_targetSchemeEven,
        targetSchemeFree:_targetSchemeFree,
        deletePoint:_deletePoint,
        associatedDisplay:_associatedDisplay,
        removeAdd:_removeAdd,
        removeEdit:_removeEdit,
        highLight:_highLight,
        association:_association,
        removeDelete:_removeDelete,
        funReturnPointLayerArr:_funReturnPointLayerArr,
  		 clickPoint:_clickPoint
    }
});

