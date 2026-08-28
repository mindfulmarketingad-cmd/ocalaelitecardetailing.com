// Per-combination copy for /services/<service>/<area>-fl/ pages.
//
// Every one of these is written for that specific service in that specific
// place. Nothing here is templated, and no sentence is reused between entries.
// If a new service or area is added, its combinations must be written by hand
// before the pages will build - see build.js, which throws on a missing pair
// rather than silently emitting a near-duplicate page.

const serviceAreaContent = {
  'mobile-detailing': {
    ocala: {
      lead: 'Ocala is spread out, and the drive to a fixed detail shop is often longer than the detail itself.',
      body: [
        'Marion County covers more than 1,600 square miles, and a lot of our customers live on properties well outside the city grid, down farm roads where the nearest commercial bay is a thirty minute drive each way. Add the wait and the return trip and a straightforward detail eats most of a day.',
        'Running mobile removes that entirely. The truck carries its own water tank, generator, and extraction gear, so a barn driveway on a dirt road is as workable as a paved suburban one. The only thing we need is enough room to open every door and walk the perimeter.'
      ]
    },
    belleview: {
      lead: 'Most Belleview appointments happen while the owner is inside doing something else entirely.',
      body: [
        'A large share of our Belleview customers are retired, and the appeal of mobile service here is rarely about saving a commute. It is about not handing your car to a stranger and sitting in a waiting room for four hours. You hand over the keys at your own front door and get them back the same place.',
        'Practically, Belleview is easy to work in. Streets are quiet, driveways are generally wide, and there is usually shade available, which matters more than people expect since working a panel in direct Florida sun causes products to flash off before they can be worked properly.'
      ]
    },
    'the-villages': {
      lead: 'Gate access and community rules are the whole logistics problem here, and we work around both.',
      body: [
        'The Villages is not a place you can simply drive into and start working. Gated entries, resident-only access, and neighbourhood rules about commercial vehicles all shape how an appointment has to run. We ask for your village and gate at the time of booking specifically so none of that becomes a problem on the day.',
        'The other reason mobile fits here is that a lot of residents would rather not drive an unfamiliar route out of the community at all. Working at the villa means the car never leaves, and it means we can do the golf cart in the same visit, which a fixed shop simply cannot offer.'
      ]
    }
  },

  'ceramic-coating': {
    ocala: {
      lead: 'Coating earns its keep fastest on an Ocala commuter, because this is where paint takes the most abuse.',
      body: [
        'A vehicle running Interstate 75 daily and parking outside collects the worst combination we see: love bug acid twice a year, road tar year round, iron from brake dust and limerock dust, and unbroken sun. Uncoated clear coat under that load visibly deteriorates within a few seasons.',
        'A coating changes the arithmetic. Bug splatter that would etch bare paint inside a day rinses off a coated panel. Iron-laden dust sits on the surface instead of bonding into it. The vehicle still needs washing, but the washing stops being a race against permanent damage.'
      ]
    },
    belleview: {
      lead: 'Belleview is where a coating lasts closest to its advertised life, because the storage conditions are right.',
      body: [
        'Coating durability is decided far more by how a car is kept than by which product goes on it. Belleview skews toward garaged, lower-mileage vehicles, which is exactly the profile where a five-year coating actually behaves like a five-year coating rather than fading at two.',
        'The specific problem it solves locally is mineral spotting. Well-water irrigation overspray dries on paint and etches; on a coated surface those deposits sit on top of the coating instead of biting into clear coat, and come off with a proper wash rather than needing polishing.'
      ]
    },
    'the-villages': {
      lead: 'On a low-mileage Villages car, a coating is close to the best value on our menu.',
      body: [
        'The maths here is unusual. A resident might drive three thousand miles a year, so the coating faces almost no road abrasion, no tar, and little of the contamination that wears protection down elsewhere. What it does face is relentless ultraviolet exposure, which is precisely what a coating is best at deflecting.',
        'That combination means a coating installed here routinely outlasts the same product on an Ocala daily driver by years. If you intend to keep the car for the rest of the time you are driving, this is usually the last paint protection decision you will need to make.'
      ]
    }
  },

  'exterior-detailing': {
    ocala: {
      lead: 'The whole job in Ocala is decontamination, because our dust is iron-bearing and it bonds.',
      body: [
        'Wash an Ocala vehicle, dry it, then run your fingertips across the hood. That gritty texture is not dirt you missed. It is limerock and clay dust plus brake iron that has embedded itself into the clear coat, and soap has no effect on it whatever.',
        'The exterior service exists for that layer. An iron remover dissolves the metallic particles chemically, a tar solvent handles the Interstate 75 road film, and clay shears off whatever survives both. Only then does protection go down, which is why a properly prepped sealant here lasts several times longer than one applied over a surface that merely looks clean.'
      ]
    },
    belleview: {
      lead: 'In Belleview the enemy is not road grime, it is the sprinkler system.',
      body: [
        'Cars here are frequently quite clean and still spotted all over. That is well water: mineral-heavy irrigation overspray that lands on paint and glass, evaporates in the sun, and leaves calcium and magnesium deposits bonded to the surface. On glass it looks like permanent cloudiness. On paint, left long enough, it etches.',
        'Ordinary washing does nothing to established deposits, and scrubbing at them just adds scratches. Removing them takes the right chemistry followed by a protective layer that stops the next round of overspray from bonding in the first place, which is what makes this service worth repeating on a schedule here.'
      ]
    },
    'the-villages': {
      lead: 'Villages paint is usually undamaged by driving and quietly oxidised by standing still.',
      body: [
        'A car with very low mileage generally has no rock chips, no tar, and no road film worth mentioning. What it does have, after several Florida summers, is dulled, chalky-feeling paint on every upward-facing panel, along with a windshield cowl and roof that have taken far more sun than the doors.',
        'The exterior service addresses that specific pattern: lifting the pollen and irrigation residue that has been baking on, then getting real protection onto the horizontal surfaces that are absorbing the ultraviolet load. Vertical panels on these cars are often nearly untouched by comparison.'
      ]
    }
  },

  'interior-detailing': {
    ocala: {
      lead: 'Ocala interiors are a dust problem, and the dust comes in on your shoes.',
      body: [
        'Anyone driving farm roads, visiting barns, or working a job site carries fine limerock dust straight into the cabin. It works into carpet pile and seat fabric, and because the particles are so fine, vacuuming lifts the top layer and leaves the rest sitting deeper in the weave where it keeps producing that permanently dusty look.',
        'Hot water extraction is what actually removes it. The carpet is flushed and the dissolved soil is pulled back out rather than pushed further down, which is the difference between an interior that looks vacuumed and one that is genuinely clean.'
      ]
    },
    belleview: {
      lead: 'Humidity off Lake Weir means Belleview interiors are usually a moisture problem, not a dirt problem.',
      body: [
        'The complaints we hear here are consistent: a musty smell when the air conditioning first comes on, interior glass that fogs and will not clear, carpet that feels faintly damp underfoot. Those are all the same underlying issue, which is moisture living in the cabin and feeding microbial growth in carpet, seat foam, and the ventilation system.',
        'Treating it means removing the source rather than covering it. Steam sanitises, extraction pulls moisture and contamination out together, and controlled drying finishes the job. An air freshener on top of a damp carpet buys about a week.'
      ]
    },
    'the-villages': {
      lead: 'The dashboard is the thing at risk here, and once it cracks nothing brings it back.',
      body: [
        'Windshields in Florida act as a magnifier over the top of the dash. In The Villages, where cars are frequently parked outdoors facing the sun for long stretches and driven rarely, that exposure accumulates without the interior ever seeing much wear. Dashboards go hard, then chalky, then they crack, and a cracked dashboard is a replacement, not a repair.',
        'A matte ultraviolet protectant applied a couple of times a year is genuinely cheap insurance against that outcome. We use matte rather than glossy deliberately, because a shiny dashboard throws glare into the windscreen, which is the last thing anyone needs on a bright Florida afternoon.'
      ]
    }
  },

  'full-package': {
    ocala: {
      lead: 'In Ocala this is most often booked on trucks that work for a living.',
      body: [
        'Horse country runs on pickups and haulers, and they accumulate a very particular kind of dirt: hay chaff, feed dust, dried mud in the bed and wheel wells, and a cabin that has had work boots in it every day for a year. That is not a job for a single service; it needs the inside and the outside taken back at once.',
        'The other common trigger is sale. A truck that presents well in Ocala sells noticeably faster, because buyers in this market are experienced enough to read a neglected work vehicle instantly and price accordingly.'
      ]
    },
    belleview: {
      lead: 'Belleview full packages tend to be about selling, downsizing, or handing a car on.',
      body: [
        'A lot of our full package work here has a transaction behind it: a second car going because it is no longer needed, a vehicle being passed to family, or a move to a smaller property. In every one of those cases the money spent on a complete detail comes back, usually several times over, in what the car fetches or in avoided reconditioning charges.',
        'These vehicles are also often mechanically excellent and cosmetically tired, which is the best possible candidate for this service. There is a genuinely good car under there, and the full package is what makes that obvious to a buyer at a glance.'
      ]
    },
    'the-villages': {
      lead: 'Cars change hands inside The Villages constantly, and presentation decides the price.',
      body: [
        'There is an unusually active local market here for used vehicles and carts sold between residents, often within the same community. Buyers are frequently viewing several similar low-mileage cars in the same week, and the deciding factor is very often condition rather than specification.',
        'A full package is the most effective preparation for that. It resets both the interior, where sun damage tends to show first, and the exterior, where oxidation has usually dulled everything horizontal, so the car reads as the well-kept, low-mileage vehicle it genuinely is.'
      ]
    }
  },

  'paint-correction': {
    ocala: {
      lead: 'Ocala paint carries wash marring, because a dusty car gets washed constantly.',
      body: [
        'There is an irony to this area. Because vehicles here get visibly dirty so quickly, they get washed far more often than average, and frequent washing on abrasive dust is exactly how swirl marks are created. Every pass with a mitt over unlifted grit drags that grit across the clear coat.',
        'Correction removes that accumulated pattern by levelling the clear coat itself. It is also the only point at which we can properly assess how much clear coat a vehicle still has, which we measure before starting rather than polishing every car to the same recipe.'
      ]
    },
    belleview: {
      lead: 'Belleview corrections are usually about undoing years that happened before the garage.',
      body: [
        'A recurring Belleview story is a car that spent a decade outdoors somewhere else and now lives under cover. The current storage is excellent, the paint is not, and no amount of washing or waxing touches the oxidation and etching already baked in from those earlier years.',
        'That is a good correction candidate. The damage is historic rather than ongoing, so once it is polished out and protected, the improvement holds for a long time, because the conditions that caused it no longer apply.'
      ]
    },
    'the-villages': {
      lead: 'Here the defect is oxidation from standing in the sun, not scratches from driving.',
      body: [
        'Correction in The Villages looks different from correction anywhere else we work. There is often very little swirling, because the car is barely driven and barely washed. What there is instead is a uniformly dead, chalky finish on the roof, bonnet, and boot lid, while the doors still look reasonable.',
        'That responds well, and often needs less aggressive work than the surface appearance suggests, since ultraviolet oxidation sits shallow in the clear coat. Golf carts are a different matter: most are single-stage paint, which chalks harder and needs a more careful approach to avoid burning through.'
      ]
    }
  },

  'wash-wax': {
    ocala: {
      lead: 'This is the between-details service that keeps Ocala dust from becoming Ocala damage.',
      body: [
        'Given how fast vehicles get dirty here, the realistic choice is not whether to wash frequently but how. Frequent washing done badly is the single biggest cause of swirl marks we see in this area, and a run through a brush tunnel with limerock dust still on the paint is close to sandpapering it.',
        'A proper hand wash with correct technique, finished with wax, keeps the vehicle presentable without adding damage each time. It does not replace decontamination, and we will tell you when the paint has reached the point of needing it.'
      ]
    },
    belleview: {
      lead: 'On a garaged Belleview car, wash and wax on a schedule is often all that is needed.',
      body: [
        'When a vehicle is stored under cover, driven modestly, and already has healthy paint, the heavier services genuinely are not necessary most of the year. Keeping mineral spotting and pollen off before either has time to bond does the majority of the work.',
        'A number of our Belleview customers run this every two to four weeks and book a full exterior detail once or twice a year. That is a sensible rhythm here, and it costs less over twelve months than repeatedly correcting a neglected finish.'
      ]
    },
    'the-villages': {
      lead: 'The natural fit here is doing the car and the golf cart together on a regular cadence.',
      body: [
        'Almost every household here has two things needing attention, and the cart usually needs it more, since it lives outdoors permanently. Handling both in one visit is far more efficient than treating them as separate jobs, and it is how most of our recurring Villages customers run it.',
        'The wax matters more than the wash does in this context. These vehicles are not especially dirty; they are unprotected against sun. A wax layer refreshed regularly is what slows the oxidation that is doing the real damage.'
      ]
    }
  },

  'engine-detailing': {
    ocala: {
      lead: 'Farm road driving fills an engine bay with material that does not belong in one.',
      body: [
        'Vehicles working around barns and unpaved roads accumulate hay chaff, seed husks, and thick dust across the top of the engine and down into every ledge and channel. Beyond looking neglected, that material is dry, it packs against hot components, and it holds moisture against metal once it eventually gets damp.',
        'Cleaning it out with covered electronics and controlled low pressure removes a genuine nuisance and makes leaks visible again. On a hard-working vehicle, spotting a weeping gasket early is worth considerably more than the appointment costs.'
      ]
    },
    belleview: {
      lead: 'Humidity is what makes a Belleview engine bay look older than the car.',
      body: [
        'Damp air off the lake plus a bay that is rarely dried out produces surface corrosion on brackets and bare metal, along with a dull, greying film across every hose and plastic cover. The vehicle can be low-mileage and well maintained and still open up looking tired.',
        'Degreasing, drying properly rather than leaving it to air dry, and conditioning the rubber and plastic reverses most of that appearance. Drying matters more here than in drier parts of the state, which is exactly why we do not skip it.'
      ]
    },
    'the-villages': {
      lead: 'A car that sits still for weeks is a car something may have moved into.',
      body: [
        'Rarely driven vehicles are attractive to rodents and insects, which nest in the warm, sheltered space above the engine. We regularly open bays here and find bedding material, seed caches, and chewed insulation, none of which the owner had any reason to suspect because the car starts and drives normally.',
        'Cleaning the bay both removes that and reveals whether any wiring has been chewed, which is the part that turns into an expensive intermittent electrical fault later. On a vehicle that sits for long stretches, this is worth doing periodically rather than never.'
      ]
    }
  },

  'headlight-restoration': {
    ocala: {
      lead: 'Ocala driving includes a lot of unlit rural road, which is where dim headlights actually matter.',
      body: [
        'Once you are outside the city, County Road 475, the farm roads, and the routes out toward the forest have no street lighting at all, and deer are a genuine hazard on them after dark. How far your headlights actually reach stops being cosmetic on roads like those.',
        'An oxidised lens scatters light rather than projecting it, so a meaningful share of what the bulb produces never lands on the road ahead. Restoring clarity puts that output back without touching the bulb or the wiring.'
      ]
    },
    belleview: {
      lead: 'Belleview vehicles are often kept a long time, which is exactly how lenses end up yellow.',
      body: [
        'Headlight oxidation is a slow, cumulative process, so it disproportionately affects cars that stay with one owner for many years. That is the norm here, and it is why we see well-maintained vehicles in otherwise excellent condition with lenses gone thoroughly amber.',
        'Because the change happens gradually, most owners have adjusted to it without noticing. The difference on the first night drive after restoration tends to be the thing that surprises people most about this service.'
      ]
    },
    'the-villages': {
      lead: 'This is the service that makes the most difference to the most people here.',
      body: [
        'Two things converge in The Villages. Lenses yellow from ultraviolet exposure regardless of mileage, so even a lightly used car develops them. And older eyes need considerably more light to see the same detail at night, so degraded headlight output costs a driver here more than it would cost a younger one.',
        'That makes restoration a safety measure rather than an appearance upgrade. It is inexpensive, it takes about an hour, and it restores output that has been quietly disappearing for years.'
      ]
    }
  }
};

module.exports = { serviceAreaContent };
