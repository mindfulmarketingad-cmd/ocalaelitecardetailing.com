// Photography used across the site. Real customer/vehicle photos, committed
// directly (not placeholders). Every page references these entries by key,
// so replacing a file and updating its dimensions here updates the whole site.

const photos = {
  // Homepage hero banner only.
  banner: {
    src: '/assets/img/photo-bmw-hood.jpg',
    alt: 'Close-up of a freshly detailed BMW hood and grille with a mirror-like glossy finish',
    width: 387,
    height: 516
  },
  // Used on the about page, ceramic coating, and full package pages.
  tesla: {
    src: '/assets/img/photo-tesla-driveway.jpg',
    alt: 'Grey Tesla Model S detailed to a mirror finish on a paver driveway outside a private home',
    width: 1875,
    height: 2500
  },
  wash: {
    src: '/assets/img/photo-gwagon-wash.jpg',
    alt: 'Detailer hand washing a silver Mercedes-AMG G-Wagon covered in foam in a residential driveway',
    width: 1920,
    height: 1080
  },
  wheel: {
    src: '/assets/img/photo-wheel-foam.jpg',
    alt: 'Red wheel face and tire being agitated with a dedicated brush and foam',
    width: 640,
    height: 960
  },
  finished: {
    src: '/assets/img/photo-civic-front.jpg',
    alt: 'White Honda Civic with a freshly detailed front end and gloss black trim',
    width: 387,
    height: 516
  }
};

module.exports = { photos };
