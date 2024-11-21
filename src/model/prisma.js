const {PrismaClient,UserPayment} = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = prisma;