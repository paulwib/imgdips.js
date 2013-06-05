(function() {
	var settings = {
		devicePixelRatioNames: {
			'@2x': 1.5
		}
	};

	function reset(){
		$('img.dips').each(function(i, img) {
			$(img).attr('src', $(img).data('original-src'));
		});
	}

	function setThreshold(threshold) {
		reset();
		settings.devicePixelRatioNames['@2x'] = threshold;
		ImgDips.init(settings);
	}

	function init(){
		$('img.dips').each(function(i, img) {
			$(img).data('original-src', $(img).attr('src'));
		});
		$('#set-dip-ratio-threshold').on('submit', function(e) {
			e.preventDefault();
			var threshold = $(':checked', this).val();
			setThreshold(threshold);
		});
	}

	$(init);
})();
