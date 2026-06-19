const {PrismaClient} = require("@prisma/client");//pulls prisma client out of the prisma package using destructuring

const prisma = new PrismaClient();//creates a single Prisma client instance, this is connection to the database, all queries go through this object
module.exports = prisma;//exports the single instance so every route file can inport and share it