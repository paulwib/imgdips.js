#imgdips.js

Replace images on high DPI screens with high resolution alternatives based on
device-independent-pixel ratios.

It takes a slightly different approach to some other libraries:

1. JavaScript image objects are used to check for alternate images, rather than
   Ajax requests. This ensures everything works cross-domain (like when your
   images are on a CDN).

   There are also caching advantages over making an Ajax HEAD request. The
   HEAD request gets a quicker response, but if the image exists it needs
   another HTTP request to load the image and the same time to wait for it to
   load, so this isn't really an advantage. By using image objects the
   response (should) be cached, so only one HTTP request is needed.

2. Multiple file suffixes can be mapped to minimum device pixel ratios. Not
   only does this make testing on low DPI devices a bit easier it also
   future-proofs against the time when we need to support @2x, @4x and @8x
   images :)

3. It doesn't mention any Apple marketing terms like "retina screens". Damn.

##Usage

Include the script however you prefer, then when the DOM is ready:

```javascript
ImgDips.init(options);
```

By default it will attempt to replace the `src` for all `img` tags with the
class `dips` when the `window.devicePixelRatio` is greater than 1.5 by adding
the file suffix `@2x`. Your images should have width and height attributes.

You can also set the hi-res image URL with a `data-2x` attribute.

Note you don't have to wait until the DOM has fully loaded as there is no
dependence on other libraries and the initial images don't have to be loaded.
Running this script just before you're closing `BODY` tag should work (unless
other scripts add more images).

If any other script wants to access the currently used suffix, for example
a gallery that loads images dynamically, it can do:

```javascript
var suffix = ImgDips.getSuffix();
```

Or it can check the body tag's `data-dips-suffix`, for example with jQuery:

```javascript
var suffix = $('body').data('dips-suffix');
```


##Options:

```javascript
{
  // Image CSS selector
  selector: '.dips',

  // Map suffixes to pixel ratios, the highest matched ratio will win
  pixelRatioSuffixes: {
    '@2x': 1.5,
    '@4x': 3,
    '@8x': 6
  }
}
```
In this case the alternate `data` attributes available would be `data-2x`,
`data-4x` and `data-8x`.

Changing suffixes may change the alternate `data` attributes available. The
attribute name is based on the suffix with all non-alphanumerics removed. So
`@2x`, `_2x` and `-2x` would all map to `data-2x`. But `@x2` would map to
`data-x2`.

