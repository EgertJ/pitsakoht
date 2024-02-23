"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  generateEmailVerificationCode,
  getUser,
  verifyEmailToken,
} from "@/lib/shared/actions/actions";

const codeSchema = z.object({
  code: z.string().min(8, {
    message: "Kood on vähemalt 8 tähte",
  }),
});

export default function ValidationInput() {
  const form = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  });

  const [error, setError] = useState<string>();

  async function generateNewCode() {
    const { user } = await getUser();
    if (user) await generateEmailVerificationCode(user.id, user.email);
  }

  async function onSubmit(values: z.infer<typeof codeSchema>) {
    const validation = await verifyEmailToken({ data: values });

    if (validation && validation.error) {
      setError(validation.error);
    }
  }
  return (
    <div className="flex justify-center">
      <div className="pt-8 flex flex-col gap-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex gap-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nimi</FormLabel>
                  <FormControl>
                    <Input placeholder="kood123" {...field} />
                  </FormControl>
                  <FormDescription>Sisestage siia kood.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <Button type="submit">Kinnita</Button>
          </form>
        </Form>

        {error && (
          <div className="my-4 p-3 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        <Button type="reset" onClick={generateNewCode}>
          Genereeri uus kood
        </Button>
      </div>
    </div>
  );
}
