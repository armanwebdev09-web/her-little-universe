/**
 * HER LITTLE UNIVERSE - DEVELOPMENT SEED SCRIPT
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Admin User
  const defaultAdminEmail = process.env.ADMIN_EMAIL || "admin@herlittleuniverse.com";
  const defaultPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: defaultAdminEmail },
    update: {},
    create: {
      email: defaultAdminEmail,
      passwordHash,
    },
  });
  console.log(`Seeded Admin User: ${admin.email}`);

  // Seed Birthday Config
  const bday = await prisma.birthdayConfig.create({
    data: {
      birthdayDate: "2026-09-15T00:00:00",
      herName: "SOFIA",
      heroMessage: "Today, the whole little universe is celebrating you.",
      finalMessage: "Thank you for being part of my universe.",
    },
  });
  console.log("Seeded Birthday Config:", bday.id);

  console.log("Seeding finished cleanly.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
