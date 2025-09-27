


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneratorSchema, type GeneratorFormValues } from "@/lib/schemas";
import { CharacterSelector } from "./character-selector";
import { ImageUploader } from "./image-uploader";
import { ScriptEditor } from "./script-editor";
import { Separator } from "../ui/separator";
import { Sparkles, DollarSign } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { generateVideo } from "@/actions/generate-video";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function GeneratorForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GeneratorFormValues>({
    resolver: zodResolver(GeneratorSchema),
    defaultValues: {
      character: null,
      inputImageUrl: null,
      script: "",
      imageFile: undefined,
    },
    mode: "onChange",
  });

  const { watch, setValue, getValues } = form;

 const onSubmit = async (values: GeneratorFormValues) => {
    setIsSubmitting(true);
    toast({
      title: 'Starting video generation...',
      description: 'Your video generation has started. You will be redirected shortly.',
    });

    try {
        const result = await generateVideo(values);
        
        if (result.error) {
            toast({
                title: 'Generation Failed',
                description: result.error,
                variant: 'destructive',
            });
            setIsSubmitting(false);
        } else if (result.jobId) {
            // Navigate to the results page
            navigate(`/results/${result.jobId}`);
        }
    } catch (e) {
        const err = e instanceof Error ? e.message : 'An unknown error occurred.';
        toast({
            title: 'Generation Failed',
            description: err,
            variant: 'destructive',
        });
        setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    if (file) {
      // Revoke previous blob URL if it exists
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
      setValue("imageFile", file, { shouldValidate: true });
      setValue("inputImageUrl", url, { shouldValidate: true }); 
      setValue("character", null); 
    } else {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(null);
      setValue("inputImageUrl", null, { shouldValidate: true });
      setValue("imageFile", undefined, { shouldValidate: true });
    }
  };

  return (
    <Card className="max-w-4xl mx-auto border-2 border-primary/10 shadow-xl shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Create Your AI Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">1. Choose Your Character</h3>
                <FormField
                  control={form.control}
                  name="imageFile"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <ImageUploader onFileSelect={handleFileSelect} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-4">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                </div>
                
                <FormField
                  control={form.control}
                  name="character"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CharacterSelector
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleFileSelect(null);
                          }}
                          disabled={!!imagePreviewUrl}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <p className={cn("text-sm text-muted-foreground transition-opacity", imagePreviewUrl && getValues().character === null ? "opacity-100" : "opacity-0")}>
                    Using your image (overrides preset).
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">2. Write Your Script</h3>
                 <FormField
                  control={form.control}
                  name="script"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ScriptEditor
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg"
                disabled={!form.formState.isValid || isSubmitting}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isSubmitting ? "Starting..." : "Generate Video"}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <DollarSign className="mr-2 h-5 w-5" />
                    View Pricing
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Generation Cost for 5 Scenes</AlertDialogTitle>
                    <AlertDialogDescription>
                      This is an estimated cost breakdown for generating a video with 5 scenes, including lip-synced images and B-roll videos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="text-sm">
                      <ul className="space-y-2">
                        <li className="flex justify-between"><span>LLMs:</span> <span>$0.05</span></li>
                        <li className="flex justify-between"><span>10 Images (5 Lip Sync + 5 B-Roll):</span> <span>$2.00</span></li>
                        <li className="flex justify-between"><span>5 Image-to-Video Clips:</span> <span>$1.25</span></li>
                      </ul>
                      <Separator className="my-3" />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total Estimated Cost:</span>
                        <span>$3.30</span>
                      </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogAction>Got it!</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
