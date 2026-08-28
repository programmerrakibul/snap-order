import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { DiscountType, ProductStatus } from "../src/generated/prisma/enums";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const two = (value: number) => Number(value.toFixed(2));

const sku = (category: string, index: number) =>
  `${category.toUpperCase().slice(0, 3)}-${String(1000 + index).padStart(8, "0")}`;

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Sports & Outdoors", slug: "sports-outdoors" },
  { name: "Beauty & Personal Care", slug: "beauty-personal-care" },
  { name: "Books", slug: "books" },
  { name: "Toys & Games", slug: "toys-games" },
  { name: "Automotive", slug: "automotive" },
  { name: "Health & Wellness", slug: "health-wellness" },
  { name: "Office Supplies", slug: "office-supplies" },
];

const products = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    brand: "SonicLab",
    description:
      "Premium over-ear headphones with active noise cancellation, 40-hour battery life and plush memory foam ear cushions.",
    category: "Electronics",
    tags: ["audio", "wireless", "noise-cancelling"],
    isFeatured: true,
    stock: 46,
    minThreshold: 10,
    maxThreshold: 80,
    costPrice: 88.0,
    originalPrice: 149.99,
    discount: { type: DiscountType.PERCENTAGE, value: 15 },
    attributes: { color: "Black", style: "Over-Ear" },
  },
  {
    name: "4K UHD Smart LED TV 55-Inch",
    brand: "VisionPlus",
    description:
      "Cinematic 4K HDR display with smart streaming apps, voice remote and ultra-thin bezel design for your living room.",
    category: "Electronics",
    tags: ["television", "4k", "smart-tv"],
    isFeatured: true,
    stock: 22,
    minThreshold: 10,
    maxThreshold: 40,
    costPrice: 410.0,
    originalPrice: 549.99,
    discount: null,
    attributes: { size: "55 inch", resolution: "4K UHD" },
  },
  {
    name: "Classic Denim Jacket",
    brand: "UrbanThreads",
    description:
      "Timeless medium-wash denim jacket cut from durable cotton denim with a regular fit and double chest pockets.",
    category: "Fashion",
    tags: ["denim", "jacket", "outerwear"],
    isFeatured: true,
    stock: 64,
    minThreshold: 10,
    maxThreshold: 100,
    costPrice: 34.0,
    originalPrice: 59.99,
    discount: null,
    attributes: { color: "Medium Wash", size: "M" },
  },
  {
    name: "AirFlow Running Sneakers",
    brand: "StrideCo",
    description:
      "Featherlight running shoes with responsive foam midsole and breathable knit upper for all-day comfort.",
    category: "Fashion",
    tags: ["running", "sneakers", "shoes"],
    isFeatured: false,
    stock: 31,
    minThreshold: 10,
    maxThreshold: 60,
    costPrice: 42.0,
    originalPrice: 79.99,
    discount: { type: DiscountType.FIXED, value: 10 },
    attributes: { color: "White", size: "US 9" },
  },
  {
    name: "12-Piece Stainless Steel Cookware Set",
    brand: "ChefCore",
    description:
      "Durable tri-ply stainless steel pots and pans set with stay-cool handles, suitable for all cooktops.",
    category: "Home & Kitchen",
    tags: ["cookware", "kitchen", "stainless-steel"],
    isFeatured: false,
    stock: 18,
    minThreshold: 10,
    maxThreshold: 40,
    costPrice: 130.0,
    originalPrice: 189.99,
    discount: null,
    attributes: { type: "Set", pieces: "12" },
  },
  {
    name: "Barista Pro Espresso Machine",
    brand: "BrewTech",
    description:
      "Semi-automatic espresso machine with 15-bar pump, built-in milk frother and precision temperature control.",
    category: "Home & Kitchen",
    tags: ["coffee", "espresso", "kitchen-appliances"],
    isFeatured: true,
    stock: 9,
    minThreshold: 10,
    maxThreshold: 30,
    costPrice: 210.0,
    originalPrice: 299.0,
    discount: { type: DiscountType.PERCENTAGE, value: 10 },
    attributes: { color: "Stainless", tank: "2L" },
  },
  {
    name: "Non-Slip Yoga Mat",
    brand: "ZenFit",
    description:
      "Eco-friendly TPE yoga mat with a textured non-slip surface, alignment cues and a carrying strap included.",
    category: "Sports & Outdoors",
    tags: ["yoga", "fitness", "exercise"],
    isFeatured: false,
    stock: 87,
    minThreshold: 10,
    maxThreshold: 120,
    costPrice: 16.0,
    originalPrice: 34.99,
    discount: null,
    attributes: { color: "Purple", thickness: "6mm" },
  },
  {
    name: "TrailGuard Mountain Bike Helmet",
    brand: "TrailGuard",
    description:
      "Ventilated MTB helmet with adjustable fit system, removable visor and lightweight in-mold construction.",
    category: "Sports & Outdoors",
    tags: ["cycling", "helmet", "safety"],
    isFeatured: false,
    stock: 3,
    minThreshold: 10,
    maxThreshold: 50,
    costPrice: 23.0,
    originalPrice: 44.99,
    discount: null,
    attributes: { color: "Matte Black", size: "M/L" },
  },
  {
    name: "HydraGlow Vitamin C Face Serum",
    brand: "HydraGlow",
    description:
      "Brightening vitamin C serum with hyaluronic acid to even skin tone and boost radiance in four weeks.",
    category: "Beauty & Personal Care",
    tags: ["skincare", "serum", "vitamin-c"],
    isFeatured: false,
    stock: 120,
    minThreshold: 10,
    maxThreshold: 150,
    costPrice: 9.5,
    originalPrice: 24.99,
    discount: null,
    attributes: { size: "30ml", skinType: "All" },
  },
  {
    name: "SonicClean Electric Toothbrush",
    brand: "SonicClean",
    description:
      "Sonic electric toothbrush with a 2-minute smart timer, three cleaning modes and long-lasting USB charging.",
    category: "Beauty & Personal Care",
    tags: ["oral-care", "toothbrush", "electric"],
    isFeatured: false,
    stock: 78,
    minThreshold: 10,
    maxThreshold: 100,
    costPrice: 18.0,
    originalPrice: 39.99,
    discount: { type: DiscountType.FIXED, value: 5 },
    attributes: { color: "White", modes: "3" },
  },
  {
    name: "The Midnight Library",
    brand: "Penguin Books",
    description:
      "A bestselling fiction novel exploring the infinite possibilities of the lives we could have lived.",
    category: "Books",
    tags: ["fiction", "novel", "bestseller"],
    isFeatured: true,
    stock: 145,
    minThreshold: 10,
    maxThreshold: 200,
    costPrice: 8.0,
    originalPrice: 17.99,
    discount: null,
    attributes: { format: "Paperback", pages: "304" },
  },
  {
    name: "Atomic Habits",
    brand: "Avery Publishing",
    description:
      "Practical guide to building good habits and breaking bad ones through tiny, incremental changes.",
    category: "Books",
    tags: ["self-help", "habits", "non-fiction"],
    isFeatured: false,
    stock: 210,
    minThreshold: 10,
    maxThreshold: 250,
    costPrice: 9.0,
    originalPrice: 19.99,
    discount: null,
    attributes: { format: "Paperback", pages: "320" },
  },
  {
    name: "Mega Brick Building Blocks Set 500 pcs",
    brand: "MegaBrick",
    description:
      "A 500-piece colorful building block set that sparks creativity and STEM learning for kids aged 4 and up.",
    category: "Toys & Games",
    tags: ["building-blocks", "stem", "kids"],
    isFeatured: false,
    stock: 55,
    minThreshold: 10,
    maxThreshold: 90,
    costPrice: 21.0,
    originalPrice: 39.99,
    discount: { type: DiscountType.PERCENTAGE, value: 20 },
    attributes: { pieces: "500", ageGroup: "4+" },
  },
  {
    name: "TurboX Remote Control Racing Car",
    brand: "TurboX",
    description:
      "High-speed 1:16 scale RC racing car with full proportional control and bounce-resistant tires.",
    category: "Toys & Games",
    tags: ["rc-car", "remote-control", "racing"],
    isFeatured: false,
    stock: 12,
    minThreshold: 10,
    maxThreshold: 40,
    costPrice: 26.0,
    originalPrice: 49.99,
    discount: null,
    attributes: { color: "Red", scale: "1:16" },
  },
  {
    name: "DashCam Pro 4K Front and Rear",
    brand: "RoadEye",
    description:
      "Dual-channel dash camera recording crisp 4K video with built-in GPS, night vision and loop recording.",
    category: "Automotive",
    tags: ["dashcam", "car-accessories", "4k"],
    isFeatured: true,
    stock: 27,
    minThreshold: 10,
    maxThreshold: 60,
    costPrice: 64.0,
    originalPrice: 119.99,
    discount: null,
    attributes: { channels: "2", resolution: "4K" },
  },
  {
    name: "Cyclone Cordless Car Vacuum",
    brand: "Cyclone",
    description:
      "Powerful cordless handheld vacuum with HEPA filter and LED nozzle, perfect for cars and tight spaces.",
    category: "Automotive",
    tags: ["vacuum", "cleaning", "car"],
    isFeatured: false,
    stock: 34,
    minThreshold: 10,
    maxThreshold: 70,
    costPrice: 30.0,
    originalPrice: 54.99,
    discount: { type: DiscountType.FIXED, value: 8 },
    attributes: { battery: "2500mAh", color: "Black" },
  },
  {
    name: "Precision Digital Blood Pressure Monitor",
    brand: "VitalCheck",
    description:
      "Clinically accurate wrist blood pressure monitor with irregular heartbeat detection and a large backlit display.",
    category: "Health & Wellness",
    tags: ["blood-pressure", "medical", "health"],
    isFeatured: false,
    stock: 41,
    minThreshold: 10,
    maxThreshold: 80,
    costPrice: 19.0,
    originalPrice: 36.99,
    discount: null,
    attributes: { type: "Wrist", display: "Backlit" },
  },
  {
    name: "FitTrack Smart Fitness Watch",
    brand: "FitTrack",
    description:
      "Fitness tracker watch with heart-rate and sleep monitoring, 20 sport modes and 7-day battery life.",
    category: "Health & Wellness",
    tags: ["smartwatch", "fitness", "tracker"],
    isFeatured: true,
    stock: 7,
    minThreshold: 10,
    maxThreshold: 50,
    costPrice: 26.0,
    originalPrice: 49.99,
    discount: { type: DiscountType.PERCENTAGE, value: 12 },
    attributes: { color: "Black", battery: "7 days" },
  },
  {
    name: "Ergonomic Mesh Office Chair",
    brand: "DeskComfort",
    description:
      "Breathable mesh back office chair with lumbar support, adjustable armrests and a smooth-rolling base.",
    category: "Office Supplies",
    tags: ["office", "chair", "ergonomic"],
    isFeatured: true,
    stock: 14,
    minThreshold: 10,
    maxThreshold: 30,
    costPrice: 110.0,
    originalPrice: 179.99,
    discount: null,
    attributes: { color: "Black", material: "Mesh" },
  },
  {
    name: "Ultra Fine Gel Pen Set 12 pc",
    brand: "InkWell",
    description:
      "Smooth-writing 0.5mm gel pens in twelve vivid colors with a comfortable rubber grip and quick-dry ink.",
    category: "Office Supplies",
    tags: ["pens", "stationery", "writing"],
    isFeatured: false,
    stock: 260,
    minThreshold: 10,
    maxThreshold: 300,
    costPrice: 4.5,
    originalPrice: 11.99,
    discount: null,
    attributes: { tip: "0.5mm", count: "12" },
  },
];

async function seed() {
  console.log("Seeding database...");

  const categoriesById: Record<string, string> = {};

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      create: {
        name: category.name,
        slug: category.slug,
        image: `https://picsum.photos/seed/${category.slug}/600/600`,
      },
      update: {},
    });

    categoriesById[category.name] = created.id;
  }

  console.log(`Seeded ${categories.length} categories.`);

  let productCount = 0;

  for (const product of products) {
    const categoryId = categoriesById[product.category];

    if (!categoryId) {
      throw new Error(`Missing category ${product.category}`);
    }

    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    const discountAmount = product.discount
      ? product.discount.type === DiscountType.FIXED
        ? product.discount.value
        : two((product.originalPrice * product.discount.value) / 100)
      : null;

    await prisma.product.upsert({
      where: { slug },
      create: {
        name: product.name,
        description: product.description,
        brand: product.brand,
        slug,
        tags: product.tags,
        categoryId,
        status: ProductStatus.ACTIVE,
        isFeatured: product.isFeatured,
        images: {
          create: {
            url: `https://picsum.photos/seed/${slug}/600/600`,
            altText: product.name,
            isPrimary: true,
          },
        },
        variants: {
          create: {
            sku: sku(product.category, productCount),
            attributes: product.attributes,
            stock: product.stock,
            minThreshold: product.minThreshold,
            maxThreshold: product.maxThreshold,
            costPrice: product.costPrice,
            originalPrice: product.originalPrice,
            discountType: product.discount?.type ?? null,
            discountValue: product.discount?.value ?? null,
            discountAmount,
            isActive: true,
          },
        },
      },
      update: {},
    });

    productCount += 1;
  }

  console.log(`Seeded ${productCount} products with variants.`);
  console.log("Done.");
}

seed()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });