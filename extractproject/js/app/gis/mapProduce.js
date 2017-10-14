var dataMain= {
    "FeaturePoint": []
        };
//var dataMain={
//        "FeaturePoint": {
//            "Property": [
//                {
//                    "GRAPHID": "H50E002023",
//                    "PLANECOORDINATESYSTEM": "WGS84",
//                    "POINTID": "1",
//                    "CONTROLPOINTSORT": "影像控制点",
//                    "PRODUCTIONDATE": "2017-11-09 14:09:07",
//                    "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
//                    "LATRANGE": "30.8451",
//                    "PRODUCTIONUNIT": "",
//                    "DATASIZE": "1024",
//                    "RESOLUTION": "0.000160",
//                    "METHOD": "自由规划",
//                    "LEVEL": "",
//                    "FEATUREID": "H50E002023-20171109140907-1",
//                    "HEIGHTCOORDINATESYSTEM": "WGS84",
//                    "HEIGHT": "20368.00",
//                    "DATAFORMAT": "tif",
//                    "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
//                    "UNIT": "度",
//                    "ZONE": "50",
//                    "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
//                    "LONRANGE": "82.4641",
//                    "MAPPROJECTION": "WGS84",
//                    "ZONENAME": ""
//                },
//                {
//                    "GRAPHID": "H50E002023",
//                    "PLANECOORDINATESYSTEM": "WGS84",
//                    "POINTID": "2",
//                    "CONTROLPOINTSORT": "影像控制点",
//                    "PRODUCTIONDATE": "2017-11-09 14:09:07",
//                    "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
//                    "LATRANGE": "30.7874",
//                    "PRODUCTIONUNIT": "",
//                    "DATASIZE": "1024",
//                    "RESOLUTION": "0.000160",
//                    "METHOD": "自由规划",
//                    "LEVEL": "",
//                    "FEATUREID": "H50E002023-20171109140907-2",
//                    "HEIGHTCOORDINATESYSTEM": "WGS84",
//                    "HEIGHT": "21105.00",
//                    "DATAFORMAT": "tif",
//                    "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
//                    "UNIT": "度",
//                    "ZONE": "50",
//                    "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
//                    "LONRANGE": "82.4991",
//                    "MAPPROJECTION": "WGS84",
//                    "ZONENAME": ""
//                },
//                {
//                    "GRAPHID": "H50E002023",
//                    "PLANECOORDINATESYSTEM": "WGS84",
//                    "POINTID": "3",
//                    "CONTROLPOINTSORT": "影像控制点",
//                    "PRODUCTIONDATE": "2017-11-09 14:09:07",
//                    "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
//                    "LATRANGE": "30.7977",
//                    "PRODUCTIONUNIT": "",
//                    "DATASIZE": "1024",
//                    "RESOLUTION": "0.000160",
//                    "METHOD": "自由规划",
//                    "LEVEL": "",
//                    "FEATUREID": "H50E002023-20171109140907-3",
//                    "HEIGHTCOORDINATESYSTEM": "WGS84",
//                    "HEIGHT": "18775.00",
//                    "DATAFORMAT": "tif",
//                    "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
//                    "UNIT": "度",
//                    "ZONE": "50",
//                    "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
//                    "LONRANGE": "82.576",
//                    "MAPPROJECTION": "WGS84",
//                    "ZONENAME": ""
//                }
//            ]
//        }
//};
//var dataMain;
define(['jquery','dhtmlx','ol','../project/open'],function($,dhl,ol,open){
    //var dataurl="http://192.168.4.221:2666";
    //var dataDisplay;    //声明的点信息列表显示函数
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
    var _pointHeight = function(argList){
        var rediskey=_uuid();
        var lonlatvalue=[];
        var datalist;
        try {
            datalist=argList.arg[0].getSelectedRowId(0).split(",");         //获得选中行的所有行id集合
        }catch (e){
            datalist=[argList.arg[0].getSelectedRowId(0)];         //获得选中行的所有行id集合
        }
        console.log(datalist);
        if(datalist<1){
            alert("没有选中的点！请重试！")
            return
        }
        datalist.forEach(function(item){
            item=parseFloat(item);
            lonlatvalue.push([item,parseFloat(argList.arg[0].cells(item, 2).getValue()),parseFloat(argList.arg[0].cells(item, 3).getValue())])
        });

        var dataheight={
            "rediskey":rediskey,
            //"dsmid":"e8043ed0-d121-40ba-b679-4bdfa38d9074",
            "dsmid":selectDomData.dsmid,
            //"dsmid":"53061084-b582-4c2e-9038-652afdfaaa85",
            "lonlatvalue":lonlatvalue
        };
        //console.log(dataheight);

        $.ajax({
            url:window.dataurl+"GetPtAlt",
            type:"post",
            contentType: "application/json",
            //dataType:'jsonp',
            data:JSON.stringify(dataheight),
            async: false,
            success:function(data){
                if(data=="SUCCESS"){
                    time();
                }else{
                    alert("高程-数据获取失败!")
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
                    url: window.dataurl+"GetPtAltProcess",
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
                                url:window.dataurl+"GetPtAltResult",
                                type:"post",
                                contentType: "application/json",
                                //dataType:'jsonp',
                                data:JSON.stringify({"rediskey":rediskey}),
                                async: false,
                                success:function(data){
                                    data=data.result;
                                    console.log(dataMain);

                                    //将获得的高程保存起来
                                    dataMain.FeaturePoint.forEach(function(item,index){
                                        data.forEach(function(value){
                                            if(item.POINTID==value[0]){
                                                item.HEIGHT=value[1].toFixed(2);
                                            }
                                        });
                                    });
                                    console.log(dataMain);
                                    dataDisplay(dataMain);
                                },
                                error: function () {
                                    console.log("高程-数据获取失败2");
                                }
                            });
                            window.clearInterval(time);
                        }
                    },
                    error: function () {
                        console.log("点列表进程,请求失败");
                    }
                });
            },500);
        }




    };
    var __mapCoordinateFixed4 = function(target) {
        //console.log(target);
        return  (Math.round(target *10000))/10000;
    };
    var linkPointLayer;
    var _mainAddPoint = function(map,leftTable,mainX,mainY,id){
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
            //var pointLayerArr = mapControls.funReturnPointLayerArr();
            //pointLayerArr.push(linkPointLayer);
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

        linkPointLayer.getSource().addFeature(pointFeature);
        //linkPointLayer.id = pointID;

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

    }
    //让十字标高亮
    var _highLight = function(selectedPointID,map) {
        //map.removeInteraction(draw);  //移除交互
        //var $pointIdPop = $("#pointIdPop");
        var features = linkPointLayer.getSource().getFeatures();//pointLayer.getSource().getFeatures();   //得到地图所有的 features
        console.log(features.length);
        //new ol.interaction.Select();   //实例化交互选择，操作要素
        for (var i = 0; i < features.length; i++) {
            if (selectedPointID == features[i].id_) {
                $("#pop"+(features[i].id_)+"").css({color:"#009999"});
                features[i].setStyle(new ol.style.Style({
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
                $("#pop"+(features[i].id_)+"").css({color:"red"});
                features[i].setStyle(new ol.style.Style({
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
    var _pointDraw = function(argList){
        var open = argList.arg[2];
        var map = open.funReturn();
        dataMain.FeaturePoint.forEach(function(item){

            _mainAddPoint(map,argList.arg[0],item.LONRANGE,item.LATRANGE,item.POINTID);
        });
        //alert(unescape("\u7279\u5f81\u70b9\u63d0\u53d6\u5931\u8d25"));
        var rediskey=_uuid();
        var systemKey = getUrlParam("systemkey");
        var pointType = "影像特征点";
        if(systemKey == "yx"){
            pointType = "影像特征点";
        }else if(systemKey == "dd"){
            pointType = "大地特征点";
        }else if(systemKey == "xp"){
            pointType = "像片特征点";
        }
        //网格点数据,罗旭给坐标
        var gridData= {
            "collectionrule":ghType,
            "controlpointsort":pointType,
            //"domid":"e8043ed0-d121-40ba-b679-4bdfa38d9074",
            //"domxmlid":"86d8490e-0ddb-481f-8736-70c329b99d6a",
            //"dsmid":"e8043ed0-d121-40ba-b679-4bdfa38d9074",
            //"domid":selectDomData.domid,
            //"domxmlid":selectDomData.dsmid,
            //"dsmid":selectDomData.xmlid,
            "domid":selectDomData.domid,
            "domxmlid":selectDomData.xmlid,
            "dsmid":selectDomData.dsmid,
            //"domid":"53061084-b582-4c2e-9038-652afdfaaa85",
            //"domxmlid":"9b5f4bf7-79f3-437f-af65-eae4f78f044c",
            //"dsmid":"53061084-b582-4c2e-9038-652afdfaaa85",
            "rediskey":rediskey,
            "InputPointInfo":allArray
        };
        $.ajax({
            url: window.dataurl+"ImageFptRefine",
            type: "post",
            data:JSON.stringify(gridData),
            //dataType: 'JSPON',
            success: function (data) {
                console.log("1:"+data);
                if(data=="SUCCESS"){
                    console.log(data);
                    time();
                }else{
                    console.log(data);
                }
            },
            error: function () {
                console.log("点列表数据1,请求失败");
            }
        });

        function time(){
            var time=window.setInterval(function(){
                console.log(2);
                $.ajax({
                    url: window.dataurl+"ImageFptRefineProcess",
                    type: "post",
                    data:JSON.stringify({"rediskey":rediskey}),
                    //dataType: 'JSPON',
                    success: function (data) {
                        console.log(data);
                        $("#progressBar").val(data);
                        if(data<100 && data != -1) {
                            console.log(data);

                        }else if(data == -1 || data == 100){
                            $.ajax({
                                url: window.dataurl+"ImageFptRefineResult",
                                type: "post",
                                data:JSON.stringify({"rediskey":rediskey}),
                                //dataType: 'JSPON',
                                success: function (data) {
                                    if(data.status == "false"){
                                        alert(unescape(data.msg));
                                    }else{
                                        dataMain=data.result;
                                        dataDisplay(dataMain);
                                        dataMain.FeaturePoint.forEach(function(item){
                                            //var map = open.funReturn();
                                            _mainAddPoint(map,argList.arg[0],item.LONRANGE,item.LATRANGE,item.POINTID);
                                        })
                                    }

                                },
                                error: function () {
                                    console.log("点列表数据2,请求失败");
                                }
                            });
                            window.clearInterval(time);
                        }
                    },
                    error: function () {
                        console.log("点列表数据,请求失败");
                    }
                });
            },2000);
        };



    //    var dataInfor={
    //    "FeaturePoint": {
    //        "Property": [
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "1",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.483287589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-1",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "20368.00",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.554037793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "2",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.473527589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-2",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "21105.00",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.567637793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "3",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.471607589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-3",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "18775.00",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.553397793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "4",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.470647589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-4",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "21190.00",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.570037793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "5",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.446967589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-5",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "19786.00",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.584917793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "6",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.451927589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-6",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "18918.00",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.597877793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "7",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.439927589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-7",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "18004.01",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.585237793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "8",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.430967589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-8",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "17052.01",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.599317793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "9",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.419607589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-9",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "28083.00",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.617877793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "10",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.409527589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-10",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "20704.00",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.627157793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "11",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.402487589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-11",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "20141.01",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.622677793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            },
    //            {
    //                "GRAPHID": "H50E002023",
    //                "PLANECOORDINATESYSTEM": "WGS84",
    //                "POINTID": "12",
    //                "CONTROLPOINTSORT": "影像控制点",
    //                "PRODUCTIONDATE": "2017-11-13 10:20:06",
    //                "DSMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dsm.tiff",
    //                "LATRANGE": "39.409207589",
    //                "PRODUCTIONUNIT": "",
    //                "DATASIZE": "1024",
    //                "RESOLUTION": "0.000160",
    //                "METHOD": "自由规划",
    //                "LEVEL": "",
    //                "FEATUREID": "H50E002023-20171113102006-12",
    //                "HEIGHTCOORDINATESYSTEM": "WGS84",
    //                "HEIGHT": "13218.00",
    //                "DATAFORMAT": "tif",
    //                "IMAGEID": "TH01-01_P20130417_10_883_123_OC_dom",
    //                "UNIT": "度",
    //                "ZONE": "50",
    //                "DOMMARK": "/mnt/hgfs/E/testdata/TH01-01_P20130417_10_883_123_OC_dom.tiff",
    //                "LONRANGE": "116.629077793",
    //                "MAPPROJECTION": "WGS84",
    //                "ZONENAME": ""
    //            }
    //        ]
    //    }
    //};
    //    dataDisplay(dataInfor); //调用点信息数据显示函数
    //    function dataDisplay(dataInfor){
    //        var dataArr = dataInfor.FeaturePoint.Property;
    //        //生成点信息数据
    //        var data= {
    //            rows: []
    //        };
    //        var shu=dataArr.length;
    //        for(var i=1;i<=shu;i++){
    //            data.rows.push({ id:dataArr[i-1].POINTID, data: [i,i,dataArr[i-1].LONRANGE,dataArr[i-1].LATRANGE,dataArr[i-1].HEIGHT]});
    //        }
    //        argList.arg[0].clearAll();                      //加载前先清空列表的内容
    //        argList.arg[0].parse(data,function(){               //加载数据到列表
    //            //alert(1);
    //        },"json");
    //        //调用属性信息数据,默认显示列表的第一条
    //        attrInformation(1);
    //
    //
    //        argList.arg[0].attachEvent('onRowSelect', function(rId, cInd){          //监听点信息列表点击事件
    //            attrInformation(rId);                                               //调用属性信息数据显示函数
    //        });
    //        function attrInformation(id) {                                          //属性信息数据显示函数
    //            var dataChild = dataInfor.FeaturePoint.Property[id-1];
    //            $("#GRAPHID").empty().append(dataChild.GRAPHID);
    //            $("#PRODUCTIONDATE").empty().append(dataChild.PRODUCTIONDATE);
    //            $("#ZONENAME").empty().append(dataChild.ZONENAME);
    //            $("#FEATUREID").empty().append(dataChild.FEATUREID);
    //            $("#PLANECOORDINATESYSTEM").empty().append(dataChild.PLANECOORDINATESYSTEM);
    //            $("#HEIGHTCOORDINATESYSTEM").empty().append(dataChild.HEIGHTCOORDINATESYSTEM);
    //            $("#PERSON").empty().append(dataChild.PERSON);
    //            $("#LEVEL").empty().append(dataChild.LEVEL);
    //            $("#RESOLUTION").empty().append(dataChild.RESOLUTION);
    //            $("#METHOD").empty().append(dataChild.METHOD);
    //        }
    //
    //    }



        //var xmlDoc = $.parseXML( xml );
        //$xml = $( xmlDoc );
        //var data= {
        //    rows: []
        //};
        //var shu=xml.split("</Point>").length;
        //for(var i=1;i<shu;i++){
        //    $Point = $xml.find( "Point[pointID='"+i+"']" );
        //    data.rows.push({ id:i, data: [""+i, ""+i,""+ $Point.find( "LONRANGE" ).text(),""+ $Point.find( "LATRANGE" ).text(),""+ $Point.find( "HEIGHT" ).text()]});
        //}
        //argList.arg[0].clearAll();
        //argList.arg[0].parse(data,function(){
        //    //alert(1);
        //},"json");
        //
        //
        //attrInformation(1);
        //argList.arg[0].attachEvent('onRowSelect', function(rId, cInd){
        //    //argList.arg[0].cells(rId,cInd).getValue();
        //    attrInformation(rId);
        //    console.log(argList.arg[0].cells(rId,cInd).getValue());
        //    console.log(data);
        //});
        //
        //function attrInformation(id){
        //    $Point = $xml.find( "Point[pointID='"+id+"']" );
        //    $GRAPHID = $Point.find( "GRAPHID" );
        //
        //    $PRODUCTIONDATE = $Point.find( "PRODUCTIONDATE" );
        //
        //    $ZONENAME = $Point.find( "ZONENAME" );
        //    $FEATUREID = $Point.find( "FEATUREID" );
        //    $PLANECOORDINATESYSTEM = $Point.find( "PLANECOORDINATESYSTEM" );
        //    $HEIGHTCOORDINATESYSTEM = $Point.find( "HEIGHTCOORDINATESYSTEM" );
        //    $PERSON = $Point.find( "PERSON" );
        //    $LEVEL = $Point.find( "LEVEL" );
        //    $RESOLUTION = $Point.find( "RESOLUTION" );
        //    $METHOD = $Point.find( "METHOD" );
        //    $( "#GRAPHID").empty().append( $GRAPHID.text() );
        //    $( "#PRODUCTIONDATE" ).empty().append( $PRODUCTIONDATE.text() );
        //    $( "#ZONENAME").empty().append( $ZONENAME.text() );
        //    $( "#FEATUREID" ).empty().append( $FEATUREID.text() );
        //    $( "#PLANECOORDINATESYSTEM").empty().append( $PLANECOORDINATESYSTEM.text() );
        //    $( "#HEIGHTCOORDINATESYSTEM" ).empty().append( $HEIGHTCOORDINATESYSTEM.text() );
        //    $( "#PERSON").empty().append( $PERSON.text() );
        //    $( "#LEVEL" ).empty().append( $LEVEL.text() );
        //    $( "#RESOLUTION" ).empty().append( $RESOLUTION.text() );
        //    $( "#METHOD" ).empty().append( $METHOD.text() );
        //}



    };
    var _save = function(){
        $.ajax({
            url: window.dataurl+"SaveWorkCondition",
            type: "post",
            data:JSON.stringify({"taskid":taskUuid,"domid":taskUuid+imgId,"gcpjson":dataMain}),
            //dataType: 'JSPON',
            success: function (data) {
                alert("保存成功！");
            },
            error: function () {
                console.log("点列表数据2,请求失败");
            }
        });
    }
    var _pointProduce = function() {
        var rediskey = _uuid();

        //var gpcData=dataMain;
        //gpcData.forEach(function (item) {
        //    var name = "";
        //    item.FeaturePoint.Property.forEach(function (value) {
        //        name = value.IMAGEID;
        //        if (name == "L51F033030") {
        //            dataMain = item;
        //        }
        //    });
        //});
        var systemKey = getUrlParam("systemkey");
        var pointType = "影像特征点";
        if(systemKey == "yx"){
            pointType = "影像特征点";
        }else if(systemKey == "dd"){
            pointType = "大地特征点";
        }else if(systemKey == "xp"){
            pointType = "像片特征点";
        }
        var gridData={
            "taskid":taskUuid,
            "taskname":taskName,
            //"collectionrule":ghType,
            "controlpointsort":pointType,
            "rediskey":rediskey,
            "domid":selectDomData.domid,
            "domxmlid":selectDomData.xmlid,
            "dsmid":selectDomData.dsmid,
            //"domid":"53061084-b582-4c2e-9038-652afdfaaa85",
            //"domxmlid":"9b5f4bf7-79f3-437f-af65-eae4f78f044c",
            //"dsmid":"53061084-b582-4c2e-9038-652afdfaaa85",
            "gcpjson":dataMain
        };


        $.ajax({
            url: window.dataurl+"ImagePtCut",
            type: "post",
            data:JSON.stringify(gridData),
            //dataType: 'JSPON',
            success: function (data) {
                if(data=="SUCCESS"){
                    time();
                }else{
                    console.log(data);
                }
            },
            error: function () {
                console.log("点列表数据1,请求失败");
            }
        });

        function time(){
            console.log(3);
            var time=window.setInterval(function(){
                $.ajax({
                    url: window.dataurl+"ImagePtCutProcess",
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
                                url: window.dataurl+"ImagePtCutResult",
                                type: "post",
                                data:JSON.stringify({"rediskey":rediskey}),
                                //dataType: 'JSPON',
                                success: function (data) {
                                    //dataMain=$.parseJSON(data);
                                    //dataDisplay(dataMain);
                                    console.log(data);
                                },
                                error: function () {
                                    console.log("点列表数据1,请求失败");
                                }
                            });
                            window.clearInterval(time);
                        }
                    },
                    error: function () {
                        console.log("点列表数据,请求失败");
                    }
                });
            },2000);
        }
        //console.log("pointProduce")
        //$.ajax({
        //    url: "",
        //    type: "post",
        //    data: "",
        //    async:false,
        //    success: function (data) {
        //
        //    },
        //    error: function (e) {
        //        if(e.status == "401"){
        //            console.log("特征点数据生成项-数据获取失败")
        //        }
        //    }
        //})
        //argList.arg[1].attachHTMLString('<div id="attribute_table">' +
        //    '<ul class="attribute_attr">' +
        //    '<li>属性:</li>' +
        //    '<li>图幅编号:</li>' +
        //    '<li>测区时间:</li>' +
        //    '<li>测区名称:</li>' +
        //    '<li>像空点编号:</li>' +
        //    '<li>平面坐标系:</li>' +
        //    '<li>高程坐标系:</li>' +
        //    '<li>人员:</li>' +
        //    '<li>级别:</li>' +
        //    '<li>精度:</li>' +
        //    '<li>采集规划:</li>' +
        //    '</ul>' +
        //    '<ul class="attribute_value">' +
        //    '<li id="attr_value">值</li>' +
        //    '<li>1</li>' +
        //    '<li>1</li>' +
        //    '<li>1</li>' +
        //    '<li>1</li>' +
        //    '<li>1</li>' +
        //    '<li>1</li>' +
        //    '<li>1</li>' +
        //    '<li><HEIGHT></HEIGHT></li>' +
        //    '<li><PRODUCTIONDATE></PRODUCTIONDATE></li>' +
        //    '<li></li>' +
        //    '</ul>' +
        //    '</div>'
        //
        //);
    };
    function getUrlParam(name){
        var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null){
            return unescape(r[2])
        }else{
            return null;
        }
    }
    //var _saveDate= function(argList){
    //    var dataMain={                      //按保存按钮,生成操作后的数据
    //        "FeaturePoint" : {
    //            "Property": []
    //        }
    //    };
    //    var dataArr = dataMain.FeaturePoint;
    //    for(var i=1;i<=argList.arg[0].getRowsNum();i++){                //遍历一遍点信息列表,将最新的操作后数据动态生成并保存
    //        dataArr.push({"COL" : 11597,"DATAFORMAT" : "tif","DATASIZE" : 1024,"DOMMARK" : "E:\\testdata\\inputData\\GF1_beijing\\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff","DSMMARK" : "E:\\testdata\\inputData\\GF1_beijing\\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff","FEATUREID" : "H50E002023-20171023162532-2","GRAPHID" : "H50E002023","HEIGHT" : value(i,4),"HEIGHTCOORDINATESYSTEM" : "WGS84","LATRANGE" : value(i,3),"LEVEL" : "","PERSON" : "","LONRANGE" : value(i,2),"MAPPROJECTION" : "UTM","METHOD" : "自由规划","PLANECOORDINATESYSTEM" : "WGS84","POINTID" : argList.arg[0].getRowId(i-1),"PRODUCTIONDATE" : "2017-10-23 16:25:32","PRODUCTIONUNIT" : "","RESOLUTION" : "0.5","ROW" : 11555,"UNIT" : "meter","ZONE" : "49","ZONENAME" : ""});
    //    }
    //    function value(i,j) {                                   //包一段写起来简便的代码
    //        return argList.arg[0].cells(i,j).getValue();
    //    }
    //    //发送操作后的数据
    //    $.ajax({
    //        url: "http://192.168.31.229:5000/ImageFptRefine",
    //        type: "post",
    //        data:JSON.stringify(dataMain),
    //        //dataType: 'JSPON',
    //        success: function () {
    //
    //        },
    //        error: function (e) {
    //            if(e.status == "401"){
    //                console.log("请求失败");
    //            }
    //        }
    //    });
    //    //console.log(dataMain);
    //
    //    //console.log(data);
    //    //$.ajax({
    //    //    url: "http://192.168.31.230:5000/testmain",
    //    //    type: "get",
    //    //    data:{"id":"jiaoke","token":"zhangguibin"},
    //    //    async:false,
    //    //    success: function (data) {
    //    //
    //    //    },
    //    //    error: function (e) {
    //    //        if(e.status == "401"){
    //    //            console.log("特征点提取精化-数据获取失败")
    //    //        }
    //    //    }
    //    //})
    //    //var data={
    //    //    "FeaturePoint" :
    //    //    {
    //    //        "Property" :
    //    //            [
    //    //                {
    //    //                    "COL" : 11562,
    //    //                    "DATAFORMAT" : "tif",
    //    //                    "DATASIZE" : 1024,
    //    //                    "DOMMARK" : "E:\\testdata\\inputData\\GF1_beijing\\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff",
    //    //                    "DSMMARK" : "E:\\testdata\\inputData\\GF1_beijing\\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff",
    //    //                    "FEATUREID" : "H50E002023-20171023162532-1",
    //    //                    "GRAPHID" : "H50E002023",
    //    //                    "HEIGHT" : "501.00",
    //    //                    "HEIGHTCOORDINATESYSTEM" : "WGS84",
    //    //                    "LATRANGE" : "40.244306521",
    //    //                    "LEVEL" : "",
    //    //                    "PERSON" : "",
    //    //                    "LONRANGE" : "116.919906624",
    //    //                    "MAPPROJECTION" : "UTM",
    //    //                    "METHOD" : "自由规划",
    //    //                    "PLANECOORDINATESYSTEM" : "WGS84",
    //    //                    "POINTID" : 1,
    //    //                    "PRODUCTIONDATE" : "2017-10-23 16:25:32",
    //    //                    "PRODUCTIONUNIT" : "",
    //    //                    "RESOLUTION" : "0.5",
    //    //                    "ROW" : 11551,
    //    //                    "UNIT" : "meter",
    //    //                    "ZONE" : "49",
    //    //                    "ZONENAME" : ""
    //    //                },
    //    //                {
    //    //                    "COL" : 11597,
    //    //                    "DATAFORMAT" : "tif",
    //    //                    "DATASIZE" : 1024,
    //    //                    "DOMMARK" : "E:\\testdata\\inputData\\GF1_beijing\\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff",
    //    //                    "DSMMARK" : "E:\\testdata\\inputData\\GF1_beijing\\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff",
    //    //                    "FEATUREID" : "H50E002023-20171023162532-2",
    //    //                    "GRAPHID" : "H50E002023",
    //    //                    "HEIGHT" : "338.00",
    //    //                    "HEIGHTCOORDINATESYSTEM" : "WGS84",
    //    //                    "LATRANGE" : "40.244234655",
    //    //                    "LEVEL" : "",
    //    //                    "PERSON" : "",
    //    //                    "LONRANGE" : "116.920733823",
    //    //                    "MAPPROJECTION" : "UTM",
    //    //                    "METHOD" : "自由规划",
    //    //                    "PLANECOORDINATESYSTEM" : "WGS84",
    //    //                    "POINTID" : 2,
    //    //                    "PRODUCTIONDATE" : "2017-10-23 16:25:32",
    //    //                    "PRODUCTIONUNIT" : "",
    //    //                    "RESOLUTION" : "0.5",
    //    //                    "ROW" : 11555,
    //    //                    "UNIT" : "meter",
    //    //                    "ZONE" : "49",
    //    //                    "ZONENAME" : ""
    //    //                }
    //    //            ]
    //    //    }
    //    //};
    //    //var dataChild=data.FeaturePoint.Property;
    //    //dataChild.forEach(function (c) {
    //    //    $( "#GRAPHID").empty().append(dataChild.GRAPHID );
    //    //    $( "#PRODUCTIONDATE" ).empty().append(dataChild.PRODUCTIONDATE);
    //    //    $( "#ZONENAME").empty().append(dataChild.ZONENAME);
    //    //    $( "#FEATUREID" ).empty().append(dataChild.FEATUREID);
    //    //    $( "#PLANECOORDINATESYSTEM").empty().append(dataChild.PLANECOORDINATESYSTEM);
    //    //    $( "#HEIGHTCOORDINATESYSTEM" ).empty().append(dataChild.HEIGHTCOORDINATESYSTEM);
    //    //    $( "#PERSON").empty().append(dataChild.PERSON);
    //    //    $( "#LEVEL" ).empty().append(dataChild.LEVEL);
    //    //    $( "#RESOLUTION" ).empty().append(dataChild.RESOLUTION);
    //    //    $( "#METHOD" ).empty().append(dataChild.METHOD);
    //    //});
    //    //$.ajax({
    //    //    url: "http://192.168.31.230:5000/testmain",
    //    //    type: "post",
    //    //    //data:{"data":zhang},
    //    //    data:JSON.stringify(zhang),
    //    //    //dataType: 'JSPON',
    //    //    success: function () {
    //    //
    //    //    },
    //    //    error: function (e) {
    //    //        if(e.status == "401"){
    //    //            console.log("请求失败");
    //    //        }
    //    //    }
    //    //});
    //    //var url = 'http://192.168.31.230:5000/testmain';
    //    //$.ajax(url, {
    //    //    data:{"id":"jiaoke","token":"zhangguibin"},
    //    //    type: "get",
    //    //    dataType: 'jsonp',
    //    //    crossDomain: true,
    //    //    success: function (data) {
    //    //        if (data && data.resultcode == '200') {
    //    //            console.log("fasong2");
    //    //        }
    //    //    }
    //    //});
    //};
    return {
        pointHeight:_pointHeight,
        pointDraw:_pointDraw,
        pointProduce:_pointProduce,
        save:_save,
        mainAddPoint:_mainAddPoint,
        highLight:_highLight
    }
});
