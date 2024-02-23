import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Pannipitsad" },
      { name: "Õhukesed pitsad" },
      { name: "Karastusjoogid" },
      { name: "Õlu" },
    ],
  });

  await prisma.ingredient.createMany({
    data: [
      { name: "Juust", price: 200, category: "topping" },
      { name: "Sinihallitusjuust", price: 200, category: "topping" },
      { name: "Mozzarella juust", price: 200, category: "topping" },
      { name: "Suitsujuust", price: 200, category: "topping" },
      { name: "Violife vegan juust", price: 200, category: "topping" },
      { name: "Sink", price: 200, category: "topping" },
      { name: "Salaamivorst", price: 200, category: "topping" },
      { name: "Krevetid", price: 200, category: "topping" },
      { name: "Tuunikala", price: 200, category: "topping" },
      { name: "Rannakarbid", price: 200, category: "topping" },
      { name: "Kebabiliha", price: 200, category: "topping" },
      { name: "Hakkliha", price: 200, category: "topping" },
      { name: "Suitsukana", price: 200, category: "topping" },
      { name: "Pepperonivorst", price: 200, category: "topping" },
      { name: "Peekon", price: 200, category: "topping" },
      { name: "Prosciutto sink", price: 200, category: "topping" },
      { name: "Vegan Salaami", price: 200, category: "topping" },
      { name: "Vöner vegan kebab", price: 200, category: "topping" },
      { name: "Röstkana", price: 200, category: "topping" },
      { name: "Ananass", price: 150, category: "topping" },
      { name: "Paprika", price: 150, category: "topping" },
      { name: "Küüslauk", price: 150, category: "topping" },
      { name: "Sibul", price: 150, category: "topping" },
      { name: "Tomat", price: 150, category: "topping" },
      { name: "Shampinjonid", price: 150, category: "topping" },
      { name: "Marineeritud kurk", price: 150, category: "topping" },
      { name: "Mais", price: 150, category: "topping" },
      { name: "Mustad oliivid", price: 150, category: "topping" },
      { name: "Pärlsibul", price: 150, category: "topping" },
      { name: "Virsik", price: 150, category: "topping" },
      { name: "Pepperonikaun", price: 150, category: "topping" },
      { name: "Rukola", price: 150, category: "topping" },
      { name: "jalapeno", price: 150, category: "topping" },
      { name: "BBQ kaste", price: 150, category: "sauce" },
      { name: "Chipotle kaste", price: 150, category: "sauce" },
      { name: "Vegan majonees", price: 150, category: "sauce" },
      { name: "Tomatikaste", price: 150, category: "topping" },
    ],
  });

  await prisma.item.create({
    data: {
      name: "Panni Hawaii",
      image: "/Hawaii.jpg",
      categoryId: 1,
      topCategory: "Pizza",
      price: 1040,
      incredients: {
        create: [
          { ingredientId: 6 },
          { ingredientId: 20 },
          { ingredientId: 1 },
          { ingredientId: 37 },
        ],
      },
      addons: {
        create: [
          { ingredientId: 1 },
          { ingredientId: 2 },
          { ingredientId: 3 },
          { ingredientId: 4 },
          { ingredientId: 5 },
          { ingredientId: 6 },
          { ingredientId: 7 },
          { ingredientId: 8 },
          { ingredientId: 9 },
          { ingredientId: 10 },
          { ingredientId: 11 },
          { ingredientId: 12 },
          { ingredientId: 13 },
          { ingredientId: 14 },
          { ingredientId: 15 },
          { ingredientId: 16 },
          { ingredientId: 17 },
          { ingredientId: 18 },
          { ingredientId: 19 },
          { ingredientId: 20 },
          { ingredientId: 21 },
          { ingredientId: 22 },
          { ingredientId: 23 },
          { ingredientId: 24 },
          { ingredientId: 25 },
          { ingredientId: 26 },
          { ingredientId: 27 },
          { ingredientId: 28 },
          { ingredientId: 29 },
          { ingredientId: 30 },
          { ingredientId: 31 },
          { ingredientId: 32 },
          { ingredientId: 33 },
          { ingredientId: 34 },
          { ingredientId: 35 },
          { ingredientId: 36 },
        ],
      },
      sizes: {
        create: [
          { value: "s", price: 1040 },
          { value: "m", price: 1040 + 150 },
        ],
      },
    },
  });

  await prisma.item.create({
    data: {
      name: "Pepperoni",
      image: "/Pepperoni.jpg",
      categoryId: 2,
      topCategory: "Pizza",
      price: 890,
      sizes: {
        create: [
          { value: "s", price: 890 },
          { value: "m", price: 890 + 150 },
          { value: "l", price: 1800 },
        ],
      },
      incredients: {
        create: [
          { ingredientId: 14 },
          { ingredientId: 1 },
          { ingredientId: 37 },
        ],
      },
      addons: {
        create: [
          { ingredientId: 1 },
          { ingredientId: 2 },
          { ingredientId: 3 },
          { ingredientId: 4 },
          { ingredientId: 5 },
          { ingredientId: 6 },
          { ingredientId: 7 },
          { ingredientId: 8 },
          { ingredientId: 9 },
          { ingredientId: 10 },
          { ingredientId: 11 },
          { ingredientId: 12 },
          { ingredientId: 13 },
          { ingredientId: 14 },
          { ingredientId: 15 },
          { ingredientId: 16 },
          { ingredientId: 17 },
          { ingredientId: 18 },
          { ingredientId: 19 },
          { ingredientId: 20 },
          { ingredientId: 21 },
          { ingredientId: 22 },
          { ingredientId: 23 },
          { ingredientId: 24 },
          { ingredientId: 25 },
          { ingredientId: 26 },
          { ingredientId: 27 },
          { ingredientId: 28 },
          { ingredientId: 29 },
          { ingredientId: 30 },
          { ingredientId: 31 },
          { ingredientId: 32 },
          { ingredientId: 33 },
          { ingredientId: 34 },
          { ingredientId: 35 },
          { ingredientId: 36 },
        ],
      },
    },
  });

  await prisma.item.create({
    data: {
      name: "Coca-cola 0.5L",
      categoryId: 3,
      topCategory: "Else",
      price: 250,
    },
  });
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
