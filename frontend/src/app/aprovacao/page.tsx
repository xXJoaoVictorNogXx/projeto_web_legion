"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Hook para pegar o ID da URL
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Para o efeito de loading
import { Label } from "@radix-ui/react-label";

const API = process.env.NEXT_PUBLIC_API_URL;

// --- Tipagem para os dados da pré-matrícula ---
// (Ajuste os campos conforme a sua tabela `pre_enrollments`)
interface PreEnrollmentData {
  id: number;
  childName: string;
  birthDate: string;
  gender: string;
  race: string;
  susCard?: string; // Campos opcionais
  hasHealthIssues: boolean;
  healthIssuesDescription?: string;
  guardianName: string;
  guardianCpf: string;
  guardianPhone: string;
  addressStreet: string;
  addressNumber: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  addressCep: string;
  status: string; // Ex: PENDENTE, APROVADO, REJEITADO
  createdAt: string; // Data de criação
}

export default function ApprovePreEnrollmentPage() {
  const router = useRouter();
  const params = useParams(); // Hook para pegar parâmetros da URL
  const preEnrollmentId = params.id as string; // Pega o ID da URL

  const [preEnrollment, setPreEnrollment] = useState<PreEnrollmentData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState("");

  // --- SUA TAREFA #1: Buscar os dados da pré-matrícula na API ---
  useEffect(() => {
    if (!preEnrollmentId) return; // Se não tiver ID, não faz nada

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        // Dica: Você precisa criar um endpoint no backend: GET /api/pre-enrollments/:id
        const response = await fetch(
          `${API}/pre-enrollments/${preEnrollmentId}`
        );
        if (!response.ok) throw new Error("Pré-matrícula não encontrada.");
        const data: PreEnrollmentData = await response.json();
        setPreEnrollment(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
        setPreEnrollment(null); // Limpa os dados se der erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [preEnrollmentId]); // Roda sempre que o ID mudar

  // --- SUA TAREFA #2: Implementar a lógica de Aprovação ---
  const handleApprove = async () => {
    setIsApproving(true);
    setError("");

    console.log(`Aprovando pré-matrícula ID: ${preEnrollmentId}`);

    // Dica: Chame um novo endpoint no backend: PUT /api/pre-enrollments/:id/approve
    // Este endpoint no backend deve:
    // 1. Mudar o status da pré-matrícula para "APROVADO".
    // 2. Criar o registro correspondente na tabela principal de alunos (`students`).
    // 3. (Opcional) Gerar login/senha para o responsável e vincular.
    // 4. Retornar sucesso ou erro.

    // Exemplo de como poderia ser:
    /*
        try {
            const response = await fetch(`${API}/pre-enrollments/${preEnrollmentId}/approve`, {
                method: 'PUT', // Ou POST, dependendo da sua API
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao aprovar matrícula.');
            }

            alert('Matrícula aprovada com sucesso!');
            // Talvez redirecionar para a lista de alunos ou de matrículas aprovadas
            router.push('/admin/alunos'); 

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsApproving(false);
        }
        */
    // Remover após implementar a lógica real
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula delay
    alert("Lógica de aprovação a ser implementada!");
    setIsApproving(false);
  };

  // --- Renderização Condicional ---
  if (isLoading) {
    // Mostra "esqueletos" enquanto carrega
    return (
      <main className="container mx-auto p-8">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-1/4" />{" "}
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />{" "}
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full mt-6" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error || !preEnrollment) {
    return (
      <main className="container mx-auto p-8 text-center text-destructive">
        {error || "Não foi possível carregar os dados da pré-matrícula."}
      </main>
    );
  }

  // --- Renderização Principal ---
  return (
    <main className="container mx-auto p-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        &larr; Voltar para a Lista
      </Button>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Revisão de Pré-Matrícula</CardTitle>
          <CardDescription>
            Revise os dados enviados pelo responsável e aprove a matrícula. ID:{" "}
            {preEnrollment.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Exibição dos dados - Adicione todos os campos importantes aqui */}
          <div>
            <Label>Nome da Criança:</Label> <p>{preEnrollment.childName}</p>
          </div>
          <div>
            <Label>Data de Nascimento:</Label> <p>{preEnrollment.birthDate}</p>
          </div>
          <div>
            <Label>Nome do Responsável:</Label>{" "}
            <p>{preEnrollment.guardianName}</p>
          </div>
          <div>
            <Label>CPF do Responsável:</Label>{" "}
            <p>{preEnrollment.guardianCpf}</p>
          </div>
          <div>
            <Label>Telefone:</Label> <p>{preEnrollment.guardianPhone}</p>
          </div>
          <div>
            <Label>Endereço:</Label>{" "}
            <p>{`${preEnrollment.addressStreet}, ${preEnrollment.addressNumber} - ${preEnrollment.addressNeighborhood}`}</p>
          </div>
          {/* Adicione outros campos relevantes da pré-matrícula aqui */}
          <div>
            <Label>Status Atual:</Label>{" "}
            <p className="font-semibold">{preEnrollment.status}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {/* Botão de Aprovação */}
          {preEnrollment.status === "PENDENTE" && ( // Só mostra o botão se estiver pendente
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? "Aprovando..." : "Aprovar Matrícula"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
