import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const url = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
const key = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';

console.log('Connecting to Supabase at:', url);
const supabase = createClient(url, key);

async function testLive() {
  const tables = [
    'institutions',
    'profiles',
    'classrooms',
    'faculty',
    'students',
    'attendance_records',
    'timetable_slots',
    'payroll_records',
    'fee_invoices',
    'payment_transactions',
  ];

  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ Table '${t}': Error:`, error.message);
    } else {
      console.log(`✅ Table '${t}': OK (count = ${count})`);
    }
  }
}

testLive();
