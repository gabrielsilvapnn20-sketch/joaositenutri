import { contato } from "@content/site";

export function whatsappUrl(message: string) {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(message)}`;
}
