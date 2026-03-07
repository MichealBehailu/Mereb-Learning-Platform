'use client'

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { courseSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";

export default function CourseCreationPage() {
  const form = useForm<z.input<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: { //starting state of a form
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 0,
      level: "Beginner",
      category: "",
      smallDescription: "",
      slug: "",
      status: "Draft",
    },
  });

   function onSubmit(values: typeof courseSchema){ //instead of using z.infer we can use typeof courseSchema
    console.log(values);
   }

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-bold">Create Courses</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Fill in the basic information for your course
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                    control={form.control}
                    name="title"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div className="flex items-end gap-4">
                         <FormField 
                    control={form.control}
                    name="slug"
                    render={({field})=>(
                        <FormItem className="w-full">
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="Slug" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button type="button" className="w-fit" onClick={()=>{
                        const titleValue = form.getValues("title"); //get the value of title field
                        const slug = slugify(titleValue); //generate slug from title

                        form.setValue("slug", slug,{shouldValidate: true}); //set the input value of the slug using SetValue("slug", then the value here in my case slug)//validate the input
                       
                    }}>
                        Generate Slug <SparkleIcon className="ml-1" size={16} />
                    </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
      </Card>
    </>
  );
}
