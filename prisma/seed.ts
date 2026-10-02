import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@shop.com" },
    update: {},
    create: {
      email: "admin@shop.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@shop.com" },
    update: {},
    create: {
      email: "user@shop.com",
      name: "John Doe",
      password: userPassword,
      role: "USER",
    },
  });

  // Categories
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Latest gadgets and electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: {
      name: "Clothing",
      slug: "clothing",
      description: "Fashion and apparel",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    },
  });

  const home = await prisma.category.upsert({
    where: { slug: "home-living" },
    update: {},
    create: {
      name: "Home & Living",
      slug: "home-living",
      description: "Home decor and essentials",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    },
  });

  // Products
  const products = [
    {
      name: "Wireless Noise-Cancelling Headphones",
      slug: "wireless-headphones",
      description:
        "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound. Perfect for travel and work.",
      price: 249.99,
      compareAt: 299.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      ]),
      stock: 50,
      featured: true,
      categoryId: electronics.id,
    },
    {
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      description:
        "Advanced fitness tracking, heart rate monitor, GPS, and smartphone notifications. Water resistant up to 50m.",
      price: 399.0,
      compareAt: 449.0,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      ]),
      stock: 30,
      featured: true,
      categoryId: electronics.id,
    },
    {
      name: "Minimalist Leather Jacket",
      slug: "leather-jacket",
      description:
        "Genuine leather jacket with a modern slim fit. Available in black and brown. Timeless style for any season.",
      price: 189.99,
      compareAt: 249.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
      ]),
      stock: 25,
      featured: true,
      categoryId: clothing.id,
    },
    {
      name: "Classic White Sneakers",
      slug: "white-sneakers",
      description:
        "Comfortable everyday sneakers made from premium materials. Perfect for casual wear and light exercise.",
      price: 89.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      ]),
      stock: 100,
      featured: false,
      categoryId: clothing.id,
    },
    {
      name: "Ceramic Plant Pot Set",
      slug: "plant-pot-set",
      description:
        "Set of 3 handmade ceramic pots in different sizes. Minimalist design that complements any interior.",
      price: 45.0,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800",
      ]),
      stock: 40,
      featured: false,
      categoryId: home.id,
    },
    {
      name: "Modern Desk Lamp",
      slug: "desk-lamp",
      description:
        "Adjustable LED desk lamp with touch controls and multiple brightness levels. USB charging port included.",
      price: 59.99,
      compareAt: 79.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
      ]),
      stock: 60,
      featured: true,
      categoryId: home.id,
    },
    {
      name: "Wireless Earbuds",
      slug: "wireless-earbuds",
      description:
        "True wireless earbuds with deep bass, touch controls, and 24-hour total battery life with charging case.",
      price: 129.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
      ]),
      stock: 80,
      featured: false,
      categoryId: electronics.id,
    },
    {
      name: "Organic Cotton T-Shirt",
      slug: "organic-tshirt",
      description:
        "Soft, breathable organic cotton t-shirt. Sustainable fashion that feels great and looks better.",
      price: 29.99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      ]),
      stock: 150,
      featured: false,
      categoryId: clothing.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("Seed completed!");
  console.log("Admin: admin@shop.com / admin123");
  console.log("User:  user@shop.com / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
