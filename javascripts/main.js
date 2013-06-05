(function() {

	/**
	 * Default settings
	 */
	var settings = {
		devicePixelRatioNames: {
			'@2x': 1.5
		}
	};

	/**
	 * Reset all images ot their original src attributes
	 */
	function reset(){
		$('img.dips').each(function(i, img) {
			$(img).attr('src', $(img).data('original-src'));
		});
	}

	/**
	 * Set the devicePixelRatio threshold for triggering
	 * @2x images
	 */
	function setThreshold(threshold) {
		reset();
		settings.devicePixelRatioNames['@2x'] = threshold;
		ImgDips.init(settings);
	}

	/**
	 * Initlaise images and event handlers
	 */
	function init(){

		// Store original img src so we can revert later
		$('img.dips').each(function(i, img) {
			$(img).data('original-src', $(img).attr('src'));
		});

		// Form handler
		$('#set-dip-ratio-threshold').on('submit', function(e) {
			e.preventDefault();
			var threshold = $(':checked', this).val();
			setThreshold(threshold);
		});

		// Start with defaults
		ImgDips.init();
	}

	$(init);
})();
