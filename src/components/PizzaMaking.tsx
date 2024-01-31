import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import ButtonWithCounter from "./ui/ButtonWithCounter";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "./ui/scroll-area";
import { ScrollBar } from "./ui/scroll-area";

export default function PizzaMaking() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"default"} className="px-16">
          Vali
        </Button>
      </DialogTrigger>

      <DialogContent className={" overflow-y-auto max-h-screen "}>
        <DialogHeader className="relative">
          <DialogTitle>
            <div className="relative h-60 w-full overflow-hidden">
              <div className="w-full h-full ">
                <Image
                  src="/Hakkliha.jpg"
                  alt="hakklihapitsa"
                  fill={true}
                  className="object-contain"
                />
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="font-bold text-3xl text-black">
            Hakklihapitsa
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-8 ">
          <p className="text-red-500">8.40€</p>
          <p>
            Hakkliha, sibul, marin. kurk, chipotle kaste, juust, tomatikaste
          </p>

          <div className="flex flex-col gap-4">
            <p className="font-bold">Vali suurus</p>
            <div>
              <RadioGroup className="flex-col gap-4" defaultValue="väike">
                <div className="flex gap-4">
                  <RadioGroupItem value="väike" id="väike"></RadioGroupItem>
                  <Label htmlFor="väike">Väike 23cm</Label>
                </div>
                <div className="flex gap-4">
                  <RadioGroupItem
                    value="keskmine"
                    id="keskmine"
                  ></RadioGroupItem>
                  <Label htmlFor="keskmine">Keskmine 30cm</Label>
                </div>
                <div className="flex gap-4">
                  <RadioGroupItem value="suur" id="suur"></RadioGroupItem>
                  <Label htmlFor="suur">Suur 40cm</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="gap-2 flex flex-col">
              <p className="font-bold">Vali lisandid</p>
              <p className="text-sm">Max 5 lisandit</p>
            </div>
            <div></div>
          </div>
        </div>

        <DialogFooter className="sm:justify-start w-full">
          <ButtonWithCounter
            buttonText="Lisa ostukorvi hinnaga"
            type="button"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
