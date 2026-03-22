type ClassValue = string | number | null | false | undefined | ClassValue[];

function flattenClassValue(input: ClassValue, output: string[]): void {
  if (!input) {
    return;
  }

  if (Array.isArray(input)) {
    for (const value of input) {
      flattenClassValue(value, output);
    }
    return;
  }

  output.push(String(input));
}

export function cn(...inputs: ClassValue[]): string {
  const classNames: string[] = [];

  for (const input of inputs) {
    flattenClassValue(input, classNames);
  }

  return classNames.join(" ");
}
