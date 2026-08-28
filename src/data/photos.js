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
  // About page full-bleed band, and the "Full Package" review pairing.
  tesla: {
    src: '/assets/img/photo-tesla-driveway.jpg',
    alt: 'Grey Tesla Model S detailed to a mirror finish on a paver driveway outside a private home',
    width: 1875,
    height: 2500
  },
  // Full package service page, homepage "Who We Are" split's alternate, about page.
  wash: {
    src: '/assets/img/photo-gwagon-wash.jpg',
    alt: 'Detailer hand washing a silver Mercedes-AMG G-Wagon covered in foam in a residential driveway',
    width: 1920,
    height: 1080
  },
  // Mobile detailing service page and the homepage "Who We Are" split.
  foam: {
    src: '/assets/img/photo-vw-foam.jpg',
    alt: 'Detailer applying thick foam cannon suds to a Volkswagen sedan in a driveway',
    width: 1200,
    height: 1382
  },
  // Ceramic coating service page and the homepage process band.
  ferrari: {
    src: '/assets/img/photo-ferrari-foam.jpg',
    alt: 'Silver Ferrari fully coated in cleaning foam inside a professional detailing bay',
    width: 1080,
    height: 1920
  },
  // Exterior detailing service page and the reviews page.
  wheel: {
    src: '/assets/img/photo-wheel-foam.jpg',
    alt: 'Red wheel face and tire being agitated with a dedicated brush and foam',
    width: 640,
    height: 960
  },
  // Interior detailing service page, services hub, contact page.
  finished: {
    src: '/assets/img/photo-civic-front.jpg',
    alt: 'White Honda Civic with a freshly detailed front end and gloss black trim',
    width: 387,
    height: 516
  }
};

module.exports = { photos };
