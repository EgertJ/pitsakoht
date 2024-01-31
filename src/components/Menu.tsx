"use client";
import React, { useState } from "react";
import { CupSoda, PizzaIcon, Utensils } from "lucide-react";
import MenuButton from "./ui/MenuButton";
import ItemCard from "./ui/ItemCard";
import { motion } from "framer-motion";

export default function Menu() {
  const Menus = [
    {
      itemName: "Pitsad",
      itemIcon: PizzaIcon,
    },
    {
      itemName: "Joogid",
      itemIcon: CupSoda,
    },
    {
      itemName: "Pakkumised",
      itemIcon: Utensils,
    },
  ];

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
        {Menus.map((menuItem, index) => (
          <MenuButton
            key={menuItem.itemName}
            itemNumber={index + 1}
            itemIcon={menuItem.itemIcon}
            isActive={active === menuItem.itemName}
            itemName={menuItem.itemName}
            setActive={setActive}
          ></MenuButton>
        ))}
      </div>
      <div className="flex justify-center md:justify-start">
        <h1 className="font-bold text-2xl">Pitsad</h1>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-2 my-10 gap-x-10">
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView={"enter"}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ItemCard></ItemCard>
        </motion.div>
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView={"enter"}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ItemCard></ItemCard>
        </motion.div>
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView={"enter"}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ItemCard></ItemCard>
        </motion.div>
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView={"enter"}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ItemCard></ItemCard>
        </motion.div>
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView={"enter"}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ItemCard></ItemCard>
        </motion.div>
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView={"enter"}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ItemCard></ItemCard>
        </motion.div>
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView={"enter"}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ItemCard></ItemCard>
        </motion.div>
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView={"enter"}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ItemCard></ItemCard>
        </motion.div>
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView={"enter"}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ItemCard></ItemCard>
        </motion.div>
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView={"enter"}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ItemCard></ItemCard>
        </motion.div>
      </div>
    </div>
  );
}
