"use client";
import React, { useState } from "react";
import MenuButton from "./MenuButton";
import ItemCard from "./ItemCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getCategories } from "../action";

export default function Menu() {
  const { data: categoryData, error: categoryError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const [active, setActive] = useState<string>();

  const variants = {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
  };

  return (
    <div id="menüü" className="px-3 md:px-24 lg:px-52 py-24">
      <div>
        <p className="text-3xl font-bold  flex justify-center md:block flex-wrap">
          Vali endale midagi&nbsp;
          <span className="text-red-500">meelepärast</span>
        </p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center md:justify-normal py-8 sticky top-0 z-50 bg-white ">
        {categoryData?.categories?.map((menuItem, index) => (
          <Link href={`#${menuItem.name}`} key={menuItem.name}>
            <MenuButton
              itemNumber={index + 1}
              isActive={active === menuItem.name}
              itemName={menuItem.name}
              setActive={setActive}
            ></MenuButton>
          </Link>
        ))}
      </div>
      {categoryData?.categories?.map((menuItem, index) => {
        return (
          <div key={menuItem.id} id={menuItem.name} className="pt-32">
            <div className="flex justify-center md:justify-start">
              <h1 className="font-bold text-2xl">{menuItem.name}</h1>
            </div>
            {menuItem.items.map((item, index) => {
              item.sizes.sort((a, b) => a.price - b.price);

              return (
                <div
                  className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-2 my-10 gap-x-10"
                  key={item.id}
                >
                  <motion.div
                    variants={variants}
                    initial="hidden"
                    whileInView={"enter"}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <ItemCard
                      itemCategory={item.topCategory}
                      itemId={item.id}
                      itemName={item.name}
                      itemImage={item.image}
                      itemPrice={item.price}
                      itemIngredients={item.incredients.map(
                        (item) => item.ingredient.name
                      )}
                      itemAddons={item.addons.map((item) => ({
                        id: item.itemId,
                        ingredientId: item.ingredientId,
                        name: item.ingredient.name,
                        price: item.ingredient.price,
                        category: item.ingredient.category,
                      }))}
                      itemSizes={item.sizes.map((item) => ({
                        size: item.value,
                        price: item.price,
                      }))}
                    ></ItemCard>
                  </motion.div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
