// Blog posts. Each entry renders /blog/<slug>/ and is listed on the /blog/ hub.
// `body` is an ordered list of blocks: {h2}, {p}, {list}, {quote}.

const posts = [
  {
    slug: 'how-often-should-you-detail-your-car-in-florida',
    title: 'How Often Should You Detail Your Car in Florida?',
    metaTitle: 'How Often Should You Detail Your Car in Florida? | Ocala Elite Car Detailing',
    metaDescription:
      'Florida sun, humidity, love bugs, and hard water shorten the life of any finish. Here is a realistic detailing schedule for vehicles driven in Ocala and Marion County.',
    excerpt:
      'Northern detailing schedules do not survive a Central Florida summer. Here is what an honest maintenance interval looks like for a vehicle that lives in Ocala.',
    date: '2026-03-04',
    readTime: '7 min read',
    category: 'Maintenance',
    photo: 'wash',
    body: [
      { p: 'Every detailing guide written for a temperate climate says the same thing: detail your car twice a year. That advice is fine in Ohio. In Marion County it is close to useless. A vehicle parked outside in Ocala absorbs more ultraviolet energy in one August than a garage-kept car in the Midwest sees in three years, and that is before you account for humidity, sprinkler overspray, pollen, two love bug seasons, and afternoon storms that leave standing mineral water on horizontal panels.' },
      { p: 'The right question is not how often to detail. It is which parts of a detail need to happen at which interval, because those intervals are wildly different.' },
      { h2: 'Washing: Every One To Two Weeks' },
      { p: 'Washing is not detailing, but it is the single biggest factor in how long a finish survives. Contamination causes damage as a function of dwell time. Bug residue is acidic and begins etching clear coat within a day or two in summer heat. Bird droppings are worse. Sprinkler water evaporates and leaves dissolved calcium and magnesium behind, and once those minerals bake in the sun they bond to the surface hard enough to require acid or polishing to remove.' },
      { p: 'A two-bucket wash every week or two, with a pH-neutral soap and clean media, removes those contaminants before they get the chance to do permanent work. What matters more than frequency is technique. A weekly run through a brush tunnel will destroy a finish faster than monthly hand washing.' },
      { h2: 'Decontamination: Every Three To Six Months' },
      { p: 'Chemical and mechanical decontamination is what separates a wash from a detail. Iron particles from brake dust embed themselves in clear coat and continue to oxidize there. Road tar bonds. Tree sap from the live oaks and pines around Ocala polymerizes in the sun and will not come off with soap.' },
      { p: 'The test is simple. Wash the car, dry it, then run your fingertips across a horizontal panel. If the surface feels like fine sandpaper instead of glass, it needs decontamination. On a daily driver parked outside, that is usually every three to four months. Garage-kept vehicles can stretch to six.' },
      { image: 'wheel', caption: 'Decontamination removes what a wash alone cannot reach.' },
      { h2: 'Protection: Every Four To Six Months, Or Every Few Years' },
      { p: 'Whatever protection is on the paint is being consumed constantly. Carnauba wax in Florida is close to a novelty item; expect four to six weeks at best. A synthetic sealant properly applied over decontaminated paint will hold four to six months. A spray coating pushes toward eight or nine. A professionally installed ceramic coating measures its life in years rather than months, which is the entire reason coatings took over this market.' },
      { p: 'The economics matter here. Sealant every four months for three years is more expensive in both money and time than one coating installation, and the coating outperforms the sealant on every day of that period.' },
      { h2: 'Interior: Twice A Year, More With Kids Or Pets' },
      { p: 'Interiors degrade on a different clock. Ultraviolet exposure through the windshield is the main enemy of a dashboard, and cracked dash plastic is not repairable, only replaceable. A UV protectant applied twice a year is cheap insurance against a repair that costs more than a decade of detailing.' },
      { p: 'Deep interior work, meaning extraction and steam, is driven by use rather than time. A commuter who eats in the car needs it twice a year. A family vehicle with car seats and a dog needs it quarterly. A truck that visits job sites needs it whenever the carpet stops responding to a vacuum.' },
      { image: 'interiorBA1', caption: 'Interior wear compounds fast without a regular deep clean.' },
      { h2: 'A Realistic Ocala Schedule' },
      { list: [
        'Every one to two weeks: safe hand wash, bug removal, wheel clean',
        'Every three to four months: full exterior decontamination and fresh protection',
        'Every six months: interior deep clean, UV protectant on all plastics and vinyl',
        'Every one to three years: paint correction as needed to remove accumulated marring',
        'Once, then maintained: ceramic coating installation for vehicles you plan to keep'
      ] },
      { h2: 'The Cost Of Skipping It' },
      { p: 'Clear coat failure is the outcome that ends this conversation. Once ultraviolet exposure and contamination break down the clear layer, it delaminates and peels, and there is no detailing product on earth that reverses it. The only fix is a repaint. Detailing is maintenance on the most expensive exterior component of the vehicle, and in this climate the maintenance interval is genuinely shorter than most owners expect.' },
      { p: 'If you are not sure where your vehicle currently stands, that is exactly the kind of thing we assess at the start of an appointment before quoting anything.' }
    ]
  },
  {
    slug: 'ceramic-coating-vs-wax-which-is-worth-it',
    title: 'Ceramic Coating vs Wax: Which Is Actually Worth It?',
    metaTitle: 'Ceramic Coating vs Wax: Which Is Worth It? | Ocala Elite Car Detailing',
    metaDescription:
      'An honest comparison of ceramic coating, synthetic sealant, and carnauba wax for Florida vehicles, including real service life, cost per month, and when wax still wins.',
    excerpt:
      'Coating marketing has gotten loud enough that the real comparison is hard to find. Here is how the three protection classes actually behave on Florida paint.',
    date: '2026-04-12',
    readTime: '8 min read',
    category: 'Paint Protection',
    photo: 'ferrari',
    body: [
      { p: 'Ask ten detailers whether you need a ceramic coating and nine will say yes, largely because coatings are the highest-margin service on the menu. The honest answer depends on how long you plan to keep the vehicle, where it sleeps, and how much of the maintenance you intend to do yourself.' },
      { h2: 'Three Different Materials, Not Three Grades Of The Same Thing' },
      { p: 'Carnauba wax is a natural sacrificial layer. It sits on the paint, fills minor imperfections optically, and produces a warm glow that no synthetic quite replicates. It is also soft, has a low melting point, and dissolves under the detergents and acids it is supposed to defend against.' },
      { p: 'Synthetic sealant is a polymer that bonds more aggressively than wax and resists heat and chemistry substantially better. It is the workhorse of maintenance detailing and the correct answer far more often than the industry admits.' },
      { p: 'A ceramic coating is a silica or quartz based liquid that cures into a hard, cross-linked film chemically bonded to the clear coat. It is not a layer sitting on paint; it becomes a semi-permanent surface. That is why removing one requires polishing rather than stripping.' },
      { h2: 'Real Service Life In Central Florida' },
      { list: [
        'Carnauba wax: four to six weeks on a vehicle parked outside',
        'Synthetic sealant: four to six months with correct washing',
        'Spray or hybrid coating: eight to twelve months',
        'Professional ceramic coating: two to five years depending on tier and care'
      ] },
      { image: 'correctionBA1', caption: 'Coating over uncorrected paint just seals the swirl marks in for good.' },
      { p: 'Those numbers assume the vehicle is washed properly. Dish soap, brush tunnels, and dirty wash mitts shorten every one of them, and they shorten a coating just as surely as they shorten wax.' },
      { h2: 'Cost Per Month Is The Only Fair Comparison' },
      { p: 'A coating installation looks expensive next to a wax job until you divide by service life. Sealant applications several times a year, each requiring a decontamination wash first, add up quickly in both money and Saturdays. Over a three year horizon a coating usually costs less per month and delivers better performance for every one of those months.' },
      { p: 'The math flips if you are selling the car within a year, if it lives under a carport and sees light use, or if you genuinely enjoy waxing your own vehicle on weekends. Those are legitimate reasons to skip a coating and we will tell you so.' },
      { h2: 'What A Coating Does Not Do' },
      { p: 'This is where marketing does the most damage. A ceramic coating does not make paint scratch-proof. It adds hardness at a microscopic film thickness, which helps against light wash marring and nothing else. A shopping cart, a careless door, or an automatic wash with worn brushes will still leave marks.' },
      { p: 'It does not make the car self-cleaning. It makes dirt bond poorly so washing is faster and safer, which is a real benefit, but a coated car parked under a pollen-heavy oak still looks dirty.' },
      { p: 'It also does not hide defects. It seals in whatever is underneath. Coating over swirls locks them in for the life of the product, which is why competent installation always includes paint correction first.' },
      { image: 'banner', caption: 'A properly maintained coating keeps this kind of gloss for years, not weeks.' },
      { h2: 'The Case For Coating In This Market' },
      { p: 'Florida makes the argument better than any sales pitch. Ultraviolet load here is among the highest in the country. Love bug hatches in May and September deposit acidic residue twice a year. Sprinkler systems running well water coat vehicles in dissolved minerals. Summer storms leave standing water that dries in direct sun.' },
      { p: 'Against that, a hard chemically resistant surface earns its keep. Bug splatter that would etch bare clear coat inside a day rinses off coated paint. Water sheets instead of beading into spots. Ultraviolet degradation slows because the coating takes the exposure first.' },
      { h2: 'How To Decide' },
      { list: [
        'Keeping the vehicle three or more years and parking outside: coating is the clear answer',
        'Keeping the vehicle one to two years, garage kept: sealant, refreshed twice a year',
        'Selling within a year: a good decontamination detail and sealant maximizes presentation for the least spend',
        'Show car or enthusiast vehicle you enjoy maintaining: wax on top of a sealant base still produces a look coatings do not match'
      ] },
      { p: 'Whichever direction you go, the preparation underneath matters more than the product on top. Protection applied over contaminated paint fails early every single time.' }
    ]
  },
  {
    slug: 'love-bug-season-paint-damage-prevention',
    title: 'Love Bug Season: Preventing Permanent Paint Damage',
    metaTitle: 'Love Bug Season Paint Damage Prevention | Ocala Elite Car Detailing',
    metaDescription:
      'Love bug residue is acidic and etches clear coat in days. Here is how to remove it safely, and what to do before the May and September hatches hit Ocala.',
    excerpt:
      'Twice a year Central Florida drivers get a hard lesson in acid etching. The damage is preventable, but only if the residue comes off correctly and quickly.',
    date: '2026-05-06',
    readTime: '6 min read',
    category: 'Paint Protection',
    photo: 'exteriorBA',
    body: [
      { p: 'Twice a year, once around May and again around September, love bugs hatch in enormous numbers across Central Florida and spend their short adult lives flying into the front of moving vehicles. The nuisance is obvious. The damage is not, because it happens after the bugs are already dead and drying on your paint.' },
      { h2: 'Why The Residue Etches' },
      { p: 'Love bug remains are acidic, and they become more so as they decompose. On a hot hood the reaction accelerates. Within roughly forty eight hours in summer conditions the acid begins working into the clear coat, and what starts as a removable smear becomes a permanent crater that only machine polishing will address. Leave it long enough and even polishing will not reach the bottom of the etch.' },
      { p: 'Heat is the multiplier. The front bumper, hood, mirror caps, and windshield cowl take both the impact and the highest surface temperatures, which is exactly why those panels show the worst damage in September.' },
      { image: 'correctionBA2', caption: 'Etching left too long needs machine correction, not just a wash.' },
      { h2: 'Remove Them Fast, And Correctly' },
      { p: 'Speed matters more than technique, but technique determines whether you trade acid etching for scratches. Dry scrubbing bug residue with a towel drags hardened insect shell across your clear coat, and the marks it leaves are as permanent as the etching you were trying to avoid.' },
      { list: [
        'Soak the affected panels first and let water do the softening work',
        'Use a dedicated bug remover or a citrus pre-soak and give it several minutes of dwell time',
        'Agitate only with a soft microfiber or a bug sponge, always with plenty of lubrication',
        'Never let the vehicle sit in direct sun with product drying on the paint',
        'Rinse thoroughly and reapply rather than scrubbing harder'
      ] },
      { p: 'Dryer sheets, mesh scrub pads, and household cleaners all circulate as home remedies. All three cause marring. A ten dollar bottle of the correct chemical is cheaper than one panel of polishing.' },
      { image: 'foam', caption: 'A proper pre-soak does the softening work instead of a towel.' },
      { h2: 'Preparation Before The Hatch' },
      { p: 'The best defense is a slick, protected surface applied before the season starts. Bug residue cannot bond well to a coated or freshly sealed panel, which converts a scrubbing job into a rinse. Booking protection work in April and August, ahead of each hatch, is the single most effective thing a Marion County driver can do about this.' },
      { p: 'Paint protection film on the leading edges is the tier above that. For vehicles that see heavy Interstate 75 mileage during hatch weeks, film on the bumper, hood edge, and mirrors takes the impact damage entirely.' },
      { h2: 'If The Damage Is Already Done' },
      { p: 'Etching that you can see but not feel with a fingernail is usually correctable with a one-step or two-step machine polish. Etching you can catch a fingernail on has gone deep enough that correction becomes a judgment call about how much clear coat remains. We take paint depth readings before polishing for exactly this reason; removing more clear coat than the panel can spare creates a much larger problem than the etch.' },
      { p: 'If you are heading into a hatch season with unprotected paint, get protection on the front of the vehicle first. Everything else can wait until the bugs are gone.' }
    ]
  },
  {
    slug: 'mobile-detailing-vs-drive-through-car-wash',
    title: 'Mobile Detailing vs the Drive-Through Car Wash',
    metaTitle: 'Mobile Detailing vs Drive-Through Car Wash | Ocala Elite Car Detailing',
    metaDescription:
      'What an automatic car wash actually does to your paint, how touchless compares to brush systems, and where mobile detailing fits in a real maintenance plan.',
    excerpt:
      'Automatic washes are fast and cheap, and they are also the leading cause of swirl marks on daily drivers. Here is the tradeoff, stated plainly.',
    date: '2026-06-18',
    readTime: '6 min read',
    category: 'Maintenance',
    photo: 'foam',
    body: [
      { p: 'There is a version of this article where the detailer tells you to never use an automatic wash. That is not realistic advice for someone commuting on State Road 200 with two kids and a job. The useful version explains what each option actually costs your paint so you can decide where the tradeoff sits.' },
      { h2: 'What Brush Systems Do' },
      { p: 'A friction tunnel cleans by dragging material across your paint. Modern closed-cell foam is far gentler than the old nylon bristle systems, but the physics do not change: whatever the previous vehicle left in those brushes gets dragged across your clear coat next. On a busy Saturday that includes sand, brake dust, and road grit from a hundred cars.' },
      { p: 'The result is swirl marks, visible as a spider-web pattern under direct sunlight or a service station light. They are not dirt. They are thousands of fine scratches in the clear coat, and the only way to remove them is to machine polish clear coat away until the surface is level again. Clear coat is finite, which means every correction cycle spends a resource you cannot replace.' },
      { image: 'correctionBA2', caption: 'Swirl marks from a brush tunnel look exactly like this under direct light.' },
      { h2: 'Touchless Is Better, With A Catch' },
      { p: 'Touchless washes never contact the paint, which eliminates the scratching problem entirely. To clean without contact they compensate with aggressive chemistry, usually a strong alkaline pre-soak followed by an acidic neutralizer. Those chemicals strip wax and sealant efficiently, and repeated exposure accelerates the breakdown of trim and rubber.' },
      { p: 'For a coated vehicle, touchless is a genuinely reasonable maintenance wash between details. The coating tolerates the chemistry far better than wax does, and nothing touches the paint. For an unprotected vehicle it is a wash that leaves you with less protection than you started with.' },
      { h2: 'Where Hand Washing And Detailing Fit' },
      { p: 'A correct hand wash uses two buckets with grit guards, a pH-neutral soap, and clean media that never touches the ground. Done properly it is the only method that cleans without introducing new marring. Done improperly, with one bucket and a sponge, it is worse than a good touchless wash.' },
      { p: 'Detailing goes past washing entirely. Decontamination removes what is bonded to the surface, polishing removes defects from the clear coat, and protection determines how long the result lasts. No wash of any kind does those things.' },
      { image: 'wash', caption: 'A correct two-bucket hand wash, done on site.' },
      { h2: 'A Practical Middle Ground' },
      { list: [
        'Get real protection installed, ideally a coating or a well-prepped sealant',
        'Use touchless washes for routine dirt removal between details',
        'Avoid friction tunnels entirely on any vehicle whose finish you care about',
        'Book a decontamination and protection service every three to four months',
        'Correct accumulated marring every year or two rather than letting it compound'
      ] },
      { p: 'The value proposition for mobile detailing is not that it beats a car wash on price. It is that it addresses the things a car wash cannot touch, without costing you a trip. The vehicle is worked on in your driveway while you carry on with the day.' }
    ]
  },
  {
    slug: 'what-to-expect-at-your-first-detailing-appointment',
    title: 'What to Expect at Your First Detailing Appointment',
    metaTitle: 'What to Expect at Your First Detailing Appointment | Ocala Elite Car Detailing',
    metaDescription:
      'A step by step walkthrough of a mobile detailing appointment in Ocala, from booking and vehicle inspection through the final walkaround and aftercare.',
    excerpt:
      'If you have never booked a detail before, here is exactly how the appointment runs, what we need from you, and what happens if something is not right.',
    date: '2026-07-22',
    readTime: '5 min read',
    category: 'Getting Started',
    photo: 'tesla',
    body: [
      { p: 'Detailing has a reputation for vagueness. Prices vary wildly, package names mean different things at different shops, and it is rarely clear what you are actually buying. This walks through a first appointment start to finish so there are no surprises.' },
      { h2: 'Booking And The Quote' },
      { p: 'The booking wizard on this site asks for the service you want, the vehicle, the location, and a preferred window. That gives us enough to confirm availability and give you a realistic price range. Final pricing is confirmed after we see the vehicle, because condition drives labor more than vehicle size does. A garage-kept sedan detailed twice a year and a work truck that has never been cleaned are not the same job even though both are one vehicle.' },
      { p: 'We do not use surprise upsells. If the vehicle needs more than what you booked, we tell you before starting and you decide.' },
      { h2: 'Arrival And Inspection' },
      { p: 'The crew arrives in the confirmed window with everything required, including water and power. The first five minutes are an inspection: a walkaround with you, a look at the paint under a dedicated light, and a check of the interior. This is when we point out existing damage, note anything that will not come out, and confirm the plan.' },
      { p: 'That last part matters. Rock chips, deep scratches, burns in upholstery, and previously cracked dash plastic are conditions, not dirt, and no detail removes them. We would rather say that at minute five than have you discover it at handover.' },
      { image: 'interiorBA3', caption: 'Interior condition is assessed and pointed out at the start of every appointment.' },
      { h2: 'The Work' },
      { p: 'From there the crew works the service sequence. You do not need to be present, though you are welcome to be. Most clients hand over the keys and go back to work. If we find something that changes the scope, such as an interior needing extraction that was booked as a basic clean, we call before doing anything that changes the price.' },
      { h2: 'The Final Walkaround' },
      { p: 'When the work is finished we walk the vehicle with you in daylight. We show you what changed, point out anything that did not fully resolve and explain why, and cover aftercare specific to what was applied. If a sealant or coating went on, there are curing rules to respect in the first day or two, and we will hand you those in writing.' },
      { p: 'If something is not right, say so during the walkaround. Fixing a missed area on the spot takes minutes. Fixing it a week later takes another appointment.' },
      { image: 'wheel', caption: 'Every appointment ends with a final inspection before handover.' },
      { h2: 'What To Do Before We Arrive' },
      { list: [
        'Clear personal items from the cabin, trunk, and glove box',
        'Remove child seats if you want the seats underneath cleaned',
        'Park where all four doors can open fully, in shade if possible',
        'Note any known problem areas so we can address them specifically',
        'Tell us about gate codes, HOA rules, or parking restrictions in advance'
      ] },
      { h2: 'How Leads And Scheduling Work' },
      { p: 'Ocala Elite Car Detailing operates as a booking and dispatch service. Requests submitted through this site are matched to vetted independent detailing operators working in the Ocala and Marion County area, and the assigned operator handles your appointment directly. Whoever performs the work is expected to meet the standard described on this site, and we want to hear about it if they do not.' }
    ]
  }
];

module.exports = { posts };
