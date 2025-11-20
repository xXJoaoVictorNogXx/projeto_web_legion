/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
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
import { Steps } from "@chakra-ui/react";
import { Check, CircleCheck } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PreMatriculaPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const allData = {
      ...section1,
      ...section2,
      ...section3,
      ...section4,
      ...section5,
    };

    console.log("Dados a serem enviados para a API:", allData); // Enviando allData

    try {
      const response = await fetch(`${API}/pre-matricula`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao enviar pré-matrícula.");
      }

      const result = await response.json();
      console.log("Sucesso:", result);
      router.push("/sucesso");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [section1, setSection1] = useState({
    childName: "",
    birthDate: "",
    gender: "",
    race: "",
    susCard: "",
    hasHealthIssues: false,
    healthIssuesDescription: "",
    hasGovernmentAid: false,
    governmentAidDescription: "",
  });

  const [section2, setSection2] = useState({
    guardianName: "",
    guardianCpf: "",
    guardianPhone: "",
    guardianWorkplace: "",
    guardianRg: "",
  });

  const [section3, setSection3] = useState({
    adresss: "",
    addressStreet: "",
    addressNumber: "",
    addressNeighborhood: "",
    addressCity: "São Luís",
    addressState: "MA",
    addressCep: "",
  });
  const [section4, setSection4] = useState({
    birthCertificateNumber: "",
    birthCertificateCity: "",
    birthCertificateRegistryOffice: "",
    birthCertificateRegistryCity: "",
    childCpf: "",
    childRg: "",
    childRgIssueDate: "",
    childRgIssuingAuthority: "",
  });

  const [section5, setSection5] = useState({
    casaPropria: false,
    casaAlugada: false,
    casaCedida: false, // Piso
    pisoLajota: false,
    pisoChaoBatido: false,
    pisoCimento: false, // Tipo de Moradia
    moradiaTijolo: false,
    moradiaTaipa: false,
    moradiaMadeira: false, // Saneamento
    saneamentoFossa: false,
    saneamentoAguaEncanada: false,
    saneamentoEnergiaEletrica: false,
  });
  const [step, setStep] = useState(1);
  const Total_Steps = 5;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-secondary">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Ficha de Pré-Matrícula
        </h1>
        {/* --- INÍCIO: BARRA DE PASSOS NAVEGÁVEL --- */}
        <div className="flex w-full max-w-2xl justify-between items-center mb-8">
          {Array.from({ length: Total_Steps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = step > stepNumber;
            const isCurrent = step === stepNumber;

            return (
              <Button
                type="button"
                key={stepNumber}
                variant={
                  isCurrent ? "default" : isCompleted ? "default" : "outline"
                }
                size="icon"
                className={`rounded-full ${
                  isCompleted ? "bg-green-600 hover:bg-green-700" : ""
                }`}
                onClick={() => setStep(stepNumber)}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
              </Button>
            );
          })}
        </div>
        {/* --- FIM: BARRA DE PASSOS NAVEGÁVEL --- */}

        {/* --- SEÇÃO 1: DADOS DA CRIANÇA --- */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>1. Identificação da Criança</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="childName">Nome Completo</Label>
                <Input
                  id="childName"
                  name="childName"
                  required
                  value={section1.childName}
                  onChange={(e) =>
                    setSection1((pv) => ({ ...pv, childName: e.target.value }))
                  }
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    required
                    value={section1.birthDate}
                    onChange={(e) =>
                      setSection1((pv) => ({
                        ...pv,
                        birthDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Sexo</Label>
                  <Select
                    name="gender"
                    value={section1.gender}
                    onValueChange={(e) =>
                      setSection1((pv) => ({ ...pv, gender: e }))
                    }
                  >
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
                  <Select
                    name="race"
                    value={section1.race}
                    onValueChange={(e) =>
                      setSection1((pv) => ({ ...pv, race: e }))
                    }
                  >
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
                <Checkbox
                  id="hasHealthIssues"
                  name="hasHealthIssues"
                  checked={section1.hasHealthIssues}
                  onCheckedChange={(e) =>
                    setSection1((pv) => ({
                      ...pv,
                      hasHealthIssues: e === true,
                    }))
                  }
                />
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

              {section1.hasHealthIssues && (
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
              )}

              <div className="items-top flex space-x-2">
                <Checkbox
                  id="hasGovernmentAid"
                  name="GovernmentAid"
                  checked={section1.hasGovernmentAid}
                  onCheckedChange={(e) =>
                    setSection1((pv) => ({
                      ...pv,
                      hasGovernmentAid: e === true,
                    }))
                  }
                />

                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="hasGovernmentAid"
                    className="text-sm font-medium leading-none"
                  >
                    O responsável é beneficiário de algum auxílio do governo?
                  </label>
                </div>
              </div>

              {section1.hasGovernmentAid && (
                <div className="grid gap-2">
                  <Label htmlFor="governmentAidDescription">Qual(is)?</Label>
                  <Textarea
                    id="governmentAidDescription"
                    name="governmentAidDescription"
                    placeholder="Ex: Alergia a lactose, asma, etc."
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* --- SEÇÃO 2: DADOS DO RESPONSÁVEL --- */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>2. Filiação / Responsável</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="guardianName">Nome do Responsável</Label>
                <Input
                  id="guardianName"
                  name="guardianName"
                  required
                  value={section2.guardianName}
                  onChange={(e) =>
                    setSection2((pv) => ({
                      ...pv,
                      guardianName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className=" ">
                <div className="grid gap-2">
                  <Label htmlFor="guardianCpf">CPF do Responsável</Label>
                  <Input
                    id="guardianCpf"
                    name="guardianCpf"
                    required
                    value={section2.guardianCpf}
                    onChange={(e) =>
                      setSection2((pv) => ({
                        ...pv,
                        guardianCpf: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guardianPhone">Outro Contato</Label>
                  <Input
                    id="guardianPhone"
                    name="guardianPhone"
                    required
                    value={section2.guardianPhone}
                    onChange={(e) =>
                      setSection2((pv) => ({
                        ...pv,
                        guardianPhone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guardianWorkplace">Local de Trabalho</Label>
                  <Input
                    id="guardianWorkplace"
                    name="guardianWorkplace"
                    required
                    value={section2.guardianWorkplace}
                    onChange={(e) =>
                      setSection2((pv) => ({
                        ...pv,
                        guardianWorkplace: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guardianRg">RG</Label>
                  <Input
                    id="guardianRg"
                    name="guardianRg"
                    required
                    value={section2.guardianRg}
                    onChange={(e) =>
                      setSection2((pv) => ({
                        ...pv,
                        guardianRg: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* --- SEÇÃO 3: ENDEREÇO DA CRIANÇA  --- */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>3. Endereço da Criança</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label>Endereço</Label>
                <Input
                  id="adresss"
                  name="adresss"
                  required
                  value={section3.adresss}
                  onChange={(e) =>
                    setSection3((pv) => ({ ...pv, adresss: e.target.value }))
                  }
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Ponto de Referência</Label>
                  <Input
                    id="addressStreet"
                    name="addressStreet"
                    required
                    value={section3.addressStreet}
                    onChange={(e) =>
                      setSection3((pv) => ({
                        ...pv,
                        addressStreet: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Bairro</Label>
                  <Input
                    id="addressNeighborhood"
                    name="addressNeighborhood"
                    required
                    value={section3.addressNeighborhood}
                    onChange={(e) =>
                      setSection3((pv) => ({
                        ...pv,
                        addressNeighborhood: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Município</Label>
                  <Input
                    id="addressState"
                    name="addressState"
                    required
                    value={section3.addressState}
                    onChange={(e) =>
                      setSection3((pv) => ({
                        ...pv,
                        addressState: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>CEP</Label>
                  <Input
                    id="addressCep"
                    name="addressCep"
                    required
                    value={section3.addressCep}
                    onChange={(e) =>
                      setSection3((pv) => ({
                        ...pv,
                        addressCep: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>UF</Label>
                  <Input
                    id="addressCity"
                    name="addressCity"
                    required
                    value={section3.addressCity}
                    onChange={(e) =>
                      setSection3((pv) => ({
                        ...pv,
                        addressCity: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Número</Label>
                  <Input
                    id="addressNumber"
                    name="addressNumber"
                    required
                    value={section3.addressNumber}
                    onChange={(e) =>
                      setSection3((pv) => ({
                        ...pv,
                        addressNumber: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* --- SEÇÃO 4: DOCUMENTOS DA CRIANÇA  --- */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>4. Documentos da Criança</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label>Certidão de Nascimento</Label>
                <Input
                  placeholder="Nº Matrícula"
                  id="birthCertificateNumber"
                  name="birthCertificateNumber"
                  required
                  value={section4.birthCertificateNumber}
                  onChange={(e) =>
                    setSection4((pv) => ({
                      ...pv,
                      birthCertificateNumber: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 ">
                <div className="grid gap-2">
                  <Label>Município do Nascimento</Label>
                  <Input
                    id="birthCertificateCity"
                    name="birthCertificateCity"
                    required
                    value={section4.birthCertificateCity}
                    onChange={(e) =>
                      setSection4((pv) => ({
                        ...pv,
                        birthCertificateCity: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Cartório de Registro</Label>
                  <Input
                    id="birthCertificateRegistryOffice"
                    name="birthCertificateRegistryOffice"
                    required
                    value={section4.birthCertificateRegistryOffice}
                    onChange={(e) =>
                      setSection4((pv) => ({
                        ...pv,
                        birthCertificateRegistryOffice: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Município de Registro</Label>
                  <Input
                    id="birthCertificateRegistryCity"
                    name="birthCertificateRegistryCity"
                    required
                    value={section4.birthCertificateRegistryCity}
                    onChange={(e) =>
                      setSection4((pv) => ({
                        ...pv,
                        birthCertificateRegistryCity: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>CPF</Label>
                  <Input
                    id="childCpf"
                    name="childCpf"
                    required
                    value={section4.childCpf}
                    onChange={(e) =>
                      setSection4((pv) => ({
                        ...pv,
                        childCpf: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>RG</Label>
                  <Input
                    id="childRg"
                    name="childRg"
                    required
                    value={section4.childRg}
                    onChange={(e) =>
                      setSection4((pv) => ({
                        ...pv,
                        childRg: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Data de Emissão</Label>
                  <Input
                    id="childRgIssueDate"
                    name="childRgIssueDate"
                    required
                    value={section4.childRgIssueDate}
                    onChange={(e) =>
                      setSection4((pv) => ({
                        ...pv,
                        childRgIssueDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Orgão Emissor</Label>
                  <Input
                    id="childRgIssuingAuthority"
                    name="childRgIssuingAuthority"
                    required
                    value={section4.childRgIssuingAuthority}
                    onChange={(e) =>
                      setSection4((pv) => ({
                        ...pv,
                        childRgIssuingAuthority: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* --- SEÇÃO 5: SITUAÇÃO HABITACIONAL E SANITÁRIA  --- */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>5. Situação Habitacional e Sanitária</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid sm:grid-cols-4 gap-4 ">
                <div className="flex flex-col space-y-2">
                  {/* Seção de Moradia */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="casaPropria"
                      name="casaPropria"
                      checked={section5.casaPropria}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({
                          ...pv,
                          casaPropria: e === true,
                        }))
                      }
                    />

                    <label
                      htmlFor="casaPropria"
                      className="text-sm font-medium leading-none"
                    >
                      Casa Própria
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="casaAlugada"
                      name="casaAlugada"
                      checked={section5.casaAlugada}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({
                          ...pv,
                          casaAlugada: e === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="casaAlugada"
                      className="text-sm font-medium leading-none"
                    >
                      Casa Alugada
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="casaCedida"
                      name="casaCedida"
                      checked={section5.casaCedida}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({ ...pv, casaCedida: e === true }))
                      }
                    />
                    <label
                      htmlFor="casaCedida"
                      className="text-sm font-medium leading-none"
                    >
                      Casa Cedida
                    </label>
                  </div>
                </div>

                {/* Seção de Piso */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pisoLajota"
                      name="pisoLajota"
                      checked={section5.pisoLajota}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({ ...pv, pisoLajota: e === true }))
                      }
                    />
                    <label
                      htmlFor="pisoLajota"
                      className="text-sm font-medium leading-none"
                    >
                      Piso de Lajota
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pisoChaoBatido"
                      name="pisoChaoBatido"
                      checked={section5.pisoChaoBatido}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({
                          ...pv,
                          pisoChaoBatido: e === true,
                        }))
                      }
                    />

                    <label
                      htmlFor="pisoChaoBatido"
                      className="text-sm font-medium leading-none"
                    >
                      Piso de Chão Batido
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pisoCimento"
                      name="pisoCimento"
                      checked={section5.pisoCimento}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({
                          ...pv,
                          pisoCimento: e === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="pisoCimento"
                      className="text-sm font-medium leading-none"
                    >
                      Piso de Cimento
                    </label>
                  </div>
                </div>

                {/* Seção de Tipo de Moradia */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="moradiaTijolo"
                      name="moradiaTijolo"
                      checked={section5.moradiaTijolo}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({
                          ...pv,
                          moradiaTijolo: e === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="moradiaTijolo"
                      className="text-sm font-medium leading-none"
                    >
                      Tijolo
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="moradiaTaipa"
                      name="moradiaTaipa"
                      checked={section5.moradiaTaipa}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({
                          ...pv,
                          moradiaTaipa: e === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="moradiaTaipa"
                      className="text-sm font-medium leading-none"
                    >
                      Taipa
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="moradiaMadeira"
                      name="moradiaMadeira"
                      checked={section5.moradiaMadeira}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({
                          ...pv,
                          moradiaMadeira: e === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="moradiaMadeira"
                      className="text-sm font-medium leading-none"
                    >
                      Madeira
                    </label>
                  </div>
                </div>

                {/* Saneamento */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saneamentoFossa"
                      name="saneamentoFossa"
                      checked={section5.saneamentoFossa}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({
                          ...pv,
                          saneamentoFossa: e === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="saneamentoFossa"
                      className="text-sm font-medium leading-none"
                    >
                      Fossa
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saneamentoAguaEncanada"
                      name="saneamentoAguaEncanada"
                      checked={section5.saneamentoAguaEncanada}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({
                          ...pv,
                          saneamentoAguaEncanada: e === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="saneamentoAguaEncanada"
                      className="text-sm font-medium leading-none"
                    >
                      Agua Encanada
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saneamentoEnergiaEletrica"
                      name="saneamentoEnergiaEletrica"
                      checked={section5.saneamentoEnergiaEletrica}
                      onCheckedChange={(e) =>
                        setSection5((pv) => ({
                          ...pv,
                          saneamentoEnergiaEletrica: e === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="saneamentoEnergiaEletrica"
                      className="text-sm font-medium leading-none"
                    >
                      Energia Eletrica
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* --- BOTÃO DE ENVIO --- */}
        {error && (
          <p className="text-center font-medium text-destructive">{error}</p>
        )}
        {step === 5 && (
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Pré-Matrícula"}
          </Button>
        )}
      </form>
    </main>
  );
}
