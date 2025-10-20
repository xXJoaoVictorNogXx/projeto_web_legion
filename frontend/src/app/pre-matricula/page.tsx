"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

// Importando os componentes que vamos usar
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// URL da sua API
const API = process.env.NEXT_PUBLIC_API_URL;

export default function PreMatriculaPage() {
  const router = useRouter();

  // --- ESTADO DO FORMULÁRIO ---
  // Um objeto para guardar todos os dados do formulário
  const [formData, setFormData] = useState({
    // Seção 1: Dados da Criança
    childName: "",
    birthDate: "",
    gender: "",
    race: "",
    susCard: "",
    hasHealthIssues: false,
    healthIssuesDescription: "",

    // Seção 2: Dados do Responsável
    guardianName: "",
    guardianCpf: "",
    guardianPhone: "",

    // Seção 3: Endereço
    addressStreet: "",
    addressNumber: "",
    addressNeighborhood: "",
    addressCity: "São Luís", // Valor Padrão
    addressState: "MA", // Valor Padrão
    addressCep: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ==================================================================
  // SUA TAREFA #1: Implementar a lógica para atualizar o estado
  // ==================================================================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Dica: Use o 'setFormData' para atualizar o campo correspondente.
    // Ex: setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Dica: Função similar para os componentes <Select>
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    // Dica: Função similar para os componentes <Checkbox>
  };

  // ==================================================================
  // SUA TAREFA #2: Implementar a lógica de envio para a API
  // ==================================================================
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("Dados a serem enviados para a API:", formData);

    // Dica: Aqui você fará a chamada `fetch` para um novo endpoint no seu backend
    // Ex: POST /api/pre-enrollments.
    // Lembre-se de criar esse endpoint no seu `backend/server.js`!
    // Trate o sucesso (ex: redirecionar para uma página de confirmação com protocolo) e o erro.

    // Exemplo de como poderia ser:
    /*
    try {
      const response = await fetch(`${API}/pre-enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao enviar pré-matrícula.');
      }

      const result = await response.json();
      router.push(`/confirmacao?protocolo=${result.protocol}`); // Exemplo de redirecionamento

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-secondary">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Ficha de Pré-Matrícula
        </h1>
        <p className="text-center text-muted-foreground">
          Preencha os dados abaixo para iniciar o processo de matrícula.
        </p>

        {/* --- SEÇÃO 1: DADOS DA CRIANÇA --- */}
        <Card>
          <CardHeader>
            <CardTitle>1. Identificação da Criança</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="childName">Nome Completo</Label>
              <Input id="childName" name="childName" required />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input id="birthDate" name="birthDate" type="date" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Sexo</Label>
                <Select name="gender">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MASCULINO">Masculino</SelectItem>
                    <SelectItem value="FEMININO">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="race">Cor/Raça</Label>
                <Select name="race">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRANCA">Branca</SelectItem>
                    <SelectItem value="PRETA">Preta</SelectItem>
                    <SelectItem value="PARDA">Parda</SelectItem>
                    <SelectItem value="AMARELA">Amarela</SelectItem>
                    <SelectItem value="INDIGENA">Indígena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox id="hasHealthIssues" name="hasHealthIssues" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="hasHealthIssues"
                  className="text-sm font-medium leading-none"
                >
                  Possui algum problema de saúde, alergia ou restrição
                  alimentar?
                </label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="healthIssuesDescription">
                Qual(is)? Descreva detalhadamente.
              </Label>
              <Textarea
                id="healthIssuesDescription"
                name="healthIssuesDescription"
                placeholder="Ex: Alergia a lactose, asma, etc."
              />
            </div>

            <div className="items-top flex space-x-2">
              <Checkbox id="hasHealthIssues" name="hasHealthIssues" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="hasHealthIssues"
                  className="text-sm font-medium leading-none"
                >
                  O responsável é beneficiário de algum auxílio do governo?
                </label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="healthIssuesDescription">Qual(is)?</Label>
              <Textarea
                id="healthIssuesDescription"
                name="healthIssuesDescription"
                placeholder="Ex: Alergia a lactose, asma, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* --- SEÇÃO 2: DADOS DO RESPONSÁVEL --- */}
        <Card>
          <CardHeader>
            <CardTitle>2. Filiação / Responsável</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="guardianName">Nome do Responsável</Label>
              <Input id="guardianName" name="guardianName" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="guardianCpf">CPF do Responsável</Label>
                <Input id="guardianCpf" name="guardianCpf" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guardianPhone">Outro Contato</Label>
                <Input id="guardianPhone" name="guardianPhone" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guardianPhone">Local de Trabalho</Label>
                <Input id="guardianPhone" name="guardianPhone" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guardianPhone">RG</Label>
                <Input id="guardianPhone" name="guardianPhone" required />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* --- SEÇÃO 3: DADOS DA CRIANÇA  --- */}
        <Card>
          <CardHeader>
            <CardTitle>3. Endereço da Criança</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Endereço</Label>
              <Input />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Ponto de Referência</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>Bairro</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>Município</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>CEP</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>UF</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>Número</Label>
                <Input />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Documentos da Criança</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Certidão de Nascimento</Label>
              <Input placeholder="Nº Matrícula" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 ">
              <div className="grid gap-2">
                <Label>Município do Nascimento</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>Cartório de Registro</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>Município de Registro</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>CPF</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>RG</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>Data de Emissão</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>Orgão Emissor</Label>
                <Input />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- BOTÃO DE ENVIO --- */}
        {error && (
          <p className="text-center font-medium text-destructive">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar Pré-Matrícula"}
        </Button>
      </form>
    </main>
  );
}
