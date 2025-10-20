"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Papa from "papaparse";

interface RoleCount {
  role: string;
  count: string;
}
interface SummaryData {
  total_users: number;
  users_by_role: RoleCount[];
}

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ReportsPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${API}/reports/summary`);
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("Falha ao buscar o sumário:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleExportToCSV = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${API}/reports/users-csv`);
      const usersData = await response.json();

      if (!usersData || usersData.length === 0) {
        alert("Não há dados para exportar.");
        return;
      }

      const csv = Papa.unparse(usersData);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "relatorio_de_usuarios.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Falha ao exportar CSV:", error);
      alert("Ocorreu um erro ao exportar o relatório.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto p-8">Carregando relatórios...</main>
    );
  }

  return (
    <main className="bg-secondary mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <Button onClick={handleExportToCSV} disabled={isExporting}>
          {isExporting ? "Exportando..." : "Exportar Usuários para CSV"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total_users ?? 0}
            </div>
          </CardContent>
        </Card>

        {summary?.users_by_role.map((roleInfo) => (
          <Card key={roleInfo.role}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {roleInfo.role.toLowerCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleInfo.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
