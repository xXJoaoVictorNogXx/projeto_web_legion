// Use no topo do arquivo para indicar que é um componente interativo
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "next-themes";

// Definindo o tipo para um Usuário
interface User {
  id: number;
  name: string;
  email: string;
}

// URL da API vinda das variáveis de ambiente que configuramos
const API = process.env.NEXT_PUBLIC_API_URL;

export default function UsersPage() {
  // --- GERENCIAMENTO DE ESTADO ---
  // Em vez de pegar elementos do DOM, criamos "estados" para guardar os dados.
  // O React irá redesenhar a tela automaticamente quando um estado for alterado.
  const [status, setStatus] = useState("checando...");
  const [users, setUsers] = useState<User[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  // --- FUNÇÕES DE LÓGICA (Equivalente às suas funções antigas) ---

  // Função para checar a saúde da API
  const healthCheck = async () => {
    try {
      const response = await fetch(`${API}/health`);
      const data = await response.json();
      setStatus(data.status === "ok" ? `OK (DB: ${data.db})` : "Falha");
    } catch {
      setStatus("Offline");
    }
  };

  // Função para carregar os usuários
  const loadUsers = async () => {
    try {
      const response = await fetch(`${API}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Falha ao carregar usuários:", error);
    }
  };

  // Função para adicionar um novo usuário
  const handleAddUser = async () => {
    if (!newName.trim() || !newEmail.trim()) {
      return alert("Preencha nome e email.");
    }
    await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail }),
    });
    setNewName("");
    setNewEmail("");
    await loadUsers(); // Recarrega a lista
  };

  // Função para deletar um usuário
  const handleDeleteUser = async (id: number) => {
    await fetch(`${API}/users/${id}`, { method: "DELETE" });
    await loadUsers(); // Recarrega a lista
  };

  // Função para salvar (atualizar) um usuário
  const handleSaveUser = async (id: number) => {
    // Encontra o usuário no estado atual para pegar os valores dos inputs
    const userToUpdate = users.find((u) => u.id === id);
    if (!userToUpdate) return;

    await fetch(`${API}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userToUpdate.name,
        email: userToUpdate.email,
      }),
    });
    alert("Usuário salvo!");
    await loadUsers(); // Recarrega a lista para garantir consistência
  };

  // Função para atualizar o valor de um input na lista
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    field: "name" | "email"
  ) => {
    const newUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, [field]: e.target.value };
      }
      return user;
    });
    setUsers(newUsers);
  };

  // useEffect é executado uma vez quando o componente é carregado na tela.
  // Perfeito para buscar os dados iniciais.
  useEffect(() => {
    healthCheck();
    loadUsers();
  }, []); // O array vazio `[]` garante que execute apenas uma vez.

  // --- RENDERIZAÇÃO (O que aparece na tela) ---
  // Este código JSX substitui a manipulação de `innerHTML` e `createElement`.
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Usuários</h1>
      <p className="mb-8">
        Status API: <strong className="text-green-600">{status}</strong>
      </p>

      <Button
        variant="secondary"
        className="button-primary"
        onClick={() => router.push("cadastro")}
      >
        ir para cadastro Página
      </Button>

      <Button onClick={() => setTheme("light")}>mudar tema</Button>

      <div className="w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Adicionar Novo Usuário</h3>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <Button onClick={handleAddUser} className="w-full">
            Adicionar
          </Button>
        </div>
      </div>
      <hr />

      <h3>Usuários Cadastrados</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <input
                  value={user.name}
                  onChange={(e) => handleInputChange(e, user.id, "name")}
                />
              </td>
              <td>
                <input
                  value={user.email}
                  onChange={(e) => handleInputChange(e, user.id, "email")}
                />
              </td>
              <td>
                <button onClick={() => handleSaveUser(user.id)}>Salvar</button>
                <button onClick={() => handleDeleteUser(user.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
