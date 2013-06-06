#imgdips.js

Replace images on high DPI screens with high resolution alternatives based on
device-independent-pixel (dips) ratios. The current `devicePixelRatio` is
normalized to a *ratio name* which is used as a file suffix or `data-*` attribute.

##Usage

Include the script however you prefer, then when the DOM is ready:

```javascript
ImgDips.init(options);
```

By default if the `devicePixelRatio` is > 1.5 it sets the ratio name to `@2x`.
For all images matching the selector `img.dips` it will get the hi-res image
URL from either a `data-2x` attribute, or if that doesn't exist by appending
`@2x` to the base file name i.e. `foo.jpg` becomes `foo@2x.jpg`.

It then attempts to load the hi-res URL into an image object. If it loads
successfully the tag's `src` attribute will be changed. The width and height
attributes aren't touched - they need to be set in the source.

If any other script wants to access the currently used ratio name, for example
a gallery that loads images dynamically, it can do:

```javascript
var suffix = ImgDips.getRatioName();
```

Or it can check the body tag's `data-dips-ratio-name`, for example with jQuery:

```javascript
var suffix = $('body').data('dips-ratio-name');
```

## Approach

It takes a slightly different approach to some other libraries:

1. JavaScript image objects are used to check for alternate images, rather than
   Ajax requests. This ensures everything works cross-domain (like when your
   images are on a CDN).

   There are also caching advantages over making an Ajax HEAD request. The
   HEAD request gets a quicker response, but if the image exists it needs
   another HTTP request to load the image and the same time to wait for it to
   load, so this isn't really an advantage. By using image objects the
   response (should) be cached, so only one HTTP transfer is needed.

2. Multiple ratio names can be mapped to different minimum device pixel
   ratios. Not only does this make testing on low DPI devices a bit easier it
   also future-proofs against the time when we need to support @2x, @4x and
   @8x images :)

3. It doesn't mention any Apple marketing terms like "retina screens". Damn.

##Options:

```javascript
{
  // Image CSS selector
  selector: '.dips',

  // Normalize names to pixel ratios, the highest matched ratio will win
  devicePixelRatioNames: {
    '@2x': 1.5,
    '@4x': 3,
    '@8x': 6
  }
}
```

In this case the alternate `data` attributes available would be `data-2x`,
`data-4x` and `data-8x`.

Changing ratio names may change the alternate `data` attributes available. The
attribute name is based on the ratio name with all non-alphanumerics removed. So
`@2x`, `_2x` and `-2x` would all map to `data-2x`. But `@2times` would map to
`data-2times`.

##Acknowledgements

Copyright-free images come courtesy of [The U.S. National Archives][]

##License

Copyright 2013 Paul Willoughby

Licensed under the MIT License

[The U.S. National Archives]:http://www.flickr.com/photos/usnationalarchives/
