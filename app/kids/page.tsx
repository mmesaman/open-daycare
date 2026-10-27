'use client';

import { useEffect, useState } from 'react';
import { kids as initialKids, type Kid } from '@/app/_data/kids';
import { Sidebar } from '@/components/shared/Sidebar';
import { MobileNav } from '@/components/shared/MobileNav';
import { SearchIcon } from '@/components/shared/icons';
import { KidCard } from '@/components/kids/KidCard';
import { AddChildModal } from '@/components/kids/AddChildModal';

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function loadKids(): Kid[] {
  const base = [...initialKids];
  if (typeof window === 'undefined') return base;
  try {
    const stored = localStorage.getItem('open-daycare:added-kids');
    if (stored) {
      const added = JSON.parse(stored) as Kid[];
      if (added.length > 0) {
        const ids = new Set(base.map((k) => k.id));
        const merged = [...base];
        for (const k of added) {
          if (!ids.has(k.id)) {
            merged.push(k);
            ids.add(k.id);
          }
        }
        return merged;
      }
    }
  } catch {
    // ignore
  }
  return base;
}

export default function KidsPage() {
  const [query, setQuery] = useState('');
  const [kidsList, setKidsList] = useState<Kid[]>(() => loadKids());
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);

  const filtered = kidsList.filter((kid) =>
    normalize(kid.fullName).includes(normalize(query))
  );

  return (
    <div className="flex flex-1 min-h-screen bg-canvas">
      <Sidebar pathname="/kids" />
      <MobileNav pathname="/kids" />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="max-w-[880px] w-full mx-auto px-5 md:px-10 pt-16 md:pt-[34px] pb-20">
          <div className="flex items-end justify-between gap-4 mb-[22px]">
            <div>
              <div className="text-[12.5px] font-extrabold tracking-[0.8px] text-accent mb-1">
                GESTIÓN
              </div>
              <h1 className="font-head font-semibold text-[30px] text-ink m-0">
                Niños
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setIsAddChildOpen(true)}
              className="flex items-center gap-2 px-[18px] py-[11px] rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-extrabold text-[14.5px] shadow-[0_8px_18px_-8px_rgba(238,129,100,0.7)]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Agregar niño
            </button>
          </div>

          <div className="flex items-center gap-[11px] bg-card border border-line rounded-[14px] px-4 py-3 mb-[22px]">
            <SearchIcon className="w-[18px] h-[18px] text-[#B0A290]" />
            <input
              placeholder="Buscar niño…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-none bg-none text-[15px] text-ink placeholder-[#B6A99999] outline-none"
            />
          </div>

          <div className="flex items-center gap-3 mb-[14px]">
            <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-ink">
              SALA SOLES
            </span>
            <span className="text-[13px] text-muted">
              {filtered.length} niños
            </span>
            <span className="flex-1 h-px bg-[#E7DAC8]" />
          </div>

          <div className="grid grid-cols-2 gap-[14px]">
            {filtered.map((kid) => (
              <KidCard key={kid.id} kid={kid} />
            ))}
          </div>
        </div>
      </main>
      <AddChildModal
        open={isAddChildOpen}
        existingKids={kidsList}
        onClose={() => setIsAddChildOpen(false)}
        onSave={(kid) => {
          setKidsList((prev) => {
            const next = [...prev, kid];
            try {
              const stored = localStorage.getItem('open-daycare:added-kids');
              const added = stored ? (JSON.parse(stored) as Kid[]) : [];
              localStorage.setItem(
                'open-daycare:added-kids',
                JSON.stringify([...added.filter((a) => a.id !== kid.id), kid])
              );
            } catch {
              // ignore
            }
            return next;
          });
          setIsAddChildOpen(false);
        }}
      />
    </div>
  );
}
