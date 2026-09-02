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
    width: 1050,
    height: 1400
  },
  // Full package service page, homepage "Who We Are" split's alternate, about page.
  wash: {
    src: '/assets/img/photo-gwagon-wash.jpg',
    alt: 'Detailer hand washing a silver Mercedes-AMG G-Wagon covered in foam in a residential driveway',
    width: 1600,
    height: 900
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
    width: 788,
    height: 1400
  },
  // Exterior detailing service page and the reviews page.
  wheel: {
    src: '/assets/img/photo-wheel-foam.jpg',
    alt: 'Red wheel face and tire being agitated with a dedicated brush and foam',
    width: 640,
    height: 960
  },
  // Services hub, blog hub, reviews page, contact page split images.
  finished: {
    src: '/assets/img/photo-civic-front.jpg',
    alt: 'White Honda Civic with a freshly detailed front end and gloss black trim',
    width: 387,
    height: 516
  },
  // Exterior detailing service page featured image.
  exteriorBA: {
    src: '/assets/img/photo-exterior-before-after.webp',
    alt: 'Split before and after photo of an oxidized black hood restored to a deep, mirror-like gloss',
    width: 600,
    height: 450
  },
  // Interior detailing service page featured image.
  interiorBA3: {
    src: '/assets/img/photo-interior-before-after-3.webp',
    alt: 'Split before and after photo of a stained Toyota seat fully cleaned and restored',
    width: 1400,
    height: 1400
  },
  // Interior detailing service page gallery.
  interiorBA1: {
    src: '/assets/img/photo-interior-before-after-1.avif',
    alt: 'Split before and after photo of a heavily stained rear seat fully cleaned',
    width: 666,
    height: 666
  },
  interiorBA2: {
    src: '/assets/img/photo-interior-before-after-2.webp',
    alt: 'Split before and after photo of a stained front seat cleaned and restored',
    width: 1024,
    height: 680
  },
  // Paint correction service page featured image.
  correctionBA1: {
    src: '/assets/img/photo-paint-correction-before-after-1.avif',
    alt: 'Split before and after photo of a dull, swirled Audi hood corrected to a deep mirror gloss',
    width: 646,
    height: 646
  },
  // Headlight restoration service page featured image.
  headlightBA1: {
    src: '/assets/img/photo-headlight-before-after-1.avif',
    alt: 'Before and after headlight restoration: a heavily yellowed, cloudy lens above and the same lens fully clear below',
    width: 590,
    height: 642
  },
  // Headlight restoration service page gallery.
  headlightBA2: {
    src: '/assets/img/photo-headlight-before-after-2.avif',
    alt: 'Before and after headlight restoration on a projector headlight, hazy above and crystal clear below',
    width: 573,
    height: 624
  },
  // Tesla interiors, used by the vehicle-specific detailing guides.
  teslaModel3Interior: {
    src: '/assets/img/photo-tesla-model3-interior.jpg',
    alt: 'Tesla Model 3 interior showing the centre touchscreen, minimal dashboard and light synthetic-leather seats',
    width: 1200,
    height: 675
  },
  teslaModelSInterior: {
    src: '/assets/img/photo-tesla-models-interior.avif',
    alt: 'Tesla Model S interior with the yoke steering wheel, wood dash trim and landscape centre screen',
    width: 1600,
    height: 900
  },
  teslaGlassRoof: {
    src: '/assets/img/photo-tesla-glassroof-interior.webp',
    alt: 'Tesla cabin viewed from the rear, showing the full-length glass roof above light seats',
    width: 800,
    height: 600
  },
  // Corvette C8 how-to-exterior-detail guide.
  corvetteC8Exterior: {
    src: '/assets/img/674e344e1183dc3a4175343b_dsc04123.jpg',
    alt: 'A blue Chevrolet Corvette C8 parked on a driveway, showing its clean, low mid-engine profile',
    width: 1600,
    height: 1066
  },
  // Corvette C6 how-to-exterior-detail guide.
  corvetteC6Exterior: {
    src: '/assets/img/images (29).jpg',
    alt: 'A red Chevrolet Corvette C6 parked at dusk, showing its classic front-engine long-hood profile',
    width: 387,
    height: 516
  },
  // Toyota Tacoma trim guides. Alt text describes only what is verifiably in
  // each frame - trim badges are not legible in all of them, so the copy does
  // not claim a specific trim the photo cannot support.
  tacomaPair: {
    src: '/assets/img/2022-Toyota-Tacoma.avif',
    alt: 'Two third-generation Toyota Tacoma pickups parked side by side on grass, one dark green and one blue',
    width: 1000,
    height: 317
  },
  tacomaPreRunner: {
    src: '/assets/img/2025-toyota-tacoma-prerunner-101-681b80dd44cde.avif',
    alt: 'A fourth-generation Toyota Tacoma XtraCab in grey parked on rocky desert ground',
    width: 1200,
    height: 674
  },
  tacomaInterior: {
    src: '/assets/img/images (32).jpg',
    alt: 'Toyota truck cabin showing the steering wheel, gauge cluster, centre touchscreen and door controls',
    width: 516,
    height: 387
  },
  // Paint correction service page gallery.
  correctionBA2: {
    src: '/assets/img/photo-paint-correction-before-after-2.jpg',
    alt: 'Audi hood showing heavy swirl marks on one half and a corrected, gloss finish on the other',
    width: 679,
    height: 452
  }
};

module.exports = { photos };
