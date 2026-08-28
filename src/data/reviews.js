// Featured reviews supplied directly by the business owner (sourced from other
// platforms such as Google or Facebook) rather than collected through the
// on-site submission form. Rendered statically so they appear immediately
// without depending on Supabase.
//
// No reviewer name was supplied with any of these, so every entry is
// attributed as "Verified Customer" rather than inventing one. Update
// `name` here if real first-name-and-last-initial attribution becomes
// available.
//
// `photo` pairs each review with a real photo of completed work (see
// src/data/photos.js). It is illustrative work photography, not a claim that
// the pictured vehicle belongs to that specific reviewer.

const featuredReviews = [
  {
    name: 'Verified Customer',
    rating: 5,
    service: 'Mobile Detailing',
    photo: 'wheel',
    body:
      "We have a new car with a matte finish and can't go through a regular car wash. This company is outstanding. Had the first wash today and will be on a bi-weekly schedule. Thanks again for the fantastic job and how professional the guys were. Would highly recommend this company!"
  },
  {
    name: 'Verified Customer',
    rating: 5,
    service: 'Interior Detailing',
    photo: 'finished',
    body:
      "I had them do the interior of my car and it came out showcase ready. They did a beautiful job and I would definitely recommend them to do your vehicle too. Great service and great people."
  },
  {
    name: 'Verified Customer',
    rating: 5,
    service: 'Full Package',
    photo: 'tesla',
    body:
      "I scheduled an appointment with Ocala Elite Car Detailing for the interior and exterior of my vehicle to be cleaned. Service was absolutely superb. Jay showed up on time and got right to work, paying attention to every little detail. When he was finished my vehicle looked and smelled brand new. I have no complaints about the service, and the price was fair."
  },
  {
    name: 'Verified Customer',
    rating: 5,
    service: 'Full Package',
    photo: 'wash',
    body:
      "Had my Benz well taken care of. I was surprised they even cleaned the roof, in and out, shampoo, polish, detailed my truck outstanding. This is my go-to detailing company now. You cannot go wrong with this company. If you want the best, ask for Matt and Ivan. They work like a championship team."
  },
  {
    name: 'Verified Customer',
    rating: 5,
    service: 'Full Package',
    photo: 'banner',
    body:
      "O.E.C.D. did a fantastic job on my F350 dually! It looks brand new inside and out, even better than when I purchased it two years ago. They came to me and were punctual and communicative, and fairly priced as well. Will definitely be having them come back to do my car soon!"
  }
];

module.exports = { featuredReviews };
