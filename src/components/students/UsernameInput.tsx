import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  firstName: string;
  lastName: string;
  existingUsernames: string[];
}

export function UsernameInput({ value, onChange, firstName, lastName, existingUsernames }: UsernameInputProps) {
  const generateUsername = () => {
    const normalizedFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const normalizedLastName = lastName.toLowerCase().replace(/[^a-z]/g, '');
    
    // Different username patterns
    const patterns = [
      () => `${normalizedFirstName}${normalizedLastName}`,
      () => `${normalizedFirstName}.${normalizedLastName}`,
      () => `${normalizedFirstName}${normalizedLastName[0]}`,
      () => `${normalizedFirstName[0]}${normalizedLastName}`,
      () => `${normalizedFirstName}_${normalizedLastName}`,
    ];

    // Try each pattern
    for (const pattern of patterns) {
      const baseUsername = pattern();
      
      // Try without number first
      if (!existingUsernames.includes(baseUsername)) {
        return baseUsername;
      }

      // Try with numbers 1-99
      for (let i = 1; i <= 99; i++) {
        const usernameWithNumber = `${baseUsername}${i}`;
        if (!existingUsernames.includes(usernameWithNumber)) {
          return usernameWithNumber;
        }
      }
    }

    // If all patterns are taken, generate a random suffix
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${normalizedFirstName}${randomSuffix}`;
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
        placeholder="Enter username"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-2"
        onClick={() => onChange(generateUsername())}
        title="Generate Username"
        disabled={!firstName || !lastName}
      >
        <Wand2 className="h-3 w-3" />
      </Button>
    </div>
  );
}