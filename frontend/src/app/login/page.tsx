'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isloading, setisLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setisLoading(true);
        setError("");

        try {
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao fazer login");
            }

            const data = await response.json();
            console.log("Login bem-sucedido:", data);
            alert("Login bem-sucedido!");

            router.push("/");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setisLoading(false);
        }


    };    return (
        <main className='flex min-h-screen items-center justify-center bg-secondary'>
            <Card className='w-full max-w-sm'>
             <CardHeader>
                <CardTitle className='text-2xl'>Login</CardTitle>
                <CardDescription>
                    Entre com seu email e senha
                </CardDescription>
             </CardHeader>
             <form onSubmit={handleSubmit}>
                <CardContent className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            type='email'
                            placeholder='m@exemplo.com'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor='password'>Senha</Label>
                        <Input
                            id='password'
                            type='password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className='text-sm font-medium text-destructive'>{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type='submit' className='w-full' disabled={isloading}>
                        {isloading ? "Entrando..." : "Entrar"}
                    </Button>
                </CardFooter>
             </form>
            </Card>
        </main>
    )
}