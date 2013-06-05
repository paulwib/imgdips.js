#imgdips.js

Replace images with device-independent-pixel (aka retina) sized images without
dependencies on any other libraries.

It takes a slightly different approach to most libraries in two respects:

1. Firstly, image objects are used to check for alternate images. This ensures
everything works croo-domain (like when your images are on a CDN). This also
has some caching advantages over making an Ajax HEAD request.

2. Secondly, you map file suffixes to minimum device pixel ratios. Not only does
this make testing a bit easier it also future-proofs against the time when you
need to support @2x, @4x and @8x images :)

##Usage

