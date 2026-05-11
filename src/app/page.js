import { supabase } from '@/lib/supabase';

async function getTechStacks() {
  const { data, error } = await supabase
    .from('tech_stacks')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Gagal mengambil data tech stacks:', error);
    return [];
  }
  return data;
}

async function getExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('order_index', { ascending: true }); 

  if (error) {
    console.error('Gagal mengambil data experiences:', error);
    return [];
  }
  return data;
}

export default async function Home() {
  const techStacks = await getTechStacks();
  const experiences = await getExperiences();

  const mobileStacks = techStacks.filter(t => t.category === 'MOBILE_INTERFACE');
  const backendStacks = techStacks.filter(t => t.category === 'BACKEND_INFRA');
  const infraStacks = techStacks.filter(t => t.category === 'CLUSTER_ORCHESTRATION');

  return (
    <div className="font-body-md text-body-md bg-background text-on-surface min-h-screen">
      {/* Top Navigation Bar */}
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant">
        <div className="max-w-[1200px] mx-auto px-gutter flex justify-between items-center h-16 w-full">
          <div className="font-code-md text-code-md font-bold tracking-tighter text-primary">AAN_SYAWAL.DEV</div>
          <nav className="hidden md:flex gap-stack-lg">
            <a className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200" href="#projects">Projects</a>
            <a className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200" href="#stack">Stack</a>
            <a className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200" href="#experience">Experience</a>
            <a className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200" href="#contact">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="/login" className="flex items-center gap-1 text-on-surface-variant hover:text-secondary transition-colors duration-200 group">
              <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">admin_panel_settings</span>
              <span className="font-label-caps text-xs hidden md:block">ADMIN</span>
            </a>
            <button className="bg-primary text-on-primary font-bold px-stack-md py-stack-sm rounded hover:opacity-90 active:scale-95 transition-all text-xs uppercase tracking-widest">Resume</button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="cyber-bg technical-grid">
          <div className="max-w-[1200px] mx-auto px-gutter pt-24 pb-section-gap flex flex-col items-start gap-stack-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
              <span className="font-label-caps text-[10px] text-secondary">&gt; HELLO WORLD, SAYA</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl">
              Aan Syawaluddin Adiputra
            </h1>
            <h2 className="font-headline-md text-headline-md text-primary -mt-4">
              Building Robust Backends & Seamless Mobile Experiences.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
              Mahasiswa Sistem Informasi di Universitas Hasanuddin yang berfokus pada pengembangan arsitektur server-side yang skalabel, manajemen database relasional yang kompleks, serta meracik antarmuka aplikasi mobile yang responsif.
            </p>
            <div className="flex flex-wrap gap-stack-md pt-4">
              <a className="bg-primary text-on-primary px-8 py-3 rounded font-bold hover:opacity-90 active:scale-95 transition-all font-code-md flex items-center gap-2" href="#projects">
                [ 🚀 Lihat Proyek Saya ]
              </a>
              <button className="border border-outline text-on-surface px-8 py-3 rounded font-bold hover:bg-surface-variant active:scale-95 transition-all font-code-md">
                [ 📄 Unduh CV ]
              </button>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="max-w-[1200px] mx-auto px-gutter py-section-gap border-t border-outline-variant/30" id="stack">
          <div className="mb-stack-lg border-l-4 border-primary pl-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">Tech Stack & Tools</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Core technologies used in engineering scalable digital solutions.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-stack-lg">
            <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl hover:border-primary transition-colors group">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>smartphone</span>
                <h3 className="font-headline-sm text-headline-sm">Mobile</h3>
              </div>
              <div className="space-y-3">
                {mobileStacks.map((tech) => (
                  <div key={tech.id} className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">{tech.icon_name}</span>
                    <span className="font-code-md text-code-md">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl hover:border-secondary transition-colors group">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>dns</span>
                <h3 className="font-headline-sm text-headline-sm">Backend</h3>
              </div>
              <div className="space-y-3">
                {backendStacks.map((tech) => (
                  <div key={tech.id} className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">{tech.icon_name}</span>
                    <span className="font-code-md text-code-md">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl hover:border-on-surface transition-colors group">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-on-surface group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
                <h3 className="font-headline-sm text-headline-sm">Infrastructure</h3>
              </div>
              <div className="space-y-3">
                {infraStacks.map((tech) => (
                  <div key={tech.id} className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">{tech.icon_name}</span>
                    <span className="font-code-md text-code-md">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="max-w-[1200px] mx-auto px-gutter py-section-gap" id="projects">
          <div className="mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface">Featured Projects</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="flex flex-col bg-surface-container border border-outline-variant rounded-2xl overflow-hidden group hover:border-primary/50 transition-all">
              <div className="relative overflow-hidden aspect-video bg-surface-container-high">
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold px-2 py-1 rounded border border-primary/30 uppercase tracking-wider">Node.js</span>
                  <span className="bg-secondary/20 backdrop-blur-md text-secondary text-[10px] font-bold px-2 py-1 rounded border border-secondary/30 uppercase tracking-wider">Socket.io</span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="font-headline-sm text-headline-sm">Aplikasi Cerdas Cermat (Real-time Quiz)</h3>
                <p className="font-body-md text-on-surface-variant">Merancang dan mengimplementasikan arsitektur real-time event untuk memastikan sinkronisasi waktu nyata antar pemain.</p>
                <div className="p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-lg">
                  <div className="flex items-start gap-2 text-secondary font-code-md text-xs">
                    <span className="material-symbols-outlined text-sm mt-0.5">terminal</span>
                    <p className="text-[11px] leading-relaxed italic text-outline">"Tantangan utama saya di sisi Backend adalah menggunakan Socket.io untuk memastikan sinkronisasi instan state kuis (soal, skor, waktu) di semua perangkat klien seluler."</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-surface-container border border-outline-variant rounded-2xl overflow-hidden group hover:border-secondary/50 transition-all">
              <div className="relative overflow-hidden aspect-video bg-surface-container-high">
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-secondary/20 backdrop-blur-md text-secondary text-[10px] font-bold px-2 py-1 rounded border border-secondary/30 uppercase tracking-wider">Node.js</span>
                  <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20 uppercase tracking-wider">Prisma ORM</span>
                  <span className="bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold px-2 py-1 rounded border border-primary/30 uppercase tracking-wider">Nginx</span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="font-headline-sm text-headline-sm">SIMONEVA (Sistem Monitoring & Evaluasi)</h3>
                <p className="font-body-md text-on-surface-variant">Merancang skema database relasional kompleks dan arsitektur server berbasis Role-Based Access Control (RBAC).</p>
                <div className="p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-lg">
                  <div className="flex items-start gap-2 text-primary font-code-md text-xs">
                    <span className="material-symbols-outlined text-sm mt-0.5">database</span>
                    <p className="text-[11px] leading-relaxed italic text-outline">"Peran saya di Backend adalah merancang skema Prisma dan kueri relasional yang efisien. Saya juga mengonfigurasi SSL pada reverse proxy Nginx untuk mengamankan data."</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col md:flex-row bg-surface-container border border-outline-variant rounded-2xl overflow-hidden group hover:border-on-surface/30 transition-all">
              <div className="md:w-1/3 relative overflow-hidden bg-surface-container-high border-r border-outline-variant/20">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="material-symbols-outlined text-[120px]">directions_run</span>
                </div>
                <div className="relative p-12 h-full flex flex-col justify-center items-center">
                  <div className="p-4 bg-primary/20 rounded-full mb-4">
                    <span className="material-symbols-outlined text-primary text-4xl">directions_run</span>
                  </div>
                  <span className="font-label-caps text-primary tracking-widest">FLUTTER PROJECT</span>
                </div>
              </div>
              <div className="p-8 md:p-12 flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline-md text-headline-md">RunMates</h3>
                  <span className="text-xs font-code-md text-outline">v1.0.0</span>
                </div>
                <p className="font-body-lg text-on-surface-variant">
                  A mobile application developed using the <strong>Waterfall Method</strong>, specifically designed for beginner runners in Makassar to find running mates and track routes.
                </p>
                <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-sm text-outline"><span className="material-symbols-outlined text-sm">location_on</span> Makassar, ID</span>
                  <span className="flex items-center gap-2 text-sm text-outline"><span className="material-symbols-outlined text-sm">architecture</span> Waterfall Dev</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-gutter py-section-gap" id="experience">
          <div className="mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface">Experience & Certifications</h2>
          </div>
          <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">

            {experiences.length === 0 ? (
              <p className="pl-12 text-outline font-code-md text-sm italic">Belum ada data experience.</p>
            ) : (
              experiences.map((exp) => {
                const isSecondary = exp.badge_color === 'secondary';
                const dotColor = isSecondary ? 'bg-secondary' : 'bg-outline-variant';
                const badgeStyle = isSecondary
                  ? 'text-secondary bg-secondary/10'
                  : 'text-outline bg-surface-container';

                return (
                  <div key={exp.id} className="relative pl-12">
                    <div className="absolute left-0 top-1.5 w-8 h-8 bg-surface-container-high border border-outline-variant rounded-full flex items-center justify-center z-10">
                      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl">
                      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-2">
                        <h3 className="font-headline-sm text-headline-sm">{exp.title}</h3>
                        <span className={`font-label-caps text-[10px] px-2 py-1 rounded self-start ${badgeStyle}`}>
                          {exp.status_badge}
                        </span>
                      </div>
                      <p className="text-on-surface-variant font-body-md whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </section>

        {/* Contact CTA */}
        <section className="max-w-[1200px] mx-auto px-gutter py-section-gap" id="contact">
          <div className="bg-primary-container/20 border border-primary/30 rounded-3xl p-10 md:p-16 text-center space-y-8">
            <h2 className="font-headline-md text-headline-md text-primary">Mari berkolaborasi untuk menciptakan arsitektur sistem yang lebih baik.</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <a className="flex items-center gap-3 text-body-lg hover:text-primary transition-colors" href="mailto:a@gmail.com">
                <span className="material-symbols-outlined">mail</span>
                <span>a@gmail.com</span>
              </a>
              <a className="flex items-center gap-3 text-body-lg hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">link</span>
                <span>LinkedIn</span>
              </a>
              <a className="flex items-center gap-3 text-body-lg hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">terminal</span>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest full-width py-12 border-t border-outline-variant mt-section-gap">
        <div className="max-w-[1200px] mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="font-code-md text-code-md font-bold text-primary">AAN_SYAWAL.DEV</div>
            <div className="text-outline text-xs font-code-md">© 2026 DEPLOY_SUCCESS. Built with precision.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-stack-lg">
            <a className="font-code-md text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">GitHub</a>
            <a className="font-code-md text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">LinkedIn</a>
            <a className="font-code-md text-xs text-on-surface-variant hover:text-primary transition-colors" href="mailto:a@gmail.com">Email</a>
          </div>
          <div className="font-code-md text-[10px] text-outline/50 bg-surface-container-low/50 px-3 py-2 rounded border border-outline-variant/10">
            {`{ "status": 200, "message": "Thanks for scrolling!" }`}
          </div>
        </div>
      </footer>
    </div>
  );
}