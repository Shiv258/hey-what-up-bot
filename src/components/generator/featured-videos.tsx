
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const featuredVideos = [
    "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/1755764633934.mp3",
    "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/1755765694290.mp3",
    "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/1755765723465.mp3",
    "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/1755773587540.mp3",
    "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/1755804621613.mp3",
    "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/1755804527287.mp3",
    "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/1755793372141.mp3",
    "https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/1755779480679.mp3",
];

export function FeaturedVideos() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Featured Generations</CardTitle>
                <CardDescription>Check out some of the amazing videos created with our platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 3000,
                            stopOnInteraction: false,
                        }),
                    ]}
                    className="w-full"
                >
                    <CarouselContent>
                        {featuredVideos.map((src, index) => (
                            <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                                <div className="p-1">
                                    <div className="relative aspect-[9/16] w-full group bg-black rounded-lg overflow-hidden">
                                        <video
                                            src={src}
                                            className="w-full h-full object-cover"
                                            loop
                                            autoPlay
                                            muted
                                            playsInline
                                        />
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </CardContent>
        </Card>
    )
}
