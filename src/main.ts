export function greeting(name: string): string {
  return `Hello, ${name}!`;
}

const el = document.querySelector<HTMLHeadingElement>("#greeting");
if (el) el.textContent = greeting("world");
