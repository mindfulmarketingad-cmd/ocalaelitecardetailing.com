// Individual service pages. Each entry renders /services/<slug>/ and is
// summarised on the homepage and the /services/ hub.

const services = [
  {
    slug: 'mobile-detailing',
    photo: 'wash',
    name: 'Mobile Detailing',
    // Used as the H3 blurb on the homepage and the card copy on the hub page.
    summary:
      'We bring the whole operation to your driveway, office lot, or job site. Power, water, and every product travel with the truck, so your vehicle is restored where it already sits and you never give up an afternoon to a waiting room.',
    metaTitle: 'Mobile Car Detailing in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Mobile car detailing in Ocala, FL. We arrive fully self-contained with water and power, detail your vehicle at home or at work, and hand it back the same day.',
    h1: 'Mobile Detailing in Ocala, Florida',
    lead:
      'Detailing that comes to you. Our mobile units carry their own water supply, generator, extraction equipment, and full chemical inventory, which means the work happens in your driveway on your schedule instead of in a shop queue.',
    priceFrom: '$149',
    duration: '2 - 5 hours',
    sections: [
      {
        h2: 'What Mobile Detailing Actually Involves',
        body: [
          'A mobile appointment is not a stripped-down version of shop work. The same decontamination chemistry, the same extraction machines, and the same finishing products come off the truck that would come off a shelf in a fixed bay. What changes is the logistics: we stage the vehicle where you park it, run off our own tank and generator, and contain the runoff so your driveway is left the way we found it.',
          'Most drivers in Marion County lose half a Saturday to a detailing appointment once you count the drop-off, the wait, and the return trip. Mobile service removes all three. You hand over the keys, we work through the package, and the vehicle is finished in the same spot it started.'
        ]
      },
      {
        h2: 'What Is Included',
        list: [
          'Pre-rinse and pH-neutral foam bath to lift road film before any contact',
          'Two-bucket contact wash with grit guards and fresh microfiber media',
          'Wheel faces, barrels, and wheel wells cleaned with dedicated tools',
          'Chemical decontamination for iron fallout and road tar',
          'Door jambs, fuel door, and trunk shuts wiped down',
          'Glass cleaned inside and out, streak-checked in direct light',
          'Interior vacuum, hard-surface clean, and dressing on plastics and vinyl',
          'Tire dressing and exterior trim restoration',
          'Spray sealant or wax topper for four to twelve weeks of protection'
        ]
      },
      {
        h2: 'What We Need From You',
        body: [
          'A standard driveway, parking pad, or office lot space wide enough to open every door is enough room. We are fully self-contained, so a water spigot and an outdoor outlet are helpful but not required. If you are booking at an apartment complex or gated community, tell us in the booking notes so we can confirm access before the appointment.',
          'Move personal items out of the cabin and trunk ahead of time if you want the full benefit of an interior pass. We work around car seats and cargo when we have to, but an empty vehicle always finishes better.'
        ]
      }
    ],
    faqs: [
      {
        q: 'Do you need access to my water and electricity?',
        a: 'No. Every mobile unit carries a water tank, a pressure system, and a generator. If a spigot and outlet are available we are happy to use them, but the appointment goes ahead either way.'
      },
      {
        q: 'How far outside Ocala will you travel?',
        a: 'We cover Ocala and the surrounding Marion County communities, including Belleview, Silver Springs, Dunnellon, Summerfield, Marion Oaks, and The Villages. Longer runs are quoted case by case at the time of booking.'
      },
      {
        q: 'What happens if it rains on my appointment day?',
        a: 'Central Florida afternoon storms are a fact of life. If weather makes the work unsafe or compromises the finish, we reschedule at no charge. Covered parking, a carport, or a garage bay lets most appointments continue as planned.'
      }
    ]
  },
  {
    slug: 'ceramic-coating',
    photo: 'hero',
    name: 'Ceramic Coating',
    summary:
      'A semi-permanent liquid glass layer that cross-links to your clear coat and stays there for years. Ceramic coating gives paint a hard, slick, hydrophobic shell that shrugs off love bugs, tree sap, hard water, and the UV load a Florida summer puts on a finish.',
    metaTitle: 'Ceramic Coating in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Professional ceramic coating in Ocala, FL. Multi-stage paint correction, panel prep, and a coating installed to spec for years of gloss, UV defense, and easy washing.',
    h1: 'Ceramic Coating in Ocala, Florida',
    lead:
      'Ceramic coating is the strongest paint protection we install. It bonds to the clear coat rather than sitting on top of it, and once cured it delivers years of gloss, chemical resistance, and water behavior that no wax or sealant can approach.',
    priceFrom: '$699',
    duration: '1 - 3 days',
    sections: [
      {
        h2: 'Why Coating Beats Wax In This Climate',
        body: [
          'Carnauba wax gives up under Florida conditions in a matter of weeks. Ultraviolet load, afternoon storms, sprinkler overspray full of dissolved minerals, and two annual love bug hatches all attack a soft sacrificial layer faster than most owners expect. A ceramic coating is a different material class: it cures into a hard, chemically stable film with far higher resistance to acids, alkalis, and heat.',
          'The practical effect is that contamination sits on the surface instead of etching into it. Bug splatter that would eat into unprotected clear coat within a day rinses off a coated panel. Water sheets off rather than sitting in flat spots and baking mineral rings into the finish.'
        ]
      },
      {
        h2: 'The Installation Process',
        body: [
          'Coating is ninety percent preparation. Anything left on the paint at the moment of application gets locked under the coating for its entire service life, so the prep stage is where the real work happens.'
        ],
        list: [
          'Full decontamination wash, iron fallout removal, and tar dissolution',
          'Mechanical decontamination with clay to pull embedded particles',
          'Paint depth readings and inspection under multiple light sources',
          'Machine polishing to remove swirls, wash marring, and oxidation',
          'Panel wipe with a dedicated solvent to strip polishing oils',
          'Coating applied panel by panel in a controlled environment and levelled by hand',
          'Infrared or ambient cure, followed by a final inspection pass'
        ]
      },
      {
        h2: 'Coating Tiers And Service Life',
        body: [
          'We install multi-year consumer and professional grade coatings. Which tier makes sense depends on how the vehicle is stored, how many miles it sees, and whether you want a single-layer gloss upgrade or a hard, thick, multi-layer system. We give you the honest version of that conversation before you commit, including the cases where a sealant is the better value.',
          'Every coating we install comes with written maintenance instructions. Coatings do not eliminate washing; they make washing dramatically easier and far less likely to damage the paint. Vehicles washed with dish soap or run through a brush tunnel will lose performance early regardless of the product installed.'
        ]
      }
    ],
    faqs: [
      {
        q: 'How long does a ceramic coating last?',
        a: 'Depending on the tier installed and how the vehicle is maintained, expect two to five years of real performance. Garage-kept vehicles washed correctly sit at the top of that range; daily drivers parked outside sit toward the bottom.'
      },
      {
        q: 'Does a coating mean I never have to wash the car?',
        a: 'No. A coating changes how dirt bonds to the surface so washing is faster, safer, and less frequent. It does not make the vehicle self-cleaning, and neglect will still dull the finish.'
      },
      {
        q: 'Do you have to correct the paint first?',
        a: 'In almost every case, yes. Coating over swirls and oxidation permanently seals those defects in. We inspect the paint before quoting and tell you exactly how much correction the finish needs.'
      },
      {
        q: 'Can a coating be installed at my house?',
        a: 'Partial-day coating work can be done on site when there is covered, low-dust space such as a garage. Full correction and coating packages usually run better over multiple sessions with controlled conditions, which we arrange when you book.'
      }
    ]
  },
  {
    slug: 'exterior-detailing',
    photo: 'wheel',
    name: 'Exterior Detailing',
    summary:
      'A complete outside reset. Safe wash technique, iron and tar decontamination, clay treatment, and a protective topper that leaves paint clean to the touch, sharp under light, and defended against the next round of Florida weather.',
    metaTitle: 'Exterior Car Detailing in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Exterior detailing in Ocala, FL. Decontamination wash, clay treatment, wheel and trim restoration, and sealant protection that leaves paint slick and defended.',
    h1: 'Exterior Detailing in Ocala, Florida',
    lead:
      'Exterior detailing is about removing what a normal wash leaves behind. Iron particles, road tar, tree sap, mineral deposits, and bug residue all bond to clear coat and stay there until something is used that is designed to break them loose.',
    priceFrom: '$179',
    duration: '2 - 4 hours',
    sections: [
      {
        h2: 'Beyond A Wash',
        body: [
          'Run a hand across a washed panel and you will usually still feel grit. That texture is bonded contamination: brake dust that has embedded itself in the clear coat, industrial fallout, overspray, and organic material that soap alone cannot lift. Left in place it dulls the finish, blocks sealants from bonding, and eventually etches.',
          'Our exterior service works through those layers in order. Chemical decontamination dissolves iron and tar. Mechanical decontamination with clay shears off what chemistry cannot reach. Only then does protection go down, which is the reason a properly prepped sealant lasts several times longer than one applied over a dirty surface.'
        ]
      },
      {
        h2: 'The Exterior Sequence',
        list: [
          'Wheels, barrels, tires, and wheel wells cleaned first with dedicated chemistry',
          'Pre-soak foam bath to soften and lift road film',
          'Two-bucket contact wash with pH-neutral soap and clean media',
          'Iron fallout remover and tar solvent applied and rinsed',
          'Clay treatment across paint and glass with fresh lubricant',
          'Forced-air and microfiber drying to avoid drag marks',
          'Sealant or spray coating applied and levelled',
          'Trim dressing, tire dressing, and exhaust tip polish',
          'Glass sealed and streak-checked in direct light'
        ]
      },
      {
        h2: 'Paint Correction As An Add-On',
        body: [
          'Exterior detailing cleans and protects. It does not remove swirl marks, wash scratches, or oxidation, because those are defects in the clear coat itself and only machine polishing removes them. If the finish looks hazy or shows spider-webbing under sunlight, we will tell you at the appointment and quote a single-stage or multi-stage correction separately.',
          'For a lot of daily drivers a one-step polish is the highest-value upgrade on the menu. It clears most of the light marring, restores real depth, and costs a fraction of a full correction.'
        ]
      }
    ],
    faqs: [
      {
        q: 'Will exterior detailing remove scratches?',
        a: 'It removes surface contamination and dramatically improves clarity, but scratches you can feel with a fingernail are in the clear coat and need machine polishing. We quote correction separately once we have inspected the paint.'
      },
      {
        q: 'How long will the protection last?',
        a: 'A properly prepped sealant typically holds four to six months in Central Florida conditions. A spray coating upgrade extends that. Ceramic coating is the multi-year answer.'
      },
      {
        q: 'Do you clean engine bays?',
        a: 'Yes, as an add-on. Engine bay cleaning is done with controlled low pressure and sensitive components covered, then plastics and hoses are dressed.'
      }
    ]
  },
  {
    slug: 'interior-detailing',
    photo: 'finished',
    name: 'Interior Detailing',
    summary:
      'Deep cleaning for the cabin you actually live in. Hot water extraction on carpet and cloth, leather cleaned and conditioned, every vent and seam addressed, and odors removed at the source rather than covered with fragrance.',
    metaTitle: 'Interior Car Detailing in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Interior car detailing in Ocala, FL. Hot water extraction, steam cleaning, leather care, and odor removal that treats the source instead of masking it.',
    h1: 'Interior Detailing in Ocala, Florida',
    lead:
      'The cabin takes more abuse than the paint. Sweat, sunscreen, spilled drinks, pet hair, school runs, and job site dust all end up ground into carpet fiber and packed into seams. Interior detailing pulls that back out.',
    priceFrom: '$169',
    duration: '3 - 6 hours',
    sections: [
      {
        h2: 'Cleaning At The Source',
        body: [
          'Most interior products are designed to make a surface look clean for a week. Ours are designed to remove what is actually there. Hot water extraction flushes carpet and cloth upholstery and pulls the dissolved soil back out instead of pushing it deeper. Steam breaks down grease and biofilm in vents, cup holders, seat rails, and switch gear without saturating electronics.',
          'Odor gets the same treatment. Air fresheners mask; enzymatic treatment and ozone or hydroxyl processing break down the organic material responsible for the smell. If a vehicle has a milk spill, a pet accident, or a smoke history, that source has to go before anything else will hold.'
        ]
      },
      {
        h2: 'The Interior Sequence',
        list: [
          'Complete removal of trash and personal items, staged and returned',
          'Floor mats pulled, cleaned, and dried separately',
          'Full vacuum including under seats, seat rails, and the cargo area',
          'Pet hair extraction with rubber tools and specialty brushes',
          'Hot water extraction on carpet and cloth seating',
          'Leather cleaned with pH-appropriate chemistry and conditioned',
          'Steam cleaning of vents, seams, consoles, and door pockets',
          'Dash, door cards, and trim cleaned and finished with a UV protectant',
          'Interior glass cleaned and haze removed',
          'Headliner spot-treated where safe'
        ]
      },
      {
        h2: 'Drying Time And Aftercare',
        body: [
          'Extraction puts moisture into fabric and it has to come back out. We use forced air to speed that along, but plan on a few hours with windows cracked in a dry space before the cabin is fully back to normal. In humid weather that window is longer, which is one reason we prefer morning appointments for heavy interior work.',
          'We finish plastics and vinyl with a matte UV protectant rather than a glossy dressing. Glare on a dashboard is a safety problem, and high-shine silicone products attract dust and go streaky in Florida heat.'
        ]
      }
    ],
    faqs: [
      {
        q: 'Can you get pet hair out of carpet?',
        a: 'Yes. Pet hair woven into carpet fiber needs rubber tools and mechanical agitation before vacuuming, which is standard in our interior service. Extreme cases are quoted with additional labor.'
      },
      {
        q: 'Do you remove cigarette smoke odor?',
        a: 'In most cases. Smoke permeates the headliner, cabin filter, and ventilation system, so treatment includes source cleaning plus an ozone or hydroxyl cycle. Severe long-term smoke damage is quoted after inspection.'
      },
      {
        q: 'Will extraction damage my seats?',
        a: 'No. Extraction is used on carpet and cloth upholstery with controlled moisture and immediate recovery. Leather is cleaned with dedicated chemistry, never flooded.'
      }
    ]
  },
  {
    slug: 'full-package',
    photo: 'hero',
    name: 'Full Package',
    summary:
      'Inside and outside, taken to the same standard in one appointment. Full decontamination and protection on the exterior, extraction and conditioning on the interior, and a finished vehicle that presents like it just came off a showroom floor.',
    metaTitle: 'Full Detail Package in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'The full detailing package in Ocala, FL. Complete exterior decontamination and protection plus full interior extraction and conditioning in one appointment.',
    h1: 'Full Detail Package in Ocala, Florida',
    lead:
      'The full package is our complete service: everything in the exterior detail and everything in the interior detail, executed in a single appointment so the vehicle comes back to you finished on every surface.',
    priceFrom: '$299',
    duration: '5 - 8 hours',
    sections: [
      {
        h2: 'Who The Full Package Is For',
        body: [
          'Three situations account for most of our full package bookings. The first is a vehicle going up for sale or coming off a lease, where the return on a complete detail is measured directly in the sale price or in avoided reconditioning charges. The second is a vehicle that has gone a year or more without a real detail and needs a reset rather than maintenance. The third is a newly purchased used vehicle whose previous owner is still, in a sense, in the cabin.',
          'If your vehicle is on a regular maintenance schedule with us, you generally do not need the full package every visit. We will say so rather than upselling you into it.'
        ]
      },
      {
        h2: 'What Is Included',
        list: [
          'Everything in the exterior detail: decontamination wash, iron and tar removal, clay treatment, sealant protection, wheels, tires, and trim',
          'Everything in the interior detail: extraction, steam cleaning, leather care, UV protection, and glass',
          'Door jambs, trunk shuts, and fuel door cleaned and dressed',
          'Engine bay cleaned and dressed',
          'Odor neutralization pass',
          'Final inspection under dedicated lighting before handover'
        ]
      },
      {
        h2: 'Scheduling A Full Day',
        body: [
          'A full package is a full working day on most vehicles. We book one per crew per day so nothing gets rushed at the end, and we start early to give the interior maximum drying time before handover. Larger SUVs, three-row vehicles, and heavily soiled cabins take longer and are priced accordingly.',
          'If the vehicle also needs paint correction or ceramic coating, that work is scheduled as a separate stage rather than compressed into the same day. Correction done under time pressure is how paint gets damaged.'
        ]
      }
    ],
    faqs: [
      {
        q: 'How long does the full package take?',
        a: 'Plan on five to eight hours for most vehicles. Large SUVs, trucks, and heavily soiled interiors run longer, and we confirm the realistic window when we quote.'
      },
      {
        q: 'Is paint correction included?',
        a: 'No. The full package cleans, decontaminates, and protects. Machine polishing to remove swirls and oxidation is a separate service, quoted after we inspect the finish.'
      },
      {
        q: 'Can the full package be done at my home?',
        a: 'Yes. It is a mobile appointment like any other; it simply occupies most of the day. We need enough room to open all doors and work around the vehicle.'
      }
    ]
  }
];

module.exports = { services };
