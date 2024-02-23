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
import { signin } from "@/lib/shared/actions/actions";

const loginSchema = z.object({
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

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string>();

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const userSignin = await signin({ data: values });

    if (userSignin && userSignin.error) setError(userSignin.error);
  }

  return (
    <div className="pt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parool</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormDescription>Sisestage parool.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Logi sisse</Button>
        </form>
      </Form>
      <div className="py-8">
        {error && (
          <div className="my-4 p-3 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
        <Link href="/registreeru" className="underline">
          Pole kasutajat? Registreeru siit
        </Link>
      </div>
    </div>
  );
}
