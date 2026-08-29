// Service areas. Each entry renders /service-areas/<slug>/ and, combined with
// src/data/services.js, one page per service at
// /services/<service-slug>/<area-slug>-fl/.
//
// The copy here is deliberately specific to each place. Pages that differ only
// by a swapped city name are what Google's guidelines call doorway pages, so
// every area needs real local substance: how vehicles are stored there, what
// the roads and vegetation do to paint, and how access actually works.

const areas = [
  {
    slug: 'ocala',
    name: 'Ocala',
    county: 'Marion County',
    // Shown on the hub card.
    summary:
      'Our home base. Horse country dust, the Interstate 75 corridor, and a canopy of live oaks make Ocala harder on paint than most of Florida.',
    metaDescription:
      'Mobile car detailing in Ocala, FL. Water, power, and professional product brought to your driveway anywhere in Marion County.',
    lead:
      'Ocala is where we are based and where most of our appointments happen. Everything we offer runs fully mobile here, usually with same-week availability.',
    intro: [
      'Ocala puts a particular set of problems on a vehicle. The farm and trail roads that make this area what it is are largely limerock and clay, and the fine, iron-rich dust they throw does not rinse off the way ordinary road dirt does. It settles into panel gaps, bonds into clear coat, and turns into rust-coloured specks that a normal wash leaves exactly where they are.',
      'Then there is Interstate 75. Any vehicle commuting that corridor collects road film, tar, and, twice a year, a windshield and bumper full of love bugs. And the live oaks that shade half the older neighbourhoods drop sap and pollen onto anything parked under them.',
      'The upshot is that a maintenance schedule that works in a milder climate falls behind here quickly. Chemical decontamination for the iron, clay for what is bonded, and real protection on top of it is what actually holds up in Marion County.'
    ],
    localNotes: [
      'Limerock and clay road dust carries iron that bonds into clear coat',
      'Interstate 75 commuting means road film, tar, and heavy love bug seasons',
      'Live oak canopy drops sap and pollen on anything parked beneath it',
      'Well-water irrigation leaves hard mineral spotting on paint and glass',
      'Full sun exposure on most driveways and open lots year round'
    ],
    coverage:
      'We cover the whole city, including the historic district, Southeast Ocala, Silver Springs Shores, the State Road 200 corridor, Ocala Palms, and the horse farm properties north and west of town.',
    travel: 'Base of operations. No travel surcharge anywhere inside the city.'
  },
  {
    slug: 'belleview',
    name: 'Belleview',
    county: 'Marion County',
    summary:
      'A short run south of Ocala on US-441. Quieter roads, more garage-kept vehicles, and the humidity that comes with sitting close to Lake Weir.',
    metaDescription:
      'Mobile car detailing in Belleview, FL. We come to your driveway anywhere around Lake Weir, fully self-contained. Every service available.',
    lead:
      'Belleview is a short run south of us on US-441, and it is one of our steadiest service areas. Every service on this site is available here at the same pricing.',
    intro: [
      'Belleview vehicles tend to arrive in better condition than Ocala ones, and the reason is mostly storage. More homes here have a garage or carport actually used for the car, and a lot of drivers are retired and putting far fewer miles on than a daily Interstate 75 commuter. That changes what a detail needs to do.',
      'What it does not change is the humidity. Sitting close to Lake Weir means damp mornings, heavy dew, and cabins that hold moisture, which is what produces musty air conditioning, foggy interior glass, and mildew in carpet that a vacuum will not touch. Interior work here leans harder on extraction and proper drying than it does elsewhere.',
      'The other local factor is irrigation. A lot of Belleview properties run well water through sprinklers, and that water is mineral-heavy. Overspray dries on paint and glass and bakes into spotting that ordinary washing will not lift.'
    ],
    localNotes: [
      'Humidity off Lake Weir drives musty cabins, damp carpet, and interior glass haze',
      'Well-water sprinkler overspray leaves mineral spotting that bonds to paint',
      'More garage-kept, lower-mileage vehicles than the Ocala average',
      'Pine pollen in spring settles heavily on anything parked outdoors',
      'Quieter residential streets make driveway access straightforward'
    ],
    coverage:
      'We cover Belleview proper plus the surrounding Lake Weir communities, including Summerfield, Ocklawaha, and the neighbourhoods along US-441 and County Road 25.',
    travel: 'Roughly fifteen minutes from base. No travel surcharge.'
  },
  {
    slug: 'the-villages',
    name: 'The Villages',
    county: 'Marion, Sumter, and Lake counties',
    summary:
      'Golf carts as much as cars. Low-mileage vehicles that look older than they are, because sun exposure does more damage here than driving does.',
    metaDescription:
      'Mobile car detailing in The Villages, FL. Cars and golf carts detailed at your home, with water and power on board. Every service available.',
    lead:
      'The Villages is unlike anywhere else we work, and the vehicles reflect that. We detail cars and golf carts here, at your home, with everything needed carried on the truck.',
    intro: [
      'The defining pattern in The Villages is low mileage and high sun exposure. A car might do three thousand miles a year and still show badly weathered paint, cloudy headlights, and a cracked dashboard, because the damage here is ultraviolet, not mechanical. That inverts the usual priorities: oxidation, headlight restoration, and interior UV protection matter far more than road grime does.',
      'Golf carts have it worse. Most live outdoors permanently, and they are typically finished in a single-stage paint that chalks under sun far faster than a modern clear coat. They also collect the same pollen, sap, and irrigation spotting as the cars, with none of the shelter.',
      'The practical consequence is that protection is worth more here than cleaning is. A ceramic coating on a garage-kept, low-mileage vehicle in The Villages may outlast the same coating on an Ocala commuter by years, which makes it one of the better-value services in this area.'
    ],
    localNotes: [
      'Ultraviolet damage, not mileage, is what ages vehicles here',
      'Headlight oxidation and dashboard cracking show up early on low-mileage cars',
      'Golf carts sit outdoors in single-stage paint that chalks quickly',
      'Irrigation overspray and pollen affect anything parked on a driveway',
      'Gated neighbourhoods and community rules need noting when you book'
    ],
    coverage:
      'We cover the Marion County portion of The Villages and the neighbouring communities. Because The Villages spans three counties, tell us your village or gate when you book and we will confirm coverage before scheduling.',
    travel:
      'Around forty minutes from base. Confirm your address when booking; some outlying areas are quoted case by case.'
  }
];

module.exports = { areas };
