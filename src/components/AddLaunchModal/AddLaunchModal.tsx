import { FormEvent, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ADD_LAUNCH } from "@/utils/mutation";
import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";

export default function AddLaunchModal() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [addLaunchMutation] = useMutation(ADD_LAUNCH);
  const [open, setOpen] = useState(false);

  const addLaunch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputRef.current?.value) return;
    const value = inputRef.current?.value;
    await addLaunchMutation({
      variables: {
        name: value,
        date: "TODAY",
      },
      update: (cache, result) => {
        cache.modify({
          fields: {
            launches(existingLaunches = []) {
              const newLaunchRef = cache.writeFragment({
                data: result.data.createLaunch,
                fragment: gql`
                  fragment NewLaunch on Launch {
                    id
                    name
                    date
                  }
                `,
              });
              return [newLaunchRef, ...existingLaunches];
            },
          },
        });
      },
      onCompleted: () => {
        setOpen(false);
        toast.success("Launch created successful");
        if(inputRef.current) inputRef.current.value = "";
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger className="flex mx-auto mb-4" asChild>
        <Button>Add Launch</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Launch</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={addLaunch}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="authorName" className="text-right">
                Launch Name
              </Label>
              <Input id="launch" type="text" ref={inputRef} placeholder="Launch name" className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
