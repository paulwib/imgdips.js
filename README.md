#imgdips.js

Replace images with device-independent-pixel (aka retina) sized images without
dependencies on any other libraries.

It takes a slightly different approach to most libraries in two respects:

1. Firstly, image objects are used to check for alternate images, rather than
   Ajax requests. This ensures everything works cross-domain (like when your
   images are on a CDN).

   This also has some caching advantages over making an Ajax HEAD request. The
   HEAD request would get a quicker response, but it still has to make another
   request and wait for the larger image to load if it exists, so this isn't
   really an advantage. By using image objects the response (should) be
   cached, so only one HTTP request is needed.

2. Secondly, you map file suffixes to minimum device pixel ratios. Not only does
   this make testing a bit easier it also future-proofs against the time when you
   need to support @2x, @4x and @8x images :)

##Usage

```javascript
ImgDips.init(options);
```

By default it will attempt to replace images for all `img` tags with the class
`dips` when the `window.devicePixelRatio` is greater than 1.5 by adding the
file suffix `@2x`. Your images should have width and height attributes.

You can also set the hi-res image URL with a `data-2x` attribute.

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

