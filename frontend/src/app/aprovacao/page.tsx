"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const API = process.env.NEXT_PUBLIC_API_URL;

// Interface simples: O objeto tem qualquer coisa que vier da API
interface PreMatricula {
  id: number;
  childName: string;
  guardianName: string;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Aceita qualquer outro campo (simplifica a tipagem)
}

export default function SimpleApprovePage() {
  const [pendentes, setPendentes] = useState<PreMatricula[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<PreMatricula | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // 1. CARREGA TUDO AO ABRIR A PÁGINA
  useEffect(() => {
    fetchPendentes();
  }, []);

  const fetchPendentes = async () => {
    try {
      // Busca a lista COMPLETA de alunos pendentes
      const response = await fetch(`${API}/pre-matricula/status/PENDENTE`);
      const data = await response.json();
      setPendentes(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Erro ao carregar lista.");
    }
  };

  // 2. FUNÇÃO DE APROVAR
  const handleApprove = async () => {
    if (!selectedStudent) return;
    setIsApproving(true);

    try {
      // Manda o comando para o backend aprovar este ID
      await fetch(`${API}/pre-matriculas/${selectedStudent.id}/approve`, {
        method: "PUT",
      });

      alert("Aprovado com sucesso!");
      setIsDialogOpen(false); // Fecha o modal
      fetchPendentes(); // Atualiza a lista
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Erro ao aprovar.");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Aprovações Pendentes</h1>

      {/* TABELA SIMPLES */}
      <div className="border rounded-lg p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Criança</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendentes.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.childName}</TableCell>
                <TableCell>{item.guardianName}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => {
                      // AQUI É A SIMPLIFICAÇÃO:
                      // Como já temos os dados, apenas passamos o item para o estado
                      setSelectedStudent(item);
                      setIsDialogOpen(true);
                    }}
                  >
                    Revisar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL (JANELA) DE DETALHES */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Aluno</DialogTitle>
          </DialogHeader>

          {/* Exibe os dados do aluno selecionado */}
          {selectedStudent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Nome:</Label>{" "}
                  <p>{selectedStudent.childName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Nascimento:</Label>{" "}
                  <p>{selectedStudent.birthDate}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Raça/Cor:</Label>{" "}
                  <p>{selectedStudent.race}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Sexo:</Label>{" "}
                  <p>{selectedStudent.gender}</p>
                </div>
              </div>

              <hr />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Responsável:</Label>{" "}
                  <p>{selectedStudent.guardianName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">CPF:</Label>{" "}
                  <p>{selectedStudent.guardianCpf}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Telefone:</Label>{" "}
                  <p>{selectedStudent.guardianPhone}</p>
                </div>
              </div>

              <hr />

              <div>
                <Label className="text-gray-500">Endereço:</Label>
                <p>
                  {selectedStudent.addressStreet},{" "}
                  {selectedStudent.addressNumber}
                </p>
                <p>
                  {selectedStudent.addressNeighborhood} -{" "}
                  {selectedStudent.addressCity}
                </p>
              </div>

              {/* Exemplo de Booleano Simples: Só mostra se for verdadeiro */}
              {selectedStudent.hasHealthIssues && (
                <p className="text-red-600 font-bold">
                  ⚠️ Possui problema de saúde:{" "}
                  {selectedStudent.healthIssuesDescription}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? "Salvando..." : "Aprovar Matrícula"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
