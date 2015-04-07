"use strict";!function(){var a=L.Marker.prototype.onAdd;L.Marker.mergeOptions({bounceOnAdd:!1,bounceOnAddDuration:1e3,bounceOnAddHeight:-1}),L.Marker.include({_toPoint:function(a){return this._map.latLngToContainerPoint(a)},_toLatLng:function(a){return this._map.containerPointToLatLng(a)},_animate:function(a){var b=new Date,c=setInterval(function(){var d=new Date-b,e=d/a.duration;e>1&&(e=1);var f=a.delta(e);a.step(f),1===e&&(a.end(),clearInterval(c))},a.delay||10)},_move:function(a,b){var c=L.latLng(this._orig_latlng),d=this._drop_point.y,e=this._drop_point.x,f=this._point.y-d,g=this;this._animate({delay:10,duration:b||1e3,delta:a,step:function(a){g._drop_point.y=d+f*a-(g._map.project(g._map.getCenter()).y-g._orig_map_center.y),g._drop_point.x=e-(g._map.project(g._map.getCenter()).x-g._orig_map_center.x),g.setLatLng(g._toLatLng(g._drop_point))},end:function(){g.setLatLng(c)}})},_easeOutBounce:function(a){return 1/2.75>a?7.5625*a*a:2/2.75>a?7.5625*(a-=1.5/2.75)*a+.75:2.5/2.75>a?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},bounce:function(a,b){this._orig_map_center=this._map.project(this._map.getCenter()),this._drop_point=this._getDropPoint(b),this._move(this._easeOutBounce,a)},_getDropPoint:function(a){this._point=this._toPoint(this._orig_latlng);var b;return b=void 0===a||0>a?this._toPoint(this._map.getBounds()._northEast).y:this._point.y-a,new L.Point(this._point.x,b)},onAdd:function(b){this._map=b,this._orig_latlng=this._latlng,this.options.bounceOnAdd===!0&&(this._drop_point=this._getDropPoint(this.options.bounceOnAddHeight),this.setLatLng(this._toLatLng(this._drop_point))),a.call(this,b),this.options.bounceOnAdd===!0&&this.bounce(this.options.bounceOnAddDuration,this.options.bounceOnAddHeight)}})}();var _CONFIG={};_CONFIG.serverUrl="http://api.panatrans.org",_CONFIG.tilelayerUrl="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",_CONFIG.tilelayerAttribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',_CONFIG.delay="",angular.module("panatransWebApp",["ngAnimate","ngCookies","ngMessages","ngResource","ngRoute","ngTouch","ui.bootstrap","ui.sortable","angular-toArrayFilter","ngToast"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/rutas",{templateUrl:"views/routes.html",controller:"RoutesCtrl"}).when("/colabora",{templateUrl:"views/contribute.html",controller:"ContributeCtrl"}).when("/acercade",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/licencias",{templateUrl:"views/licenses.html",controller:"LicensesCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("panatransWebApp").config(["ngToastProvider",function(a){a.configure({verticalPosition:"top",horizontalPosition:"center",maxNumber:3})}]),angular.module("panatransWebApp").controller("MainCtrl",["$scope","$compile","$http","$modal","ngToast",function(a,b,c,d,e){if(!a.map){a.routes={},a.stops={},a.stopsArr={},a.showStopDetail=!1,a.loadingStopDetail=!1,a.stopDetail={};var f=null,g=null,h={},i=null,j=null,k={},l={"default":L.AwesomeMarkers.icon({icon:"bus",prefix:"fa",markerColor:"blue"}),orange:L.AwesomeMarkers.icon({icon:"bus",prefix:"fa",markerColor:"orange"}),orangeSpin:L.AwesomeMarkers.icon({icon:"bus",prefix:"fa",markerColor:"orange",spin:!0}),pink:L.AwesomeMarkers.icon({icon:"bus",prefix:"fa",markerColor:"pink"}),red:L.AwesomeMarkers.icon({icon:"bus",prefix:"fa",markerColor:"red"}),redSpin:L.AwesomeMarkers.icon({icon:"bus",prefix:"fa",markerColor:"red",spin:!0}),userLocation:L.AwesomeMarkers.icon({icon:"user",prefix:"fa",markerColor:"green",spin:!1})};a.map=L.map("map",{center:[8.9740946,-79.5508536],zoom:13,zoomControl:!1}),L.tileLayer(_CONFIG.tilelayerUrl,{attribution:_CONFIG.tilelayerAttribution,maxZoom:18}).addTo(a.map),c.get(_CONFIG.serverUrl+"/v1/routes?with_trips=true"+_CONFIG.delay).success(function(b){a.routesArray=b.data,$.each(b.data,function(b,c){a.routes[c.id]=c})}),c.get(_CONFIG.serverUrl+"/v1/stops/?"+_CONFIG.delay).success(function(b){console.log("Success getting stops!!!"),a.stopsArr=b.data,$.each(b.data,function(b,c){a.stops[c.id]=c;var d=L.marker([c.lat,c.lon],{icon:l["default"],draggable:!1,title:c.name});d.addTo(a.map).bindPopup(c.name),d.on("popupopen",o),d.on("popupclose",q),d._stopId=c.id,k[c.id]=d})});var m=function(b){if(null!==b.accuracy){var c=b.accuracy/2;null===f&&(f=L.marker(b.latlng,{icon:l.userLocation}),f.addTo(a.map),a.map.panTo(b.latlng),g=L.circle(b.latlng,c),g.addTo(a.map)),f.setLatLng(b.latlng),f.bindPopup("Estás cerca de este punto en un radio de unos "+c+" metros."),g.setLatLng(b.latlng),g.setRadius(c),a.trackingUser&&a.map.panTo(b.latlng)}},n=function(a){console.log(a.message)};a.map.on("locationfound",m),a.map.on("locationerror",n),a.map.locate({watch:!0,setView:!1,maxZoom:15,enableHighAccuracy:!0});var o=function(a){console.log("stopMarkerPopupOpen"),console.log(j),null===j&&p(a)},p=function(b){console.log("popupOpen - stopMarkerClicked"),a.showStopDetail=!0,console.log(b);var d=b.popup._source._stopId;return null===d?void console.log("stopMarkerClicked: Hey! Hey! stopId es null :-?"):(console.log("stopId Clicked: "+d),void(a.stops[d].routes?a.$apply(function(){a.stopDetail=a.stops[d],s(d)}):(k[d].setIcon(l.orangeSpin),a.loadingStopDetail=!0,c.get(_CONFIG.serverUrl+"/v1/stops/"+d+"?with_stop_sequences=true"+_CONFIG.delay).success(function(b){a.loadingStopDetail=!1,console.log("Success getting stop info"),console.log(b.data),a.stopDetail=b.data,a.stops[a.stopDetail.id]=b.data,s(d)}))))},q=function(){console.log("stopMarkerClosed"),null===j&&$.each(k,function(a,b){b.setIcon(l["default"])})};a.closeStopDetail=function(){a.showStopDetail=!1},a.isFirstStopInTrip=function(a,b){var c=!1;return $.each(b.stop_sequences,function(b,d){0===d.sequence&&d.stop_id===a.id&&(c=!0)}),c},a.isLastStopInTrip=function(a,b){var c=-1,d=-1;return $.each(b.stop_sequences,function(a,b){b.sequence>c&&(c=b.sequence,d=b.stop_id)}),d===a.id?!0:!1},a.highlightStop=function(a){console.log("highlight stop"+a.name),j=a,k[a.id].openPopup()},a.lowlightStop=function(b){console.log("loglight stop"+b.name),k[a.stopDetail.id].openPopup(),j=null};var r=function(a,b){$.each(a.trips,function(a,c){$.each(c.stop_sequences,function(a,c){k[c.stop_id].setIcon(b)})})},s=function(b){$.each(a.stopDetail.routes,function(a,b){r(b,l.orange)}),k[b].setIcon(l.red)};a.highlightRoute=function(a){console.log("highlight route "+a.name),r(a,l.red)},a.lowlightRoute=function(b){r(b,l.orange),k[a.stopDetail.id].setIcon(l.red)},a.hoverIn=function(){this.hoverEdit=!0},a.hoverOut=function(){this.hoverEdit=!1},a.toggleTripDetails=function(){console.log("toggle"),this.showTripDetails=this.showTripDetails===!1||void 0===this.showTripDetails?!0:!1,console.log("showTripDetails: "+this.showTripDetails)},a.openEditStopModal=function(b){var c=d.open({templateUrl:"views/modals/edit-stop.html",size:"lg",controller:"EditStopModalInstanceCtrl",backdrop:!0,stopId:b,resolve:{routes:function(){return a.routesArray},stop:function(){return a.stopDetail}}});c.result.then(function(){},function(c){console.log("modal instance dismissed reason : "+c),"changeStopLocation"===c&&(console.log("changeStopLocation: "+b),t(k[b])),"stopDeleted"===c&&(console.log("deletedStop, eliminating marker and stop"),a.map.removeLayer(k[b]),e.create("Se ha borrado la parada "+a.stops[b].name),delete k[b],delete a.stops[b])})};var t=function(c){console.log("setStopMarkerEditMode"),c.setIcon(l.redSpin),c.dragging.disable(),c.dragging.enable(),c.off("popupopen",o),c.off("popupclose",q),a.map.setView(c.getLatLng(),15);var d=a.stops[c._stopId],e="<div><h4>"+d.name+'</h4><p><strong>Arrástrame</strong> hasta mi localización.<br>Después dale a: </p><button ng-click="saveStopLocation(stop)"class="btn btn-primary">Actualizar</button> o a <a href="" ng-click="cancelStopMarkerEditMode(stopMarker)">cancelar</a></div>',f=b(angular.element(e)),g=a.$new();g.stop=d,g.stopMarker=c;var h=f(g);console.log(h),c.bindPopup(h[0]).openPopup(),c.on("dragend",function(b){console.log("dragend called!!");var c=b.target;c.openPopup();var e=c.getLatLng();d.lat=e.lat,d.lon=e.lng,console.log(a.newStop)})};a.cancelStopMarkerEditMode=function(b){console.log("cancelStopMarkerEditMode"),b.closePopup(),b.dragging.disable(),b.setIcon(l.red),console.log("setting popup content = "+a.stops[b._stopId].name),b.bindPopup(a.stops[b._stopId].name),b.on("popupopen",o),b.on("popupclose",q),b.openPopup()},a.saveStopLocation=function(b){console.log("saveStopLocation called"),c.put(_CONFIG.serverUrl+"/v1/stops/"+b.id,{stop:{lat:b.lat,lon:b.lon}}).success(function(){console.log("new stop location successfully saved"),a.cancelStopMarkerEditMode(k[b.id])}).error(function(a){console.log("error updating stop Location"),console.log(a)})},a.openEditRouteModal=function(b){var c={templateUrl:"views/modals/edit-route.html",size:"lg",controller:"EditRouteModalInstanceCtrl",backdrop:!0,routeId:b,resolve:{route:function(){return a.routes[b]},stopsArr:function(){return a.stopsArr}}};d.open(c)},a.openNewRouteModal=function(){var a={templateUrl:"views/modals/new-route.html",controller:"NewRouteModalInstanceCtrl",backdrop:"static",resolve:{}};d.open(a)},a.saveNewStop=function(){console.log("saveSaveNewStop"),console.log(h),c.post(_CONFIG.serverUrl+"/v1/stops/",{stop:h}).success(function(b){console.log("stop saved successfully"),console.log(b.data),a.stops[b.data.id]=b.data,a.stopDetail=b.data,i._stopId=b.data.id,i.closePopup(),i.setIcon(l["default"]),i.bindPopup(b.data.name),i.on("popupopen",o),i.on("popupclose",q),k[b.data.id]=i,i.openPopup(),h={},i=null,e.create("Excelente, ¡parada añadida!"),console.log("Se ha añadido la parada con éxito")}).error(function(a){console.log(a)})},a.cancelSaveNewStop=function(){console.log("cancelSaveStop")},a.openNewStopModal=function(){var c={templateUrl:"views/modals/new-stop.html",controller:"NewStopModalInstanceCtrl",backdrop:"static",resolve:{}},e=d.open(c);e.result.then(function(c){h=c;var d=a.map.getCenter();h.lat=d.lat,h.lon=d.lng,i=L.marker(d,{icon:l.redSpin,draggable:!0,bounceOnAdd:!0,bounceOnAddOptions:{duration:500,height:100},bounceOnAddCallback:function(){console.log("bouncing done")}}).addTo(a.map);var e="<div><h4>"+h.name+'</h4><p><strong>Arrástrame</strong> hasta mi localización.<br>Después dale a: </p><button ng-click="saveNewStop()"class="btn btn-primary">Guardar</button> o <a ng-click="cancelSaveNewStop()">cancelar</a></div>',f=b(angular.element(e)),g=a.$new(),j=f(g);console.log(j),i.bindPopup(j[0]).openPopup(),i.on("dragend",function(b){console.log("dragend called!!");var c=b.target;c.openPopup();var d=c.getLatLng();h.lat=d.lat,h.lon=d.lng,console.log(a.newStop)})},function(){})}}}]),angular.module("panatransWebApp").controller("AboutCtrl",["$scope",function(a){a.title="Acerca de",window.scrollTo(0,0)}]),angular.module("panatransWebApp").controller("LicensesCtrl",["$scope",function(a){a.title="Licenses",window.scrollTo(0,0)}]),angular.module("panatransWebApp").controller("RoutesCtrl",["$scope","$http","$modal","ngToast",function(a,b,c,d){a.routes={},a.stopsArr=[],a.stops={},a.loading=!0,console.log("requesting routes..."),b.get(_CONFIG.serverUrl+"/v1/routes/?with_trips=true").success(function(b){a.loading=!1,a.routesArray=b.data,$.each(b.data,function(b,c){a.routes[c.id]=c})}).error(function(a,b){console.log("error obteniendo rutas"),0===b&&d.create({className:"danger",contents:"¡Ups! El servidor parece caído. Prueba en un rato Si sigue así contáctanos en @panatrans"}),422!==b&&(d.create({className:"danger",contents:"Error accediendo al servidor. Prueba en un rato. Si el problema persiste contacta por twitter: @panatrans"}),console.log(a))}),b.get(_CONFIG.serverUrl+"/v1/stops/?"+_CONFIG.delay).success(function(b){console.log("Success getting stops!!!"),a.stopsArr=b.data,$.each(b.data,function(b,c){a.stops[c.id]=c})}),a.ignoreAccentsComparator=function(a,b){var c=function(a){return a.replace(/á/g,"a").replace(/é/g,"e").replace(/í/g,"i").replace(/ó/g,"o").replace(/ú/g,"u").replace(/\-/g,"").replace(/\s/g,"")};return"string"!=typeof a?!1:b?(a=c(a.toLowerCase()),b=c(b.toLowerCase()),a.indexOf(b)>-1):!0},a.openEditRouteModal=function(b){var d={templateUrl:"views/modals/edit-route.html",size:"lg",controller:"EditRouteModalInstanceCtrl",backdrop:!0,routeId:b,resolve:{route:function(){return a.routes[b]||null},stopsArr:function(){return a.stopsArr}}},e=c.open(d);e.result.then(function(){},function(c){console.log("modal instance dismissed reason : "+c),"routeDeleted"===c&&(console.log("routeDeleted: "+b),delete a.routes[b])})}}]),angular.module("panatransWebApp").controller("ContributeCtrl",["$scope",function(a){a.title="Colabora",window.scrollTo(0,0)}]),angular.module("panatransWebApp").controller("EditRouteModalInstanceCtrl",["$scope","$http","ngToast","$modalInstance","route","stopsArr",function(a,b,c,d,e,f){a.sortedStopSequences={},a.unknownStopSequences={},a.isNewRoute=!1,a.loading=!0,a.route=e;var g=angular.copy(e);a.stopsArr=f,a.showNewStopSequence={},console.log(f),a.newStopSequence={},a.dragControlListeners={};var h=function(){b.get(_CONFIG.serverUrl+"/v1/routes/"+a.route.id+"?"+_CONFIG.delay).success(function(b){a.route=b.data,g=angular.copy(b.data),a.loading=!1,$.each(a.route.trips,function(b,c){a.sortedStopSequences[c.id]=[],a.unknownStopSequences[c.id]=[],$.each(c.stop_sequences,function(b,d){null!==d.sequence?a.sortedStopSequences[c.id].push(d):a.unknownStopSequences[c.id].push(d)})})}).error(function(a){console.log("WTF! Something wrong with the route!"),console.log(a)})};null==e&&(e={trips:[]},a.route=e,a.isNewRoute=!0,a.loading=!1),$.each(e.trips,function(c,d){a.newStopSequence[d.id]={stop:null,trip:d,sequence:null},a.dragControlListeners[d.id]={},$.each(["sorted","unknown"],function(c,e){console.log(e+" -------"+d.id),a.dragControlListeners[d.id][e]={accept:function(){return!0},itemMoved:function(a){console.log("source sort"+e),console.log("source trip.id"+d.id),console.log("itemMoved"),console.log(a),console.log("nueva posición: "+a.dest.index),console.log("dest trip:"+a.dest.sortableScope.$parent.trip.id),console.log("src seq:"+a.source.itemScope.modelValue.sequence),console.log("dest sortStatus"+a.dest.sortableScope.options.containment.indexOf("unknown"));var c,f=a.dest.sortableScope.$parent.trip,g=a.source.itemScope.modelValue;f.id===d.id?null===g.sequence?(g.sequence=a.dest.index,c={stop_sequence:{sequence:a.dest.index}}):(g.sequence=null,c={stop_sequence:{unknown_sequence:!0}}):0===a.dest.sortableScope.options.containment.indexOf("unknown")?(g.sequence=null,c={stop_sequence:{unknown_sequence:!0,trip_id:f.id}}):(g.trip=f,g.sequence=a.dest.index,c={stop_sequence:{sequence:a.dest.index,trip_id:f.id}}),console.log("putData"),console.log(g),b.put(_CONFIG.serverUrl+"/v1/stop_sequences/"+g.id,c).success(function(){h()})},orderChanged:function(a){if(console.log("orderChanged "),console.log("nueva posición: "+a.dest.index),console.log(a),0!==a.dest.sortableScope.options.containment.indexOf("unknown")){var c=a.dest.index,d=a.source.itemScope.modelValue;console.log("nueva posición: "+a.dest.index);var e={stop_sequence:{sequence:c}};b.put(_CONFIG.serverUrl+"/v1/stop_sequences/"+d.id,e).success(function(){console.log("updated stop sequence!"),h()})}},containment:e+"_"+d.id}})}),console.log(a.dragControlListeners),e.trips.length>0&&e.trips[0].stops?a.loading=!1:a.isNewRoute||h(),a.addNewRoute=function(){console.log("add new Route"),b.post(_CONFIG.serverUrl+"/v1/routes/",{route:{name:a.route.name}}).success(function(b){c.create("Ruta creada. Ahora sigue completando la información"),console.log("route successfully created"),a.route=b.data,a.serverRoute=angular.copy(e),a.isNewRoute=!1}).error(function(a,b){var d=a.errors.name.join(", ")||"";c.create({className:"danger",contents:"Error: "+d}),console.log(a),console.log(b),console.log("Error creating route")})},a.deleteRoute=function(){console.log("delete route"),b["delete"](_CONFIG.serverUrl+"/v1/routes/"+a.route.id).success(function(){c.create("Ruta eliminada"),d.dismiss("routeDeleted")}).error(function(a,b){var d=a.errors.name.join(", ")||"";c.create({className:"danger",contents:"Error: "+d}),console.log(a),console.log(b),console.log("Error deleting route")})},a.updateRouteName=function(){a.isNewRoute||(console.log("updateRouteName"),a.route.name!==g.name&&b.put(_CONFIG.serverUrl+"/v1/routes/"+a.route.id,{route:{name:a.route.name}}).success(function(){c.create("Se ha actualizado el nombre de la ruta"),console.log("route name successfully updated")}).error(function(a,b){var d=a.errors.name.join(", ")||"";c.create({className:"danger",contents:"Error: "+d}),console.log(a),console.log(b),console.log("Error updating route name")}))},a.updateRouteUrl=function(){console.log("updateRouteUrl"),a.route.url!==g.url&&b.put(_CONFIG.serverUrl+"/v1/routes/"+a.route.id,{route:{url:a.route.url}}).success(function(){c.create("Se ha actualizado la dirección web"),console.log("route name successfully updated")}).error(function(){c.create({className:"danger",contents:"Error: "+errors}),console.log(data),console.log(status),console.log("error updating route")})},a.deleteStopSequence=function(a){b["delete"](_CONFIG.serverUrl+"/v1/stop_sequences/"+a.id).success(function(){c.create("Se eliminado la parada del trayecto"),console.log("removed stop sequence success!"),h()})};var i=function(a,b){exceptions=/transfer|tranfer|corredor|circular/i;var c=b.split("-"),d=!1,e=!1;switch(angular.forEach(c,function(a,b){tripName=c[b].trim(),tripName.match(exceptions)||(d?e=tripName:d=tripName)}),a){case"one":return[e];case"circular":return["circular"];case"two":return[e,d];default:return void 0}};a.routeHasTrips=function(){return void 0!==a.route.trips&&0!==a.route.trips.length},a.addTripsToRoute=function(){console.log("addTripsToRoute. tripsType:"+a.route.tripsType),console.log(i(a.route.tripsType,a.route.name));var d=i(a.route.tripsType,a.route.name);if(void 0===d)return void c({className:"danger",contents:"Error. Revisa que el nombre de la ruta tenga el formato adecuado."});var e=0;angular.forEach(d,function(f,g){console.log(f),console.log(g);var i={headsign:f,direction:g,route_id:a.route.id};b.post(_CONFIG.serverUrl+"/v1/trips/",{trip:i}).success(function(a){console.log("added trips to route"),c.create("Se ha añadido el trayecto "+a.data.headsign),++e===d.length&&h()}).error(function(a,b){console.log("error updating trip"),console.log(a.errors),console.log(b),422!=b&&c("Humm! Error raro. Si el error persiste, probablemente tengas que contactar con los administradores");var e="";c.create("Hubo problema a al añadir el trayecto: "+e),++response===d.length&&h()})})},a.deleteTrips=function(){console.log("deleteTrips. number to delete = "+a.route.trips.length);var d=0;angular.forEach(a.route.trips,function(e){b["delete"](_CONFIG.serverUrl+"/v1/trips/"+e.id).success(function(){++d===a.route.trips.length&&h()}).error(function(b,d){console.log("error updating trip"),console.log(b.errors),console.log(d),422!=d&&c("Humm! Error raro. Si el error persiste, probablemente tengas que contactar con los administradores");var e="";c.create("Hubo problema al borrar los trayectos: "+e),++response===a.route.trips.length&&h()})})},a.tripsHaveStops=function(){return haveStops=!1,angular.forEach(a.route.trips,function(a){void 0!==a.stop_sequences&&a.stop_sequences.length>0&&(haveStops=!0)}),haveStops},a.addStopToTrip=function(d){var e=!1;console.log("stopSequence:"+a.newStopSequence[d].sequence),-1===a.newStopSequence[d].sequence&&(e=!0);var f={stop_sequence:{sequence:a.newStopSequence[d].sequence,unknown_sequence:e,stop_id:a.newStopSequence[d].stop.id,trip_id:d}};console.log("addStopToTrip postData:"),console.log(f),b.post(_CONFIG.serverUrl+"/v1/stop_sequences/",f).success(function(){h(),c.create("Se ha añadido la parada al trayecto."),a.showNewStopSequence[d]=!0,a.newStopSequence[d].stop=null})},a.close=function(){d.close()}}]),angular.module("panatransWebApp").controller("EditStopModalInstanceCtrl",["$scope","$http","$modalInstance","ngToast","routes","stop",function(a,b,c,d,e,f){a.stop=f,a.routes=e,console.log(e),a.tripNotAlready=function(b){var c=!0;return $.each(a.stop.routes,function(a,d){$.each(d.trips,function(a,d){d.id===b.id&&(c=!1)})}),c},a.searchFilter=function(b){var c=new RegExp(a.searchText,"i");return!a.searchText||c.test(b.name)},a.addTrip=function(c){console.log("addTrip: "+c),b.post(_CONFIG.serverUrl+"/v1/stop_sequences/",{stop_sequence:{unknown_sequence:!0,stop_id:a.stop.id,trip_id:c}}).success(function(b){console.log("added trip to stop"),console.log(b);var c=b.data.trip,d=!1;if($.each(a.stop.routes,function(b,e){e.id===c.route.id&&(d=!0,a.stop.routes[b].trips.push(c))}),!d){var e=c.route;e.trips=[c],a.stop.routes.push(e)}}).error(function(a){console.log("error adding trip to stop"),console.log(a)})},a.updateStopName=function(){console.log("updateStop"),console.log(a.stop),b.put(_CONFIG.serverUrl+"/v1/stops/"+a.stop.id,{stop:{name:a.stop.name}}).success(function(){console.log("Stop successfully updated"),d.create("Nombre de la parada actualizado con éxito.")}).error(function(a){console.log("error adding trip to stop"),console.log(a)})},a.deleteStop=function(){return a.stop.routes.length>0?(console.log("ERROR: the stop has trips cannot be deleted"),void alert("No se puede borrar. Tienes que quitar todas las rutas que pasan por la parada antes de eliminarla.")):void b["delete"](_CONFIG.serverUrl+"/v1/stops/"+a.stop.id).success(function(){d.create("Parada eliminada."),console.log("parada borrada del servidor con éxito"),c.dismiss("stopDeleted")}).error(function(a){console.log("Error borrando la parada"),console.log(a)})},a.changeStopLocation=function(){console.log("changeStopLocation Requested"),c.dismiss("changeStopLocation")},a.deleteTrip=function(c){b["delete"](_CONFIG.serverUrl+"/v1/stop_sequences/trip/"+c+"/stop/"+a.stop.id).success(function(b){console.log(b),console.log("awesome! Trip and stop unlinked"),$.each(a.stop.routes,function(b,d){$.each(d.trips,function(d,e){e.id===c&&(a.stop.routes[b].trips.splice(d,1),0===a.stop.routes[b].trips.length&&a.stop.routes.splice(b,1))})}),d.create("Se ha eliminado la parada del trayecto.")}).error(function(a){console.log("error removing trip from stop"),console.log(a)})},a.close=function(){c.close()}}]),angular.module("panatransWebApp").controller("NewRouteModalInstanceCtrl",["$scope","$modalInstance",function(a,b){a.ok=function(){b.close(a.selected.item)},a.cancel=function(){b.dismiss("cancel")}}]),angular.module("panatransWebApp").controller("NewStopModalInstanceCtrl",["$scope","$modalInstance",function(a,b){a.stop={},a.ok=function(){b.close(a.stop)},a.cancel=function(){b.dismiss("cancel")}}]);
