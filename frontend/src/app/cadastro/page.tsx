    'use client'; 

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"

export default function CadastroPage() {
    const router = useRouter();
  return (
    <div>
      <h1>Cadastro de Usuários</h1>
      <p>Esta é a página de cadastro de usuários.</p>
      <Button variant="secondary" onClick={() => router.back()} >Voltar</Button>
      <Button>button</Button>
    </div>
   
  ); 
}