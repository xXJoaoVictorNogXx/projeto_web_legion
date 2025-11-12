import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function sucesso() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="text-4xl font-light ">
        <div className="w-full  items-center">
          <h1>Matrícula feita com sucesso</h1>
          <Button>
            <Link href={"/aprovacao"}>Aprovação</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
