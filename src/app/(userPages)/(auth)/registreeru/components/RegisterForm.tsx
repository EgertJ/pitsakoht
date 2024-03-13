"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { signup } from "@/lib/shared/actions/actions";

const registerSchema = z.object({
  name: z.string().min(1, {
    message: "Nimi on vajalik.",
  }),
  email: z.string().email("See ei ole õige e-mail."),
  password: z
    .string()
    .min(8, {
      message: "Parool peab olema vähemalt 8 tähemärki.",
    })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, {
      message: "Parool peab sisaldama vähemalt ühte tähte ja ühte numbrit.",
    }),
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string>();

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const userSignup = await signup({ data: values });

    if (userSignup && userSignup.error) setError(userSignup.error);
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
                <FormLabel>Nimi*</FormLabel>
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
                <FormLabel>E-mail*</FormLabel>
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parool*</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormDescription>Sisestage parool.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Registreeru</Button>
        </form>
      </Form>
      <div className="py-8">
        {error && (
          <div className="my-4 p-3 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
        <div className="flex gap-4">
        <Link href="/logi-sisse" className="underline">
          Juba kasutaja olemas? Logi sisse
        </Link>
        <Link href="/unustasid-parooli" className="underline">
          Unustasid parooli?
        </Link>
        </div>
      </div>
    </div>
  );
}
