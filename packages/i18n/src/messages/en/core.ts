/** Khung ứng dụng: điều hướng, chào mừng, đăng nhập, cài đặt. */
export const core = {
  brand: { tagline: 'Community travel notebook' },
  nav: {
    home: 'Home', explore: 'Explore', map: 'Explore', mapShort: 'Explore', culture: 'Culture', community: 'Community', posts: 'Posts', exploreVn: 'Explore Vietnam', about: 'About', placesTab: 'Places', itineraryTab: 'Itinerary', stories: 'Stories', connect: 'Services', me: 'Me', connectShort: 'Services', following: 'Following', journeys: 'Journeys',
    profile: 'Profile', create: 'Write', itinerary: 'Itinerary', write: 'Write', notifications: 'Notifications', settings: 'Settings',
    signIn: 'Sign in', signOut: 'Sign out', signUp: 'Sign up', login: 'Sign in',
  },
  me: {
    guestTitle: 'Hello there!', guestLead: 'Sign in to rate places, save journeys and follow people you like.',
    signUp: 'Create account', myProfile: 'My profile', stories: 'Travel stories', becomeProvider: 'Become a provider',
  },
  guest: {
    banner: 'You are browsing as a guest – search freely. Sign in to rate places, save journeys and write stories.',
    loginPrompt: 'Sign in to use this feature',
  },
  locked: {
    title: 'Members only',
    profile: 'Sign in to save trips, favourite places and publish your own stories.',
    footprints: 'Sign in to keep your footprints from every journey.',
  },
  auth: {
    title: 'Sign in to TravelPad', signUpTitle: 'Create your TravelPad account',
    lead: 'Save journeys, follow people you like and tell the story of your trips.',
    email: 'Email', password: 'Password', displayName: 'Display name',
    toSignUp: 'No account yet? Sign up', toSignIn: 'Already have an account? Sign in',
    close: 'Close',
  },
  settings: {
    title: 'Settings', lead: 'Language, appearance and privacy.',
    language: 'Language', display: 'Appearance', theme: 'Colour mode', light: 'Light', dark: 'Dark', system: 'System',
    mapStyle: 'Map style', classic: 'Classic', terrain: 'Terrain', satellite: 'Satellite',
    largeText: 'Larger text', dataSaver: 'Data saver',
    notifications: 'Notifications', notifyFollowing: 'New stories from people you follow', notifyHot: 'Weekly hot destinations', notifyComments: 'Comments and likes',
    account: 'Account & privacy', shareLocation: 'Share my location on trips',
    privacy: 'Privacy',
  },
  footer: {
    about: 'A Vietnam travel notebook built and grown by the community: ratings from people who have been there, real stories and services the community trusts.',
    discover: 'Discover', community: 'Community', business: 'For businesses', rights: 'All rights reserved.', madeIn: 'Made in Vietnam', photoCredits: 'Photo credits',
  },
  credits: { title: 'Photo credits', lead: 'Photos on TravelPad come from Wikimedia Commons under free licences. Thanks to the photographers for sharing.', photo: 'Photo', author: 'Author', license: 'Licence', view: 'View original', note: 'Food, accommodation and service cover photos are illustrative, not photos of that specific venue.' },
  common: { loading: 'Loading…', error: 'Something went wrong. Please try again in a moment.', retry: 'Retry', seeAll: 'See all', photoBy: 'Photo: {artist} · {license}' },
  about: {
    eyebrow: 'About TravelPad', title: 'Your companion for travel in Vietnam',
    lead: 'A community that travels, rates and grows Vietnam’s travel culture together.',
    howTitle: 'A great trip starts here',
    s1Title: 'Plan your trip', s1Body: 'Pick a destination and number of days, and TravelPad lays out a morning-to-evening plan on the map. Less searching, more travelling.',
    s2Title: 'Choose services you can trust', s2Body: 'Stays, food, transport and guides at your destination – rated by people who used them, with direct contact to the provider.',
    s3Title: 'Understand Vietnamese culture', s3Body: 'Conical hats, áo dài, heritage, food… each topic takes a few minutes to read, with places to experience it yourself.',
    s1Cta: 'Create an itinerary', s2Cta: 'Browse services', s3Cta: 'Explore culture',
    missionTitle: 'What TravelPad stands for',
    healthyTitle: 'Healthy, transparent travel',
    healthyBody: 'Ratings come from travellers; only people who have connected can rate a service. No booking fees – you agree on price directly with the provider.',
    localTitle: 'Growing tourism at home',
    localBody: 'Every story you tell and every local homestay or eatery you choose helps a destination get noticed and gives local people more opportunities.',
    providerTitle: 'For providers', start: 'Start exploring', plan: 'Plan a trip',
  },
  /** Chú thích ảnh polaroid trang trí hai lề (components/decor) */
  decor: { khueVanCac: 'Temple of Literature', hoanKiem: 'Hoan Kiem Lake', haLong: 'Ha Long Bay', muCangChai: 'Mu Cang Chai', pho: 'Hanoi phở', hoiAn: 'Hoi An Old Town', cauVang: 'Golden Bridge', miQuang: 'Mì Quảng', benThanh: 'Ben Thanh Market', caiRang: 'Cai Rang floating market' },
};
