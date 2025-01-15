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
import { ADD_BLOG } from "@/utils/mutation";
import { useMutation } from "@apollo/client";

export default function AddBlogModal() {
  const inputRef1 = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
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
    });
    inputRef1.current.value = "";
    inputRef2.current.value = "";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Blog</Button>
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
              <Input id="authorName" type="text" ref={inputRef1} placeholder="Author name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Input id="content" type="text" ref={inputRef2} placeholder="content" className="col-span-3" />
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
