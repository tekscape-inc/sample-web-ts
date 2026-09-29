export function greeting(name: string): string {
  return `Hello, ${name}!`;
}

const name = new URLSearchParams(globalThis.location?.search ?? "").get("name") ?? "";
const el = document.querySelector<HTMLHeadingElement>("#greeting");
if (el) el.textContent = greeting(name.trim() ? name : "world");
