// Per-service cost pages at /costs/<service-slug>/.
//
// Each entry explains what actually drives the price of that one service.
// The numbers themselves are not stored here: the tier table on each page is
// computed in build.js from priceFrom in src/data/services.js, so prices can
// never drift between a service page and its cost page.
//
// build.js throws if a service has no entry here, rather than emitting a cost
// page that is the same generic text with a different heading.

const costs = {
  'mobile-detailing': {
    lead: 'Travel and setup are a fixed cost on every mobile job, which is why the entry price exists at all.',
    body: [
      'A mobile appointment carries an overhead a shop visit does not: loading, driving, setting up the tank and generator, and packing down afterwards. That is roughly forty five minutes of unbillable work per job, and it is the reason there is a floor under the price no matter how small the vehicle.',
      'What that buys you is a maintenance-level service rather than a restoration. A wash done with correct technique, wheels and tires, glass, a quick interior pass, and a protective topper. It is the right service for a car already in reasonable condition that needs keeping there.'
    ],
    factors: [
      'Vehicle size, which changes wash and interior time proportionally',
      'How long since the last proper clean, which is the biggest single variable',
      'Distance, for addresses well outside our normal coverage',
      'Whether the working area has shade, which affects how fast we can safely work',
      'Access constraints such as gated communities or apartment parking'
    ],
    notIncluded: [
      'Decontamination of bonded contamination, which is exterior detailing',
      'Hot water extraction on carpet and seats, which is interior detailing',
      'Any machine polishing'
    ],
    value:
      'If you are booking a single service and the car is genuinely dirty rather than merely dusty, the money is usually better spent on exterior or interior detailing than on the entry-level option.'
  },

  'wash-wax': {
    lead: 'The most predictable price on our menu, because the scope barely moves between vehicles.',
    body: [
      'This is the one service where condition is largely irrelevant to the quote. A wash and wax on a filthy car and on a clean one take close to the same time, because we are not removing bonded contamination either way. Only size really moves the number.',
      'That predictability is the point. It is designed to be booked repeatedly on a schedule, so a stable, low price matters more than the ability to handle an extreme case.'
    ],
    factors: [
      'Vehicle size, which is the dominant factor here',
      'Whether the wax is a spray sealant or a hand-applied paste',
      'Adding a second vehicle or a golf cart in the same visit, which lowers the per-unit cost',
      'Recurring bookings, which we price better than one-offs'
    ],
    notIncluded: [
      'Iron and tar decontamination',
      'Clay treatment',
      'Any interior work beyond a light tidy'
    ],
    value:
      'Run monthly on a car in good condition, this costs less over a year than a single rescue detail on a finish that was left too long, and the car looks better the whole time.'
  },

  'exterior-detailing': {
    lead: 'The price tracks how much bonded contamination has to come off before anything can go on.',
    body: [
      'Washing is a small part of what you are paying for here. The labour is in decontamination: iron remover dissolving embedded brake and road dust, tar solvent on the lower panels, and clay across every surface. A car detailed six months ago moves through that quickly. One that has never been decontaminated can take twice as long on the same panels.',
      'Wheels are the other variable people underestimate. Baked-on brake dust on an intricate multi-spoke wheel, cleaned properly face and barrel, can add the better part of an hour on its own.'
    ],
    factors: [
      'How long since the last decontamination, which is the main driver',
      'Wheel design and how baked-on the brake dust is',
      'Tar and love bug residue, which need dwell time rather than force',
      'Hard water or sprinkler spotting, which needs dedicated chemistry',
      'Vehicle size and how much of it is glass'
    ],
    notIncluded: [
      'Removal of swirl marks or scratches, which is paint correction',
      'Engine bay cleaning',
      'Interior work of any kind'
    ],
    value:
      'The protection applied at the end lasts several times longer on a properly decontaminated surface than on one that merely looks clean, so skipping this stage to save money shortens everything that follows it.'
  },

  'interior-detailing': {
    lead: 'Three things move this price far more than vehicle size does: pet hair, stains, and odour.',
    body: [
      'A cabin that has been kept tidy and one that has carried a dog for three years are the same volume and wildly different jobs. Pet hair woven into carpet fibre does not vacuum out; it has to be lifted mechanically with rubber tools first, and on a heavily affected vehicle that alone can add an hour or more.',
      'Stains and odour work the same way. A surface spill lifts with extraction. Something that soaked into the foam beneath the carpet needs enzyme treatment and a drying cycle, and smoke that has permeated the headliner and ventilation system is a different job again.'
    ],
    factors: [
      'Pet hair, which is the single largest labour multiplier',
      'Number of seats and rows, since a three-row vehicle is close to double a sedan',
      'Set-in stains needing enzyme treatment rather than extraction alone',
      'Odour treatment, particularly smoke, which needs an ozone or hydroxyl cycle',
      'Whether child seats have been removed beforehand'
    ],
    notIncluded: [
      'Repair of cracked dashboards, torn upholstery, or cigarette burns',
      'Headliner re-adhesion where the fabric is already sagging',
      'Any exterior work'
    ],
    value:
      'Preparing the car properly is worth real money on this service specifically. An emptied cabin with the child seats already out can take a meaningful amount off the labour.'
  },

  'full-package': {
    lead: 'Priced below booking the exterior and interior separately, because it is one mobilisation instead of two.',
    body: [
      'Booking exterior and interior detailing on separate days means paying the travel and setup overhead twice, and it means the vehicle is disrupted twice. Combined into one appointment that overhead is absorbed once, which is where the saving comes from.',
      'What it costs you instead is a full working day. We book one per crew per day deliberately, because the failure mode on a compressed full package is a rushed interior that never dries properly.'
    ],
    factors: [
      'Vehicle size, compounded here because it affects both halves of the job',
      'Interior condition, which is the larger of the two variables',
      'Engine bay condition, since engine detailing is included in this package',
      'Whether the paint needs correction, which is quoted separately on top'
    ],
    notIncluded: [
      'Paint correction, which is always a separate stage',
      'Ceramic coating installation',
      'Headlight restoration'
    ],
    value:
      'For a vehicle going up for sale, this is usually the highest-return service on the menu. Reconditioning charges on a trade-in, or the difference in a private sale price, routinely exceed what the detail costs.'
  },

  'engine-detailing': {
    lead: 'The variable is how much buildup is present, and whether the bay can safely be cleaned wet at all.',
    body: [
      'A bay that has been cleaned before and only carries dust is quick. One with a decade of oil film baked onto a hot engine, or packed with hay chaff and road debris, needs several degreaser applications with dwell time between them, and hand agitation into every ledge.',
      'The other thing that changes the quote is whether wet cleaning is appropriate. On a very old vehicle with brittle wiring insulation, exposed connectors, or previous makeshift repairs, we may recommend a dry detail instead, which is slower and more careful.'
    ],
    factors: [
      'Depth of grease and oil buildup, which sets the number of degreaser passes',
      'Debris such as hay chaff, leaf litter, or rodent nesting material',
      'How much has to be covered before any liquid is used',
      'Whether a dry detail is needed instead of a wet clean',
      'Engine bay size and how densely packed it is'
    ],
    notIncluded: [
      'Any mechanical repair, including replacing chewed wiring we find',
      'Diagnosis of a leak, though we will point out what we see',
      'Undercarriage cleaning'
    ],
    value:
      'It is already part of the full package, so booking it separately only makes sense as a standalone job or added to another service in the same visit.'
  },

  'headlight-restoration': {
    lead: 'Priced per pair, and the main question is whether restoration is the right fix at all.',
    body: [
      'Standard oxidation on a pair of lenses is a predictable job: several stages of wet sanding, polishing, then the UV sealant that determines whether the result lasts years or months. Severity moves it somewhat, since a deeply yellowed lens needs to start at a coarser grit and step through more stages.',
      'The real cost question is whether the damage is on the outside of the lens at all. Condensation inside the housing, a flaked internal reflector, or hazing on the inner surface cannot be reached from outside, and no amount of restoration will help. We check for that at inspection and will tell you before starting.'
    ],
    factors: [
      'Severity of oxidation, which sets how many sanding stages are needed',
      'Lens size and shape, with complex projector housings taking longer',
      'Adding tail lights or fog lights, which use the same process',
      'Whether the vehicle has more than two affected lenses'
    ],
    notIncluded: [
      'Replacement housings where the damage is internal',
      'Bulb replacement or electrical work',
      'Headlight aim adjustment'
    ],
    value:
      'Against the cost of replacing a pair of housings, which frequently runs into several hundred dollars per side on a modern vehicle, restoration is inexpensive whenever the lens surface is the actual problem.'
  },

  'paint-correction': {
    lead: 'The number of stages is the whole price. Everything else is secondary.',
    body: [
      'A one-step polish and a three-stage correction on the same car differ by a factor of several in labour, because each stage means working every panel again with a different pad and compound, then wiping down and inspecting under dedicated lighting before deciding whether another pass is needed.',
      'Paint hardness matters more than people expect. Some manufacturers use notably hard clear coats that resist cutting and take substantially longer to correct to the same standard, and some soft finishes need a gentler, slower approach to avoid introducing new marring.'
    ],
    factors: [
      'Number of correction stages, which is the dominant cost',
      'Paint hardness, which varies enormously by manufacturer',
      'Panel count and vehicle size',
      'How much clear coat remains, measured before we start',
      'Whether the finish is single-stage paint, as on most golf carts'
    ],
    notIncluded: [
      'Scratches deep enough to catch a fingernail, which need paint not polish',
      'Rock chip filling or touch-up work',
      'Any guarantee of removing one hundred percent of defects, since clear coat is finite'
    ],
    value:
      'Correction is also the prerequisite for coating. If a ceramic coating is planned, doing it in the same booking avoids paying for the decontamination and prep stages twice.'
  },

  'ceramic-coating': {
    lead: 'You are mostly paying for preparation. The coating itself is the smallest part of the invoice.',
    body: [
      'Roughly ninety percent of the labour in a coating installation happens before the coating comes out of the bottle. Decontamination, clay, paint depth readings, machine polishing, and a solvent panel wipe to strip every trace of polishing oil. Anything left on the paint at the moment of application is sealed under it for the life of the product, which is why this stage cannot be shortened.',
      'That is also why coating quotes vary so widely between businesses. A quote that undercuts everyone else is usually not including correction, which means the swirl marks currently in your paint are about to become permanent for several years.'
    ],
    factors: [
      'How much paint correction the finish needs first, which is the largest variable by far',
      'Coating tier, from one-year through to ten-year systems',
      'Vehicle size and panel complexity',
      'Whether wheels, glass, trim, and interior surfaces are coated as well',
      'Cure conditions, since controlled indoor space may mean multiple sessions'
    ],
    notIncluded: [
      'Immunity from scratches, which no coating provides',
      'Removal of defects sealed under the coating if correction is declined',
      'Ongoing maintenance washes, though we will tell you exactly how to wash it'
    ],
    value:
      'Divided across its service life, a coating usually costs less per month than repeated sealant applications, and it outperforms them on every day of that period. On a garaged, low-mileage vehicle it is the best value protection we sell.'
  }
};

module.exports = { costs };
