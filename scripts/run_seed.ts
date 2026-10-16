import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const url = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';

const supabase = createClient(url, serviceRoleKey);

async function runSeed() {
  console.log('Seeding Supabase at:', url);

  // 1. Seed Institutions
  const institutions = [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      name: 'Delhi Public World Academy',
      code: 'DPWA-DEL',
      slug: 'dpwa-del',
      type: 'school',
      status: 'Active',
      address: 'Sector 14, Rohini',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      phone: '+91 11 2789 4400',
      email: 'principal@dpwa-delhi.edu.in',
      currency: '₹',
      current_academic_year: '2024-2025',
      representative_name: 'Dr. Rajeshwar Sharma',
      representative_designation: 'Principal',
      representative_email: 'principal@dpwa-delhi.edu.in',
      representative_phone: '+91 98110 12345',
      enabled_modules: ['students', 'academics', 'attendance', 'timetable', 'exams', 'finance', 'announcements'],
      total_members: 128,
      total_students: 120,
      total_faculty: 8
    },
    {
      id: 'b2222222-2222-2222-2222-222222222222',
      name: 'Apex Institute of Technology & Engineering',
      code: 'AITE-BLR',
      slug: 'aite-blr',
      type: 'college',
      status: 'Active',
      address: 'Electronic City Phase 1',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      phone: '+91 80 4122 8800',
      email: 'dean@apextech.edu.in',
      currency: '₹',
      current_academic_year: '2024-2025',
      representative_name: 'Prof. Sunita Rao',
      representative_designation: 'Dean of Academics',
      representative_email: 'dean@apextech.edu.in',
      representative_phone: '+91 94480 56789',
      enabled_modules: ['students', 'academics', 'attendance', 'timetable', 'exams', 'finance', 'library', 'announcements'],
      total_members: 450,
      total_students: 420,
      total_faculty: 30
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      name: 'NexTech Digital Solutions Pvt. Ltd.',
      code: 'NEXT-CORP',
      slug: 'next-corp',
      type: 'corporate',
      status: 'Active',
      address: 'Cyber City, DLF Phase 2',
      city: 'Gurugram',
      state: 'Haryana',
      country: 'India',
      phone: '+91 124 456 7890',
      email: 'hr@nextechdigital.com',
      currency: '₹',
      current_academic_year: '2024-2025',
      representative_name: 'Vikram Malhotra',
      representative_designation: 'Chief People Officer',
      representative_email: 'vikram.m@nextechdigital.com',
      representative_phone: '+91 99100 23456',
      enabled_modules: ['corporate_dashboard', 'employees', 'clock', 'payroll', 'leaves', 'announcements'],
      total_members: 85,
      total_students: 0,
      total_faculty: 0
    },
    {
      id: 'd4444444-4444-4444-4444-444444444444',
      name: 'Directorate of Higher & Technical Education',
      code: 'GOVT-DHTE',
      slug: 'govt-dhte',
      type: 'government',
      status: 'Active',
      address: 'Sachivalaya Complex, Block 4',
      city: 'Gandhinagar',
      state: 'Gujarat',
      country: 'India',
      phone: '+91 79 2325 0001',
      email: 'commissioner@dhte.gov.in',
      currency: '₹',
      current_academic_year: '2024-2025',
      representative_name: 'Shri Anand Patel, IAS',
      representative_designation: 'Commissioner',
      representative_email: 'commissioner@dhte.gov.in',
      representative_phone: '+91 79 2325 0002',
      enabled_modules: ['govt_dashboard', 'circulars', 'file_tracking', 'employees', 'announcements'],
      total_members: 140,
      total_students: 0,
      total_faculty: 0
    }
  ];

  for (const inst of institutions) {
    const { error } = await supabase.from('institutions').upsert(inst, { onConflict: 'id' });
    if (error) console.error(`Error inserting institution ${inst.name}:`, error.message);
    else console.log(`✅ Institution seeded: ${inst.name}`);
  }

  // 2. Seed Venue Rooms
  const venueRooms = [
    { id: 'grand-atrium', name: 'Grand Atrium & Central Registration', floor: 'Ground Floor', zone: 'Zone Alpha', capacity: 350, current_occupancy: 110, congestion_status: 'low', coordinates: { x: 100, y: 200 } },
    { id: 'hall-a', name: 'Hall A — Main Keynote Auditorium', floor: 'Ground Floor', zone: 'Zone Alpha', capacity: 200, current_occupancy: 168, congestion_status: 'congested', coordinates: { x: 250, y: 120 } },
    { id: 'hall-b', name: 'Hall B — AI & Systems Amphitheatre', floor: '1st Floor', zone: 'Zone Beta', capacity: 120, current_occupancy: 60, congestion_status: 'moderate', coordinates: { x: 420, y: 140 } },
    { id: 'hall-c', name: 'Hall C — Web3 & Decentralized Lab', floor: '1st Floor', zone: 'Zone Beta', capacity: 90, current_occupancy: 32, congestion_status: 'low', coordinates: { x: 580, y: 150 } },
    { id: 'workshop-room-1', name: 'Workshop Lab 1 — Hands-on Quantum', floor: '2nd Floor', zone: 'Zone Gamma', capacity: 45, current_occupancy: 41, congestion_status: 'congested', coordinates: { x: 300, y: 380 } },
    { id: 'workshop-room-2', name: 'Workshop Lab 2 — Hardware & Robotics', floor: '2nd Floor', zone: 'Zone Gamma', capacity: 50, current_occupancy: 22, congestion_status: 'low', coordinates: { x: 450, y: 380 } },
    { id: 'food-court', name: 'Central Food Court & Networking Lounge', floor: 'Ground Floor', zone: 'Zone Delta', capacity: 400, current_occupancy: 190, congestion_status: 'moderate', coordinates: { x: 260, y: 480 } },
    { id: 'hackathon-arena', name: 'Hackathon Arena 24/7 Zone', floor: 'Basement 1', zone: 'Zone Epsilon', capacity: 180, current_occupancy: 75, congestion_status: 'low', coordinates: { x: 520, y: 460 } }
  ];

  for (const room of venueRooms) {
    const { error } = await supabase.from('venue_rooms').upsert(room, { onConflict: 'id' });
    if (error) console.error(`Error inserting venue room ${room.name}:`, error.message);
    else console.log(`✅ Venue room seeded: ${room.name}`);
  }

  // 3. Seed Event Sessions
  const eventSessions = [
    {
      id: 'sess-101',
      title: 'Autonomous Agent Architecture: From Zero to Self-Executing Code',
      speaker_name: 'Dr. Aris Thorne',
      speaker_role: 'Staff AI Researcher, DeepMind',
      venue_id: 'hall-a',
      category: 'ai',
      start_time: '09:30',
      end_time: '10:30',
      tags: ['AI', 'Agents', 'NextGen'],
      description: 'Comprehensive deep-dive into multi-agent consensus protocols, continuous memory, and tool-use reasoning.'
    },
    {
      id: 'sess-102',
      title: 'High-Concurrency Rust: Building Resilient Microsecond Event Pipelines',
      speaker_name: 'Elena Vance',
      speaker_role: 'Principal Infrastructure Architect, FastQueue',
      venue_id: 'hall-b',
      category: 'systems',
      start_time: '10:45',
      end_time: '11:45',
      tags: ['Rust', 'Systems', 'Performance'],
      description: 'Architectural blueprint for memory-safe zero-allocation stream handlers processing millions of telemetry events per second.'
    },
    {
      id: 'sess-103',
      title: 'Hands-on Local LLM Fine-Tuning & Quantization Workshop',
      speaker_name: 'Devon Clarke',
      speaker_role: 'ML Lead, OpenForge',
      venue_id: 'workshop-room-1',
      category: 'workshops',
      start_time: '13:00',
      end_time: '14:30',
      tags: ['LLM', 'Hands-on', 'Quantization'],
      description: 'Bring your laptop: live walkthrough of LoRA adapters, 4-bit AWQ quantization, and local deployment via Ollama/vLLM.'
    },
    {
      id: 'sess-104',
      title: 'Grand Closing Keynote: The Sovereign Web & The Next Computing Frontier',
      speaker_name: 'Dr. Aris Thorne & Elena Vance',
      speaker_role: 'Industry Pioneers',
      venue_id: 'hall-a',
      category: 'keynote',
      start_time: '16:00',
      end_time: '17:00',
      tags: ['Keynote', 'Future', 'Tech'],
      description: 'Visionary panel discussing distributed autonomous computing platforms and software resilience.'
    }
  ];

  for (const sess of eventSessions) {
    const { error } = await supabase.from('event_sessions').upsert(sess, { onConflict: 'id' });
    if (error) console.error(`Error inserting session ${sess.title}:`, error.message);
    else console.log(`✅ Event session seeded: ${sess.title}`);
  }

  console.log('\n🎉 Seed data population complete!');
}

runSeed();
