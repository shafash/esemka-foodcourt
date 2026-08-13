import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.categories.findMany({
    orderBy: { ID: "asc" },
  });

  const seenNames = new Set();
  const idsToDelete = [];

  for (const category of categories) {
    if (seenNames.has(category.Name)) {
      idsToDelete.push(category.ID);
    } else {
      seenNames.add(category.Name);
    }
  }

  if (idsToDelete.length === 0) {
    console.log("No duplicate categories found.");
    return;
  }

  for (const id of idsToDelete) {
    const dupe = categories.find((c) => c.ID === id);
    const keeper = categories.find(
      (c) => c.Name === dupe.Name && !idsToDelete.includes(c.ID)
    );
    await prisma.menus.updateMany({
      where: { CategoryID: id },
      data: { CategoryID: keeper.ID },
    });
  }

  await prisma.categories.deleteMany({
    where: { ID: { in: idsToDelete } },
  });

  console.log(`Deleted ${idsToDelete.length} duplicate categories.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });