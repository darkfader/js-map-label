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
var l="prototype";function MapLabel(a){this.set("fontFamily","sans-serif"),this.set("fontSize",12),this.set("fontColor","#000000"),this.set("strokeWeight",4),this.set("strokeColor","#ffffff"),this.set("align","center"),this.set("labelPos","bottom"),this.set("zIndex",1e3),this.setValues(a)}MapLabel[l]=new google.maps.OverlayView,window.MapLabel=MapLabel,MapLabel[l].changed=function(a){switch(a){case"fontFamily":case"fontSize":case"fontColor":case"strokeWeight":case"strokeColor":case"align":case"labelPos":case"text":case"marker":return this.drawCanvas_();case"maxZoom":case"minZoom":case"position":return this.draw()}},MapLabel[l].drawCanvas_=function(){var a=this.canvas_;if(a){var b=a.style;b.zIndex=this.get("zIndex");var c=a.getContext("2d");c.clearRect(0,0,a.width,a.height),c.strokeStyle=this.get("strokeColor"),c.fillStyle=this.get("fontColor"),c.font=this.get("fontSize")+"px "+this.get("fontFamily");var d=Number(this.get("strokeWeight")),e=this.get("text");if(e){var f={height:40,width:22},g=this.get("marker");if(g){var h=g.getIcon();h&&(f=h.size)}var i=c.measureText(e),j=i.width+d;b.marginLeft=this.getMarginLeft_(j,f.width)+"px";var k=this.getTextHeight_(e);switch(this.get("labelPos")){case"top":b.marginTop=-k-1.1*f.height+"px";break;case"bottom":b.marginTop="-0.4em";break;case"left":case"right":b.marginTop=-(k/2)-f.height/2+"px"}d&&(c.lineWidth=d,c.strokeText(e,d,d)),c.fillText(e,d,d)}}},MapLabel[l].getTextHeight_=function(a){var b=document.getElementsByTagName("body")[0],c=document.createElement("div"),d=document.createTextNode(a);c.appendChild(d),c.style.fontFamily=this.get("fontFamily"),c.style.fontSize=this.get("fontSize")+"px",c.style.left="-99999px",c.style.top="-99999px",b.appendChild(c);var e=c.offsetHeight;return b.removeChild(c),e},MapLabel[l].onAdd=function(){var a=this.canvas_=document.createElement("canvas"),b=a.style;b.position="absolute";var c=a.getContext("2d");c.lineJoin="round",c.textBaseline="top",this.drawCanvas_();var d=this.getPanes();d&&d.mapPane.appendChild(a)},MapLabel[l].onAdd=MapLabel[l].onAdd,MapLabel[l].getMarginLeft_=function(a,b){switch(this.get("labelPos")){case"top":case"bottom":switch(this.get("align")){case"left":return 0;case"right":return-a}return a/-2;case"left":return-a-.6*b;case"right":return.6*b}},MapLabel[l].draw=function(){var a=this.getProjection();if(a&&this.canvas_){var b=this.get("position");if(b){var c=a.fromLatLngToDivPixel(b),d=this.canvas_.style;d.top=c.y+"px",d.left=c.x+"px",d.visibility=this.getVisible_()}}},MapLabel[l].draw=MapLabel[l].draw,MapLabel[l].getVisible_=function(){var a=this.get("minZoom"),b=this.get("maxZoom");if(void 0===a&&void 0===b)return"";var c=this.getMap();if(!c)return"";var d=c.getZoom();return d<a||d>b?"hidden":""},MapLabel[l].onRemove=function(){var a=this.canvas_;a&&a.parentNode&&a.parentNode.removeChild(a)},MapLabel[l].onRemove=MapLabel[l].onRemove;})()
