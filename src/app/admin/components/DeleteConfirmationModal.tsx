import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";

interface DeleteConfirmationModalProps {
  onDelete: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DeleteConfirmationModal({
  onDelete,
  open,
  setOpen,
}: DeleteConfirmationModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(e) => setOpen(e)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Kindel, et soovid seda kustutada?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Seda ei saa tagasi võtta. See kirje kustutatakse andmebaasist
            jäädavalt.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Tühista</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => onDelete()}>
            Kinnita
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
