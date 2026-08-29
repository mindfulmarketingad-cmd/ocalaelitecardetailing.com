// Central site configuration. Edit business details here once; every page picks them up.

const site = {
  name: 'Ocala Elite Car Detailing',
  domain: 'ocalaelitecardetailing.com',
  origin: 'https://ocalaelitecardetailing.com',
  tagline: 'Mobile Detailing Built For Florida Roads',
  // ---- Business contact details -------------------------------------------
  // Replace the street address below with the live mailing address.
  phone: '(757) 743-9050',
  phoneHref: '+17577439050',
  email: 'info@ocalaelitecardetailing.com',
  addressLocality: 'Ocala',
  addressRegion: 'FL',
  // Left empty deliberately. 34470 was a placeholder, and a postcode that does
  // not match your Google Business Profile creates a NAP mismatch, which works
  // against local ranking. Set the real one and it appears in the footer and
  // in LocalBusiness schema automatically; left empty, both omit it.
  postalCode: '',
  // The three cities actually served. This drives the homepage coverage
  // section and the areaServed field in LocalBusiness schema, so listing
  // towns we do not cover would generate leads for trips we cannot take.
  areaServed: ['Ocala', 'Belleview', 'The Villages'],
  hours: [
    { days: 'Monday - Friday', time: '7:00 AM - 7:00 PM' },
    { days: 'Saturday', time: '8:00 AM - 5:00 PM' },
    { days: 'Sunday', time: 'By appointment' }
  ],
  geo: { lat: 29.1872, lng: -82.1401 },

  // ---- Social & listing profiles -------------------------------------------
  // Fill in the real URLs. Each one you add does two things automatically:
  // it renders an icon in the footer, and it is emitted in the sameAs array of
  // the LocalBusiness schema, which is how Google ties this site to your
  // Google Business Profile and social accounts.
  //
  // Leave a value as an empty string and it is skipped entirely - no broken
  // icon, no empty sameAs entry. Nothing here is guessed: an invented profile
  // URL would either 404 or point at somebody else's account.
  social: {
    google: '',    // Google Business Profile share link or maps place URL
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    x: ''
  },
  // ---- Supabase -----------------------------------------------------------
  // The publishable key is safe in client code. Row Level Security on the
  // bookings / reviews tables is what protects the data - see supabase/schema.sql.
  supabase: {
    url: 'https://tbqigevoksabizjogvtm.supabase.co',
    // The live key used by the browser lives in assets/js/supabase.js. The
    // sb_publishable_ key 401s on this project, so the anon JWT is used there.
    publishableKey: 'sb_publishable_aHlx0Tdu2rhOTBUp3lhkQw_Lv6Awz7a'
  }
};

// Primary navigation, in the order requested.
const headerNav = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/' },
  // Labelled "Prices" rather than "Costs" because that is the word people
  // scan a nav bar for. The hub itself lives at /costs/.
  { label: 'Prices', href: '/costs/' },
  // Sits next to Services because the two are closely related: the areas hub
  // fans out into the same services scoped to each town.
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Search', href: '/search/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' }
];

// Footer navigation, rendered as a single horizontal row.
const footerNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Disclaimer', href: '/disclaimer/' },
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Sitemap', href: '/sitemap/' }
];

module.exports = { site, headerNav, footerNav };
