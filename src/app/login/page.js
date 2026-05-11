// src/app/login/page.js
"use client"; // Wajib ditambahkan agar Next.js tahu ini adalah komponen interaktif (Client-side)

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
    const router = useRouter();

    // State untuk menyimpan input dan status
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Fungsi untuk mengeksekusi login ke Supabase
    const handleLogin = async (e) => {
        e.preventDefault(); // Mencegah halaman refresh saat form disubmit
        setLoading(true);
        setErrorMsg("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            // Jika sukses, arahkan ke rute /admin
            router.push("/admin");
        }
    };

    return (
        <div className="font-body-md text-on-background selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col bg-background">
            {/* TopAppBar */}
            <header className="bg-background border-b border-outline-variant flat no shadows docked full-width top-0 z-50">
                <div className="flex justify-between items-center w-full px-gutter h-16 max-w-container-max mx-auto">
                    <div className="flex items-center gap-4">
                        <span className="font-label-caps text-label-caps tracking-widest text-primary">
                            INFRA-GATEWAY v2.4.0
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-stack-lg">
                        <nav className="flex gap-stack-md items-center">
                            <span className="material-symbols-outlined text-primary cursor-pointer active:opacity-80">terminal</span>
                            <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors cursor-pointer active:opacity-80">settings_ethernet</span>
                            <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors cursor-pointer active:opacity-80">security</span>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-margin-mobile py-section-gap relative overflow-hidden">
                {/* Background Visual Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-20">
                    <div className="w-full h-full max-w-container-max flex justify-around items-end">
                        <div className="w-1 h-64 bg-primary-container blur-3xl"></div>
                        <div className="w-1 h-96 bg-secondary-container blur-3xl translate-y-32"></div>
                    </div>
                </div>

                <div className="w-full max-w-[480px] z-10">
                    {/* Terminal Header / Info */}
                    <div className="mb-stack-lg space-y-unit">
                        <div className="flex items-center gap-stack-sm">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            <p className="font-label-caps text-label-caps text-secondary">SECURE INFRASTRUCTURE GATEWAY</p>
                        </div>
                        <h1 className="font-headline-md text-headline-md text-on-surface">Authorize Session</h1>
                        <p className="font-code-md text-code-md text-on-surface-variant opacity-70">
                            SYSTEM_VERSION: v4.2.1-stable // NODAL_AUTH_REQUIRED
                        </p>
                    </div>

                    {/* Login Terminal Card */}
                    <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden terminal-glow">
                        <div className="bg-surface-container-high border-b border-outline-variant px-stack-md py-stack-sm flex justify-between items-center">
                            <div className="flex gap-stack-sm">
                                <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                                <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                                <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                            </div>
                            <span className="font-label-caps text-[10px] text-on-surface-variant">CONSOLE_PORT: 443</span>
                        </div>

                        {/* FORM LOGIN */}
                        <form onSubmit={handleLogin} className="p-stack-lg space-y-stack-lg">

                            {/* Menampilkan pesan error jika login gagal */}
                            {errorMsg && (
                                <div className="bg-error-container border border-error/50 text-error px-4 py-3 rounded text-sm font-code-md">
                                    ACCESS_DENIED: {errorMsg}
                                </div>
                            )}

                            <div className="space-y-stack-md">
                                <div className="space-y-unit">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant block">Access Key / Email</label>
                                    <div className="relative group">
                                        <input
                                            className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-code-md px-stack-md py-stack-sm rounded focus:outline-none focus:border-secondary transition-colors placeholder:text-on-surface-variant/30"
                                            placeholder="admin@infra.local"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">key</span>
                                    </div>
                                </div>
                                <div className="space-y-unit">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant block">Security Token</label>
                                    <div className="relative group">
                                        <input
                                            className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-code-md px-stack-md py-stack-sm rounded focus:outline-none focus:border-secondary transition-colors placeholder:text-on-surface-variant/30"
                                            placeholder="••••••••••••"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">lock</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-stack-sm cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input className="peer sr-only" type="checkbox" />
                                        <div className="w-10 h-5 bg-surface-container-highest rounded-full border border-outline-variant transition-colors peer-checked:bg-secondary-container"></div>
                                        <div className="absolute left-1 w-3 h-3 bg-on-surface-variant rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-white"></div>
                                    </div>
                                    <span className="font-label-caps text-[11px] text-on-surface-variant group-hover:text-on-surface transition-colors">Remember Session</span>
                                </label>
                                <button type="button" className="font-label-caps text-[11px] text-secondary hover:underline underline-offset-4">Reset Credentials</button>
                            </div>

                            {/* Action Button (Ubah dari <a> menjadi <button>) */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary py-stack-md text-on-primary font-label-caps text-label-caps flex items-center justify-center gap-stack-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{loading ? "VERIFYING_NODE..." : "Authorize Access"}</span>
                                <span className="material-symbols-outlined text-[18px]">
                                    {loading ? "sync" : "bolt"}
                                </span>
                            </button>
                        </form>

                        <div className="bg-surface-container-low px-stack-lg py-stack-sm border-t border-outline-variant flex justify-between items-center">
                            <div className="flex items-center gap-stack-sm">
                                <span className="font-code-md text-[10px] text-tertiary">SERVER_STATUS:</span>
                                <span className="font-code-md text-[10px] text-secondary">OPERATIONAL</span>
                            </div>
                            <div className="flex items-center gap-stack-sm">
                                <span className="font-code-md text-[10px] text-tertiary">LATENCY:</span>
                                <span className="font-code-md text-[10px] text-on-surface">14ms</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-stack-lg text-center font-code-md text-code-md text-on-surface-variant opacity-40">
                        Encrypted with AES-256-GCM. Restricted monitoring in progress.
                    </p>
                </div>
            </main>

            <footer className="bg-background border-t border-outline-variant flat no shadows docked full-width bottom-0 z-50 mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-stack-md max-w-container-max mx-auto">
                    <span className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm md:mb-0">
                        SECURE CONSOLE ACCESS | SYSTEM_STATUS: OPERATIONAL
                    </span>
                    <div className="flex gap-stack-lg">
                        <a className="font-code-md text-code-md text-on-tertiary-fixed-variant hover:text-primary transition-colors transition-all duration-200" href="#">Documentation</a>
                        <a className="font-code-md text-code-md text-on-tertiary-fixed-variant hover:text-primary transition-colors transition-all duration-200" href="#">Network Audit</a>
                        <a className="font-code-md text-code-md text-on-tertiary-fixed-variant hover:text-primary transition-colors transition-all duration-200" href="#">API Status</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}