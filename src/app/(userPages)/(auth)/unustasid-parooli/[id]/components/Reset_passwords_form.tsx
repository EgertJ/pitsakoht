"use client";
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
import { reset_password } from "../action";
import { toast } from "sonner";


const resetPasswordsSchema = z
  .object({
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

export default function Reset_passwords_form({
    id,
  }: {
    id: string;
  }) {

  const [error, setError] = useState<any>();

  const form = useForm<z.infer<typeof resetPasswordsSchema>>({
    resolver: zodResolver(resetPasswordsSchema),
    defaultValues: {
      new_password: "",
      new_password_validate: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordsSchema>) {
    await reset_password(id, values).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        if (!data) {
          toast.success("Parool uuendatud!");

          setError(null);
        }
      })
      .catch((error) => toast.error("Viga parooli uuendamisel: " + error));

    

  }

  return (
    <div className="pt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
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
          <Button type="submit">Uuenda parooli</Button>
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
