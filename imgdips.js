/**
 * Replace images with device pixel (aka retina) sized images without
 * dependencies on any other libraries.
 *
 * @author Paul Willoughby <paul@fivetide.com>
 */
ImgDips = (function() {

	var ratioName, settings = {
		// Image selector
		selector: '.dips',
		// Map names to pixel ratios, the highest matched ratio will win
		devicePixelRatioNames: {
			'@2x': 1.5
		}
	};

	/**
	 * Initialize
	 *
	 * @param {object} options Override default settings
	 */
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

		ratioName = pickRatioName(settings.devicePixelRatioNames);
		if(!ratioName){
			return false;
		}
		document.getElementsByTagName('body')[0].setAttribute('data-dips-ratio-name', ratioName);
		return swapImages(settings.selector, ratioName);
	}

	/**
	 * Pick the ratio name to use based on the current devicePixelRatio.
	 * Ratio names look like { '@2x': 1.5 } where name: min devicePixelRatio.
	 * Will pick the names for the highest supported ratio.
	 *
	 * @param {object} names
	 */
	function pickRatioName(names) {
		var useName = false, minRatio = 0;
		for(var name in names) {
			var ratio = names[name];
			if(isPixelRatioGreaterThan(ratio) && ratio > minRatio) {
				useName = name;
				minRatio = ratio;
			}
		}
		return useName;
	}

	/**
	 * Get the current ratio name
	 *
	 * Useful for other scripts to access without having to run all these
	 * kind of tests again.
	 */
	function getRatioName() {
		return ratioName;
	}

	/**
	 * Swap images to equivalent with file suffix if it exists, or
	 * URL in data atrribute.
	 *
	 * @param {string} selector
	 * @param {string} ratioName
	 */
	function swapImages(selector, ratioName) {
		// Get images - relevant browsers will support querySelectorAll
		var imgs = document.querySelectorAll(settings.selector);
		if(imgs.length === 0) {
			return false;
		}
		// Try and load alternate versions - if onload never fires, because 404 or
		// not an image - then the src will never be set
		for(var i=0, l=imgs.length; i < l ; i++) {
			var src,
				imgTag = imgs[i],
				attr = 'data-' + ratioName.replace(/[^A-Z0-9]/i, ''),
				imgObject = new Image();

			// Get src from data attribute or by renaming with file suffix
			if(imgTag.hasAttribute(attr)) {
				src = imgTag.getAttribute(attr);
			}
			else {
				src = imgTag.getAttribute('src').replace(/(\.[a-z]+$)/, ratioName + '$1');
			}
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
		init: init,
		getRatioName: getRatioName
	};

})();
