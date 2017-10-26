define(['jquery','dhtmlx','ol'],function($,dhl,ol){
    var _pointDraw = function(argList){
        //console.log("pointDraw")
        //$.ajax({
        //    url: "",
        //    type: "post",
        //    data: {},
        //    async:false,
        //    success: function (data) {
        //
        //    },
        //    error: function (e) {
        //        if(e.status == "401"){
        //            console.log("特征点提取精化-数据获取失败")
        //        }
        //    }
        //})


        //点信息显示:
//        var jingwei=' 1  116.919906624  40.244306521  501.00 2  116.920733823  40.244234655  338.00 3  116.918821334  40.242820832  135.00 4  116.921538433  40.243257321  312.00 5  116.931022607  40.235422186  303.00 6  116.933362243  40.235025160  170.00 7  116.931212956  40.234118454  304.00 8  116.933220685  40.234807771  236.00';
//        var data= {
//            rows: []
//        };
//        for(var i=2;i<9;i++){
//            var  grade=jingwei.split(" "+i+"  ")[0].split("  ");
////        console.log( grade);
//            data.rows.push({ id:i-1, data: [""+i-1, ""+i-1,""+ grade[ grade.length-3],""+ grade[ grade.length-2],""+ grade[ grade.length-1]]});
//        }
//        console.log(111);
//        argList.arg[0].clearAll();
//        argList.arg[0].parse(data,function(){
//            //alert(1);
//        },"json");


        //属性信息显示:
        var xml='<?xml version="1.0" encoding="UTF-8"?> <Root> <ProductType>FeaturePoint</ProductType> <Product> <FeaturePoint> <Point pointID="1" active="true"> <GRAPHID>aaaE002023</GRAPHID> <FEATUREID>H50E002023-20171020153435-1</FEATUREID> <DSMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff</DSMMARK> <DOMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff</DOMMARK> <PRODUCTIONDATE>2017-10-20 15:34:35</PRODUCTIONDATE> <ZONENAME></ZONENAME> <PLANECOORDINATESYSTEM>WGS84</PLANECOORDINATESYSTEM> <HEIGHTCOORDINATESYSTEM>WGS84</HEIGHTCOORDINATESYSTEM> <PRODUCTIONUNIT></PRODUCTIONUNIT> <METHOD>鑷敱瑙勫垝</METHOD> <PERSON></PERSON> <LEVEL></LEVEL> <DATASIZE>1024</DATASIZE> <DATAFORMAT>tif</DATAFORMAT> <RESOLUTION>04.5</RESOLUTION> <LONRANGE>116.919906624</LONRANGE> <LATRANGE>40.244306521</LATRANGE> <HEIGHT>501.00</HEIGHT> <ROW>11551</ROW> <COL>11562</COL> <MAPPROJECTION>UTM</MAPPROJECTION> <ZONE>49</ZONE> <UNIT>meter</UNIT> </Point> <Point pointID="2" active="true"> <GRAPHID>bbbE002023</GRAPHID> <FEATUREID>H50E002023-20171020153435-2</FEATUREID> <DSMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff</DSMMARK> <DOMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff</DOMMARK> <PRODUCTIONDATE>2017-10-20 15:34:35</PRODUCTIONDATE> <ZONENAME></ZONENAME> <PLANECOORDINATESYSTEM>WGS84</PLANECOORDINATESYSTEM> <HEIGHTCOORDINATESYSTEM>WGS84</HEIGHTCOORDINATESYSTEM> <PRODUCTIONUNIT></PRODUCTIONUNIT> <METHOD>鑷敱瑙勫垝</METHOD> <LEVEL></LEVEL> <DATASIZE>1024</DATASIZE> <DATAFORMAT>tif</DATAFORMAT> <RESOLUTION>0.5</RESOLUTION> <LONRANGE>116.920733823</LONRANGE> <LATRANGE>40.244234655</LATRANGE> <HEIGHT>338.00</HEIGHT> <ROW>11555</ROW> <COL>11597</COL> <MAPPROJECTION>UTM</MAPPROJECTION> <ZONE>49</ZONE> <UNIT>meter</UNIT> </Point> <Point pointID="3" active="true"> <GRAPHID>cccE002023</GRAPHID> <FEATUREID>H50E002023-20171020153435-3</FEATUREID> <DSMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff</DSMMARK> <DOMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff</DOMMARK> <PRODUCTIONDATE>2017-10-20 15:34:35</PRODUCTIONDATE> <ZONENAME></ZONENAME> <PLANECOORDINATESYSTEM>WGS84</PLANECOORDINATESYSTEM> <HEIGHTCOORDINATESYSTEM>WGS84</HEIGHTCOORDINATESYSTEM> <PRODUCTIONUNIT></PRODUCTIONUNIT> <METHOD>鑷敱瑙勫垝</METHOD> <LEVEL></LEVEL> <DATASIZE>1024</DATASIZE> <DATAFORMAT>tif</DATAFORMAT> <RESOLUTION>0.5</RESOLUTION> <LONRANGE>116.918821334</LONRANGE> <LATRANGE>40.242820832</LATRANGE> <HEIGHT>135.00</HEIGHT> <ROW>11633</ROW> <COL>11516</COL> <MAPPROJECTION>UTM</MAPPROJECTION> <ZONE>49</ZONE> <UNIT>meter</UNIT> </Point> <Point pointID="4" active="true"> <GRAPHID>dddE002023</GRAPHID> <FEATUREID>H50E002023-20171020153435-4</FEATUREID> <DSMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff</DSMMARK> <DOMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff</DOMMARK> <PRODUCTIONDATE>2017-10-20 15:34:35</PRODUCTIONDATE> <ZONENAME></ZONENAME> <PLANECOORDINATESYSTEM>WGS84</PLANECOORDINATESYSTEM> <HEIGHTCOORDINATESYSTEM>WGS84</HEIGHTCOORDINATESYSTEM> <PRODUCTIONUNIT></PRODUCTIONUNIT> <METHOD>鑷敱瑙勫垝</METHOD> <LEVEL></LEVEL> <DATASIZE>1024</DATASIZE> <DATAFORMAT>tif</DATAFORMAT> <RESOLUTION>0.5</RESOLUTION> <LONRANGE>116.921538433</LONRANGE> <LATRANGE>40.243257321</LATRANGE> <HEIGHT>312.00</HEIGHT> <ROW>11609</ROW> <COL>11631</COL> <MAPPROJECTION>UTM</MAPPROJECTION> <ZONE>49</ZONE> <UNIT>meter</UNIT> </Point> <Point pointID="5" active="true"> <GRAPHID>eeeE002023</GRAPHID> <FEATUREID>H50E002023-20171020153435-5</FEATUREID> <DSMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff</DSMMARK> <DOMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff</DOMMARK> <PRODUCTIONDATE>2017-10-20 15:34:35</PRODUCTIONDATE> <ZONENAME></ZONENAME> <PLANECOORDINATESYSTEM>WGS84</PLANECOORDINATESYSTEM> <HEIGHTCOORDINATESYSTEM>WGS84</HEIGHTCOORDINATESYSTEM> <PRODUCTIONUNIT></PRODUCTIONUNIT> <METHOD>鑷敱瑙勫垝</METHOD> <LEVEL></LEVEL> <DATASIZE>1024</DATASIZE> <DATAFORMAT>tif</DATAFORMAT> <RESOLUTION>0.5</RESOLUTION> <LONRANGE>116.931022607</LONRANGE> <LATRANGE>40.235422186</LATRANGE> <HEIGHT>303.00</HEIGHT> <ROW>12042</ROW> <COL>12032</COL> <MAPPROJECTION>UTM</MAPPROJECTION> <ZONE>49</ZONE> <UNIT>meter</UNIT> </Point> <Point pointID="6" active="true"> <GRAPHID>fffE002023</GRAPHID> <FEATUREID>H50E002023-20171020153435-6</FEATUREID> <DSMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff</DSMMARK> <DOMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff</DOMMARK> <PRODUCTIONDATE>2017-10-20 15:34:35</PRODUCTIONDATE> <ZONENAME></ZONENAME> <PLANECOORDINATESYSTEM>WGS84</PLANECOORDINATESYSTEM> <HEIGHTCOORDINATESYSTEM>WGS84</HEIGHTCOORDINATESYSTEM> <PRODUCTIONUNIT></PRODUCTIONUNIT> <METHOD>鑷敱瑙勫垝</METHOD> <LEVEL></LEVEL> <DATASIZE>1024</DATASIZE> <DATAFORMAT>tif</DATAFORMAT> <RESOLUTION>0.5</RESOLUTION> <LONRANGE>116.933362243</LONRANGE> <LATRANGE>40.235025160</LATRANGE> <HEIGHT>170.00</HEIGHT> <ROW>12064</ROW> <COL>12131</COL> <MAPPROJECTION>UTM</MAPPROJECTION> <ZONE>49</ZONE> <UNIT>meter</UNIT> </Point> <Point pointID="7" active="true"> <GRAPHID>gggE002023</GRAPHID> <FEATUREID>H50E002023-20171020153435-7</FEATUREID> <DSMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff</DSMMARK> <DOMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff</DOMMARK> <PRODUCTIONDATE>2017-10-20 15:34:35</PRODUCTIONDATE> <ZONENAME></ZONENAME> <PLANECOORDINATESYSTEM>WGS84</PLANECOORDINATESYSTEM> <HEIGHTCOORDINATESYSTEM>WGS84</HEIGHTCOORDINATESYSTEM> <PRODUCTIONUNIT></PRODUCTIONUNIT> <METHOD>鑷敱瑙勫垝</METHOD> <LEVEL></LEVEL> <DATASIZE>1024</DATASIZE> <DATAFORMAT>tif</DATAFORMAT> <RESOLUTION>0.5</RESOLUTION> <LONRANGE>116.931212956</LONRANGE> <LATRANGE>40.234118454</LATRANGE> <HEIGHT>304.00</HEIGHT> <ROW>12114</ROW> <COL>12040</COL> <MAPPROJECTION>UTM</MAPPROJECTION> <ZONE>49</ZONE> <UNIT>meter</UNIT> </Point> <Point pointID="8" active="true"> <GRAPHID>hhhE002023</GRAPHID> <FEATUREID>H50E002023-20171020153435-8</FEATUREID> <DSMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dsm.tiff</DSMMARK> <DOMMARK>E:\testdata\inputData\GF1_beijing\GF1_PMS1_E116.9_N40.3_20160831_L1A0001795441_dom.tiff</DOMMARK> <PRODUCTIONDATE>2017-10-20 15:34:35</PRODUCTIONDATE> <ZONENAME></ZONENAME> <PLANECOORDINATESYSTEM>WGS84</PLANECOORDINATESYSTEM> <HEIGHTCOORDINATESYSTEM>WGS84</HEIGHTCOORDINATESYSTEM> <PRODUCTIONUNIT></PRODUCTIONUNIT> <METHOD>鑷敱瑙勫垝</METHOD> <LEVEL></LEVEL> <DATASIZE>1024</DATASIZE> <DATAFORMAT>tif</DATAFORMAT> <RESOLUTION>0.5</RESOLUTION> <LONRANGE>116.933220685</LONRANGE> <LATRANGE>40.234807771</LATRANGE> <HEIGHT>236.00</HEIGHT> <ROW>12076</ROW> <COL>12125</COL> <MAPPROJECTION>UTM</MAPPROJECTION> <ZONE>49</ZONE> <UNIT>meter</UNIT> </Point> </FeaturePoint> </Product> </Root>';
        var xmlDoc = $.parseXML( xml );
        $xml = $( xmlDoc );
        var data= {
            rows: []
        };
        var shu=xml.split("</Point>").length;
        for(var i=1;i<shu;i++){
            $Point = $xml.find( "Point[pointID='"+i+"']" );
            data.rows.push({ id:i, data: [""+i, ""+i,""+ $Point.find( "LONRANGE" ).text(),""+ $Point.find( "LATRANGE" ).text(),""+ $Point.find( "HEIGHT" ).text()]});
        }
        argList.arg[0].clearAll();
        argList.arg[0].parse(data,function(){
            //alert(1);
        },"json");


        attrInformation(1);
        argList.arg[0].attachEvent('onRowSelect', function(rId, cInd){
            //argList.arg[0].cells(rId,cInd).getValue();
            attrInformation(rId);
            console.log(argList.arg[0].cells(rId,cInd).getValue());
            console.log(data);
        });

        function attrInformation(id){
            $Point = $xml.find( "Point[pointID='"+id+"']" );
            $GRAPHID = $Point.find( "GRAPHID" );

            $PRODUCTIONDATE = $Point.find( "PRODUCTIONDATE" );

            $ZONENAME = $Point.find( "ZONENAME" );
            $FEATUREID = $Point.find( "FEATUREID" );
            $PLANECOORDINATESYSTEM = $Point.find( "PLANECOORDINATESYSTEM" );
            $HEIGHTCOORDINATESYSTEM = $Point.find( "HEIGHTCOORDINATESYSTEM" );
            $PERSON = $Point.find( "PERSON" );
            $LEVEL = $Point.find( "LEVEL" );
            $RESOLUTION = $Point.find( "RESOLUTION" );
            $METHOD = $Point.find( "METHOD" );
            $( "#GRAPHID").empty().append( $GRAPHID.text() );
            $( "#PRODUCTIONDATE" ).empty().append( $PRODUCTIONDATE.text() );
            $( "#ZONENAME").empty().append( $ZONENAME.text() );
            $( "#FEATUREID" ).empty().append( $FEATUREID.text() );
            $( "#PLANECOORDINATESYSTEM").empty().append( $PLANECOORDINATESYSTEM.text() );
            $( "#HEIGHTCOORDINATESYSTEM" ).empty().append( $HEIGHTCOORDINATESYSTEM.text() );
            $( "#PERSON").empty().append( $PERSON.text() );
            $( "#LEVEL" ).empty().append( $LEVEL.text() );
            $( "#RESOLUTION" ).empty().append( $RESOLUTION.text() );
            $( "#METHOD" ).empty().append( $METHOD.text() );
        }



    };
    var _pointProduce = function(){
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
    var _saveDate= function(argList){
        var data= {
            rows: []
        };
        for(var i=1;i<=argList.arg[0].getRowsNum();i++){
                data.rows.push({ id:i, data: {"orderNumber":i, "pointID":i,"lon":argList.arg[0].cells(i,2).getValue(),"lat":argList.arg[0].cells(i,3).getValue(),"height":argList.arg[0].cells(i,4).getValue()}});
        }
        console.log(data);
        //$.ajax({
        //    url: "",
        //    type: "post",
        //    data: {},
        //    async:false,
        //    success: function (data) {
        //
        //    },
        //    error: function (e) {
        //        if(e.status == "401"){
        //            console.log("特征点提取精化-数据获取失败")
        //        }
        //    }
        //})
    };
    return {
        pointDraw:_pointDraw,
        pointProduce:_pointProduce,
        saveDate:_saveDate
    }
});
