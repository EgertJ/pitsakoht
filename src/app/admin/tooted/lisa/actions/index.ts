"use server";

import { ItemSchema } from "@/lib/types";
import { z } from "zod";
import path from "path";
import fs from "fs/promises";
import prisma from "@/lib/db";
import { validateRequest } from "@/lib/getUser";

export async function addItem({ data }: { data: z.infer<typeof ItemSchema> }) {
  const { user } = await validateRequest();

  if (!user || !user.emailVerified || user.role !== "ADMIN")
    return { error: "Pole lubatud!" };

  const result = ItemSchema.safeParse(data);

  if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };

  let savedImagePath = null;
  let image = null;
  if (result.data.image) {
    image = result.data.image.get("file") as File;
  }

  if (image) {
    const imagePath = path.join(process.cwd(), "/public/uploadedImages");

    const fileName = Date.now().toString() + "_" + image?.name;
    const filePath = path.join(imagePath, fileName);

    try {
      await fs.readdir(imagePath);
    } catch (error) {
      await fs.mkdir(imagePath);
    }

    try {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);
      savedImagePath = "/uploadedImages/" + fileName;
    } catch (error) {
      return { error: "Pildi salvestamisel tekkis probleem, proovige uuesti." };
    }
  }

  let categoryId = null;

  try {
    const categoryIdNumber = await prisma.category.findFirstOrThrow({
      where: { id: Number(result.data.categoryId) },
    });

    categoryId = categoryIdNumber.id;
  } catch (error) {
    const databaseCategory = await prisma.category.create({
      data: {
        name: result.data.categoryId,
      },
    });

    categoryId = databaseCategory.id;
  }

  const ingredients = result.data.incredients || [];
  const addons = result.data.addons || [];
  const sizes = result.data.sizes || [];

  const item = await prisma.item.create({
    data: {
      name: result.data.name,
      topCategory: result.data.topCategory,
      categoryId: categoryId,
      price: Number(result.data.price),
      discountPrice: Number(result.data.discountPrice),
      image: savedImagePath,
    },
  });

  // Add the ingredients to the item
  for (const ingredientId of ingredients) {
    await prisma.itemIngredient.create({
      data: {
        itemId: item.id,
        ingredientId: Number(ingredientId),
      },
    });
  }

  // Add the addons to the item
  for (const addonId of addons) {
    await prisma.itemAddon.create({
      data: {
        itemId: item.id,
        ingredientId: Number(addonId),
      },
    });
  }

  // Add the sizes to the item
  for (const size of sizes) {
    await prisma.size.create({
      data: {
        value: size.name,
        price: Number(size.price),
        itemId: item.id,
      },
    });
  }
}
