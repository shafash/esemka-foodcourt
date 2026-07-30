import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    await prisma.roles.createMany({
        data: [
            { Name: "admin" },
            { Name: "member" },
        ],
    });

    const password = await bcrypt.hash(
        "admin123",
        10
    );

    await prisma.users.create({
        data: {
            FirstName: "System",
            LastName: "Administrator",
            Email: "admin@esemkafoodcourt.com",
            PhoneNumber: "081234567890",
            Password: password,
            RoleID: 1
        }
    });
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