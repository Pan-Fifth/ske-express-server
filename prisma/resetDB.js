require('dotenv').config()
const prisma = require('../src/model/prisma')

async function run(){
    await prisma.$executeRawUnsafe("DROP DATABASE SK_EXPRESS")
    await prisma.$executeRawUnsafe("CREATE DATABASE SK_EXPRESS")
}

console.log("Reset DB...")
run()