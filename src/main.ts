export function greeting(name: string): string {
  return `Hello, ${name}!`;
}

const search = globalThis.location?.search ?? "";
const name = new URLSearchParams(search).get("name") ?? "";
const el = document.querySelector<HTMLHeadingElement>("#greeting");
if (el) el.textContent = greeting(name.trim() ? name : "world");
