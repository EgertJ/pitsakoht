import { Sizes } from "@prisma/client";

export function sizeToText(size: Sizes): string {
  switch (size) {
    case "s":
      return "Väike";
    case "m":
      return "Keskmine";
    case "l":
      return "Suur";
  }
}
