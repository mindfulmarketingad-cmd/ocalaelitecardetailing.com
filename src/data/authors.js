// Blog authors, rendered at /author/<slug>/.
//
// These are real detailers named in genuine customer reviews supplied by the
// business owner. The bios below deliberately contain NO invented credentials,
// years of experience, certifications, or personal history, because none of
// that was supplied and fabricating it would mislead readers.
//
// Everything stated here is drawn from what the business itself publishes:
// where they work, the process standard every operator is held to, and the
// subjects each one writes about on this site. If real background becomes
// available, extend `bio` rather than replacing this note.

const authors = [
  {
    slug: 'jay',
    name: 'Jay',
    role: 'Detailer, interiors and vehicle preparation',
    summary:
      'Writes on interior work, cabin odour and moisture, and how to get the most out of a booked appointment.',
    bio: [
      'Jay details vehicles for Ocala Elite Car Detailing across Ocala and Marion County. Customers have singled him out by name for turning up on time and working through a vehicle detail by detail rather than rushing the finish.',
      'Like every operator we dispatch, he works to the same non-negotiable process: wheels first with dedicated tools, decontamination before any protection goes down, extraction rather than surface cleaning on carpet and upholstery, and a final inspection under proper lighting before the keys go back.',
      'On this site he writes mostly about interiors, which is where the gap between a vehicle that looks clean and one that is clean shows up most clearly, and about what customers can do before an appointment to get a better result from it.'
    ]
  },
  {
    slug: 'matt',
    name: 'Matt',
    role: 'Detailer, paint and protection',
    summary:
      'Writes on paint protection, correction, and what Florida sun and love bug season do to a finish.',
    bio: [
      'Matt details vehicles for Ocala Elite Car Detailing across Ocala and Marion County. He and Ivan have been named together in customer reviews for the way they work through a vehicle as a pair.',
      'His work centres on the exterior: decontamination, machine polishing, and the protection stage that decides how long any of it lasts. That means paint depth readings before correction rather than polishing every vehicle the same way, and refusing to install a coating over defects that would then be sealed in for years.',
      'What he writes here reflects that. Ceramic coating against wax, why love bug residue etches clear coat within days in Florida heat, and why a maintenance schedule written for a milder climate falls behind fast in Marion County.'
    ]
  },
  {
    slug: 'ivan',
    name: 'Ivan',
    role: 'Detailer, mobile operations',
    summary:
      'Writes on how mobile appointments actually run, what is included in a package, and what drives pricing.',
    bio: [
      'Ivan details vehicles for Ocala Elite Car Detailing across Ocala and Marion County, working alongside Matt on the vehicles customers have written in about.',
      'Because every job we dispatch happens at the customer address rather than in a shop, a large part of the work is logistics: arriving self-contained with water and power, containing runoff so a driveway is left as it was found, and working around gated communities, apartment parking, and Central Florida afternoon storms.',
      'He writes about the parts of detailing customers ask about most before booking. What a package does and does not include, whether engine bays are covered, and why quotes for the same words vary so widely between businesses.'
    ]
  }
];

module.exports = { authors };
