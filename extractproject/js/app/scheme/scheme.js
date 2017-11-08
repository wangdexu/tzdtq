var source;
var vector;
var selectedValue="2*2";
var vectorSource;
var vectorLayer;
var vectorSource1;
var vectorLayer1;
var vectorSource2;
var vectorLayer2;
var clearLayer1 = [];
var clearLayer2 = [];
var clearEven = [];
var clearEvenFree = [];
var allArrayFree = [];
var allFree = [];
var draw;
var allArray = [];
var cache;
var isFree;
var tempX;
var tempY;
var vectorFreeSource;
var vectorFreeLayer;
var xminX1,xmaxX1,xminY1,xmaxY1;
var xminX2,xmaxX2,xminY2,xmaxY2;
define(['jquery','dhtmlx','ol'],function($,dhl,ol){
    function clearMap(map){
        if(vectorSource1!=null&&vectorSource1!='undefined'){
            for(var i = 0;i<clearLayer1.length;i++)
            {
               map.removeLayer(clearLayer1[i]);
            } 
        }
       if(vectorSource2!=null&&vectorSource2!='undefined'){
            for(var j = 0;j<clearLayer2.length;j++)
            {
                map.removeLayer(clearLayer2[j]);
            } 
        }
        if(vectorFreeSource!=null&&vectorFreeSource!='undefined'){
            for(var j = 0;j<clearEvenFree.length;j++)
            {
                map.removeLayer(clearEvenFree[j]);
            } 
        }
        if(vectorSource!=null&&vectorSource!='undefined'){
            for(var i = 0;i<clearEven.length;i++)
            {
                map.removeLayer(clearEven[i]);
            }  
        }
        if(vector!=null)
            vector.getSource().clear();
    }
    var _targetSchemeEven = function(map,themeName){
        isFree = themeName;
        clearMap(map);
        selectedValue = "2*2";
        showDialog("",map,"均匀规划");
        $(".form-group>input")[0].style.display='none'
        $(".col-lg-12.col-md-12")[0].style.display='none'
        $(".form-group>select")[0].onchange = function(e){
                     var keyValue = {
                         "1-1":"2*2",
                         "1-2":"4*4",
                         "1-3":"8*8",
                         "1-4":"16*16"
                     }
            selectedValue = keyValue[e.target.value];
         }
    }
    var _targetSchemeFree = function(map,themeName){
        isFree = themeName;
        clearMap(map);
        showNet("",map,themeName)
        map.on('click',function(event){
               tempX = event.coordinate[0];//经度
               tempY = event.coordinate[1];//纬度
               selectedValue = "2*2";
               for(var i=0;i<allArrayFree.length;i++){
                   if(isFree=="goalProgram"){
                        break;
                   }
                    if((allArrayFree[i][0]<tempX&&tempX<allArrayFree[i][2])&&(allArrayFree[i][3]<tempY&&tempY<allArrayFree[i][1]))//四个矩形坐标位置
                    {
                        showDialog(allArrayFree[i],map,"自由规划",tempX,tempY);
                        $(".form-group>select")[0].value="2*2";
                        $(".col-lg-12.col-md-12")[0].style.display='block'
                        $(".form-group>input")[0].style.display='block'
                            $(".form-group>select")[0].onchange = function(e){
                                var keyValue = {
                                    "1-1":"2*2",
                                    "1-2":"4*4",
                                    "1-3":"8*8",
                                    "1-4":"16*16"
                                }
                            selectedValue = keyValue[e.target.value];
                        }
                    }
               }
        }); 
    }
    function submitArrayFree(a1,a2,a3,a4)
    {
        allArrayFree.length = 0;
        w = 4;
        h = 4;
        var m = (a3[0]-a4[0])/w;
        var n = (a3[1]-a2[1])/h;
        var x=a4[0];
        var y=a4[1];
        for(var i=0;i<w;i++)
        {
            for(var j=0;j<h;j++)
            {
                var p0=x+i*m;
                var p1=y-j*n;
                var p2=x+(i+1)*m;
                var p3=y-(j+1)*n;
                allArrayFree.push([p0,p1,p2,p3]);
                
            }
        }
    }
    function showNet(rect,map,theme){
        var a1=[],a2=[],a3=[],a4=[];
        var count;
        a1.push(map.previousExtent_[0],map.previousExtent_[1]);
        allFree.push(a1);
        a2.push(map.previousExtent_[2],map.previousExtent_[1]);
        allFree.push(a2);
        a3.push(map.previousExtent_[2],map.previousExtent_[3]);
        allFree.push(a3);
        a4.push(map.previousExtent_[0],map.previousExtent_[3]);
        allFree.push(a4);
        if(isFree=='均匀规划'){
            count = 0;
        }else{
            count = 4;
        }
        addEvenNetFree(a1,a2,a3,a4,count,map,theme);
    }
    var _targetScheme = function(map,themeName){
        isFree = themeName;
        clearMap(map);
        if(source!=null&&source!='undefined'){
             map.removeLayer(vector); 
        }
        source= new ol.source.Vector();
        vector = new ol.layer.Vector({
            source: source
        });
        //将矢量图层加载到map中  
        map.addLayer(vector); 
        //  map.removeInteraction(draw);
        if(draw!=null&&draw!='undefined'){
             map.removeInteraction(draw);
        }
        draw = new ol.interaction.Draw({
                    source: source,
                    type: 'LineString',
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: '#ffcc33'
                            })
                        })
                    }),
                    maxPoints: 2,
                    geometryFunction: function(coordinates, geometry){
                        if(!geometry){
                            geometry = new ol.geom.Polygon(null);
                        }
                        var start = coordinates[0];
                        var end = coordinates[1];
                        geometry.setCoordinates([
                            [start, [start[0], end[1]], end, [end[0], start[1]], start]
                        ]);
                        return geometry;
                    }
            });
            map.addInteraction(draw);
            draw.on('drawend',function(event){
                 map.removeInteraction(draw);
                 var rect = event.feature.values_.geometry.extent_;
                 showDialog(rect,map,"目标规划","","");
                 $(".col-lg-12.col-md-12")[0].style.display='block';
                 $(".form-group>input")[0].style.display='block'
                 $(".form-group>select")[0].onchange = function(e){
                     var keyValue = {
                          "1-1":"2*2",
                          "1-2":"4*4",
                          "1-3":"8*8",
                          "1-4":"16*16"
                     }
                     selectedValue = keyValue[e.target.value];
                 }
            });     
    };
   
    function showDialog(rect,map,theme,x,y)
    {
        cache = rect;
        function getFormContent() {
            return $("#formTemplateId").html();
        }
        var singleButtons = [];
        singleButtons.push({id:"startIncButId",name:"确定",order:2,halign:"right",callback:function(){drawNet(cache,map,theme,x,y);return false}});
        singleButtons.push({id:"sendMessageButId",name:"取消",order:1,halign:"right",callback:function(){cancelNet();return false}}); 
        var showPar = {
            zIndex:1024,
            width:400,
            height:200,  
            title:theme,
            content:getFormContent,
            singleButtons:singleButtons,
            isButtonGroupsAfter:true,
            operatePosition:"bottom",
            isDragable:true
        }
        noModalService("modal-9","show",showPar);
        $(".panel-body input")[0].onchange = function(){
            $("#value1")[0].value = "";
            $("#value2")[0].value = "";
        }
        $(".panel-body input")[1].onchange = function(){
            $(".form-group>select")[0].value="";
        }
        $(".close")[0].onclick = function(){
            clearMap(map);
        }
        $("#sendMessageButId_modal-9")[0].onclick = function(){
            clearMap(map);
            $("#value1")[0].value = "";
            $("#value2")[0].value = "";
            $(".form-group>select")[0].value="";
        }
    }
    function drawNet(rect,map,theme,x,y)
    {
        var selectValue;
        if($(".panel-body input")[0].checked){//下拉选择
                selectValue = selectedValue
                $("#value1")[0].value = "";
                $("#value2")[0].value = "";

        }else
        {
            $(".form-group>select")[0].value="";
            selectValue = $("#value1")[0].value+"*"+$("#value2")[0].value;
        }
        var a1=[],a2=[],a3=[],a4=[];
        if(theme=="均匀规划"){
            a1.push(map.previousExtent_[0],map.previousExtent_[1]);
            a2.push(map.previousExtent_[2],map.previousExtent_[1]);
            a3.push(map.previousExtent_[2],map.previousExtent_[3]);
            a4.push(map.previousExtent_[0],map.previousExtent_[3]);
        }else if(theme=="自由规划"){
            a1.push(rect[0],rect[3]);
            a2.push(rect[2],rect[3]);
            a3.push(rect[2],rect[1]);
            a4.push(rect[0],rect[1]);
        }
        else{
            a1.push(rect[0],rect[1]);
            a2.push(rect[2],rect[1]);
            a3.push(rect[2],rect[3]);
            a4.push(rect[0],rect[3]);
        }
        seperateLine(a1,a2,a3,a4,selectValue,map,theme,x,y); 
    }
    var styles = {
            'GeometryCollection': [new ol.style.Style({
                    stroke: new ol.style.Stroke({
                    width: 1,    
                    color: [255, 0, 0, 1]  
                }),
                })],
    };
    var styleFunction = function(feature, resolution) {
            return styles[feature.getGeometry().getType()];
    };
    function seperateLine(a1,a2,a3,a4,count,map,theme,x,y)
    {
            var cnt1,cnt2;
            var Arr12=[],Arr23=[],Arr34=[],Arr14=[];
            Arr34.push([a4[0],a4[1]]);
            if(($("#value1")[0].value!=$("#value2")[0].value)&&(count!="2*2"&&count!="4*4"&&count!="8*8"&&count!="16*16"))
            {
                cn1 = $("#value1")[0].value;
                cn2 = $("#value2")[0].value;
                var number;
                if(theme=="自由规划"){
                    for(var k = 0;k<allArrayFree.length;k++){//16份
                        if((allArrayFree[k][0]<tempX&&tempX<allArrayFree[k][2])&&(allArrayFree[k][3]<tempY&&tempY<allArrayFree[k][1])){
                            number = k;
                        }
                    }
                    for(var i = 0;i<clearEven.length;i++){
                        if(clearEven[i].values_.id=="layer"+number){
                             map.removeLayer(clearEven[i]);
                        }
                    }
                    for(var i = 0;i<clearLayer1.length;i++){
                        if(clearLayer1[i].values_.id=="layer1"+number){
                             map.removeLayer(clearLayer1[i]);
                        }
                    }
                    for(var i = 0;i<clearLayer2.length;i++){
                        if(clearLayer2[i].values_.id=="layer2"+number){
                             map.removeLayer(clearLayer2[i]);
                        }
                    }               
                }else{
                    if(vectorSource1!=null&&vectorSource1!='undefined'){
                            for(var i = 0;i<clearLayer1.length;i++)
                            {
                                map.removeLayer(clearLayer1[i]);
                            } 
                    }
                    if(vectorSource2!=null&&vectorSource2!='undefined'){
                            for(var j = 0;j<clearLayer2.length;j++)
                            {
                                map.removeLayer(clearLayer2[j]);
                            } 
                    }
                    if(vectorSource!=null&&vectorSource!='undefined')
                    {
                        for(var i = 0;i<clearEven.length;i++)
                        {
                            map.removeLayer(clearEven[i]);
                        }  
                    }
                }
                for(var k = 1;k<=cn1-1;k++)
                {
                    var x12=[],x23=[],x34=[],x14=[];
                    x12.push(((cn1-k)*a1[0]+k*a2[0])/cn1,((cn1-k)*a1[1]+k*a2[1])/cn1);
                    Arr12.push([x12[0],x12[1]]);
                    x34.push(((cn1-k)*a4[0]+k*a3[0])/cn1,((cn1-k)*a4[1]+k*a3[1])/cn1);
                    Arr34.push([x34[0],x34[1]]);
                    var geojsonObject = {
                            'type': 'FeatureCollection',
                            'crs': {
                                'type': 'name',
                                'properties': {
                                'name': 'EPSG:3857'
                                }
                            },
                            'features': [
                                {
                                'type': 'Feature',
                                'geometry': {
                                        'type': 'GeometryCollection',
                                        'geometries': [
                                            {
                                                'type': 'LineString',
                                                'coordinates': [[x12[0],x12[1]],[x34[0],x34[1]]]
                                            }
                                        ]
                                    }
                                }
                            ]
                    };
                    vectorSource1 = new ol.source.Vector({
                            features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
                        });
                    
                    vectorLayer1 = new ol.layer.Vector({
                        id:"layer1"+number,
                        source: vectorSource1,
                        style: styleFunction
                    });
                    clearLayer1.push(vectorLayer1);
                    map.addLayer(vectorLayer1);
                }
                for(var j = 1;j<=cn2-1;j++)
                {
                    var x12=[],x23=[],x34=[],x14=[];
                    x23.push(((cn2-j)*a2[0]+j*a3[0])/cn2,((cn2-j)*a2[1]+j*a3[1])/cn2);
                    Arr23.push([x23[0],x23[1]]);
                    x14.push(((cn2-j)*a1[0]+j*a4[0])/cn2,((cn2-j)*a1[1]+j*a4[1])/cn2);
                    Arr14.push([x14[0],x14[1]]);
                    var geojsonObject = {
                            'type': 'FeatureCollection',
                            'crs': {
                                'type': 'name',
                                'properties': {
                                'name': 'EPSG:3857'
                                }
                            },
                            'features': [
                                {
                                'type': 'Feature',
                                'geometry': {
                                        'type': 'GeometryCollection',
                                        'geometries': [
                                            {
                                                'type': 'LineString',
                                                'coordinates': [[x14[0],x14[1]],[x23[0],x23[1]]]
                                            }
                                        ]
                                    }
                                }
                            ]
                    };
                    vectorSource2 = new ol.source.Vector({
                            features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
                        });
                    vectorLayer2 = new ol.layer.Vector({
                        id:"layer2"+number,
                        source: vectorSource2,
                        style: styleFunction
                    });
                    clearLayer2.push(vectorLayer2);
                    map.addLayer(vectorLayer2);
                }

            }
            else
            {
               addEvenNet(a1,a2,a3,a4,count,map,theme,x,y,number);
            }
            submitArray(a1,a2,a3,a4);   
    }
    function addEvenNetFree(a1,a2,a3,a4,count,map,theme){
                clearEvenFree.length = 0;
                vectorFreeSource = null;
                vectorFreeLayer= null;
                //此处应该判断是否均匀分布
                var n;
                if(!isNaN(count)){
                    n = count;
                }else{
                    n = count.split("*")[0]
                }
                for(var k = 1;k<=n-1;k++){
                    var x12=[],x23=[],x34=[],x14=[];
                    x12.push(((n-k)*a2[0]+k*a1[0])/n,((n-k)*a2[1]+k*a1[1])/n);
                    x34.push(((n-k)*a3[0]+k*a4[0])/n,((n-k)*a3[1]+k*a4[1])/n);
                    x23.push(((n-k)*a2[0]+k*a3[0])/n,((n-k)*a2[1]+k*a3[1])/n);
                    x14.push(((n-k)*a1[0]+k*a4[0])/n,((n-k)*a1[1]+k*a4[1])/n);
                    var geojsonObject = {
                            'type': 'FeatureCollection',
                            'crs': {
                                'type': 'name',
                                'properties': {
                                'name': 'EPSG:3857'
                                }
                            },
                            'features': [
                                {
                                'type': 'Feature',
                                'geometry': {
                                        'type': 'GeometryCollection',
                                        'geometries': [
                                            {
                                                'type': 'MultiLineString',
                                                'coordinates': [
                                                    [[x14[0],x14[1]],[x23[0],x23[1]]],
                                                    [[x12[0],x12[1]],[x34[0],x34[1]]]
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                    };
                    vectorFreeSource = new ol.source.Vector({
                            features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
                        });
                    vectorFreeLayer = new ol.layer.Vector({
                        source: vectorFreeSource,
                        style: styleFunction
                    });
                    map.addLayer(vectorFreeLayer);
                    clearEvenFree.push(vectorFreeLayer);
                }
                submitArrayFree(a1,a2,a3,a4);   
    }
    function addEvenNet(a1,a2,a3,a4,count,map,theme,x,y,number){
                if(theme=="自由规划"){
                    for(var k = 0;k<allArrayFree.length;k++){//16份
                        if((allArrayFree[k][0]<tempX&&tempX<allArrayFree[k][2])&&(allArrayFree[k][3]<tempY&&tempY<allArrayFree[k][1])){
                            number = k;
                        }
                    }
                    for(var i = 0;i<clearEven.length;i++){
                        if(clearEven[i].values_.id=="layer"+number){
                             map.removeLayer(clearEven[i]);
                        }
                    }
                    for(var i = 0;i<clearLayer1.length;i++){
                        if(clearLayer1[i].values_.id=="layer1"+number){
                             map.removeLayer(clearLayer1[i]);
                        }
                    }
                    for(var i = 0;i<clearLayer2.length;i++){
                        if(clearLayer2[i].values_.id=="layer2"+number){
                             map.removeLayer(clearLayer2[i]);
                        }
                    }
                }else{
                    if(vectorSource1!=null&&vectorSource1!='undefined'){
                            for(var i = 0;i<clearLayer1.length;i++)
                            {
                                map.removeLayer(clearLayer1[i]);
                            } 
                    }
                    if(vectorSource2!=null&&vectorSource2!='undefined'){
                            for(var j = 0;j<clearLayer2.length;j++)
                            {
                                map.removeLayer(clearLayer2[j]);
                            } 
                    }
                    if(vectorSource!=null&&vectorSource!='undefined')
                    {
                        for(var i = 0;i<clearEven.length;i++)
                        {
                            map.removeLayer(clearEven[i]);
                        }  
                    }
                }
                // clearEven.length = 0;
                vectorSource = null;
                vectorLayer = null;
                //此处应该判断是否均匀分布
                var n;
                if(!isNaN(count)){
                    n = count;
                }else{
                    n = count.split("*")[0]
                }
                for(var k = 1;k<=n-1;k++){
                    var x12=[],x23=[],x34=[],x14=[];
                    x12.push(((n-k)*a2[0]+k*a1[0])/n,((n-k)*a2[1]+k*a1[1])/n);
                    x34.push(((n-k)*a3[0]+k*a4[0])/n,((n-k)*a3[1]+k*a4[1])/n);
                    x23.push(((n-k)*a2[0]+k*a3[0])/n,((n-k)*a2[1]+k*a3[1])/n);
                    x14.push(((n-k)*a1[0]+k*a4[0])/n,((n-k)*a1[1]+k*a4[1])/n);
                    var geojsonObject = {
                            'type': 'FeatureCollection',
                            'crs': {
                                'type': 'name',
                                'properties': {
                                'name': 'EPSG:3857'
                                }
                            },
                            'features': [
                                {
                                'type': 'Feature',
                                'geometry': {
                                        'type': 'GeometryCollection',
                                        'geometries': [
                                            {
                                                'type': 'MultiLineString',
                                                'coordinates': [
                                                    [[x14[0],x14[1]],[x23[0],x23[1]]],
                                                    [[x12[0],x12[1]],[x34[0],x34[1]]]
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                    };
                    vectorSource = new ol.source.Vector({
                            features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
                        });
                    vectorLayer = new ol.layer.Vector({
                        id:'layer'+number,
                        source: vectorSource,
                        style: styleFunction
                    });
                    map.addLayer(vectorLayer);
                    clearEven.push(vectorLayer);
                }
                // submitArrayFree(a1,a2,a3,a4);        
    }
    function submitArray(a1,a2,a3,a4)
    {
        var selectedValueInput = $("#value1")[0].value+"*"+$("#value2")[0].value;
        var w,h;
        allArray.length = 0;
        if((selectedValue=="2*2"||selectedValue=="4*4"||selectedValue=="8*8"||selectedValue=="16*16")&&selectedValueInput=="*")
        {
                    var keyValue = {
                        "2*2":"2",
                        "4*4":"4",
                        "8*8":"8",
                        "16*16":"16"
                    };
                    w = keyValue[selectedValue];
                    h = keyValue[selectedValue];

        }else
        {
            w = $("#value1")[0].value;
            h = $("#value2")[0].value;
        }
            var m = (a3[0]-a4[0])/w;
            var n = (a3[1]-a2[1])/h;
            var x=a4[0];
            var y=a4[1];
            for(var i=0;i<w;i++)
            {
                for(var j=0;j<h;j++)
                {
                  var p0=x+i*m;
                  var p1=y-j*n;
                  var p2=x+(i+1)*m;
                  var p3=y-(j+1)*n;
                  allArray.push([p0,p1,p2,p3]);
                }
            }
    }
    return {
        targetScheme:_targetScheme,
        targetSchemeEven:_targetSchemeEven,
        targetSchemeFree:_targetSchemeFree    
    }
});

