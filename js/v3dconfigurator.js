'use strict';

var app;
var mediadir = 'media/';
var url = 'media/popbag-medium.gltf';

function getMainDir() {
    var scripts= document.getElementsByTagName('script');
    var path= scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
    var mydir= path.split('/').slice(0, -1).join('/')+'/';  // remove last filename part of path

    var the_arr = mydir.split('/');
    the_arr.pop();
    the_arr.pop();
        
    return the_arr.join('/')+"/";
}

$(document).ready(function(){
    class myLoader extends v3d.SimplePreloader {
        constructor(e) {
            super(e);
            this.background.setAttribute("style", "margin:0 auto; padding:0;");
            this.gearCont.setAttribute("style", "margin:0 auto");
            //var textstyle = ["color: " + this.textColor.getStyle() + ";", "text-align: center;", "position: absolute;", "top: 50%;", "left: 50%;", "margin-top: -18px;", "margin-left: -43px;", "min-width: 90px;", "font-size: 30px;", "font-family: sans-serif;", "font-weight: bold;"].join("\n");
            var textstyle = ["color: " + this.textColor.getStyle() + ";", "margin-top:-85px;", "text-align: center;", "display:flex;", "justify-content:center;", "align-items:center;", "text-align:center;", "min-width: 90px;", "font-size: 30px;", "font-family: sans-serif;", "font-weight: bold;"].join("\n");
            this.text.setAttribute("style", textstyle);
        }
    }
    if($('div#container3d').length) {
        app = new v3d.App('container3d', {alpha: true}, 
            new myLoader({ container: 'container3d' }));

        app.load(url, function() {
            window.pauseRender = true;
            app.myRender = app.render;
            app.render = function(){
                if(!window.pauseRender) {
                    app.myRender();
                }
            }
            // Transparent Background
            app.scene.background = null;
            app.renderer.setClearColor(0x000000, 0);
            app.scene.children.find(function(e){return e.name=="Ambient_Scene";}).visible = false;
            
            // Shadow Catcher Material
            var material = new THREE.ShadowMaterial();
            material.opacity = 0.2;
            material.receiveShadow = true;
            //material.side = THREE.DoubleSide;
            app.scene.children.find(function(e){return e.name=="ShadowPlane";}).material = material;
            material.needsUpdate = true;
            
            // Preload
            var imagePromises = [];
            var images = 
               ['Material-AbstractAcrylic01var01-COLOR.jpg',
                'Material-AbstractAcrylic01var01-METALROUGH.jpg',
                'Material-AbstractAcrylic01var01-NORMAL.jpg',
                
                'Material-Aluminum001var01-COLOR.png',
                'Material-Aluminum001var01-METALROUGH.png',
                'Material-Aluminum001var01-NORMAL.png',
                
                'Material-BlueOcean01var02-COLOR.jpg',
                'Material-BlueOcean01var02-METALROUGH.jpg',
                'Material-BlueOcean01var02-NORMAL.jpg',
                
                'Material-Fabric001var02-COLOR.jpg',
                'Material-Fabric001var02-METALROUGH.jpg',
                'Material-Fabric001var02-NORMAL.jpg',
                
                'Material-Gold001var01-COLOR.png',
                'Material-Gold001var01-METALROUGH.png',
                'Material-Gold001var01-NORMAL.png',
                
                'Material-Leather002var02-COLOR.jpg',
                'Material-Leather002var02-METALROUGH.jpg',
                'Material-Leather002var02-NORMAL.jpg',
                
                'Material-Leather003var03-AO.jpg',
                'Material-Leather003var03-COLOR.jpg',
                'Material-Leather003var03-METALROUGH.jpg',
                'Material-Leather003var03-NORMAL.jpg',
                
                'Material-PaintSplatter01var01-COLOR.jpg',
                'Material-PaintSplatter01var01-METALROUGH.jpg',
                'Material-PaintSplatter01var01-NORMAL.jpg',
                
                'Material-Ruby01var02-AO.jpg',
                'Material-Ruby01var02-COLOR.jpg',
                'Material-Ruby01var02-METALROUGH.jpg',
                'Material-Ruby01var02-NORMAL.jpg',
                
                'stitching back COL.png',
                'stitching back NOR.png',
                'stitching front COL.png',
                'stitching front NOR.png'];
            for(var i = 0; i < images.length; ++i) {
                var img = $('<img/>');
                img[0].src = getMainDir()+mediadir+images[i];
                imagePromises[i] = $.Deferred();
                img[0].ind = i;
                img[0].onload = function (index) {
                    imagePromises[this.ind].resolve();
                }
            }
            $("#container3d").css("align-items", "flex-start");
            $("#container3d").append("<div id=\"Preloader\">Please wait, preloading materials...</div>");
            app.enableControls();
            function setCameraAngles(polar, azimuth, zoom) {
                var Azimuth_axis = new THREE.Vector3(0, 1, 0);
                var Polar_axis = new THREE.Vector3(1, 0, 0);
                
                var CameraPos = new THREE.Vector3(0, 0, 6-zoom);
                CameraPos.applyAxisAngle(Polar_axis, polar);
                CameraPos.applyAxisAngle(Azimuth_axis, azimuth);
                CameraPos.y += 1.5;

                app.camera.position.set(CameraPos.x, CameraPos.y, CameraPos.z);
                app.controls.update();
            }
            $(".changeCam").click(function(){
                var coords = {  polar:      app.controls.getPolarAngle()-Math.PI/2,
                                azimuth:    app.controls.getAzimuthalAngle(),
                                zoom:       6-app.camera.position.distanceTo(new THREE.Vector3(0,1.50,0))};
                var end = {     polar:      parseFloat($(this).data("camera-polar"))*Math.PI/180,
                                azimuth:    parseFloat($(this).data("camera-azimuth"))*Math.PI/180,
                                zoom:       parseFloat($(this).data("camera-zoom"))};
                var dist = Math.sqrt(Math.pow(coords.polar-end.polar, 2)+Math.pow(coords.azimuth-end.azimuth, 2)+Math.pow(coords.zoom-end.zoom, 2));
                var tween = new TWEEN.Tween(coords).to(end, dist*250).easing(TWEEN.Easing.Quadratic.InOut)
                        .onUpdate(function() {
                            setCameraAngles(coords.polar, coords.azimuth, coords.zoom);
                        }).start();
            });
            function animate(time) {
                requestAnimationFrame( function(time){animate(time);} );
                TWEEN.update(time);
            }
            animate();
            $.when.apply($, imagePromises).done(function(){
                startUI();
                runCode();
                $("#Preloader").remove();

                var search = window.location.search.substr(1);
                if(search.length > 0) {
                    var searchVariations = JSON.parse(decodeURIComponent(search));
                    for(var serachKey in searchVariations) {
                        if (searchVariations.hasOwnProperty(serachKey)) {
                            $('.changeMat[data-material-name="'+serachKey+'"][data-material-file="'+searchVariations[serachKey]+'"]').trigger('click');
                        }
                    }
                }
                window.pauseRender = false;
            });
        });
          
        function runCode() {
            $(".changeMat").click(function(){
                var dataMatName = $(this).data("material-name");
                var dataMatSettings = $(this).data("material-settings");
                if(dataMatSettings === undefined || dataMatSettings == "") {
                    dataMatSettings = {};
                }
                var dataMatFile = $(this).data("material-file");

                if(window.v3dConfigurator === undefined) {
                    window.v3dConfigurator = {};
                }
                if(window.v3dConfigurator.currentVariant === undefined) {
                    window.v3dConfigurator.currentVariant = {};
                }
                window.v3dConfigurator.currentVariant[dataMatName] = dataMatFile;
                
                var material = app.materials.find(function(e){return e.name==dataMatName;})
                if(typeof material === 'undefined') {
                    return;
                }
                
                var dMatFile = $.Deferred();
                var matfile;
                if(typeof dataMatFile === 'undefined') {
                    dMatFile.resolve()
                } else {
                    $.getJSON(getMainDir()+mediadir+dataMatFile, function(data) {
                        matfile = data;
                        dMatFile.resolve();
                    });
                }
                $.when(dMatFile).done(function() {
                    if(typeof matfile !== 'undefined') {
                        var allSettings = ["map", "color", "normalMap", "metalRoughnessMap", "metalness", "roughness", "normalScale", "aoMap", "aoMapIntensity", "emissive", "emissiveMap", "emissiveIntensity"];
                        for(var i = 0; i < allSettings.length; i++) {
                            if(typeof dataMatSettings[allSettings[i]] === 'undefined' && typeof matfile[allSettings[i]] !== 'undefined') {
                                dataMatSettings[allSettings[i]] = matfile[allSettings[i]];
                            }
                        }
                    }
                    
                    var dMap = $.Deferred();
                    var map;
                    if(typeof dataMatSettings.map === 'undefined' || dataMatSettings.map == null) {
                        map = null;
                        dMap.resolve();
                    } else {
                        map = new THREE.TextureLoader().load(getMainDir()+mediadir+dataMatSettings.map, function(){
                            dMap.resolve();
                        });
                    }
                    
                    var dNormalMap = $.Deferred();
                    var normalMap;
                    if(typeof dataMatSettings.normalMap === 'undefined' || dataMatSettings.normalMap == null) {
                        normalMap = null;
                        dNormalMap.resolve();
                    } else {
                        normalMap = new THREE.TextureLoader().load(getMainDir()+mediadir+dataMatSettings.normalMap, function(){
                            dNormalMap.resolve();
                        });
                    }
                    
                    var dMetalRoughnessMap = $.Deferred();
                    var metalRoughnessMap;
                    if(typeof dataMatSettings.metalRoughnessMap === 'undefined' || dataMatSettings.metalRoughnessMap == null) {
                        metalRoughnessMap = null;
                        dMetalRoughnessMap.resolve();
                    } else {
                        metalRoughnessMap = new THREE.TextureLoader().load(getMainDir()+mediadir+dataMatSettings.metalRoughnessMap, function(){
                            dMetalRoughnessMap.resolve();
                        });
                    }
                    
                    var dAOMap = $.Deferred();
                    var aoMap;
                    if(typeof dataMatSettings.aoMap === 'undefined' || dataMatSettings.aoMap == null) {
                        aoMap = null;
                        dAOMap.resolve();
                    } else {
                        aoMap = new THREE.TextureLoader().load(getMainDir()+mediadir+dataMatSettings.aoMap, function(){
                            dAOMap.resolve();
                        });
                    }
                    
                    var dEmissiveMap = $.Deferred();
                    var emissiveMap;
                    if(typeof dataMatSettings.emissiveMap === 'undefined' || dataMatSettings.emissiveMap == null) {
                        emissiveMap = null;
                        dEmissiveMap.resolve();
                    } else {
                        emissiveMap = new THREE.TextureLoader().load(getMainDir()+mediadir+dataMatSettings.emissiveMap, function(){
                            dEmissiveMap.resolve();
                        });
                    }
                    
                    $.when(dMap, dNormalMap, dMetalRoughnessMap, dAOMap, dEmissiveMap).done(function() {
                        if(typeof map !== 'undefined') {
                            material.map = map;
                        }
                        if(typeof normalMap !== 'undefined') {
                            material.normalMap = normalMap;
                        }
                        if(typeof metalRoughnessMap !== 'undefined') {
                            material.roughnessMap = metalRoughnessMap;
                            material.metalnessMap = metalRoughnessMap;
                        }
                        if(typeof aoMap !== 'undefined') {
                            material.aoMap = aoMap;
                        }
                        if(typeof emissiveMap !== 'undefined') {
                            material.emissiveMap = emissiveMap;
                        }
                        if(typeof dataMatSettings.color !== 'undefined') {
                            material.color = dataMatSettings.color;
                        }
                        if(typeof dataMatSettings.metalness !== 'undefined') {
                            material.metalness = dataMatSettings.metalness;
                        }
                        if(typeof dataMatSettings.roughness !== 'undefined') {
                            material.roughness = dataMatSettings.roughness;
                        }
                        if(typeof dataMatSettings.normalScale !== 'undefined') {
                            material.normalScale.x = dataMatSettings.normalScale;
                            material.normalScale.y = dataMatSettings.normalScale;
                        }
                        if(typeof dataMatSettings.aoMapIntensity !== 'undefined') {
                            material.aoMapIntensity = dataMatSettings.aoMapIntensity;
                        }
                        if(typeof dataMatSettings.emissive !== 'undefined') {
                            material.emissive = dataMatSettings.emissive;
                        }
                        if(typeof dataMatSettings.emissiveIntensity !== 'undefined') {
                            material.emissiveIntensity = dataMatSettings.emissiveIntensity;
                        }
                    });
                });
            });
            $("#startover").click(function(){
                $('.changeMat[data-material-name="Front"][data-material-file="Material-Leather002var02.json"]').trigger('click');
                $('.changeMat[data-material-name="Back"][data-material-file="Material-Leather003var03.json"]').trigger('click');
                $('.changeMat[data-material-name="Hand Straps"][data-material-file="Material-Leather003var03.json"]').trigger('click');
                $('.changeMat[data-material-name="Buckles and Rivets"][data-material-file="Material-Gold001var01.json"]').trigger('click');
            });
            $("#share").click(function(){
                var variantString = "";
                var baseURL = window.location.href.split('?')[0];
                if(window.v3dConfigurator !== undefined && window.v3dConfigurator.currentVariant !== undefined) {
                    variantString = JSON.stringify(window.v3dConfigurator.currentVariant);
                }
                //$('#Field5').val('http://localhost/parkfield-event/index.html?'+encodeURIComponent('[{"name":"Front","file":"Material-Leather002var02.json"},{"name":"Back","file":"Material-AbstractAcrylic01var01.json"}]'));
                $('#Field5').val(baseURL+encodeURIComponent(variantString));
                $('#shareform').css('display', 'block');
                $('#bg-overlay').css('display', 'block');
            });
        }
        runCode();
    }
});
