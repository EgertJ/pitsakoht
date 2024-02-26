"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type InfoCardProps = {
  title: string;
  queryFn: () => Promise<
    { data: number; error?: undefined } | { error: unknown; data?: undefined }
  >;
  queryKey: string;
};

export default function InfoCard(props: InfoCardProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: [props.queryKey],
    queryFn: () => props.queryFn(),
  });
  return (
    <Card className="border-none rounded-none">
      <CardHeader className="pl-0">
        <CardTitle>{data?.data}</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">{props.title}</CardContent>
    </Card>
  );
}
