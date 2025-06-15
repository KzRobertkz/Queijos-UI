import { ChefHat, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { logout } from "@/app/(auth)/logout/actions";

export const Header = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-bold tracking-wide text-foreground">
            Queijos Gestor
          </span>
        </div>

        {/* Navegação */}
        <nav className="flex items-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/App/queijos">Lista de Queijos</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/App/queijos/novoqueijo">Novo Queijo</Link>
          </Button>

          {/* Botão de Logout */}
          <form action={logout}>
            <Button className="cursor-pointer" type="submit" variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
};