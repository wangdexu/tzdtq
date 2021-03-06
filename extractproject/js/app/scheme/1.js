  window.onload = function () {  
            //获取下拉列表框  
            var typeSelect = document.getElementById('type');  
            //定义一个用来接收绘制对象的对象，方便以后对绘制对象进行添加、移除等操作  
            var draw;  
  
            //初始化地图对象  
            var map = new ol.Map({  
                target: 'map',  
                layers: [  
                    new ol.layer.Tile({  
                        source: new ol.source.OSM()  
                    })  
                ],  
                view: new ol.View({  
                    center: [0, 0],  
                    zoom: 3  
                })  
            });  
  
            //初始化矢量数据源对象  
            //wrapX:Wrap the world horizontally. Default is true.   
            //For vector editing across the -180° and 180° meridians to work properly, this should be set to false  
            var source = new ol.source.Vector({ wrapX: false });  
            //实例化矢量数据图层  
            var vector = new ol.layer.Vector({  
                //数据源  
                source: source,  
                //样式  
                style: new ol.style.Style({  
                    //样式填充  
                    fill: new ol.style.Fill({  
                        //填充颜色  
                        color: 'rgba(37,241,239,0.2)'
                    }),  
                    //笔触  
                    stroke: new ol.style.Stroke({  
                        //笔触颜色  
                        color: '#264df6',
                        //笔触宽度  
                        width:2  
                    }),  
                    //图形样式，主要适用于点样式  
                    image: new ol.style.Circle({  
                        //半径大小  
                        radius: 7,  
                        //填充  
                        fill: new ol.style.Fill({  
                            //填充颜色  
                            color: '#e81818'
                        })  
                    })  
                })  
            });  
  
            //将矢量图层加载到map中  
            map.addLayer(vector);  
  
            //添加绘图交互的函数  
            function addInteraction() {  
                //获取当前选择的绘图类型  
                var value = typeSelect.value;  
                //如果当前选择的绘图类型不为"None"的话，则进行相应绘图操作  
                //如果当前选择的绘图类型为"None"的话，则清空矢量数据源  
                if (value !== 'None') {  
                    //如果当前的矢量数据源为空的话，则重新创建和设置数据源  
                    //因为当你选择的绘图类型为"None"时，会清空数据源  
                    if (source == null) {  
                        source = new ol.source.Vector({ wrapX: false });  
                        vector.setSource(source);  
                    }  
                    //geometryFunction变量，用来存储绘制图形时的回调函数  
                    //maxPoints变量，用来存储最大的点数量  
                    var geometryFunction, maxPoints;  
                    //如果当前选择的绘图类型是"Square"的话，则将value设置为Circle  
                    //然后调用createRegularPolygon()方法  
                    if (value === 'Square') {  
                        value = 'Circle';  
                        //Create a geometryFunction for type: 'Circle'   
                        //that will create a regular polygon with a user specified number of sides and start angle instead of an ol.geom.  
                        //根据圆来创建一个四边形  
                        geometryFunction = ol.interaction.Draw.createRegularPolygon(4);  
                    } else if (value === 'Rectangle') {  
                        //如果当前选择的绘图类型是"Square"的话，则将value设置为LineString  
                        value = 'LineString';  
                        //设置最大点数为2  
                        maxPoints = 2;  
                        geometryFunction = function (coordinates, geometry) {  
                            //如果geometry对象不存在或者为空，则创建  
                            if (!geometry) {  
                                geometry = new ol.geom.Polygon(null);  
                            }  
                            //开始点的坐标  
                            var start = coordinates[0];  
                            //结束点的坐标  
                            var end = coordinates[1];  
                            //根据开始坐标和结束坐标设置绘图点坐标  
                            geometry.setCoordinates([  
                                [start, [start[0], end[1]], end, [end[0], start[1]], start]  
                            ]);  
                            return geometry;  
                        };  
                    }  
  
                    //将交互绘图对象赋给draw对象  
                    //初始化交互绘图对象  
                    draw = new ol.interaction.Draw({  
                        //数据源  
                        source: source,  
                        //绘制类型  
                        type: value,  
                        //回调函数  
                        //Function that is called when a geometry's coordinates are updated  
                        geometryFunction: geometryFunction,  
                        //最大点数  
                        maxPoints: maxPoints  
                    });  
                    //将draw对象添加到map中，然后就可以进行图形绘制了  
                    map.addInteraction(draw);  
                } else {  
                    //清空矢量数据源  
                    source = null;  
                    //设置矢量图层的数据源为空  
                    vector.setSource(source);  
                }  
            }  
  
            //当绘制类型下拉列表框的选项发生改变时执行  
            typeSelect.onchange = function (e) {  
                //从map中移除交互绘图对象  
                //如果不移除，则会在下拉列表框选项发生改变时再次进行绘制时，保留上一次的draw对象  
                map.removeInteraction(draw);  
                //执行添加绘图交互的函数  
                addInteraction();  
            };  
            //添加绘图交互的函数  
            //此处是为保证刷新页面后，仍然能够根据下拉列表框框的选项进行图形绘制  
            addInteraction();  
        };  