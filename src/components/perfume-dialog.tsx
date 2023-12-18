import { IResult } from "@/app/type/result";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { Icons } from "./icons";

type Props = {
  item: IResult;
  children: React.ReactNode;
};

function PerfumeDialog({ item, children }: Props) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="flex gap-2 max-w-4xl">
        <img
          src={item.meta?.image?.src ?? ""}
          alt={item.name}
          className="w-1/2 aspect-square"
        />
        <article className="w-full space-y-2 border-l px-3.5 border-border flex flex-col gap-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">{item.name}</h1>
            <p className="text-sm">
              <span className="text-slate-500">Brand:</span>
              {item.meta?.brand ? (
                <Link
                  href={`https://www.google.com/search?q=${encodeURI(
                    item.meta.brand,
                  )}`}
                  className="hover:text-slate-500/90 transition-opacity"
                >
                  <Icons.ExternalLink className="inline-block w-4 h-4 mr-1" />
                  {item.meta.brand}
                </Link>
              ) : (
                "Unknown"
              )}
            </p>
            <p className="text-sm">
              <span className="text-slate-500">Perfume: </span>
              {item.type}
            </p>
            <p className="text-sm">
              <span className="text-slate-500">Incense: </span>
              {item.meta?.incense}
            </p>
            <p className="text-sm">
              <span className="text-slate-500">Tags: </span>
              {item.tags.join(", ").toUpperCase()}
            </p>
          </div>
          <Tabs defaultValue="account" className="w-full flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="match">Match</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <p className="text-base font-normal text-slate-500 px-2 overflow-y-auto">
                {item.description}
              </p>
            </TabsContent>
            <TabsContent value="match">
              <p className="text-base font-normal text-slate-500 px-2 overflow-y-auto">
                {item.match}
              </p>
            </TabsContent>
          </Tabs>
          <Link
            href={item.meta?.image?.contextLink ?? "#"}
            className="text-xs underline underline-offset-4 mt-4 ml-auto"
          >
            <Button variant="secondary" size="sm">
              <Icons.ExternalLink className="w-4 h-4 mr-1" /> Find out more
            </Button>
          </Link>
        </article>
      </DialogContent>
    </Dialog>
  );
}

export default PerfumeDialog;
