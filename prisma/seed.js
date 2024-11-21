const bcrypt = require('bcryptjs')
const prisma = require('../src/model/prisma')

const hashPassword = bcrypt.hashSync("1234567",10)

const userData = [
            {
              firstName: "pan",
              lastName: "Johnson",
              email: "pan@mail.com",
              phone: "123-456-7890",
              address: "123 Maple Street, Springfield",
              password: hashPassword,
              role: "ADMIN"
            },
            {
              firstName: "Bob",
              lastName: "Smith",
              email: "bob@example.com",
              phone: "987-654-3210",
              address: "456 Oak Avenue, Metropolis",
              password: hashPassword,
              role: "USER"
            },
            {
              firstName: "Charlie",
              lastName: "Davis",
              email: "charlie@example.com",
              phone: "555-0123",
              address: "789 Pine Road, Gotham",
              password: hashPassword,
              role: "USER"
            },
            {
              firstName: "Dana",
              lastName: "Lee",
              email: "dana@example.com",
              phone: "444-3210",
              address: "321 Birch Circle, Star City",
              password: hashPassword,
              role: "USER"
            },
            {
              firstName: "Eva",
              lastName: "Clark",
              email: "eva@example.com",
              phone: "333-7654",
              address: "654 Elm Street, Central City",
              password: hashPassword,
              role: "USER"
            }
          ]
       
async function  run(){
  await prisma.user.createMany({
      data: userData
  })
  
}
run()

const productImg =[
  {image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', orderId: 5 },
  {image: 'https://images.unsplash.com/photo-1522115174737-2497162f69ec?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', orderId: 3 },
  {image: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', orderId: 3 },
  {image: 'https://images.unsplash.com/photo-1512390225428-a9d51c817f94?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', orderId: 4 },
  {image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', orderId: 5  },
  {image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', orderId: 6 },
  {image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D', orderId: 7 },
  {image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', orderId: 8 },
  {image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', orderId: 9 },
  {image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', orderId: 10 },
  {image: 'https://unsplash.com/photos/pair-of-blue-and-pink-floral-almond-toe-pumps-E-0ON3VGrBc', orderId: 10 },
]

async function order(){
      for (let i = 0; i < 10; i++) {
        const order = await prisma.order.create({
            data: {
                orderDate: new Date(),
                name: `Product ${i + 1}`,
                detail: `Details for product ${i + 1}`,
                webLink: `http://example.com/product${i + 1}`,
                userId: Math.floor(Math.random() * 3) + 1, // Random userId between 1 and 3
                sellingPrice: Math.random() * 100, // Random price between 0 and 100
                deposite: Math.random() * 20, // Random deposit between 0 and 20
                remain: Math.random() * 80, // Random remaining stock
                userPaymentStatus: 'NOT_PAY',
                buyerId: 1, // Assuming you have 10 buyers
                cost: Math.random() * 50, // Random cost between 0 and 50
                trackingNo: `TRACK${i + 1}`,
                shippingStatus: 'PENDING',
                buyerPaymentStatus: 'NOT_PAY',
            },
        });
        console.log(`Created order with id: ${i}`);
   }
  }


console.log("DB Seed....")
// order()

async function productPic (){
  await prisma.productImage.createMany({
    data:productImg
  })
}



// productPic()

