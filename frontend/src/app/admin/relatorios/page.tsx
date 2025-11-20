"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Papa from "papaparse";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Student {
  id: number;
  childName: string;
  guardianName: string;
  guardianCpf: string;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface StudentStatus {
  status: string;
  count: string;
}
interface SummaryData {
  total_users: number;
  total_students: number;
  students_by_status: StudentStatus[];
}

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ReportsPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  const [activeTab, setActiveTab] = useState<"users" | "students">("students");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [summaryRes, usersRes, studentsRes] = await Promise.all([
          fetch(`${API}/reports/dashboard-summary`),
          fetch(`${API}/users`),
          fetch(`${API}/pre-matriculas`),
        ]);

        if (!summaryRes.ok || !usersRes.ok || !studentsRes.ok) {
          throw new Error("Falha ao buscar dados dos relatórios.");
        }

        const summaryData = await summaryRes.json();
        const usersData = await usersRes.json();
        const studentsData = await studentsRes.json();

        setSummary(summaryData);
        setAllUsers(usersData);
        setAllStudents(studentsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const filteredData = useMemo(() => {
    const sourceData = activeTab === "users" ? allUsers : allStudents;

    if (!filter) {
      return sourceData; // Retorna tudo se o filtro estiver vazio
    }

    const lowerCaseFilter = filter.toLowerCase();

    return sourceData.filter((item) => {
      if (activeTab === "users") {
        const user = item as User;
        return (
          user.name.toLowerCase().includes(lowerCaseFilter) ||
          user.email.toLowerCase().includes(lowerCaseFilter) ||
          user.role.toLowerCase().includes(lowerCaseFilter)
        );
      }
      if (activeTab === "students") {
        const student = item as Student;
        return (
          student.childName?.toLowerCase().includes(lowerCaseFilter) ||
          student.guardianName?.toLowerCase().includes(lowerCaseFilter) ||
          student.status?.toLowerCase().includes(lowerCaseFilter)
        );
      }

      return false;
    });
  }, [filter, activeTab, allUsers, allStudents]); // Recalcula se o filtro ou a aba mudarem

  const handleExportToCSV = () => {
    setIsExporting(true);

    if (!filteredData || filteredData.length === 0) {
      alert("Não há dados filtrados para exportar.");
      setIsExporting(false);
      return;
    }

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    const fileName =
      activeTab === "users"
        ? "relatorio_funcionarios.csv"
        : "relatorio_alunos.csv";
    link.setAttribute("download", fileName);

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto p-8">Carregando relatórios...</main>
    );
  }

  return (
    <main className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Relatórios e Gerenciamento</h1>
      </div>

      {/* --- Seção de Estatísticas (Cards) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total_students ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total_users ?? 0}
            </div>
          </CardContent>
        </Card>
        {summary?.students_by_status.map((statusInfo) => (
          <Card key={statusInfo.status}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                Alunos ({statusInfo.status.toLowerCase()})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusInfo.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Seção da Tabela Dinâmica --- */}
      <Tabs
        value={activeTab}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Alunos (Matrículas)</TabsTrigger>
          <TabsTrigger value="users">Funcionários (Usuários)</TabsTrigger>
        </TabsList>

        {/* Painel de Filtro e Exportação */}
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder={`Filtrar ${
              activeTab === "students" ? "alunos" : "funcionários"
            }...`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleExportToCSV} disabled={isExporting}>
            {isExporting ? "Exportando..." : `Exportar CSV Filtrado`}
          </Button>
        </div>

        {/* Conteúdo da Tabela para ALUNOS */}
        <TabsContent value="students">
          <Card>
            <CardContent>
              <Table>
                <TableCaption>Lista de alunos (pré-matrículas).</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Criança</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => {
                    const student = item as Student;
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.childName}
                        </TableCell>
                        <TableCell>{student.guardianName}</TableCell>
                        <TableCell>{student.guardianCpf}</TableCell>
                        <TableCell>{student.status}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo da Tabela para FUNCIONÁRIOS */}
        <TabsContent value="users">
          <Card>
            <CardContent>
              <Table>
                <TableCaption>Lista de funcionários do sistema.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => {
                    const user = item as User;
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
