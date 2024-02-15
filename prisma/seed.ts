import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.createMany({
    data: [
      { name: "Pannipitsad" },
      { name: "Õhukesed pitsad" },
      { name: "Karastusjoogid" },
      { name: "Õlu" },
    ],
  });

  const ingredients = await prisma.ingredient.createMany({
    data: [
      { name: "Juust", price: 200 },
      { name: "Sinihallitusjuust", price: 200 },
      { name: "Mozzarella juust", price: 200 },
      { name: "Suitsujuust", price: 200 },
      { name: "Violife vegan juust", price: 200 },
      { name: "Sink", price: 200 },
      { name: "Salaamivorst", price: 200 },
      { name: "Krevetid", price: 200 },
      { name: "Tuunikala", price: 200 },
      { name: "Rannakarbid", price: 200 },
      { name: "Kebabiliha", price: 200 },
      { name: "Hakkliha", price: 200 },
      { name: "Suitsukana", price: 200 },
      { name: "Pepperonivorst", price: 200 },
      { name: "Peekon", price: 200 },
      { name: "Prosciutto sink", price: 200 },
      { name: "Vegan Salaami", price: 200 },
      { name: "Vöner vegan kebab", price: 200 },
      { name: "Röstkana", price: 200 },
      { name: "Ananass", price: 150 },
      { name: "Paprika", price: 150 },
      { name: "Küüslauk", price: 150 },
      { name: "Sibul", price: 150 },
      { name: "Tomat", price: 150 },
      { name: "Shampinjonid", price: 150 },
      { name: "Marineeritud kurk", price: 150 },
      { name: "Mais", price: 150 },
      { name: "Mustad oliivid", price: 150 },
      { name: "Pärlsibul", price: 150 },
      { name: "Virsik", price: 150 },
      { name: "Pepperonikaun", price: 150 },
      { name: "Rukola", price: 150 },
      { name: "jalapeno", price: 150 },
      { name: "BBQ kaste", price: 150 },
      { name: "Chipotle kaste", price: 150 },
      { name: "Vegan majonees", price: 150 },
      { name: "Tomatikaste", price: 150 },
    ],
  });

  const item = await prisma.item.create({
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

  const drink = await prisma.item.create({
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
