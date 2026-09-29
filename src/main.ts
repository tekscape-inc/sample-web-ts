export function greeting(name: string): string {
  return `Hello, ${name}!`;
}

const params = new URLSearchParams(globalThis.location?.search ?? "");
const name = params.get("name")?.trim();
const el = document.querySelector<HTMLHeadingElement>("#greeting");
if (el) el.textContent = greeting(name || "world");
