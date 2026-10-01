import { faixa } from "@content/site";
import Leaf from "./Leaf";

export default function Faixa() {
  const itens = [...faixa, ...faixa];
  return (
    <div className="overflow-hidden border-y border-line bg-leaf-deep py-4 text-white">
      <div className="marquee flex w-max gap-10 animate-[marquee_38s_linear_infinite]">
        {itens.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap text-[15px] font-medium">
            {t}
            <Leaf className="h-4 w-4 text-leaf-soft" />
          </span>
        ))}
      </div>
    </div>
  );
}
