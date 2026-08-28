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
  postalCode: '34470',
  areaServed: [
    'Ocala',
    'Silver Springs',
    'Belleview',
    'Dunnellon',
    'Marion Oaks',
    'The Villages',
    'Ocklawaha',
    'Anthony',
    'Citra',
    'Reddick',
    'Summerfield',
    'Fort McCoy'
  ],
  hours: [
    { days: 'Monday - Friday', time: '7:00 AM - 7:00 PM' },
    { days: 'Saturday', time: '8:00 AM - 5:00 PM' },
    { days: 'Sunday', time: 'By appointment' }
  ],
  geo: { lat: 29.1872, lng: -82.1401 },
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
