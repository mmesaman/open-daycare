'use client';

import { useState } from 'react';
import { type AllergyType, type Kid } from '@/app/_data/kids';

interface AddChildModalProps {
  open: boolean;
  existingKids: Kid[];
  onClose: () => void;
  onSave: (kid: Kid) => void;
}

const AVATAR_PALETTES = [
  { bg: '#A9D9E8', color: '#1F7A93' },
  { bg: '#F4B8CC', color: '#C44A7A' },
  { bg: '#B9DEC4', color: '#3E8B62' },
  { bg: '#F4DC8E', color: '#9A7B1E' },
  { bg: '#C9B6E8', color: '#7B5FC0' },
];

function normalizeForSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateId(fullName: string, existingKids: Kid[]): string {
  const base = normalizeForSlug(fullName) || 'nino';
  const existingIds = new Set(existingKids.map((k) => k.id));
  if (!existingIds.has(base)) return base;
  let i = 2;
  while (existingIds.has(`${base}-${i}`)) {
    i += 1;
  }
  return `${base}-${i}`;
}

function applyDateMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

function parseDateDDMMYYYY(dateStr: string): Date | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return null;
  const [dd, mm, yyyy] = dateStr.split('/').map((n) => parseInt(n, 10));
  const date = new Date(yyyy, mm - 1, dd);
  if (
    date.getFullYear() !== yyyy ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd
  ) {
    return null;
  }
  return date;
}

function isDateValidNotFuture(dateStr: string): boolean {
  const date = parseDateDDMMYYYY(dateStr);
  if (!date) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date <= today;
}

function calculateAge(birthDateStr: string): number {
  const birth = parseDateDDMMYYYY(birthDateStr);
  if (!birth) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age < 0 ? 0 : age;
}

function mapAllergies(allergiesText: string): {
  allergies: AllergyType[];
  remainingNotes: string;
} {
  const text = allergiesText.trim();
  if (!text) return { allergies: [], remainingNotes: '' };
  const lower = text.toLowerCase();
  const allergies: AllergyType[] = [];
  if (lower.includes('man') || lower.includes('peanut')) {
    if (!allergies.includes('peanut')) allergies.push('peanut');
  }
  if (lower.includes('lact')) {
    if (!allergies.includes('lactose')) allergies.push('lactose');
  }
  if (lower.includes('gluten')) {
    if (!allergies.includes('gluten')) allergies.push('gluten');
  }
  // If mapped, we don't duplicate mapped keywords in a special way; keep original text manageable
  // Per spec: if not mapped keep text in medicalNotes - we merge later
  return { allergies, remainingNotes: text };
}

export function AddChildModal({
  open,
  existingKids,
  onClose,
  onSave,
}: AddChildModalProps) {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [room] = useState('Soles');
  const [allergiesText, setAllergiesText] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setFullName('');
    setBirthDate('');
    setAllergiesText('');
    setMedicalNotes('');
    setError(null);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    setError(null);
    const nameTrimmed = fullName.trim();
    if (!nameTrimmed) {
      setError('El nombre completo es obligatorio.');
      return;
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      setError('La fecha de nacimiento debe tener el formato dd/mm/aaaa.');
      return;
    }
    if (!isDateValidNotFuture(birthDate)) {
      setError('La fecha de nacimiento no es válida o es futura.');
      return;
    }
    if (room !== 'Soles') {
      setError('La sala debe ser Soles.');
      return;
    }

    const { allergies, remainingNotes } = mapAllergies(allergiesText);
    const parts = nameTrimmed.split(/\s+/);
    const firstName = parts[0] || nameTrimmed;
    const lastName = parts.slice(1).join(' ') || firstName;
    const initial = firstName.charAt(0).toUpperCase() || 'N';
    const id = generateId(nameTrimmed, existingKids);
    const age = calculateAge(birthDate);
    const palette = AVATAR_PALETTES[existingKids.length % AVATAR_PALETTES.length];

    const notesParts: string[] = [];
    if (medicalNotes.trim()) notesParts.push(medicalNotes.trim());
    if (remainingNotes && allergies.length === 0) {
      notesParts.push(remainingNotes);
    } else if (remainingNotes && allergies.length > 0) {
      // Keep non-mapped context minimal; mapped go to allergies
      // If there was other text mixed, append as-is
      const lower = remainingNotes.toLowerCase();
      // Simple: if we mapped something, don't duplicate obvious keywords; still safe to append if extra text
      if (
        !(
          (allergies.includes('peanut') &&
            (lower.includes('man') || lower.includes('peanut'))) ||
          (allergies.includes('lactose') && lower.includes('lact')) ||
          (allergies.includes('gluten') && lower.includes('gluten'))
        )
      ) {
        notesParts.push(remainingNotes);
      } else if (remainingNotes.replace(/maní|mani|peanut|lactosa|lactose|gluten/gi, '').trim()) {
        notesParts.push(
          remainingNotes.replace(/maní|mani|peanut|lactosa|lactose|gluten/gi, '').trim()
        );
      }
    }

    const kid: Kid = {
      id,
      firstName,
      lastName,
      fullName: nameTrimmed,
      initial,
      age,
      room: 'Soles',
      birthDate,
      enrollmentDate: '',
      allergies,
      medicalNotes: notesParts.join(' ').trim(),
      linkedParents: [],
      avatarBg: palette.bg,
      avatarColor: palette.color,
    };

    onSave(kid);
    reset();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-6 py-10"
      style={{ background: 'rgba(63,54,46,0.25)' }}
    >
      <div className="w-full max-w-[520px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden">
        <div className="flex items-center justify-between px-[26px] py-5 border-b border-[#ECE0D0]">
          <button
            type="button"
            onClick={handleCancel}
            className="text-[#94887B] font-bold text-[15px]"
          >
            Cancelar
          </button>
          <span className="font-head font-semibold text-[18px] text-ink">
            Agregar niño
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="text-[#D9583C] font-extrabold text-[15px]"
          >
            Guardar
          </button>
        </div>
        <div className="px-[26px] py-6">
          <div className="text-[12px] font-extrabold tracking-[0.7px] text-[#94887B] mb-2">
            NOMBRE COMPLETO
          </div>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ej. Martina López"
            className="w-full px-4 py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-ink mb-[18px] outline-none"
          />
          <div className="flex gap-[14px] mb-[18px]">
            <div className="flex-1">
              <div className="text-[12px] font-extrabold tracking-[0.7px] text-[#94887B] mb-2">
                FECHA DE NACIMIENTO
              </div>
              <input
                value={birthDate}
                onChange={(e) => setBirthDate(applyDateMask(e.target.value))}
                placeholder="dd/mm/aaaa"
                inputMode="numeric"
                maxLength={10}
                className="w-full px-4 py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-ink outline-none"
              />
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-extrabold tracking-[0.7px] text-[#94887B] mb-2">
                SALA
              </div>
              <div className="flex items-center gap-2 px-4 py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-ink font-bold">
                {room}
                <span className="flex-1" />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B0A290"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-[12px] font-extrabold tracking-[0.7px] text-[#94887B] mb-2">
            ALERGIAS (ETIQUETAS)
          </div>
          <input
            value={allergiesText}
            onChange={(e) => setAllergiesText(e.target.value)}
            placeholder="Ej. Maní, Lactosa"
            className="w-full px-4 py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-ink mb-[18px] outline-none"
          />
          <div className="text-[12px] font-extrabold tracking-[0.7px] text-[#94887B] mb-2">
            NOTAS MÉDICAS
          </div>
          <textarea
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            placeholder="Indicaciones, medicación, contactos…"
            className="w-full min-h-[90px] resize-y px-4 py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-ink leading-[1.5] outline-none"
          />
          {error ? (
            <div className="mt-3 text-[13px] text-[#D9583C] font-semibold">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
