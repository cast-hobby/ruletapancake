import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

// Leer .env.local
const env = Object.fromEntries(
  readFileSync(join(root, '.env.local'), 'utf8')
    .split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: true });

if (error) {
  console.error('Error al consultar Supabase:', error.message);
  process.exit(1);
}

if (!data.length) {
  console.log('No hay registros en la tabla leads todavía.');
  process.exit(0);
}

console.log(`✅ ${data.length} registro(s) encontrado(s).`);

// Columnas en orden amigable
const COLS = [
  'created_at',
  'nombre',
  'email',
  'whatsapp',
  'prediction_colombia',
  'prediction_portugal',
  'prize_name',
  'session_date',
  'id',
];

function cell(val) {
  if (val == null) return '';
  return `"${String(val).replace(/"/g, '""')}"`;
}

const header = COLS.map(c => {
  const labels = {
    created_at: 'Fecha y Hora',
    nombre: 'Nombre',
    email: 'Email',
    whatsapp: 'WhatsApp',
    prediction_colombia: 'Pronóstico Colombia',
    prediction_portugal: 'Pronóstico Portugal',
    prize_name: 'Premio Ganado',
    session_date: 'Fecha Sesión',
    id: 'ID',
  };
  return `"${labels[c] || c}"`;
}).join(',');

const rows = data.map(row => COLS.map(c => cell(row[c])).join(','));
const csv = [header, ...rows].join('\r\n');

const filename = join(root, `leads-fire-festival-${new Date().toISOString().slice(0, 10)}.csv`);
writeFileSync(filename, '﻿' + csv, 'utf8'); // BOM para Excel en español

console.log(`📄 Archivo generado: ${filename}`);
console.log('\n── Resumen ──');

const porPremio = {};
for (const row of data) {
  porPremio[row.prize_name] = (porPremio[row.prize_name] || 0) + 1;
}
for (const [prize, count] of Object.entries(porPremio).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${count}x  ${prize}`);
}
