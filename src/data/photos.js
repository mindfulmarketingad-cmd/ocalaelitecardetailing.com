// Photography used across the site.
//
// Drop the real photo files at the paths below. Every page references these
// entries by key, so replacing a file updates the whole site.
//
//   photo-tesla-driveway.jpg   portrait, ~1200x1600  (lead hero photo)
//   photo-gwagon-wash.jpg      landscape, ~1920x1080 (wash in progress)
//   photo-wheel-foam.jpg       portrait, ~1000x1500  (wheel and tire work)
//   photo-civic-front.jpg      portrait, ~1000x1330  (finished vehicle)

const photos = {
  hero: {
    src: '/assets/img/photo-tesla-driveway.jpg',
    alt: 'Grey sedan detailed to a mirror finish on a paver driveway outside a private home',
    width: 1200,
    height: 1600
  },
  wash: {
    src: '/assets/img/photo-gwagon-wash.jpg',
    alt: 'Detailer hand washing a silver SUV covered in foam in a residential driveway',
    width: 1920,
    height: 1080
  },
  wheel: {
    src: '/assets/img/photo-wheel-foam.jpg',
    alt: 'Wheel face and tire being agitated with a dedicated brush and foam',
    width: 1000,
    height: 1500
  },
  finished: {
    src: '/assets/img/photo-civic-front.jpg',
    alt: 'White compact sedan with a freshly detailed front end and gloss black trim',
    width: 1000,
    height: 1330
  }
};

module.exports = { photos };
