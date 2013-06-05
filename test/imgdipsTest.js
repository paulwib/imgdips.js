/**
 * Tests for imgdips.js
 *
 * These need to be run in a regular browser with a devicePixelRatio of 1!
 *
 * @todo Add examples to view in your browser
 * @author Paul Willoughby <paul@fivetide.com>
 */
module('Testing imgdips.js', {
	setup: function() {
		var $fixture = $('#qunit-fixture');
		$('<img id="missing" class="dips" src="test/images/missing.jpg" title="This image does not exist at all" />').appendTo($fixture);
		$('<img id="hi-res-missing" class="dips" src="test/images/bar.jpg" title="This image exists but has no hi-res version" />').appendTo($fixture);
		$('<img id="hi-res" class="dips" src="test/images/512x384.jpg" title="This image exists and has a hi-res version" />').appendTo($fixture);
		$('<img id="hi-res-class-missing" src="test/images/512x384.jpg" title="This image exists and has a hi-res version, but no class" />').appendTo($fixture);
		$('<img id="missing-nested" class="dips" src="test/images/x/fred.jpg" title="This image does not exist" />').appendTo($fixture);
		$('<img id="data-attr" class="dips" src="test/images/512x384.jpg" data-2x="test/images/2x/512x384.jpg" title="This image exists and has a hi-res version specified with data-2x attribute" />').appendTo($fixture);
		// This one may depend on your server
		$('<img id="not-img" class="dpimg" src="test/images/200x400.jpg" title="Hi-res exists, but is not actually an image" />').appendTo($fixture);
	}
});

// Async test as has to wait for the images to load (although should be near
// instant when testing locally, may need to tweak timeout)
asyncTest('Test replacements', function(){
	expect(7);
	// We're loading even when DIP ratio is >= 1 so works on any device
	ImgDips.init({
		pixelRatioSuffixes: {
			'@2x': 1
		}
	});
	var check = function(){
		ok(!$('#missing').attr('src').match(/@2x/), 'Missing not replaced');
		ok(!$('#hi-res-missing').attr('src').match(/@2x/), 'Missing hi-res not replaced');
		ok($('#hi-res').attr('src').match(/@2x/), 'Found is replaced');
		ok(!$('#hi-res-class-missing').attr('src').match(/@2x/), 'Missing hi-res class not replaced');
		ok(!$('#missing-nested').attr('src').match(/@2x/), 'Missing nested not replaced');
		ok($('#data-attr').attr('src').match(/\/2x\//), 'Found with data-attr is replaced');
		ok(!$('#not-img').attr('src').match(/@2x/), 'Wrong mime-type not replaced');
		start();
	};
	setTimeout(check, 100);
});

asyncTest('Test a different suffix', function(){
	expect(2);
	// We're loading even when DIP ratio is >= 1 so works on any device
	ImgDips.init({
		pixelRatioSuffixes: {
			'_2x': 1
		}
	});
	var check = function(){
		ok(!$('#hi-res-missing').attr('src').match(/_2x/), 'Missing hi-res not replaced');
		ok($('#hi-res').attr('src').match(/_2x/), 'Found is replaced');
		start();
	};
	setTimeout(check, 100);
});

asyncTest('Test a different selector', function(){
	expect(3);
	// We're loading even when DIP ratio is >= 1 so works on any device
	ImgDips.init({
		selector: 'IMG',
		pixelRatioSuffixes: {
			'@2x': 1
		}
	});
	var check = function(){
		ok(!$('#missing').attr('src').match(/@2x/), 'Missing not replaced');
		ok($('#hi-res').attr('src').match(/@2x/), 'Found is replaced');
		ok($('#hi-res-class-missing').attr('src').match(/@2x/), 'No class but still replaced');
		start();
	};
	setTimeout(check, 100);
});

test('Test getting suffix', function(){
	// We're loading even when DIP ratio is >= 1 so works on any device
	ImgDips.init({
		selector: 'IMG',
		pixelRatioSuffixes: {
			'@1x': 1,
			'@2x': 1.5,
			'@4x': 3
		}
	});
	equal(ImgDips.getSuffix(), '@1x', 'getSuffix() returns suffix');
	equal($('body').data('dips-suffix'), '@1x', 'Current suffix stored in data attribute on body');
});
