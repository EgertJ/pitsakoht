import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import React from "react";

export default function DeletionAlert({
  open,
  onOpenChange,
  handleCancel,
  handleConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleCancel: () => void;
  handleConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(e) => onOpenChange(e)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Oled kindel?</AlertDialogTitle>
          <AlertDialogDescription>
            Kas oled kindel, et tellimus on kätte antud ja soovid selle
            kustutada?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => handleCancel()}>
            Tühista
          </AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleConfirm()}>
            Kinnita
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
