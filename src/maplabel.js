/**
 * @license
 *
 * Copyright 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Map Label.
 *
 * @author Luke Mahe (lukem@google.com),
 *         Chris Broadfoot (cbro@google.com)
 */

/**
 * Creates a new Map Label
 * @constructor
 * @extends google.maps.OverlayView
 * @param {Object.<string, *>=} opt_options Optional properties to set.
 */
function MapLabel(opt_options) {
	if (!MapLabel.prototype.setValues) {
		for (var property in google.maps.OverlayView.prototype) {
			if(!MapLabel.prototype.hasOwnProperty(property)) {
				MapLabel.prototype[property] = google.maps.OverlayView.prototype[property];
			}
		}
	}

	this.set('align', 'center');
	this.set('fontColor', '#000000');
	this.set('fontFamily', 'sans-serif');
	this.set('fontSize', 12);
	this.set('strokeColor', '#ffffff');
	this.set('strokeWeight', 4);
	this.set('labelPos', 'bottom');
	this.set('lineJoin', 'round');
	this.set('baseline', 'top');
	this.set('zIndex', 1e3);

	this.setValues(opt_options);
}

window['MapLabel'] = MapLabel;

/** @inheritDoc */
MapLabel.prototype.changed = function (prop) {
	switch (prop) {
	case 'fontFamily':
	case 'fontSize':
	case 'fontColor':
	case 'strokeWeight':
	case 'strokeColor':
	case 'align':
	case 'labelPos':
	case 'text':
	case 'marker':
		return this.drawCanvas_();
	case 'maxZoom':
	case 'minZoom':
	case 'position':
		return this.draw();
	}
};

/**
 * Draws the label to the canvas 2d context.
 * @private
 */
MapLabel.prototype.drawCanvas_ = function () {
	var canvas = this.canvas_;
	if (!canvas)
		return;

	var style = canvas.style;
	style.zIndex = /** @type number */(this.get('zIndex'));

	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	this.setStyle_(ctx);
	var strokeWeight = Number(this.get('strokeWeight'));

	var text = this.get('text');
	if (text) {

		// get marker size (use default size if no custom icon)
		var markerSize = {
			height : 40,
			width : 22
		};
		var marker = this.get('marker');
		if (marker) {
			var markerIcon = marker.getIcon();
			if (markerIcon) {
				markerSize = markerIcon.size;
			}
		}
		var textMeasure = ctx.measureText(text);
		var textWidth = textMeasure.width + strokeWeight;
		style.marginLeft = this.getMarginLeft_(textWidth, markerSize.width) + 'px';
		var textHeight = this.getTextHeight_(text);
		switch (this.get('labelPos')) {
		case 'top':
			// move text (somewhere) above the marker
			style.marginTop = -textHeight - markerSize.height * 1.1 + 'px';
			break;
		case 'bottom':
			// Bring actual text top in line with desired latitude.
			// Cheaper than calculating height of text.
			style.marginTop = '-0.4em';
			break;
		case 'left':
		case 'right':
			// bring text level with marker
			style.marginTop =  - (textHeight / 2) - (markerSize.height / 2) + 'px';
		}

		var bufferX = textWidth * .05 > strokeWeight * 2 ? textWidth * .05 : strokeWeight * 2;
		var bufferY = textHeight * .05 > strokeWeight * 2 ? textHeight * .05 : strokeWeight * 2;
		canvas.width = textWidth + bufferX;
		canvas.height = textHeight + bufferY;
		// need to reapply context props if canvas size has changed
		this.setStyle_(ctx);

		if (strokeWeight) {
			ctx.strokeText(text, strokeWeight, strokeWeight);
		}

		ctx.fillText(text, strokeWeight, strokeWeight);
	}
};

/**
 * Sets the style properties for the label
 * @private
 * @param {string} The canvas context to be drawn onto
 */
MapLabel.prototype.setStyle_ = function (ctx) {
	ctx.lineJoin = this.lineJoin;
	ctx.lineWidth = this.strokeWeight;
	ctx.strokeStyle = this.strokeColor;
	// ctx.textAlign = this.textAlign;
	ctx.textBaseline = this.baseline;
	ctx.font = this.fontSize + 'px ' + this.fontFamily;
	ctx.fillStyle = this.fontColor;
}

/**
 * Gets the height in pixels of a text string for given font and size
 * @private
 * @param {string} The text to be drawn
 */
MapLabel.prototype.getTextHeight_ = function (label) {
	// create a dummy element containing the text string
	var body = document.getElementsByTagName("body")[0];
	var dummy = document.createElement("div");
	var dummyText = document.createTextNode(label);
	dummy.appendChild(dummyText);
	dummy.style.fontFamily = this.get('fontFamily');
	dummy.style.fontSize = this.get('fontSize') + 'px';
	dummy.style.left = '-99999px';
	dummy.style.top = '-99999px';

	// add to the document and get the text height
	body.appendChild(dummy);
	var result = dummy.offsetHeight;

	// cleanup
	body.removeChild(dummy);
	return result;
};

/**
 * @inheritDoc
 */
MapLabel.prototype.onAdd = function () {
	var canvas = this.canvas_ = document.createElement('canvas');
	var style = canvas.style;
	style.position = 'absolute';

	this.drawCanvas_();

	var panes = this.getPanes();
	if (panes) {
		panes.mapPane.appendChild(canvas);
	}
};
MapLabel.prototype['onAdd'] = MapLabel.prototype.onAdd;

/**
 * Gets the appropriate margin-left for the canvas.
 * @private
 * @param {number} textWidth  the width of the text, in pixels.
 * @return {number} the margin-left, in pixels.
 */
MapLabel.prototype.getMarginLeft_ = function (textWidth, markerWidth) {
	switch (this.get('labelPos')) {
	case 'top':
	case 'bottom':
		// Top/bottom position - use alignment to get left/right/centred text
		switch (this.get('align')) {
		case 'left':
			return 0;
		case 'right':
			return -textWidth;
		}
		return textWidth / -2;
	case 'left':
		// Left/right position - include a margin to avoid the marker
		return -textWidth - (markerWidth * 0.6);
	case 'right':
		return markerWidth * 0.6;
	}
};

/**
 * @inheritDoc
 */
MapLabel.prototype.draw = function () {
	var projection = this.getProjection();

	if (!projection) {
		// The map projection is not ready yet so do nothing
		return;
	}

	if (!this.canvas_) {
		// onAdd has not been called yet.
		return;
	}

	var latLng = /** @type {google.maps.LatLng} */(this.get('position'));
	if (!latLng) {
		return;
	}
	var pos = projection.fromLatLngToDivPixel(latLng);

	var style = this.canvas_.style;

	style['top'] = pos.y + 'px';
	style['left'] = pos.x + 'px';

	style['visibility'] = this.getVisible_();
};
MapLabel.prototype['draw'] = MapLabel.prototype.draw;

/**
 * Get the visibility of the label.
 * @private
 * @return {string} blank string if visible, 'hidden' if invisible.
 */
MapLabel.prototype.getVisible_ = function () {
	var minZoom = /** @type number */(this.get('minZoom'));
	var maxZoom = /** @type number */(this.get('maxZoom'));

	if (minZoom === undefined && maxZoom === undefined) {
		return '';
	}

	var map = this.getMap();
	if (!map) {
		return '';
	}

	var mapZoom = map.getZoom();
	if (mapZoom < minZoom || mapZoom > maxZoom) {
		return 'hidden';
	}
	return '';
};

/**
 * @inheritDoc
 */
MapLabel.prototype.onRemove = function () {
	var canvas = this.canvas_;
	if (canvas && canvas.parentNode) {
		canvas.parentNode.removeChild(canvas);
	}
};
MapLabel.prototype['onRemove'] = MapLabel.prototype.onRemove;
