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
import { ADD_BLOG } from "@/utils/mutation";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";

export default function AddBlogModal() {
  const inputRef1 = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [addBlogMutation] = useMutation(ADD_BLOG);

  const addBlog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputRef1.current?.value || !inputRef2.current?.value) return;
    const authorName = inputRef1.current?.value;
    const content = inputRef2.current?.value;
    await addBlogMutation({
      variables: {
        author: authorName,
        content,
      },
      onCompleted: () => {
        toast.success("Blog created successful");
        setOpen(false);
        if (inputRef1.current) inputRef1.current.value = "";
        if (inputRef2.current) inputRef2.current.value = "";
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger className="flex mb-4 mx-auto" asChild>
        <Button>Add Blog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Blog</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={addBlog}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="authorName" className="text-right">
                Author Name
              </Label>
              <Input id="authorName" type="text" ref={inputRef1} placeholder="Author name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Input id="content" type="text" ref={inputRef2} placeholder="content" className="col-span-3" required />
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
