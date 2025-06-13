"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { useAppSelector, useAppDispatch } from "@/store"
import { clearAuth } from "@/store/authSlice"
import { clearContributeList } from "@/store/contributeSlice"
import { setMarkList } from "@/store/markSlice"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Species", href: "/plants" },
  { name: "Contribute", href: "/contribute" },
  { name: "Search", href: "/search" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Lấy token và user từ Redux
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  const isAuthenticated = Boolean(token)

  const avatarLetter = user?.username?.[0]?.toUpperCase() ?? "U"
  const username = user?.username ?? "User"

  const handleLogout = () => {
    // Xoá token/user khỏi store và localStorage, rồi redirect
    dispatch(clearAuth())
    dispatch(clearContributeList())
    dispatch(setMarkList([]))
    localStorage.removeItem("token")
    localStorage.removeItem("userData") // nếu bạn vẫn lưu dự phòng
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-10 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/icon/leaf.png"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="hidden font-bold sm:inline-block">
            Plant Library
          </span>
        </Link>

        {/* Nav (desktop) */}
        <nav className="hidden md:flex md:items-center md:justify-center md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth / Avatar */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href={"/userdetail"}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {avatarLetter}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <span className="hidden sm:inline-block font-medium">
                {username}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Plant Library</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 py-2">
                      <Link href={"/userdetail"}>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {avatarLetter}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <span className="font-medium">{username}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
