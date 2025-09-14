export function shortenCPUName(cpu: string): string {
  const map: Record<string, string> = {
    "Ryzen 9": "R9",
    "Ryzen 7": "R7",
    "Ryzen 5": "R5",
    "Ryzen 3": "R3",
    "Core i9": "i9",
    "Core i7": "i7",
    "Core i5": "i5",
    "Core i3": "i3",
  };

  for (const [key, value] of Object.entries(map)) {
    if (cpu.includes(key)) return value;
  }

  return "CPU";
}
