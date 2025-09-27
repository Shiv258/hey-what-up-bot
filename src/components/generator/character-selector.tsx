import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHARACTERS } from "@/lib/constants";
import type { CharacterName } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CharacterSelectorProps {
  value: CharacterName | null;
  onValueChange: (value: CharacterName) => void;
  disabled?: boolean;
}

export function CharacterSelector({ value, onValueChange, disabled }: CharacterSelectorProps) {
  const selectedCharacter = CHARACTERS.find(c => c.name === value);

  return (
    <div className="space-y-4">
      <Select onValueChange={onValueChange} value={value ?? ""} disabled={disabled}>
        <SelectTrigger className="w-full h-12">
          <SelectValue placeholder="Select a pre-defined character" />
        </SelectTrigger>
        <SelectContent>
          {CHARACTERS.map((character) => (
            <SelectItem key={character.name} value={character.name}>
              <div className="flex items-center gap-3">
                <img
                  src={character.preview}
                  alt={character.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                  data-ai-hint={character['data-ai-hint']}
                />
                <span>{character.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedCharacter && !disabled && (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border">
            <Avatar className="h-16 w-16">
                <AvatarImage src={selectedCharacter.preview} alt={selectedCharacter.name} data-ai-hint={selectedCharacter['data-ai-hint']} />
                <AvatarFallback>{selectedCharacter.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h4 className="font-semibold">{selectedCharacter.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedCharacter.persona}</p>
            </div>
        </div>
      )}
    </div>
  );
}
