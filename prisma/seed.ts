import { PrismaClient } from "@prisma/client";
import { links } from "../data/links";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.create({
    data: {
      email: "testnigga@gmail.com",
      role: "USER",
    },
  });

  await prisma.link.createMany({
    data: links,
  });
};

main()
  .then(() => {
    console.log("successfully sedded data yay!!");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
