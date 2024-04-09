"use client";

import { registerSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucia";
import { updateUser } from "../action";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const updateSchema = z
  .object({
    name: z.string().min(1, {
      message: "Nimi on vajalik.",
    }),
    email: z.string().email("See ei ole õige e-mail."),
    current_password: z
      .string()
      .min(8, {
        message: "Parool peab olema vähemalt 8 tähemärki.",
      })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, {
        message: "Parool peab sisaldama vähemalt ühte tähte ja ühte numbrit.",
      }),
    new_password: z
      .string()
      .refine(
        (value) =>
          value === "" ||
          (value.length >= 8 &&
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(value)),
        {
          message:
            "Parool peab olema vähemalt 8 tähemärki ja sisaldama vähemalt ühte tähte ja ühte numbrit, või olema tühi.",
        }
      ),
    new_password_validate: z
      .string()
      .refine(
        (value) =>
          value === "" ||
          (value.length >= 8 &&
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(value)),
        {
          message:
            "Parool peab olema vähemalt 8 tähemärki ja sisaldama vähemalt ühte tähte ja ühte numbrit, või olema tühi.",
        }
      ),
  })
  .refine(
    (data) => {
      if (data.new_password !== undefined) {
        return data.new_password === data.new_password_validate;
      }
      return true;
    },
    {
      message: "Uus parool ei kattu.",
      path: ["new_password_validate"],
    }
  );

export default function UserForm({ user }: { user: User }) {
  const [error, setError] = useState<any>();
  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      current_password: "",
      new_password: "",
      new_password_validate: "",
    },
  });

  if (!user) return "";

  async function onSubmit(values: z.infer<typeof updateSchema>) {
    const updatedData: Partial<z.infer<typeof updateSchema>> = {};

    if (values.email !== user.email) updatedData.email = values.email;
    if (values.name !== user.name) updatedData.name = values.name;
    if (values.new_password) updatedData.new_password = values.new_password;
    if (values.new_password_validate)
      updatedData.new_password_validate = values.new_password_validate;

    if (Object.keys(updatedData).length === 0) {
      toast.info("Muudatusi ei ole.");
      return;
    }

    if (values.current_password)
      updatedData.current_password = values.current_password;

    await updateUser(updatedData)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        if (data.data) {
          toast.success("Kasutaja andmed uuendatud!");

          setError(null);
        }
      })
      .catch((error) => toast.error("Viga andmete uuendamisel: " + error));
  }

  return (
    <div className="pt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nimi</FormLabel>
                <FormControl>
                  <Input placeholder="Toomas Juurikas" {...field} />
                </FormControl>
                <FormDescription>Sisestage enda nimi.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="toomas.juurikas@gmail.com" {...field} />
                </FormControl>
                <FormDescription>Sisestage enda email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Praegune parool*</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormDescription>Sisestage praegune parool.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uus parool</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormDescription>Sisestage uus parool.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="new_password_validate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uus parool uuesti</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormDescription>Sisestage uus parool uuesti.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Uuenda andmeid</Button>
        </form>
      </Form>
      <div className="py-8">
        {error && (
          <div className="my-4 p-3 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
