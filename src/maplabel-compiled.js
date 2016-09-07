(function(){/*


 Copyright 2011 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
var g="prototype";function MapLabel(a){this.set("fontFamily","sans-serif");this.set("fontSize",12);this.set("fontColor","#000000");this.set("strokeWeight",4);this.set("strokeColor","#ffffff");this.set("align","center");this.set("label-pos","bottom");this.set("zIndex",1E3);this.setValues(a)}MapLabel[g]=new google.maps.OverlayView;window.MapLabel=MapLabel;
MapLabel[g].changed=function(a){switch(a){case "fontFamily":case "fontSize":case "fontColor":case "strokeWeight":case "strokeColor":case "align":case "label-pos":case "text":case "marker":return this.drawCanvas_();case "maxZoom":case "minZoom":case "position":return this.draw()}};
MapLabel[g].drawCanvas_=function(){var a=this.canvas_;if(a){var c=a.style;c.zIndex=this.get("zIndex");var b=a.getContext("2d");b.clearRect(0,0,a.width,a.height);b.strokeStyle=this.get("strokeColor");b.fillStyle=this.get("fontColor");a=Number(this.get("fontSize"));b.font=a+"px "+this.get("fontFamily");var d=Number(this.get("strokeWeight"));if(a=this.get("text")){d&&(b.lineWidth=d,b.strokeText(a,d,d));b.fillText(a,d,d);var e=this.get("marker").getIcon(),e=e?e.size():{height:40,width:22},b=b.measureText(a).width+
d;c.marginLeft=this.getMarginLeft_(b,e.width)+"px";b=this.getTextHeight_(a);switch(this.get("label-pos")){case "top":c.marginTop=-b-1.1*e.height+"px";break;case "bottom":c.marginTop="-0.4em";break;case "left":case "right":c.marginTop=-(b/2)-e.height/2+"px"}}}};
MapLabel[g].getTextHeight_=function(a){var c=document.getElementsByTagName("body")[0],b=document.createElement("div");a=document.createTextNode(a);b.appendChild(a);b.style.fontFamily=this.get("fontFamily");b.style.fontSize=this.get("fontSize")+"px";b.style.left="-99999px";b.style.top="-99999px";c.appendChild(b);a=b.offsetHeight;c.removeChild(b);return a};
MapLabel[g].onAdd=function(){var a=this.canvas_=document.createElement("canvas");a.style.position="absolute";var c=a.getContext("2d");c.lineJoin="round";c.textBaseline="top";this.drawCanvas_();(c=this.getPanes())&&c.mapPane.appendChild(a)};MapLabel[g].onAdd=MapLabel[g].onAdd;
MapLabel[g].getMarginLeft_=function(a,c){switch(this.get("label-pos")){case "top":case "bottom":switch(this.get("align")){case "left":return 0;case "right":return-a}return a/-2;case "left":return-a-c;case "right":return c}};MapLabel[g].draw=function(){var a=this.getProjection();if(a&&this.canvas_){var c=this.get("position");c&&(a=a.fromLatLngToDivPixel(c),c=this.canvas_.style,c.top=a.y+"px",c.left=a.x+"px",c.visibility=this.getVisible_())}};MapLabel[g].draw=MapLabel[g].draw;
MapLabel[g].getVisible_=function(){var a=this.get("minZoom"),c=this.get("maxZoom");if(void 0===a&&void 0===c)return"";var b=this.getMap();if(!b)return"";b=b.getZoom();return b<a||b>c?"hidden":""};MapLabel[g].onRemove=function(){var a=this.canvas_;a&&a.parentNode&&a.parentNode.removeChild(a)};MapLabel[g].onRemove=MapLabel[g].onRemove;})()
