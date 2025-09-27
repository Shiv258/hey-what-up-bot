
"use client";

import { CHARACTERS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function QuickTry() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight">Not sure where to start?</h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
        Give it a try with one of our pre-made characters and sample scripts.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {CHARACTERS.map((char) => (
          <Card key={char.name} className="overflow-hidden group text-center transform transition-all hover:-translate-y-2 hover:shadow-2xl">
            <CardContent className="p-0">
                <div className="relative w-full aspect-[3/4]">
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className={cn(
                        "transition-transform group-hover:scale-110",
                        char.name === 'Kaira' ? 'object-contain' : 'object-cover'
                      )}
                      data-ai-hint={char['data-ai-hint']}
                    />
                </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{char.name}</h3>
                <p className="text-muted-foreground text-sm mt-2 h-10">{char.persona}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
