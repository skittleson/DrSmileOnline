export interface Location {
  slug: string;
  name: string;
  city: string;
  region: string;
  streetAddress: string;
  address: string;
  phone: string;
  postalCode: string;
  mapQuery: string;
  hoursEn: string;
  hoursEs: string;
}

export const locations: Location[] = [
  {
    slug: 'newport-beach',
    name: 'Newport Beach',
    city: 'Newport Beach',
    region: 'Newport Beach, CA',
    streetAddress: '2121 East Coast Hwy Ste 140',
    address: '2121 East Coast Hwy Ste 140, Newport Beach, CA 92660',
    phone: '(949) 640-0222',
    postalCode: '92660',
    mapQuery: '2121 East Coast Hwy Ste 140, Newport Beach, CA 92660',
    hoursEn: 'Mon–Fri: 8AM–5PM, Sat: By appointment',
    hoursEs: 'Lun–Vie: 8AM–5PM, Sáb: Por cita',
  },
  {
    slug: 'san-pedro',
    name: 'San Pedro',
    city: 'San Pedro',
    region: 'San Pedro, CA',
    streetAddress: '1622 S Gaffey St',
    address: '1622 S Gaffey St, San Pedro, CA 90731',
    phone: '(310) 548-8128',
    postalCode: '90731',
    mapQuery: '1622 S Gaffey St, San Pedro, CA 90731',
    hoursEn: 'Mon–Fri: 8AM–5PM, Sat: By appointment',
    hoursEs: 'Lun–Vie: 8AM–5PM, Sáb: Por cita',
  },
  {
    slug: 'torrance',
    name: 'Torrance',
    city: 'Torrance',
    region: 'Torrance, CA',
    streetAddress: '24667 Crenshaw Blvd D',
    address: '24667 Crenshaw Blvd D, Torrance, CA 90505',
    phone: '(310) 325-8555',
    postalCode: '90505',
    mapQuery: '24667 Crenshaw Blvd D, Torrance, CA 90505',
    hoursEn: 'Mon–Fri: 8AM–5PM, Sat: By appointment',
    hoursEs: 'Lun–Vie: 8AM–5PM, Sáb: Por cita',
  },
  {
    slug: 'lomita',
    name: 'Lomita',
    city: 'Lomita',
    region: 'Lomita, CA',
    streetAddress: '2104 Pacific Coast Hwy #5',
    address: '2104 Pacific Coast Hwy #5, Lomita, CA 90717',
    phone: '(310) 539-1111',
    postalCode: '90717',
    mapQuery: '2104 Pacific Coast Hwy #5, Lomita, CA 90717',
    hoursEn: 'Mon–Fri: 8AM–5PM, Sat: By appointment',
    hoursEs: 'Lun–Vie: 8AM–5PM, Sáb: Por cita',
  },
];

export const getDirectionsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const getMapEmbedSrc = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
