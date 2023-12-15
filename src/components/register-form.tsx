"use client";
import React, { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "./ui/input";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { useForm } from "react-hook-form";
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "./ui/form";
import findSmell from "@/app/actions/find-smell";
import { useToast } from "./ui/use-toast";
import { IResult } from "@/app/type/result";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Textarea } from "./ui/textarea";
import { Skeleton } from "./ui/skeleton";

const SESSIONS = [
  { label: "❄ Winter", value: "winter" },
  { label: "🌷 Spring", value: "spring" },
  { label: "☀ Summer", value: "summer" },
  { label: "🍂 Fall", value: "fall" },
];

const OCCASTIONS = [
  { label: "💼 Work", value: "work" },
  { label: "🍀 Casual", value: "casual" },
  { label: "💃 Party", value: "party" },
  { label: "🎊 Event", value: "event" },
];

const FindSmellFormData = z.object({
  name: z.string().min(3).max(100),
  characteristics: z.string().min(3).max(100),
  gender: z.enum(["male", "female", "unisex"]),
  //session: z.array(z.string()),
  occasion: z.array(z.string()),
});

export type IFindSmellFormData = z.infer<typeof FindSmellFormData>;

type Props = {};

function RegisterForm({}: Props) {
  const form = useForm<IFindSmellFormData>({
    resolver: zodResolver(FindSmellFormData),
  });

  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();
  const [data, setData] = useState<IResult[] | undefined>();

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: IFindSmellFormData) => {
    setLoading(true);
    findSmell(data)
      .then((result) => {
        setData(result);
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: e.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderData = useMemo(() => {
    if (isLoading)
      return Array.from(Array(4).keys()).map(() => (
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-10 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-56 w-56 mx-auto rounded-md" />
            <Skeleton className="h-24 w-full mx-auto rounded-md" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-14 rounded-md" />
          </CardFooter>
        </Card>
      ));

    if (!data)
      return (
        <div className="col-span-full h-[80vh] border border-border border-dashed rounded-md w-full flex justify-center items-center text-zinc-400">
          No result found
        </div>
      );

    return data.map((item) => {
      if (!item.meta?.image) return null;
      const { width, height, src } = item.meta?.image;
      return (
        <Card>
          <CardHeader>
            <h1 className="text-lg font-medium">{item.name}</h1>
          </CardHeader>
          <CardContent className="">
            <img
              className={
                "w-full max-w-[14em] mx-auto aspect-square border rounded-md"
              }
              width={width}
              height={height}
              src={src}
              alt={item.name}
            />
            <p className="text-slate-500 text-sm">{item.description}</p>
            <div className="border-t border-accent-200 mt-4 py-2">
              <ul className="space-y-2">
                <li className="flex gap-2 flex-wrap">
                  {item.tags.map((tag) => (
                    <Badge size="sm" className="" variant="secondary">
                      {tag.toUpperCase()}
                    </Badge>
                  ))}
                </li>
                <li className={"h-full text-sx"}>{item.match}</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={item.meta.image.contextLink ?? "#"}>
              <Button>View</Button>
            </Link>
          </CardFooter>
        </Card>
      );
    });
  }, [data, isLoading]);

  return (
    <div className="w-full gap-4 flex items-center justify-center">
      <div className="grid grid-cols-2 gap-3 flex-1 max-h-[80vh]">
        {renderData}
      </div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-5 py-3.5 border border-zinc-200 rounded-md bg-zinc-50/50 w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
                <FormDescription>Tell me your name</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="characteristics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Characteristics</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    maxLength={100}
                    placeholder="Describe characteristics"
                    {...field}
                    disabled={isLoading}
                    className="max-h-32"
                  />
                </FormControl>
                {errors.characteristics && (
                  <FormMessage>{errors.characteristics.message}</FormMessage>
                )}
                <FormDescription>
                  Who are you? What are your aura?
                  <br /> <span className="font-bold">Tips</span>: The more you
                  write, the better match you get
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                    className="text-base"
                  >
                    <FormItem className="space-x-2">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel>🚺 Female</FormLabel>
                    </FormItem>
                    <FormItem className="space-x-2">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel>🚹 Male</FormLabel>
                    </FormItem>
                    <FormItem className="space-x-2">
                      <FormControl>
                        <RadioGroupItem value="unisex" />
                      </FormControl>
                      <FormLabel>🚻 Unisex</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                {errors.gender && (
                  <FormMessage>{errors.gender.message}</FormMessage>
                )}
                <FormDescription>
                  Select the appropriate gender.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occasion"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Sessions</FormLabel>
                </div>
                <div className="grid grid-cols-2 justify-items-start">
                  {SESSIONS.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="occasion"
                      render={({ field }) => (
                        <FormItem
                          key={item.value}
                          className="flex gap-2 items-center space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              disabled={isLoading}
                              checked={field.value?.includes(item.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      item.value,
                                    ])
                                  : field.onChange(
                                      (field.value ?? []).filter(
                                        (i) => i !== item.value,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal space-y-0">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occasion"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Occasions</FormLabel>
                </div>
                <div className="grid grid-cols-2 justify-items-start">
                  {OCCASTIONS.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="occasion"
                      render={({ field }) => (
                        <FormItem
                          key={item.value}
                          className="flex gap-2 items-center space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              disabled={isLoading}
                              checked={field.value?.includes(item.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      item.value,
                                    ])
                                  : field.onChange(
                                      (field.value ?? []).filter(
                                        (i) => i !== item.value,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal space-y-0">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Icons.Loading className="animate-spin mr-2" />}
            {isLoading ? "Loading..." : data ? "Search again" : "Search"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default RegisterForm;
