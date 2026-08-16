import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.roles.upsert({
    where: {
      Name: "admin",
    },
    update: {},
    create: {
      Name: "admin",
    },
  });

  await prisma.roles.upsert({
    where: {
      Name: "member",
    },
    update: {},
    create: {
      Name: "member",
    },
  });

  const password = await bcrypt.hash("admin123", 10);

  await prisma.users.upsert({
    where: {
      Email: "admin@esemkafoodcourt.com",
    },
    update: {},
    create: {
      FirstName: "System",
      LastName: "Administrator",
      Email: "admin@esemkafoodcourt.com",
      PhoneNumber: "081234567890",
      Password: password,
      RoleID: 1,
    },
  });

  await prisma.categories.createMany({
    data: [
      { Name: "Breakfast" },
      { Name: "Main Course" },
      { Name: "Appetizer" },
      { Name: "Desserts" },
      { Name: "Beverages" },
    ],
    skipDuplicates: true,
  });

  await prisma.tables.createMany({
    data: [
      { Name: "01" },
      { Name: "02" },
      { Name: "03" },
      { Name: "04" },
      { Name: "05" },
      { Name: "06" },
      { Name: "07" },
      { Name: "09" },
      { Name: "10" },
      { Name: "11" },
      { Name: "12" },
      { Name: "13" },
      { Name: "14" },
      { Name: "15" },
      { Name: "16" },
    ],
    skipDuplicates: true,
  });

  console.log("Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });