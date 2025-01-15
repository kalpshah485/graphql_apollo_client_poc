import { FormEvent, useRef } from "react";
import {
  Dialog,
  DialogClose,
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

export default function AddLaunchModal() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [addLaunchMutation] = useMutation(ADD_LAUNCH);

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
    });
    inputRef.current.value = "";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
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
              <Input id="launch" type="text" ref={inputRef} placeholder="Launch name" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Add</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
