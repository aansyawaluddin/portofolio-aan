// src/app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const router = useRouter();
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [activeTab, setActiveTab] = useState("PROJECTS"); // Tab state: PROJECTS atau EXPERIENCES

    // ==========================================
    // DATA STATE
    // ==========================================
    const [techStacks, setTechStacks] = useState([]);

    // ==========================================
    // MODAL STATE (Untuk tambah Tech Stack)
    // ==========================================
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalCategory, setModalCategory] = useState("");
    const [newTechName, setNewTechName] = useState("");
    const [newTechIcon, setNewTechIcon] = useState("terminal");
    const [isSubmittingTech, setIsSubmittingTech] = useState(false);

    // ==========================================
    // FORM STATE: PROJECT
    // ==========================================
    const [projectTitle, setProjectTitle] = useState("");
    const [coreFocus, setCoreFocus] = useState("Backend Architecture");
    const [projectDesc, setProjectDesc] = useState("");
    const [backendLogic, setBackendLogic] = useState("");
    const [visualAssetFile, setVisualAssetFile] = useState(null); // State untuk File Gambar
    const [selectedTechs, setSelectedTechs] = useState([]); // Array of tech_stack IDs
    const [isSubmittingProject, setIsSubmittingProject] = useState(false);

    // ==========================================
    // FORM STATE: EXPERIENCE
    // ==========================================
    const [expTitle, setExpTitle] = useState("");
    const [expStatus, setExpStatus] = useState("PRESENT");
    const [expDesc, setExpDesc] = useState("");
    const [isSubmittingExp, setIsSubmittingExp] = useState(false);

    // ==========================================
    // INISIALISASI (Cek Sesi & Ambil Data)
    // ==========================================
    useEffect(() => {
        const initData = async () => {
            // 1. Cek Login
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }
            setIsLoadingAuth(false);

            // 2. Ambil data Tech Stacks
            fetchTechStacks();
        };
        initData();
    }, [router]);

    const fetchTechStacks = async () => {
        const { data, error } = await supabase.from('tech_stacks').select('*').order('order_index');
        if (!error && data) setTechStacks(data);
    };

    // ==========================================
    // FUNGSI: TECH STACKS
    // ==========================================
    const openModal = (category) => {
        setModalCategory(category);
        setIsModalOpen(true);
    };

    const handleAddTechStack = async (e) => {
        e.preventDefault();
        setIsSubmittingTech(true);
        const { error } = await supabase.from('tech_stacks').insert([{
            name: newTechName,
            category: modalCategory,
            icon_name: newTechIcon
        }]);
        setIsSubmittingTech(false);

        if (error) alert("Gagal: " + error.message);
        else {
            setIsModalOpen(false);
            setNewTechName(""); setNewTechIcon("terminal");
            fetchTechStacks(); // Refresh daftar
        }
    };

    const handleDeleteTech = async (id) => {
        if (confirm("Hapus tech stack ini?")) {
            await supabase.from('tech_stacks').delete().eq('id', id);
            fetchTechStacks();
        }
    };

    const toggleTechSelection = (id) => {
        setSelectedTechs(prev =>
            prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
        );
    };

    // ==========================================
    // FUNGSI: SUBMIT PROJECT (Dengan Upload Gambar)
    // ==========================================
    const handleAddProject = async (e) => {
        e.preventDefault();
        setIsSubmittingProject(true);

        let uploadedImageUrl = "";

        // 1. Proses Upload Gambar (Jika ada file yang dipilih)
        if (visualAssetFile) {
            const fileExt = visualAssetFile.name.split('.').pop();
            const fileName = `project-${Date.now()}.${fileExt}`; // Buat nama unik

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(fileName, visualAssetFile);

            if (uploadError) {
                alert("Gagal mengunggah gambar: " + uploadError.message);
                setIsSubmittingProject(false);
                return;
            }

            // Ambil URL Publik dari gambar yang baru diupload
            const { data: publicUrlData } = supabase.storage
                .from('project-images')
                .getPublicUrl(fileName);

            uploadedImageUrl = publicUrlData.publicUrl;
        }

        // 2. Insert ke tabel projects
        const { data: newProject, error: projectError } = await supabase.from('projects').insert([{
            title: projectTitle,
            core_focus: coreFocus,
            description: projectDesc,
            backend_logic: backendLogic,
            visual_asset_url: uploadedImageUrl,
            status: 'PUBLISHED'
        }]).select();

        if (projectError) {
            alert("Gagal menyimpan project: " + projectError.message);
            setIsSubmittingProject(false);
            return;
        }

        // 3. Insert ke tabel relasi project_tech_stacks
        if (newProject && newProject[0] && selectedTechs.length > 0) {
            const projectId = newProject[0].id;
            const relations = selectedTechs.map(techId => ({
                project_id: projectId,
                tech_stack_id: techId
            }));
            await supabase.from('project_tech_stacks').insert(relations);
        }

        setIsSubmittingProject(false);
        alert("Project & Gambar berhasil diunggah!");

        // Reset Form
        setProjectTitle(""); setProjectDesc(""); setBackendLogic("");
        setVisualAssetFile(null); setSelectedTechs([]);
    };

    // ==========================================
    // FUNGSI: SUBMIT EXPERIENCE
    // ==========================================
    const handleAddExperience = async (e) => {
        e.preventDefault();
        setIsSubmittingExp(true);
        const badgeColor = expStatus === 'PRESENT' ? 'secondary' : 'outline';

        const { error } = await supabase.from('experiences').insert([{
            title: expTitle,
            status_badge: expStatus,
            badge_color: badgeColor,
            description: expDesc
        }]);

        setIsSubmittingExp(false);
        if (error) alert("Gagal: " + error.message);
        else {
            alert("Experience berhasil disimpan!");
            setExpTitle(""); setExpDesc("");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (isLoadingAuth) return <div className="min-h-screen bg-background text-on-surface flex items-center justify-center font-code-md">VERIFYING_SECURE_SESSION...</div>;

    // Kelompokkan data untuk Sidebar Kanan
    const backendTools = techStacks.filter(t => t.category === 'BACKEND_INFRA');
    const mobileTools = techStacks.filter(t => t.category === 'MOBILE_INTERFACE');
    const infraTools = techStacks.filter(t => t.category === 'CLUSTER_ORCHESTRATION');

    return (
        <div className="flex min-h-screen bg-background text-on-surface">
            {/* ============================================== */}
            {/* MODAL TAMBAH TECH STACK */}
            {/* ============================================== */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-surface-container border border-outline-variant p-stack-lg rounded-xl w-[400px]">
                        <h3 className="font-headline-sm mb-4">Add {modalCategory}</h3>
                        <form onSubmit={handleAddTechStack} className="space-y-4">
                            <div>
                                <label className="text-xs font-label-caps text-on-surface-variant block mb-1">Tech Name</label>
                                <input required value={newTechName} onChange={e => setNewTechName(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant rounded p-2 text-sm focus:border-secondary outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-label-caps text-on-surface-variant block mb-1">Material Icon Name (e.g. dns, terminal)</label>
                                <input required value={newTechIcon} onChange={e => setNewTechIcon(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant rounded p-2 text-sm focus:border-secondary outline-none" />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4 border-t border-outline-variant">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-label-caps text-on-surface-variant hover:text-on-surface">CANCEL</button>
                                <button type="submit" disabled={isSubmittingTech} className="px-4 py-2 text-xs font-label-caps bg-primary text-on-primary rounded">{isSubmittingTech ? 'SAVING...' : 'SAVE TECH'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================== */}
            {/* KIRI: SIDEBAR NAVIGASI */}
            {/* ============================================== */}
            <aside className="bg-surface-container-low flex flex-col h-screen p-stack-md space-y-stack-sm border-r border-outline-variant fixed left-0 top-0 w-64 z-50">
                <div className="mb-stack-lg px-2">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">DevAdmin</h2>
                    <div className="flex items-center space-x-3 mt-4 p-2">
                        <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-bold">A</div>
                        <div className="overflow-hidden">
                            <p className="font-label-caps text-label-caps text-on-surface truncate">Admin</p>
                            <p className="font-body-md text-xs text-on-surface-variant truncate">System Architect</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveTab("PROJECTS")} className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 ${activeTab === "PROJECTS" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
                        <span className="material-symbols-outlined">terminal</span>
                        <span className="font-label-caps text-label-caps">Projects</span>
                    </button>
                    <button onClick={() => setActiveTab("EXPERIENCES")} className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 ${activeTab === "EXPERIENCES" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
                        <span className="material-symbols-outlined">work_history</span>
                        <span className="font-label-caps text-label-caps">Experiences</span>
                    </button>
                </nav>
                <div className="pt-stack-md border-t border-outline-variant">
                    <button onClick={handleLogout} className="w-full bg-error/20 text-error hover:bg-error hover:text-on-error py-3 px-4 rounded-lg font-label-caps text-label-caps transition-colors flex items-center justify-center space-x-2">
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>LOGOUT</span>
                    </button>
                </div>
            </aside>

            {/* ============================================== */}
            {/* TENGAH & KANAN: KONTEN UTAMA */}
            {/* ============================================== */}
            <div className="flex-1 ml-64 flex flex-col">
                <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-gutter h-16 sticky top-0 z-40">
                    <div className="flex items-center space-x-4">
                        <h1 className="font-headline-sm text-headline-sm font-bold text-primary">DevAdmin Console</h1>
                        <span className="px-2 py-0.5 bg-surface-container-highest text-[10px] font-label-caps text-on-surface-variant rounded border border-outline-variant">PORTFOLIO_V2.0</span>
                    </div>
                </header>

                <main className="p-gutter max-w-container-max mx-auto w-full space-y-stack-lg">
                    <div className="mb-stack-lg">
                        <h2 className="font-headline-md text-headline-md text-on-background">Portfolio Management</h2>
                        <p className="font-body-md text-on-surface-variant">Configure architectural projects and manage core technical systems.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">

                        {/* TENGAH: AREA FORM (Projects / Experiences) */}
                        <div className="lg:col-span-8">

                            {activeTab === "PROJECTS" && (
                                <section className="bg-surface-container-low border border-outline-variant rounded-xl p-stack-md animate-fade-in">
                                    <div className="flex items-center space-x-2 mb-stack-md border-b border-outline-variant pb-stack-sm">
                                        <span className="material-symbols-outlined text-primary">add_box</span>
                                        <span className="font-label-caps text-label-caps text-on-surface">CREATE_PROJECT.EXE</span>
                                    </div>

                                    <form onSubmit={handleAddProject} className="space-y-stack-md">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                                            <div className="space-y-unit">
                                                <label className="font-label-caps text-label-caps text-on-surface-variant">PROJECT_TITLE</label>
                                                <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} required className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-sm focus:border-secondary outline-none transition-all" placeholder="e.g. Distributed System" type="text" />
                                            </div>
                                            <div className="space-y-unit">
                                                <label className="font-label-caps text-label-caps text-on-surface-variant">CORE_FOCUS</label>
                                                <select value={coreFocus} onChange={(e) => setCoreFocus(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-sm focus:border-secondary outline-none appearance-none">
                                                    <option value="Backend Architecture">Backend Architecture</option>
                                                    <option value="Infrastructure/DevOps">Infrastructure/DevOps</option>
                                                    <option value="Full-stack System">Full-stack System</option>
                                                    <option value="Mobile Engineering">Mobile Engineering</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-unit">
                                            <label className="font-label-caps text-label-caps text-on-surface-variant">TECH_STACK_TAGS (Pilih Alat yang Digunakan)</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-surface-container-highest border border-outline-variant rounded-lg max-h-48 overflow-y-auto">
                                                {techStacks.map(tech => (
                                                    <label key={tech.id} className="flex items-center space-x-2 cursor-pointer p-1.5 hover:bg-surface-variant rounded">
                                                        <input
                                                            type="checkbox"
                                                            className="accent-secondary"
                                                            checked={selectedTechs.includes(tech.id)}
                                                            onChange={() => toggleTechSelection(tech.id)}
                                                        />
                                                        <span className="material-symbols-outlined text-[14px] text-outline">{tech.icon_name}</span>
                                                        <span className="font-code-md text-xs text-on-surface">{tech.name}</span>
                                                    </label>
                                                ))}
                                                {techStacks.length === 0 && <span className="text-xs text-outline italic col-span-3">Belum ada tech stack. Tambahkan di panel kanan.</span>}
                                            </div>
                                        </div>

                                        <div className="space-y-unit">
                                            <label className="font-label-caps text-label-caps text-on-surface-variant">SYSTEM_DESCRIPTION</label>
                                            <textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} required className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-sm focus:border-secondary outline-none resize-none" rows="3"></textarea>
                                        </div>

                                        <div className="space-y-unit">
                                            <label className="font-label-caps text-label-caps text-on-surface-variant text-secondary">LOGIC_HIGHLIGHT</label>
                                            <textarea value={backendLogic} onChange={(e) => setBackendLogic(e.target.value)} className="w-full bg-surface-container-lowest border border-secondary/30 rounded-lg p-3 font-code-md text-sm focus:border-secondary outline-none resize-none" placeholder="// Code snippet or logic explanation" rows="4"></textarea>
                                        </div>

                                        {/* ================= FILE UPLOAD ================= */}
                                        <div className="space-y-unit">
                                            <label className="font-label-caps text-label-caps text-on-surface-variant">VISUAL_ASSET_FILE (Upload Image)</label>
                                            <div className="bg-surface-container-high border border-outline-variant rounded-lg p-3">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setVisualAssetFile(e.target.files[0])}
                                                    className="w-full text-sm font-code-md text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-label-caps file:bg-primary file:text-on-primary hover:file:bg-primary/90"
                                                />
                                            </div>
                                            <p className="text-[10px] text-outline italic mt-1">*Gambar akan otomatis disimpan di Supabase Storage (Max 10MB).</p>
                                        </div>

                                        <div className="pt-4 border-t border-outline-variant">
                                            <button disabled={isSubmittingProject} className="bg-primary text-on-primary font-label-caps px-6 py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center space-x-2 shadow-lg shadow-primary/20 disabled:opacity-50" type="submit">
                                                <span className="material-symbols-outlined">{isSubmittingProject ? "sync" : "publish"}</span>
                                                <span>{isSubmittingProject ? "PUBLISHING..." : "PUBLISH PROJECT"}</span>
                                            </button>
                                        </div>
                                    </form>
                                </section>
                            )}

                            {activeTab === "EXPERIENCES" && (
                                <section className="bg-surface-container-low border border-outline-variant rounded-xl p-stack-md animate-fade-in">
                                    <div className="flex items-center space-x-2 mb-stack-md border-b border-outline-variant pb-stack-sm">
                                        <span className="material-symbols-outlined text-secondary">work_history</span>
                                        <span className="font-label-caps text-label-caps text-on-surface">ADD_EXPERIENCE_RECORD.EXE</span>
                                    </div>

                                    <form onSubmit={handleAddExperience} className="space-y-stack-md">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                                            <div className="space-y-unit">
                                                <label className="font-label-caps text-label-caps text-on-surface-variant">EXPERIENCE_TITLE</label>
                                                <input value={expTitle} onChange={(e) => setExpTitle(e.target.value)} required className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-sm focus:border-secondary outline-none" placeholder="e.g. Backend Developer Intern" type="text" />
                                            </div>
                                            <div className="space-y-unit">
                                                <label className="font-label-caps text-label-caps text-on-surface-variant">STATUS_BADGE</label>
                                                <select value={expStatus} onChange={(e) => setExpStatus(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-sm focus:border-secondary outline-none">
                                                    <option value="PRESENT">PRESENT</option>
                                                    <option value="COMPLETED">COMPLETED</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-unit">
                                            <label className="font-label-caps text-label-caps text-on-surface-variant">DESCRIPTION</label>
                                            <textarea value={expDesc} onChange={(e) => setExpDesc(e.target.value)} required className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-sm focus:border-secondary outline-none resize-none" rows="4"></textarea>
                                        </div>
                                        <div className="pt-4 border-t border-outline-variant">
                                            <button disabled={isSubmittingExp} className="bg-secondary text-on-secondary font-label-caps px-6 py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50" type="submit">
                                                <span className="material-symbols-outlined">{isSubmittingExp ? "sync" : "save"}</span>
                                                <span>{isSubmittingExp ? "SAVING..." : "SAVE EXPERIENCE"}</span>
                                            </button>
                                        </div>
                                    </form>
                                </section>
                            )}

                        </div>

                        {/* KANAN: TECH STACK SIDEBAR */}
                        <div className="lg:col-span-4">
                            <section className="bg-surface-container-low border border-outline-variant rounded-xl p-stack-md sticky top-24">
                                <div className="flex items-center space-x-2 mb-stack-md border-b border-outline-variant pb-stack-sm">
                                    <span className="material-symbols-outlined text-secondary">inventory_2</span>
                                    <span className="font-label-caps text-label-caps text-on-surface">SYSTEM_TOOLS_MANAGER</span>
                                </div>

                                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">

                                    {/* Kategori: Backend */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-label-caps text-xs text-on-surface-variant">BACKEND_INFRA</h4>
                                            <button onClick={() => openModal('BACKEND_INFRA')} className="material-symbols-outlined text-sm hover:text-primary">add</button>
                                        </div>
                                        <div className="space-y-1">
                                            {backendTools.map(tech => (
                                                <div key={tech.id} className="flex items-center justify-between bg-surface-container-high p-2 rounded border border-outline-variant hover:border-error group transition-colors">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="material-symbols-outlined text-on-surface-variant text-[16px]">{tech.icon_name}</span>
                                                        <span className="font-code-md text-xs">{tech.name}</span>
                                                    </div>
                                                    <button onClick={() => handleDeleteTech(tech.id)} className="material-symbols-outlined text-xs text-error opacity-0 group-hover:opacity-100 transition-opacity">delete</button>
                                                </div>
                                            ))}
                                            {backendTools.length === 0 && <span className="text-xs text-outline italic">Kosong.</span>}
                                        </div>
                                    </div>

                                    {/* Kategori: Mobile */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-label-caps text-xs text-on-surface-variant">MOBILE_INTERFACE</h4>
                                            <button onClick={() => openModal('MOBILE_INTERFACE')} className="material-symbols-outlined text-sm hover:text-primary">add</button>
                                        </div>
                                        <div className="space-y-1">
                                            {mobileTools.map(tech => (
                                                <div key={tech.id} className="flex items-center justify-between bg-surface-container-high p-2 rounded border border-outline-variant hover:border-error group transition-colors">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="material-symbols-outlined text-on-surface-variant text-[16px]">{tech.icon_name}</span>
                                                        <span className="font-code-md text-xs">{tech.name}</span>
                                                    </div>
                                                    <button onClick={() => handleDeleteTech(tech.id)} className="material-symbols-outlined text-xs text-error opacity-0 group-hover:opacity-100 transition-opacity">delete</button>
                                                </div>
                                            ))}
                                            {mobileTools.length === 0 && <span className="text-xs text-outline italic">Kosong.</span>}
                                        </div>
                                    </div>

                                    {/* Kategori: Infrastruktur */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-label-caps text-xs text-on-surface-variant">CLUSTER_ORCHESTRATION</h4>
                                            <button onClick={() => openModal('CLUSTER_ORCHESTRATION')} className="material-symbols-outlined text-sm hover:text-primary">add</button>
                                        </div>
                                        <div className="space-y-1">
                                            {infraTools.map(tech => (
                                                <div key={tech.id} className="flex items-center justify-between bg-surface-container-high p-2 rounded border border-outline-variant hover:border-error group transition-colors">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="material-symbols-outlined text-on-surface-variant text-[16px]">{tech.icon_name}</span>
                                                        <span className="font-code-md text-xs">{tech.name}</span>
                                                    </div>
                                                    <button onClick={() => handleDeleteTech(tech.id)} className="material-symbols-outlined text-xs text-error opacity-0 group-hover:opacity-100 transition-opacity">delete</button>
                                                </div>
                                            ))}
                                            {infraTools.length === 0 && <span className="text-xs text-outline italic">Kosong.</span>}
                                        </div>
                                    </div>

                                </div>
                            </section>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}