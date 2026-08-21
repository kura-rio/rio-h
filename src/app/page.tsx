import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          RIO LAB
        </h1>
        <p className="text-lg leading-relaxed text-foreground/70">
          Experimental web essay & creative coding lab
        </p>
      </div>

      <ul className="flex flex-col gap-6 text-base">
        <li>
          <Link href="/essays" className="group block">
            <span className="font-medium text-foreground group-hover:underline">
              Essays
            </span>
            <span className="mt-1 block text-sm text-foreground/60">
              Written experiments in form and thought
            </span>
          </Link>
        </li>
        <li>
          <Link href="/experiments" className="group block">
            <span className="font-medium text-foreground group-hover:underline">
              Experiments
            </span>
            <span className="mt-1 block text-sm text-foreground/60">
              Creative coding and web technique studies
            </span>
          </Link>
        </li>
        <li>
          <Link href="/about" className="group block">
            <span className="font-medium text-foreground group-hover:underline">
              About
            </span>
            <span className="mt-1 block text-sm text-foreground/60">
              Who runs this lab
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
