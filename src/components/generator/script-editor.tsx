
"use client";

import { Textarea } from "../ui/textarea";
import { SCRIPT_PLACEHOLDER, MAX_SCRIPT_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ScriptEditorProps {
    value: string;
    onValueChange: (value: string) => void;
}

export function ScriptEditor({ value, onValueChange }: ScriptEditorProps) {
    const charCount = value.length;
    const wordCount = value ? value.trim().split(/\s+/).filter(Boolean).length : 0;

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onValueChange(event.target.value);
    };

    return (
        <div className="w-full h-full flex flex-col">
            <Textarea
                placeholder={SCRIPT_PLACEHOLDER}
                className="flex-grow resize-none text-base leading-relaxed h-[220px]"
                value={value}
                onChange={handleInputChange}
                maxLength={MAX_SCRIPT_LENGTH}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 px-1">
                <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
                <span className={cn(charCount > MAX_SCRIPT_LENGTH && "text-destructive")}>
                    {charCount} / {MAX_SCRIPT_LENGTH}
                </span>
            </div>
        </div>
    );
}
