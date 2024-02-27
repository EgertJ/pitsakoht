"use server";

import prisma from "@/lib/db";
import { getUser } from "@/lib/shared/actions/actions";
import { ItemSchema, UpdateItemSchema } from "@/lib/types";
import path from "path";
import { z } from "zod";
import fs from "fs/promises";

export async function getItem(id: string) {
  try {
    const item = await prisma.item.findFirst({
      where: { id: Number(id) },
      include: {
        incredients: true,
        addons: true,
        sizes: true,
      },
    });
    return { data: item };
  } catch (error) {
    return { error: error };
  }
}

export async function updateItem(
  id: string,
  updatedItems: Partial<z.infer<typeof UpdateItemSchema>>
) {
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud" };

  const result = UpdateItemSchema.safeParse(updatedItems);

  if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };

  let savedImagePath = null;
  let image = null;
  let oldImage = null;
  if (result.data.image) {
    image = result.data.image.get("file") as File;
    oldImage = result.data.image.get("oldImage") as string;
  }

  //Creation of new product image, if old image exists, delete it.
  if (image || image === null) {
    if (oldImage) {
      try {
        await fs.unlink(path.join(process.cwd(), "/public", oldImage));
      } catch (error) {}
    }
    if (image !== null) {
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
        return {
          error: "Pildi salvestamisel tekkis probleem, proovige uuesti.",
        };
      }
    }
  }

  try {
    const numberId = Number(id);
    const categoryIdNumber = Number(result.data.categoryId);
    const updateData: any = {
      name: result.data.name,
      topCategory: result.data.topCategory,
      categoryId: categoryIdNumber
        ? Number(categoryIdNumber)
        : result.data.categoryId,
      price: result.data.price ? Number(result.data.price) : result.data.price,
      discountPrice:
        result.data.discountPrice !== null &&
        result.data.discountPrice !== undefined
          ? Number(result.data.discountPrice)
          : result.data.discountPrice,
      image: savedImagePath,
    };

    // Update incredients if they exist
    if (result.data.incredients) {
      updateData.incredients = {
        deleteMany: {}, // Delete all existing item ingredients
        create: result.data.incredients.map((ingredientId) => ({
          ingredientId: Number(ingredientId),
        })),
      };
    }

    // Update addons if they exist
    if (result.data.addons) {
      updateData.addons = {
        deleteMany: {}, // Delete all existing item addons
        create: result.data.addons.map((addonId) => ({
          ingredientId: Number(addonId),
        })),
      };
    }

    // Update sizes if they exist
    if (result.data.sizes) {
      updateData.sizes = {
        deleteMany: {}, // Delete all existing sizes
        create: result.data.sizes.map((size) => ({
          value: size.name,
          price: Number(size.price),
        })),
      };
    }

    const updatedItem = await prisma.item.update({
      where: { id: numberId },
      data: updateData,
    });

    return { data: updatedItem };
  } catch (error) {
    return { error: error };
  }
}
