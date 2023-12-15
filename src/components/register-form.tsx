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
import { Card, CardContent, CardHeader } from "./ui/card";

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
    if (!data) return null;

    return data.map((item) => (
      <Card>
        <CardHeader>{item.name}</CardHeader>
        <CardContent>
          <Image src={item.meta?.image ?? ""} alt={item.name} />
        </CardContent>
      </Card>
    ));
  }, [data]);

  return (
    <div className="w-full flex items-center justify-center">
      {renderData}
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
                    disabled={isLoading}
                    placeholder="Enter a name"
                    {...field}
                  />
                </FormControl>
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
                <FormDescription>This is the main name.</FormDescription>
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
                  <Input
                    disabled={isLoading}
                    placeholder="Describe characteristics"
                    {...field}
                  />
                </FormControl>
                {errors.characteristics && (
                  <FormMessage>{errors.characteristics.message}</FormMessage>
                )}
                <FormDescription>
                  Describe the key characteristics.
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
          <Button type="submit">
            {isLoading && <Icons.Loading className="animate-spin mr-2" />}
            {isLoading ? "Loading..." : "Find Smell"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default RegisterForm;
