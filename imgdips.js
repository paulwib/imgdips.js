/**
 * Replace images with device pixel (aka retina) sized images without
 * dependencies on any other libraries.
 *
 * @author Paul Willoughby <paul@fivetide.com>
 */
ImgDips = (function() {

	var settings = {
		// Image selector
		selector: '.dips',
		// Map suffixes to pixel ratios, the highest matched ratio will win
		pixelRatioSuffixes: {
			'@2x': 1.5
		}
	};

	// @todo Would be good if you could pass a list of elements
	function init(options) {

		// Nothing to do for old browsers
		if(typeof document.querySelectorAll !== "function") {
			return false;
		}

		// Override settings with passed options
		for(var p in options) {
			if(typeof settings[p] !== "undefined") {
				settings[p] = options[p];
			}
		}

		var fileSuffix = pickFileSuffix(settings.pixelRatioSuffixes);
		if(!fileSuffix){
			return false;
		}
		return swapImages(settings.selector, fileSuffix);
	}

	/**
	 * Pick the suffix to use based on the current devicePixelRatio.
	 * Suffixes look like { '@2x': 1.5 } where suffix: min devicePixelratio.
	 * Will pick the suffix for the highest supported ratio.
	 *
	 * @param {object} suffixes
	 */
	function pickFileSuffix(suffixes) {
		var useSuffix = false, useRatio = 0;
		for(var suffix in suffixes) {
			var ratio = suffixes[suffix];
			if(isPixelRatioGreaterThan(ratio) && ratio > useRatio) {
				useSuffix = suffix;
				useRatio = ratio;
			}
		}
		return useSuffix;
	}

	/**
	 * Swap images to equivalent with file suffix if it exists
	 *
	 * @param {string} selector
	 * @param {string} fileSuffix
	 */
	function swapImages(selector, fileSuffix) {
		// Get images - relevant browsers will support querySelectorAll
		var imgs = document.querySelectorAll(settings.selector);
		if(imgs.length === 0) {
			return false;
		}
		// Try and load alternate versions - if onload never fires, because 404 or
		// not an image - then the src will never be set
		var i, l;
		for(i=0, l=imgs.length; i < l ; i++) {
			var imgTag = imgs[i];
			var src = imgTag.getAttribute('src').replace(/(\.[a-z]+$)/, fileSuffix + '$1');
			var imgObject = new Image();
			imgObject.onload = getSetImage(imgTag, src);
			imgObject.src = src;
		}
		return true;
	}

	/**
	 * Return a function for setting the image tag attribute on load
	 *
	 * @param {object} tag The HTML img tag to chnage src attribute of
	 * @param {string} src The new image source
	 */
	function getSetImage(tag, src) {
		return function() {
			tag.setAttribute('src', src);
		};
	}

	/**
	 * Check if the device pixel ratio is above a threshold
	 *
	 * @param {number} ratio The minimum device pixel ratio
	 */
	function isPixelRatioGreaterThan(ratio) {
		if(!window.devicePixelRatio && typeof window.matchMedia !== "function") {
			return false;
		}
		var mediaQuery = '(-webkit-min-device-pixel-ratio: ' + ratio + '),' +
			'(min--moz-device-pixel-ratio: ' + ratio + '),' +
			'(-o-min-device-pixel-ratio: ' + (ratio*2) + '/2),' +
			'(min-resolution: ' + ratio + 'dppx)';

		if(window.devicePixelRatio >= ratio || (window.matchMedia && matchMedia(mediaQuery).matches)) {
			return true;
		}
		return false;
	}

	// Return public interface
	return {
		init: init
	};

})();
