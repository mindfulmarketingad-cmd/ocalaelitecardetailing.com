// Individual service pages. Each entry renders /services/<slug>/ and is
// summarised on the homepage and the /services/ hub.

const services = [
  {
    slug: 'mobile-detailing',
    photo: 'foam',
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
    photo: 'ferrari',
    name: 'Ceramic Coating',
    summary:
      'A semi-permanent liquid glass layer that cross-links to your clear coat and stays there for years. Ceramic coating gives paint a hard, slick, hydrophobic shell that shrugs off love bugs, tree sap, hard water, and the UV load a Florida summer puts on a finish.',
    metaTitle: 'Ceramic Coating in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Professional ceramic coating in Ocala, FL. Multi-stage paint correction, panel prep, and a coating installed to spec for years of gloss, UV defense, and easy washing.',
    h1: 'Ceramic Coating in Ocala, Florida',
    lead:
      'Ceramic coating is the strongest paint protection we install. It bonds to the clear coat rather than sitting on top of it, and once cured it delivers years of gloss, chemical resistance, and water behavior that no wax or sealant can approach.',
    priceFrom: '$999+',
    duration: '1 - 3 days',
    overview: [
      { title: 'Wash', body: 'Thoroughly wash the vehicle to remove dirt, grime, and debris from the exterior.' },
      { title: 'Iron Decontamination', body: 'Apply a specialized iron remover to dissolve iron particles, a common contaminant from brake dust.' },
      { title: 'Clay Bar', body: 'Use a clay bar to decontaminate the paint further, removing embedded particles for a smooth finish.' },
      { title: 'Dry', body: 'Dry the vehicle using microfiber towels or a blower to prevent water spots.' },
      { title: 'Paint Correction (Optional)', body: 'Perform paint correction if needed to remove imperfections such as swirl marks and scratches. Read more about <a href="/services/paint-correction/">paint correction</a>.' },
      { title: 'Surface Prep', body: 'Clean and prepare the paint surface using an alcohol-based solution to ensure proper bonding of the ceramic coating.' },
      {
        title: 'Ceramic Coating Application',
        body: 'Apply the ceramic coating to the paint using an applicator pad. Choose from different protection tiers depending on how long you plan to keep the vehicle:',
        list: [
          '1-Year Protection: basic protection and durability for a year',
          '3-Year Protection: enhanced protection and durability for three years',
          '5-Year Protection: advanced protection and durability for five years',
          '10-Year Protection: advanced protection and durability for ten years'
        ]
      },
      { title: 'Tire And Wheel Coating', body: 'Apply a protective coating to the tires and wheels to enhance their appearance and protect against UV damage and dirt buildup.' },
      { title: 'Final Inspection', body: 'Inspect the vehicle to confirm the ceramic coating has been applied correctly and the detailing process is complete.' }
    ],
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
    photo: 'exteriorBA',
    name: 'Exterior Detailing',
    summary:
      'A complete outside reset. Safe wash technique, iron and tar decontamination, clay treatment, and a protective topper that leaves paint clean to the touch, sharp under light, and defended against the next round of Florida weather.',
    metaTitle: 'Exterior Car Detailing in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Exterior detailing in Ocala, FL. Decontamination wash, clay treatment, wheel and trim restoration, and sealant protection that leaves paint slick and defended.',
    h1: 'Exterior Detailing in Ocala, Florida',
    lead:
      'Exterior detailing is about removing what a normal wash leaves behind. Iron particles, road tar, tree sap, mineral deposits, and bug residue all bond to clear coat and stay there until something is used that is designed to break them loose.',
    priceFrom: '$199+',
    duration: '2 - 4 hours',
    overview: [
      { title: 'Pre-Rinse', body: 'Begin by rinsing the vehicle to remove loose dirt and debris.' },
      { title: 'Foam Bath', body: 'Apply a pH-neutral foam bath to the exterior to loosen dirt and grime without damaging the paint.' },
      { title: 'Hand Wash', body: 'Use a microfiber wash mitt and a high-quality car wash soap to gently hand wash the vehicle, starting from the top and working down, then rinse thoroughly.' },
      { title: 'Clay Bar Treatment (Optional)', body: 'Use a clay bar to remove embedded contaminants from the paint surface, such as tar, bugs, and tree sap, preparing it for polishing or protection.' },
      { title: 'Polishing (Optional)', body: 'Use a dual-action polisher and a quality polish to remove light scratches, swirl marks, and oxidation, restoring shine and color depth. Read more about <a href="/services/paint-correction/">paint correction</a>.' },
      { title: 'Sealant Or Wax (Optional)', body: 'Apply a paint sealant or carnauba wax to protect the paint and enhance its gloss. Sealants last longer; wax gives a warmer, more natural shine. See our <a href="/services/wash-wax/">wash and wax</a> service.' },
      { title: 'Trim And Plastic Restoration', body: 'Use a trim restorer to rejuvenate faded or dull exterior trim and plastic surfaces, such as bumpers and moldings.' },
      { title: 'Glass Cleaning', body: 'Clean the exterior glass surfaces with a glass cleaner and a microfiber cloth to remove dirt, grime, and water spots.' },
      { title: 'Tire And Wheel Cleaning', body: 'Clean the tires and wheels using a dedicated cleaner and a brush, then rinse thoroughly and dry with a microfiber towel.' },
      { title: 'Tire Shining', body: 'Apply a tire shine product to give the tires a glossy finish and protect them from UV rays.' },
      { title: 'Final Inspection', body: 'Inspect the vehicle to confirm every area is clean and shiny, touching up any missed spots.' },
      { title: 'Finishing Touches', body: 'Dress the exterior trim and emblems for a completed, uniform look.' },
      { title: 'Ceramic Coating (Optional)', body: 'Apply a ceramic coating for long-term paint protection and easier maintenance. Read more about <a href="/services/ceramic-coating/">ceramic coating</a>.' }
    ],
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
        a: 'Yes. It is not part of the exterior service, but it can be added to the same appointment or booked on its own as engine detailing, done with controlled low pressure and sensitive components covered, then plastics and hoses dressed.'
      }
    ]
  },
  {
    slug: 'interior-detailing',
    photo: 'interiorBA3',
    gallery: ['interiorBA1', 'interiorBA2'],
    name: 'Interior Detailing',
    summary:
      'Deep cleaning for the cabin you actually live in. Hot water extraction on carpet and cloth, leather cleaned and conditioned, every vent and seam addressed, and odors removed at the source rather than covered with fragrance.',
    metaTitle: 'Interior Car Detailing in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Interior car detailing in Ocala, FL. Hot water extraction, steam cleaning, leather care, and odor removal that treats the source instead of masking it.',
    h1: 'Interior Detailing in Ocala, Florida',
    lead:
      'The cabin takes more abuse than the paint. Sweat, sunscreen, spilled drinks, pet hair, school runs, and job site dust all end up ground into carpet fiber and packed into seams. Interior detailing pulls that back out.',
    priceFrom: '$199+',
    duration: '3 - 6 hours',
    overview: [
      { title: 'Initial Inspection And Vacuuming', body: 'Inspect the interior to identify areas that need special attention, then thoroughly vacuum the seats, carpets, and every crevice to remove dirt and debris.' },
      { title: 'Shampooing And Extraction (Optional)', body: 'Apply a quality shampoo to the carpets, floor mats, and fabric seats, then extract the dirt and shampoo residue, leaving the surfaces clean and fresh.' },
      { title: 'Steam Cleaning', body: 'Use steam to sanitize and deep clean all fabric surfaces, including seats, carpets, and headliners, killing germs and lifting stubborn stains without harsh chemicals.' },
      { title: 'Dashboard, Console, And Door Panels', body: 'Clean and sanitize the dashboard, console, and door panels with appropriate cleaners and brushes, paying special attention to buttons, vents, and small crevices.' },
      { title: 'Leather Conditioning (If Applicable)', body: 'Clean leather seats and surfaces with a gentle leather cleaner, then apply a quality conditioner to keep the leather soft, supple, and protected from cracking.' },
      { title: 'Plastic And Vinyl Cleaning', body: 'Wipe down all plastic and vinyl surfaces, including the dashboard, door panels, and trim, until free of dust, grime, and fingerprints.' },
      { title: 'Window And Mirror Cleaning', body: 'Clean all interior windows and mirrors with a streak-free glass cleaner so the glass is clear and smudge-free.' },
      { title: 'Odor Treatment (Optional)', body: 'Apply an odor neutralizer to eliminate unpleasant smells, using ozone treatment or specialized deodorizers for persistent odors.' },
      { title: 'Final Inspection', body: 'Perform a final inspection to confirm every area is clean and spotless, addressing any missed spots.' },
      { title: 'Optional Add-Ons', body: 'Fabric protection, pet hair removal, and interior coatings are available to extend the results of the package.' }
    ],
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
    photo: 'wash',
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
  },
  {
    slug: 'paint-correction',
    photo: 'correctionBA1',
    gallery: ['correctionBA2'],
    name: 'Paint Correction',
    summary:
      'Machine polishing that removes swirl marks, wash marring, oxidation, and light scratches from the clear coat itself, rather than covering them up. The step that turns a clean car into one with real depth and gloss.',
    metaTitle: 'Paint Correction in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Professional paint correction in Ocala, FL. Machine polishing removes swirl marks, oxidation, and light scratches from clear coat, restoring true gloss before sealant or ceramic coating.',
    h1: 'Paint Correction in Ocala, Florida',
    lead:
      'Washing removes dirt. Correction removes damage. Machine polishing levels the clear coat itself, cutting away the swirl marks, wash marring, and oxidation that years of washing and Florida sun leave behind, and brings back the depth and reflection the paint had when it was new.',
    priceFrom: '$399',
    duration: '1 - 2 days',
    sections: [
      {
        h2: 'What Correction Actually Removes',
        body: [
          'Every visible defect in a clear coat is either contamination sitting on the surface or damage inside the surface. A wash and decontamination handles the first category. Correction is the only thing that addresses the second, because swirl marks, holograms, wash-induced scratches, and UV oxidation are not on the paint, they are cut into it.',
          'Run a bright light across a car that has been washed for a few years without correction and the defects show up as a fine spider-web pattern across every panel. That pattern is what scatters light instead of reflecting it cleanly, which is why a car can be spotless and still look dull.'
        ]
      },
      {
        h2: 'One-Step Versus Multi-Stage Correction',
        body: [
          'Not every vehicle needs the same amount of work, and paint depth readings taken before we start tell us how much clear coat is actually available to work with.'
        ],
        list: [
          'One-step polish: removes light swirling and restores gloss on a daily driver in reasonably good condition',
          'Two-stage correction: a cutting compound removes deeper marring, followed by a finishing polish to refine clarity',
          'Multi-stage correction: heavier compounding on severely oxidized or neglected paint, stepped down through finer polishes until the finish is level',
          'Spot correction: targeted work on specific panels rather than the whole vehicle, priced accordingly'
        ]
      },
      {
        h2: 'The Correction Process',
        list: [
          'Full decontamination wash, iron fallout removal, and clay treatment before any machine work begins',
          'Paint depth readings across every panel to confirm how much clear coat is safe to remove',
          'Test section polished first and inspected under dedicated lighting to set the correct pad and compound',
          'Machine polishing worked panel by panel, checked continuously under LED and sunlight',
          'Panels wiped with a dedicated solvent between stages to reveal true progress, not compound haze',
          'Finished paint sealed the same day, since bare corrected clear coat has no protection of its own'
        ]
      },
      {
        h2: 'Correction Is A Prerequisite, Not An Add-On',
        body: [
          'Sealant, spray coatings, and ceramic coatings all lock in whatever is underneath them at the moment of application. Coating over uncorrected paint seals every swirl and scratch in place for the life of the product, which is why we will not install a ceramic coating over paint we have not inspected first.',
          'If you are planning on ceramic coating and the paint needs correction, we quote both together. If the paint is already in good condition, correction may not be needed at all, and we will tell you that rather than sell you a stage you do not need.'
        ]
      }
    ],
    faqs: [
      {
        q: 'Will correction remove all my scratches?',
        a: 'It removes what is safely within the clear coat, which covers the large majority of swirl marks, wash marring, and light scratches. A scratch deep enough to catch a fingernail has usually gone through the clear coat and needs touch-up or repaint, not polishing.'
      },
      {
        q: 'Does correction remove clear coat?',
        a: 'Yes, a small, controlled amount. That is why we take paint depth readings before starting and stop at whatever level is safe for that specific panel, rather than polishing every car the same way.'
      },
      {
        q: 'Do I need ceramic coating after correction?',
        a: 'Not necessarily. Correction is often finished with a sealant instead. Coating is worth adding if you want the result to last years rather than months, but it is a separate decision with its own cost.'
      },
      {
        q: 'How long does paint correction take?',
        a: 'A one-step polish on a single vehicle usually runs one full day. Multi-stage correction on heavily marred or oxidized paint can take two days, which we confirm after inspecting the finish.'
      },
      {
        q: 'Can this be done at my house?',
        a: 'Machine polishing needs a shaded, low-dust area with steady power, which a garage or covered carport usually provides. Full multi-stage work is sometimes better scheduled at a controlled location, which we arrange when we quote the job.'
      }
    ]
  },
  {
    slug: 'wash-wax',
    photo: 'tesla',
    name: 'Wash & Wax',
    summary:
      'A proper hand wash finished with a real coat of wax. No decontamination, no correction, just the maintenance service that keeps a healthy finish looking sharp between full details.',
    metaTitle: 'Wash and Wax in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Mobile wash and wax in Ocala, FL. A gentle hand wash followed by a quality carnauba wax for a glossy, protected finish, starting at $199.',
    h1: 'Wash & Wax in Ocala, Florida',
    lead:
      'Not every visit needs to be a full detail. Wash and wax is the maintenance service: a careful hand wash to lift surface dirt safely, followed by a real coat of wax for shine and short-term protection.',
    priceFrom: '$199',
    duration: '1 - 2 hours',
    overview: [
      { title: 'Pre-Cleaning Inspection', body: 'We inspect the vehicle for any visible dirt, grime, or damage that needs special attention, and note any specific areas you want us to focus on.' },
      { title: 'Exterior Washing', body: 'We wash the exterior using a gentle yet effective car shampoo, with microfiber wash mitts or soft brushes to avoid scratching the paint.' },
      { title: 'Rinsing', body: 'The vehicle is thoroughly rinsed to remove all soap residue and loosened dirt.' },
      { title: 'Drying', body: 'We dry the vehicle with soft, absorbent towels, making sure no water spots are left behind.' },
      { title: 'Tire And Wheel Cleaning', body: 'We use a specialized cleaner and brushes to clean the tires and wheels, removing brake dust, dirt, and grime.' },
      { title: 'Tire Shining', body: 'A tire shine product is applied for a glossy, like-new appearance.' },
      { title: 'Waxing', body: 'Once the vehicle is dry, a quality car wax is applied by hand or buffed to a smooth finish, giving the paint a protective layer against contaminants and UV rays that typically holds for three to twelve months.' },
      { title: 'Final Inspection', body: 'We perform a final inspection to confirm the vehicle meets our standard for cleanliness and shine.' }
    ],
    sections: [
      {
        h2: 'Maintenance, Not A Full Reset',
        body: [
          'Wash and wax is built for a vehicle that is already in reasonably good condition and just needs to stay that way. It is not a substitute for <a href="/services/exterior-detailing/">exterior detailing</a> on a neglected finish, and it will not remove bonded contamination the way a decontamination wash does, or level clear coat the way <a href="/services/paint-correction/">paint correction</a> does.',
          'What it does well is keep a healthy finish looking sharp between those bigger services, at a price and time commitment that fits a monthly or bi-weekly schedule.'
        ]
      },
      {
        h2: 'When To Upgrade',
        body: [
          'If the paint feels rough to the touch after a wash, or has gone six months or more without decontamination, wax will not fix that; book exterior detailing instead. If you want protection measured in years rather than months, <a href="/services/ceramic-coating/">ceramic coating</a> is the better investment. We will tell you honestly which service the vehicle actually needs when we arrive.'
        ]
      }
    ],
    faqs: [
      {
        q: 'How is this different from exterior detailing?',
        a: 'Exterior detailing includes chemical and clay decontamination before any protection goes on. Wash and wax skips that step, so it is faster and less expensive, but it will not remove bonded contamination or restore a neglected finish.'
      },
      {
        q: 'How long does the wax last?',
        a: 'A quality carnauba wax typically holds three to six weeks in Florida conditions, up to a few months on a garage-kept vehicle. For longer protection, ask about a sealant or ceramic coating instead.'
      },
      {
        q: 'Can I book this on a recurring schedule?',
        a: 'Yes. Many customers keep a vehicle looking sharp with wash and wax every two to four weeks. Set your preferred cadence in the booking notes and we will confirm a recurring slot.'
      }
    ]
  },
  {
    slug: 'engine-detailing',
    photo: 'wash',
    name: 'Engine Detailing',
    summary:
      'A careful clean of the engine bay, with sensitive electronics covered and controlled low pressure throughout. Degreased, detailed, and conditioned so hoses and plastics look right and stay protected.',
    metaTitle: 'Engine Bay Detailing in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Engine bay detailing in Ocala, FL. Sensitive components covered, degreased and agitated by hand, then dressed and conditioned. Starting at $169.99, done at your address.',
    h1: 'Engine Detailing in Ocala, Florida',
    lead:
      'The engine bay is the part of the vehicle most owners never clean and every buyer opens. Done properly it is a careful, low-pressure process with the electronics protected the whole way through, not a pressure washer pointed at an open hood.',
    priceFrom: '$169.99',
    duration: '1 - 2 hours',
    overview: [
      { title: 'Pre-Clean Inspection', body: 'We start with a thorough inspection of your engine to identify any potential issues or areas that need special attention.' },
      { title: 'Protective Measures', body: 'Essential electrical components and other sensitive areas are covered to prevent any damage during the cleaning process.' },
      { title: 'Degreasing', body: 'A high-quality degreaser is applied to break down grease, grime, and oil buildup on the engine surfaces.' },
      { title: 'Agitation', body: 'Stubborn dirt and debris are loosened using brushes to ensure a deep clean in all the nooks and crannies.' },
      { title: 'Rinse', body: 'The engine is carefully rinsed to remove all traces of the degreaser and dirt, ensuring a clean surface.' },
      { title: 'Drying (Optional)', body: 'We use air compressors and microfiber towels to dry the engine, preventing any water spots or potential rust.' },
      { title: 'Detailing', body: 'All visible surfaces, including hoses, plastic covers, and metal parts, are detailed to give your engine a polished look.' },
      { title: 'Conditioning', body: 'Rubber and plastic components are conditioned to restore their appearance and protect against cracking or fading.' },
      { title: 'Final Inspection', body: 'A final inspection is conducted to ensure every part of the engine bay is thoroughly cleaned and detailed to perfection.' }
    ],
    sections: [
      {
        h2: 'Why The Engine Bay Is Worth Cleaning',
        body: [
          'Two reasons account for almost every engine detail we book. The first is resale: a buyer who opens the hood on a clean, dressed bay reads the whole vehicle as well maintained, and that impression is worth real money on a private sale or a trade-in appraisal.',
          'The second is maintenance visibility. Grease and road film hide leaks. A clean bay means a weeping gasket, a seeping hose, or a fresh oil drip shows up immediately instead of six months later, when it has become a bigger repair.'
        ]
      },
      {
        h2: 'Done Carefully, Not Quickly',
        body: [
          'Engine bays are where careless detailing does expensive damage. Alternators, fuse boxes, intakes, coil packs, and exposed connectors do not tolerate a pressure washer, and a bay soaked without covering them can produce a no-start or an intermittent electrical fault days later.',
          'Everything sensitive is covered before any liquid is used, pressure stays low and controlled, and the bay is dried rather than left to air dry. If we see something on the pre-clean inspection that makes wet cleaning a bad idea on your vehicle, we will say so and offer a dry detail instead.'
        ]
      },
      {
        h2: 'Booking It With Other Work',
        body: [
          'Engine detailing is already included in the <a href="/services/full-package/">full package</a>. Booked on its own it pairs naturally with <a href="/services/exterior-detailing/">exterior detailing</a>, since the vehicle is already being washed and the bay adds about an hour to the appointment.'
        ]
      }
    ],
    faqs: [
      {
        q: 'Is it safe to clean an engine bay with water?',
        a: 'Yes, when it is done correctly. Sensitive components are covered first, pressure is kept low and controlled, and the bay is dried afterwards rather than left wet. The damage people worry about comes from pressure washers and uncovered electronics, neither of which we use.'
      },
      {
        q: 'Will this fix an oil leak or a burning smell?',
        a: 'No. Detailing cleans; it does not repair. What it does do is make an existing leak visible, since fresh fluid shows up immediately on clean surfaces. If we spot something during the inspection we will point it out so you can have it looked at.'
      },
      {
        q: 'Do you clean engine bays on older or high-mileage vehicles?',
        a: 'Usually yes, and they often benefit the most. On a very old vehicle with brittle wiring insulation or previous makeshift repairs we may recommend a dry detail instead, which we will discuss before starting.'
      },
      {
        q: 'Is engine detailing included in other services?',
        a: 'It is part of the full package. Exterior and interior detailing do not include it, so it is booked as its own service or added to an appointment.'
      }
    ]
  },
  {
    slug: 'headlight-restoration',
    photo: 'banner',
    name: 'Headlight Restoration',
    summary:
      'Wet sanding and polishing that cuts away the oxidized outer layer of a yellowed headlight lens, then seals it against UV so it stays clear. Restores night-time output as much as it restores appearance.',
    metaTitle: 'Headlight Restoration in Ocala FL | Ocala Elite Car Detailing',
    metaDescription:
      'Headlight restoration in Ocala, FL. Multi-stage wet sanding, polishing, and a UV sealant that keeps lenses clear instead of yellowing again in months. From $179.99.',
    h1: 'Headlight Restoration in Ocala, Florida',
    lead:
      'Cloudy headlights are ultraviolet damage to the outer surface of the lens, and Florida produces them faster than almost anywhere. Restoration removes that damaged layer and seals what is underneath, which is why it lasts where a wipe-on kit does not.',
    priceFrom: '$179.99',
    duration: '1 - 2 hours',
    overview: [
      { title: 'Inspection', body: 'We start by thoroughly inspecting the condition of your headlights to assess the level of oxidation and damage.' },
      { title: 'Cleaning', body: 'The headlights are cleaned to remove any surface dirt and debris, ensuring a smooth restoration process.' },
      { title: 'Sanding', body: 'Multiple stages of wet sanding are performed to remove the damaged outer layer of the headlight lens, eliminating oxidation and surface imperfections.' },
      { title: 'Polishing', body: 'A special polishing compound is applied to restore the clarity and smoothness of the headlight lens, bringing back its transparency.' },
      { title: 'UV Protection Sealant', body: 'A high-quality UV sealant is applied to protect the headlights from future oxidation and yellowing, ensuring long-lasting results.' },
      { title: 'Final Inspection', body: 'We conduct a final inspection to ensure the headlights are fully restored to their optimal clarity and brightness.' }
    ],
    sections: [
      {
        h2: 'This Is A Safety Repair, Not Just Cosmetic',
        body: [
          'A heavily oxidized lens scatters light instead of projecting it. The bulb is working exactly as hard as it always did, but a meaningful share of that output never reaches the road, which shortens how far ahead you can see at night and how early an oncoming driver picks you out.',
          'Restoring clarity puts that output back without touching the bulb or the wiring. On a vehicle that has gone yellow over several Florida summers, the difference on a dark road is immediately obvious.'
        ]
      },
      {
        h2: 'Why The Sealant Is The Whole Job',
        body: [
          'Every headlight leaves the factory with a UV-resistant hard coat on the outside of the lens. What people call yellowing is that coating breaking down under ultraviolet exposure. Sanding removes the failed coating along with the damage in it, and polishing brings the polycarbonate underneath back to clarity.',
          'At that point the lens is clear but completely unprotected, and bare polycarbonate will yellow again fast in this climate. Applying a proper UV sealant is what turns a result that lasts years into one that lasts a season. This is exactly why drugstore restoration kits disappoint: most of them polish and stop.'
        ]
      },
      {
        h2: 'What It Will Not Fix',
        body: [
          'Restoration works on the outside surface of the lens. It does not address moisture or condensation trapped inside the housing, internal reflector failure where the mirrored coating has flaked, cracks through the lens, or a lens that has gone hazy on the inner surface. Those need the housing replaced.',
          'We check for all of that during the inspection and will tell you before starting if restoration is not the right answer, rather than taking the booking and handing back a disappointing result.'
        ]
      }
    ],
    faqs: [
      {
        q: 'How long does headlight restoration last?',
        a: 'With the UV sealant applied, expect two to four years in Central Florida conditions before clarity starts to soften again, longer on a garage-kept vehicle. Without a sealant, a polished lens can begin yellowing within months, which is why we never skip that step.'
      },
      {
        q: 'Is this better than a kit from the auto parts store?',
        a: 'The sanding and polishing stages are broadly similar. The difference is the sealant: most consumer kits finish with a wipe-on protectant that wears off quickly, so the lens yellows again in a matter of months. The durable result comes from what goes on last.'
      },
      {
        q: 'Can you fix headlights that are foggy on the inside?',
        a: 'No. Condensation, internal reflector failure, and inner-surface hazing are inside a sealed housing, and restoration only works on the outer lens. We will identify that at inspection and tell you the housing needs replacing instead.'
      },
      {
        q: 'Do you restore tail lights and fog lights too?',
        a: 'Yes. They oxidize the same way and are restored with the same process. Mention them in the booking notes and we will include them in the quote.'
      }
    ]
  }
];

module.exports = { services };
