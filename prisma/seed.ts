import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const packages = [
  {
    slug: "lagos-city-explorer",
    title: "Lagos City Explorer",
    summary:
      "Dive into the energy of Nigeria's biggest city — beaches, art, food, and nightlife.",
    description:
      "Experience Lagos like a local: from the historic streets of Lagos Island to the golden sands of Tarkwa Bay, the buzzing art scene of Nike Art Gallery, and the city's legendary nightlife. This tour blends culture, history, and modern city energy into one unforgettable trip.",
    itinerary:
      "Day 1: Arrival & Victoria Island orientation walk\nDay 2: Lagos Island history tour + Nike Art Gallery\nDay 3: Tarkwa Bay boat trip & beach day\nDay 4: Lekki Conservation Centre & local food crawl\nDay 5: Free day + departure",
    location: "Lagos",
    durationDays: 5,
    price: 650,
    maxGroupSize: 12,
    imageUrl: "https://picsum.photos/seed/lagos-city-explorer/1200/800",
    gallery: JSON.stringify([
      "https://picsum.photos/seed/lagos-1/800/600",
      "https://picsum.photos/seed/lagos-2/800/600",
      "https://picsum.photos/seed/lagos-3/800/600",
    ]),
  },
  {
    slug: "abuja-capital-experience",
    title: "Abuja Capital Experience",
    summary:
      "Explore Nigeria's planned capital — monuments, Aso Rock, and green spaces.",
    description:
      "A relaxed, scenic tour of Abuja covering its iconic landmarks: the Aso Rock formation, the National Mosque and Church, Millennium Park, and the surrounding hills. Ideal for travelers who want culture and comfort in equal measure.",
    itinerary:
      "Day 1: Arrival & city orientation\nDay 2: Aso Rock & Aso Rock Villa viewpoint\nDay 3: National Mosque, National Church & Millennium Park\nDay 4: Jabi Lake & Zuma Rock day trip\nDay 5: Departure",
    location: "Abuja",
    durationDays: 5,
    price: 700,
    maxGroupSize: 12,
    imageUrl: "https://picsum.photos/seed/abuja-capital-experience/1200/800",
    gallery: JSON.stringify([
      "https://picsum.photos/seed/abuja-1/800/600",
      "https://picsum.photos/seed/abuja-2/800/600",
      "https://picsum.photos/seed/abuja-3/800/600",
    ]),
  },
  {
    slug: "calabar-carnival-cross-river",
    title: "Calabar Carnival & Cross River",
    summary:
      "Rainforests, gorillas, and Africa's biggest street party — Calabar has it all.",
    description:
      "Calabar is Nigeria's cleanest city and home to the famous Calabar Carnival. This tour pairs the carnival's color and music with the natural wonders of Cross River National Park, including canopy walks and gorilla sanctuary visits.",
    itinerary:
      "Day 1: Arrival & Calabar city tour\nDay 2: Cross River National Park & canopy walkway\nDay 3: Drill Ranch primate sanctuary\nDay 4: Calabar Carnival experience\nDay 5: Marina Resort & departure",
    location: "Calabar",
    durationDays: 5,
    price: 780,
    maxGroupSize: 10,
    imageUrl: "https://picsum.photos/seed/calabar-carnival-cross-river/1200/800",
    gallery: JSON.stringify([
      "https://picsum.photos/seed/calabar-1/800/600",
      "https://picsum.photos/seed/calabar-2/800/600",
      "https://picsum.photos/seed/calabar-3/800/600",
    ]),
  },
  {
    slug: "zuma-rock-niger-adventure",
    title: "Zuma Rock & Niger Adventure",
    summary:
      "Chase Nigeria's most iconic monolith and cruise the mighty Niger River.",
    description:
      "A journey through central Nigeria's dramatic landscapes: the towering Zuma Rock, riverside villages along the Niger, and quiet countryside far from the city noise. Great for travelers who want nature and photography opportunities.",
    itinerary:
      "Day 1: Arrival in Suleja & Zuma Rock viewing\nDay 2: Niger River boat cruise\nDay 3: Riverside village visit & local market\nDay 4: Countryside hike & photography\nDay 5: Departure",
    location: "Niger State",
    durationDays: 4,
    price: 590,
    maxGroupSize: 10,
    imageUrl: "https://picsum.photos/seed/zuma-rock-niger-adventure/1200/800",
    gallery: JSON.stringify([
      "https://picsum.photos/seed/zuma-1/800/600",
      "https://picsum.photos/seed/zuma-2/800/600",
      "https://picsum.photos/seed/zuma-3/800/600",
    ]),
  },
  {
    slug: "obudu-mountain-resort-getaway",
    title: "Obudu Mountain Resort Getaway",
    summary:
      "Cool mountain air, cable cars, and highland scenery in southeastern Nigeria.",
    description:
      "Escape the heat on the Obudu Plateau, 1,600 meters above sea level. Ride the cable car up the mountain, hike scenic trails, and relax in one of Nigeria's most beautiful highland resorts, surrounded by waterfalls and grazing cattle ranches.",
    itinerary:
      "Day 1: Arrival & cable car ascent to the plateau\nDay 2: Grassland hiking & waterfall visit\nDay 3: Canopy walkway & mountain lake\nDay 4: Ranch visit & relaxation\nDay 5: Cable car descent & departure",
    location: "Cross River State",
    durationDays: 5,
    price: 820,
    maxGroupSize: 8,
    imageUrl: "https://picsum.photos/seed/obudu-mountain-resort/1200/800",
    gallery: JSON.stringify([
      "https://picsum.photos/seed/obudu-1/800/600",
      "https://picsum.photos/seed/obudu-2/800/600",
      "https://picsum.photos/seed/obudu-3/800/600",
    ]),
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@naijaadventuretours.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Site Admin",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`Seeded admin user: ${adminEmail}`);

  for (const pkg of packages) {
    await prisma.tourPackage.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }
  console.log(`Seeded ${packages.length} tour packages`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
