// Long-form policy pages. Blocks: {h2}, {h3}, {p}, {list}.
//
// These are plain-language starting documents written to match how the
// business actually operates (a booking and dispatch service that refers work
// to independent detailing operators). Have counsel review before launch.

const effective = 'August 1, 2026';

const disclaimer = {
  title: 'Disclaimer',
  metaTitle: 'Disclaimer | Ocala Elite Car Detailing',
  metaDescription:
    'Disclaimer covering service referrals, independent operators, pricing estimates, results, and the limits of information published on this site.',
  lead:
    'Please read this disclaimer carefully. It explains the limits of the information published on this site and the nature of the services arranged through it.',
  body: [
    { h2: 'Nature Of Our Service' },
    { p: 'Ocala Elite Car Detailing operates as a booking, quoting, and dispatch service for vehicle detailing in Ocala and the surrounding Marion County area. Requests submitted through this website are matched with independent detailing operators who perform the work. Those operators are not employees of Ocala Elite Car Detailing, and each is responsible for its own equipment, insurance, licensing, personnel, and workmanship.' },
    { p: 'We select the operators we work with and set the service standard described on this site. We do not, however, exercise direct control over the moment-to-moment conduct of an independent operator on your property, and nothing on this site should be read as a representation that we do.' },
    { h2: 'Pricing And Estimates' },
    { p: 'All prices shown on this website, including any figure labelled as starting at a given amount, are estimates for planning purposes only. They are not quotes, offers, or binding commitments. Final pricing depends on the vehicle, its size, its condition, the services selected, the location, and the operator assigned. A firm price is confirmed after the vehicle has been assessed and before work begins.' },
    { h2: 'Results And Expectations' },
    { p: 'Detailing improves the condition of a vehicle; it does not repair damage. Rock chips, deep scratches, dents, previously failed clear coat, cracked or sun-damaged interior plastics, burns, tears, permanent staining, corrosion, and pre-existing mechanical faults are conditions of the vehicle rather than contamination, and no detailing service removes them.' },
    { p: 'Descriptions of expected outcomes, product service life, and durability on this website reflect typical results under normal conditions. Actual results vary with vehicle history, paint condition, storage, driving environment, climate exposure, and post-service maintenance. No specific outcome is guaranteed.' },
    { h2: 'Educational Content' },
    { p: 'Articles, guides, and other content published on this website are provided for general information. They are not instructions for work on your own vehicle and are not a substitute for professional assessment of a specific vehicle. Detailing chemicals and machine polishing can permanently damage paint, trim, and interior materials when misused. Anyone acting on information found here does so at their own risk.' },
    { h2: 'No Professional Advice' },
    { p: 'Nothing on this website constitutes legal, insurance, financial, or appraisal advice. Statements about resale value, lease return outcomes, or insurance treatment are general observations and should not be relied on for any specific transaction.' },
    { h2: 'Third-Party Content And Links' },
    { p: 'This website may reference or link to third-party products, brands, manufacturers, or websites. Those references are for identification and information only and do not imply endorsement, affiliation, or sponsorship in either direction. We do not control third-party content and are not responsible for it.' },
    { h2: 'Reviews And Testimonials' },
    { p: 'Customer reviews published on this site reflect the experience of the individual who submitted them. Individual experiences vary, and a review is not a prediction or guarantee of the outcome of any other appointment. We do not publish fabricated reviews.' },
    { h2: 'Accuracy And Availability' },
    { p: 'We work to keep this site accurate and current, but we make no warranty that the content is complete, current, or error-free. Service descriptions, coverage areas, availability, and pricing can change without notice. This website is provided on an as-is basis and may be unavailable at times.' },
    { h2: 'Questions' },
    { p: 'If anything on this page is unclear, contact us before booking and we will explain it in plain terms.' }
  ]
};

const privacy = {
  title: 'Privacy Policy',
  metaTitle: 'Privacy Policy | Ocala Elite Car Detailing',
  metaDescription:
    'How Ocala Elite Car Detailing collects, uses, stores, and shares the information you submit through booking requests, review submissions, and contact forms.',
  lead:
    'This policy explains what information we collect through this website, why we collect it, who we share it with, and the choices you have.',
  body: [
    { h2: 'Who We Are' },
    { p: 'Ocala Elite Car Detailing operates the website at ocalaelitecardetailing.com and arranges vehicle detailing services in Ocala and Marion County, Florida. This policy applies to information collected through this website.' },
    { h2: 'Information You Give Us' },
    { p: 'We collect the information you enter into forms on this site. Depending on the form, that includes:' },
    { list: [
      'Your name',
      'Your email address',
      'Your phone number',
      'The service address or area where the vehicle is located',
      'Vehicle details such as year, make, model, and size class',
      'The services you are requesting and your preferred date and time window',
      'Any notes, questions, or condition details you choose to add',
      'Review text, a rating, and the display name you provide when submitting a review'
    ] },
    { p: 'We do not collect payment card details through this website. Payment is handled directly between you and the operator performing the work.' },
    { h2: 'Information Collected Automatically' },
    { p: 'Our hosting provider and infrastructure services record standard technical information such as IP address, browser type, referring page, and timestamps as part of delivering and securing the site. This site does not use advertising trackers or third-party behavioural profiling cookies. If analytics are added in the future, this policy will be updated before they are enabled.' },
    { h2: 'How We Use Your Information' },
    { list: [
      'To respond to your booking request, quote it, and schedule the appointment',
      'To pass the details needed to complete the job to the assigned operator',
      'To contact you about the appointment, including changes, arrival windows, and follow-up',
      'To publish a review you have submitted for publication, using only the display name you provided',
      'To keep records of requests and services for business, tax, and dispute-resolution purposes',
      'To improve our services and the content of this website'
    ] },
    { p: 'We do not sell your personal information, and we do not share it with advertisers or data brokers.' },
    { h2: 'Who We Share It With' },
    { p: 'Booking details are shared with the independent detailing operator assigned to your appointment, limited to what that operator needs to reach you and complete the work. We also use service providers who process data on our behalf, including our website host and Supabase, which stores form submissions in a managed database. Those providers are permitted to use the information only to provide services to us.' },
    { p: 'We may disclose information where required by law, to enforce our terms, or to protect the rights, property, or safety of our customers, our operators, or the public.' },
    { h2: 'Where Your Data Is Stored' },
    { p: 'Booking requests, contact messages, and review submissions are stored in a Supabase project hosted in the United States. Access is restricted through database row level security policies and administrative credentials held only by us. Submitted records are not publicly readable, with the single exception of reviews that we have explicitly approved for publication.' },
    { h2: 'How Long We Keep It' },
    { p: 'We keep booking and contact records for as long as needed to provide the service and to meet legal, accounting, and dispute-resolution obligations, generally not longer than seven years. Published reviews remain until you ask us to remove them.' },
    { h2: 'Your Choices' },
    { list: [
      'You can ask us for a copy of the personal information we hold about you',
      'You can ask us to correct information that is inaccurate',
      'You can ask us to delete your information, subject to records we are required to retain',
      'You can ask us to remove a published review you submitted',
      'You can opt out of non-essential messages at any time by replying to any message or contacting us directly'
    ] },
    { p: 'To make any of these requests, contact us using the details on our contact page. We will respond within a reasonable period.' },
    { h2: 'Text And Phone Contact' },
    { p: 'When you give us a phone number in a booking or contact form, you are agreeing that we or the assigned operator may contact you at that number about your request, including by text message. Message and data rates may apply. Reply STOP to any text message to opt out of further texts. Opting out of texts does not prevent us from calling you about an active appointment.' },
    { h2: 'Children' },
    { p: 'This website is not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child has submitted information through this site, contact us and we will delete it.' },
    { h2: 'Security' },
    { p: 'Data submitted through this site is transmitted over an encrypted connection and stored with access controls in place. No system is perfectly secure, and we cannot guarantee absolute security, but we take reasonable measures appropriate to the sensitivity of the information involved.' },
    { h2: 'Changes To This Policy' },
    { p: 'We may update this policy as our practices or the law change. The effective date at the top of this page reflects the current version. Material changes will be noted on this page.' },
    { h2: 'Contact' },
    { p: 'Questions about this policy or about the information we hold can be directed to us through the contact page.' }
  ]
};

const terms = {
  title: 'Terms of Service',
  metaTitle: 'Terms of Service | Ocala Elite Car Detailing',
  metaDescription:
    'The terms governing use of the Ocala Elite Car Detailing website, booking requests, scheduling, cancellations, liability, and dispute resolution.',
  lead:
    'These terms govern your use of this website and any booking request you submit through it. By using the site or submitting a request, you agree to them.',
  body: [
    { h2: 'Agreement To These Terms' },
    { p: 'These Terms of Service form an agreement between you and Ocala Elite Car Detailing covering your use of ocalaelitecardetailing.com and any request submitted through it. If you do not agree with these terms, do not use the site or submit a request.' },
    { h2: 'What We Provide' },
    { p: 'We provide a booking, quoting, and dispatch service. We collect your request, confirm scope and pricing, and assign the work to an independent detailing operator serving your area. The operator performs the detailing work and is solely responsible for it, including their equipment, personnel, insurance, licensing, and results.' },
    { p: 'We are not a party to any separate agreement between you and an operator regarding work outside the scope arranged through us.' },
    { h2: 'Booking Requests And Confirmation' },
    { p: 'Submitting a request through the booking wizard or any form on this site does not create a confirmed appointment. A request is an inquiry. An appointment exists only once we have confirmed the date, arrival window, scope, and price with you directly. We may decline any request.' },
    { h2: 'Pricing' },
    { p: 'Prices displayed on this site are estimates. Final pricing is confirmed after assessment of the vehicle and before work begins. If a vehicle requires materially more labor than the booked scope, the operator will contact you for approval before proceeding. You are not obligated to accept additional work.' },
    { p: 'Payment terms are set at the time of booking and are settled directly with the operator unless we tell you otherwise in writing.' },
    { h2: 'Your Responsibilities' },
    { list: [
      'Provide accurate information about the vehicle, its condition, and the service location',
      'Ensure the vehicle is accessible and legally parked with room to work on all sides',
      'Disclose gate codes, HOA restrictions, parking limits, or property access requirements in advance',
      'Remove personal belongings, valuables, and documents from the vehicle before the appointment',
      'Disclose known damage, aftermarket paint or wrap, prior bodywork, or anything requiring special handling',
      'Be reachable during the appointment window in case questions arise'
    ] },
    { p: 'We and our operators are not responsible for personal property left in a vehicle.' },
    { h2: 'Cancellation And Rescheduling' },
    { p: 'Cancellations or reschedules requested at least twenty four hours before the appointment window carry no charge. Cancellations inside that window, or an appointment where the vehicle is not accessible on arrival, may incur a trip fee reflecting the reserved time and travel.' },
    { p: 'We may reschedule for weather, safety, equipment failure, or operator availability. Central Florida storm activity is a common cause. Where weather makes the work unsafe or would compromise the result, we will reschedule at no charge to you.' },
    { h2: 'Vehicle Condition And Pre-Existing Damage' },
    { p: 'Vehicles are inspected before work begins, and pre-existing damage is noted at that time. Detailing does not repair damage. Loose, previously repaired, aftermarket, or deteriorated components including trim, emblems, clear coat, wraps, and interior materials may fail during normal cleaning through no fault of the operator. Where an item is identified as at risk, it will be pointed out and, if you prefer, left untouched.' },
    { h2: 'Claims' },
    { p: 'If you believe damage occurred during an appointment, notify us and the operator within forty eight hours with photographs. Claims are investigated with the operator, whose insurance is the applicable coverage for work performed. We will assist in resolving the matter and will stop referring work to any operator who does not deal with customers fairly.' },
    { h2: 'Reviews And Submissions' },
    { p: 'By submitting a review you grant us a non-exclusive, royalty-free licence to publish, display, and excerpt it on this site and in marketing, attributed to the display name you provide. You confirm the review reflects your own genuine experience. We may decline to publish, or may remove, any submission that is abusive, unlawful, off-topic, fraudulent, or that identifies third parties without consent. We do not edit reviews to change their meaning.' },
    { h2: 'Acceptable Use' },
    { p: 'You agree not to use this site to submit false or fraudulent requests, to attempt unauthorized access to our systems or data, to scrape or harvest content at scale, to introduce malicious code, or to interfere with the operation of the site or its underlying services.' },
    { h2: 'Intellectual Property' },
    { p: 'The content, layout, branding, and code of this website are owned by Ocala Elite Car Detailing or used with permission. You may view and share pages for personal, non-commercial purposes. You may not reproduce substantial portions of the site, or use our name or branding, without written permission.' },
    { h2: 'Disclaimer Of Warranties' },
    { p: 'This website is provided on an as-is and as-available basis without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the site will be uninterrupted, timely, secure, or error-free.' },
    { h2: 'Limitation Of Liability' },
    { p: 'To the fullest extent permitted by Florida law, Ocala Elite Car Detailing is not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, revenue, data, or use, arising out of your use of this website or the arrangement of services through it. Our total aggregate liability arising from the booking service is limited to the amount you paid to us, if any, for the specific booking giving rise to the claim.' },
    { p: 'Nothing in these terms limits liability that cannot lawfully be limited.' },
    { h2: 'Indemnity' },
    { p: 'You agree to indemnify and hold harmless Ocala Elite Car Detailing against claims, losses, and reasonable costs arising from your breach of these terms, your misuse of this website, or inaccurate information you provided in a request.' },
    { h2: 'Governing Law' },
    { p: 'These terms are governed by the laws of the State of Florida, without regard to conflict of law principles. Any dispute that cannot be resolved directly will be brought in the state or federal courts located in Marion County, Florida, and you consent to that jurisdiction and venue.' },
    { h2: 'Changes To These Terms' },
    { p: 'We may revise these terms from time to time. The effective date at the top of this page reflects the current version. Continued use of the site after a change constitutes acceptance of the revised terms.' },
    { h2: 'Contact' },
    { p: 'Questions about these terms can be directed to us through the contact page.' }
  ]
};

module.exports = { disclaimer, privacy, terms, effective };
