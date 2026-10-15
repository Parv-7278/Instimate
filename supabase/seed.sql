-- ====================================================================
-- INSTITUTION HUB: SUPABASE SEED DATA
-- Pre-populates sample institutions, corporate staff, students, and circulars
-- ====================================================================

-- 1. SEED INSTITUTIONS
INSERT INTO institutions (
  id, name, code, slug, type, status, address, city, state, country, phone, email,
  currency, current_academic_year, representative_name, representative_designation,
  representative_email, representative_phone, enabled_modules, total_members, total_students, total_faculty
) VALUES 
(
  'a1111111-1111-1111-1111-111111111111',
  'Delhi Public World Academy',
  'DPWA-DEL',
  'dpwa-del',
  'school',
  'Active',
  'Sector 14, Rohini',
  'New Delhi',
  'Delhi',
  'India',
  '+91 11 2789 4400',
  'principal@dpwa-delhi.edu.in',
  '₹',
  '2024-2025',
  'Dr. Rajeshwar Sharma',
  'Principal',
  'principal@dpwa-delhi.edu.in',
  '+91 98110 12345',
  ARRAY['students', 'academics', 'attendance', 'timetable', 'exams', 'finance', 'announcements'],
  128,
  120,
  8
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Apex Institute of Technology & Engineering',
  'AITE-BLR',
  'aite-blr',
  'college',
  'Active',
  'Electronic City Phase 1',
  'Bengaluru',
  'Karnataka',
  'India',
  '+91 80 4122 8800',
  'dean@apextech.edu.in',
  '₹',
  '2024-2025',
  'Prof. Sunita Rao',
  'Dean of Academics',
  'dean@apextech.edu.in',
  '+91 94480 56789',
  ARRAY['students', 'academics', 'attendance', 'timetable', 'exams', 'finance', 'library', 'announcements'],
  450,
  420,
  30
),
(
  'c3333333-3333-3333-3333-333333333333',
  'NexTech Digital Solutions Pvt. Ltd.',
  'NEXT-CORP',
  'next-corp',
  'corporate',
  'Active',
  'Cyber City, DLF Phase 2',
  'Gurugram',
  'Haryana',
  'India',
  '+91 124 456 7890',
  'hr@nextechdigital.com',
  '₹',
  '2024-2025',
  'Vikram Malhotra',
  'Chief People Officer',
  'vikram.m@nextechdigital.com',
  '+91 99100 23456',
  ARRAY['corporate_dashboard', 'employees', 'clock', 'payroll', 'leaves', 'announcements'],
  85,
  0,
  0
),
(
  'd4444444-4444-4444-4444-444444444444',
  'Directorate of Higher & Technical Education',
  'GOVT-DHTE',
  'govt-dhte',
  'government',
  'Active',
  'Sachivalaya Complex, Block 4',
  'Gandhinagar',
  'Gujarat',
  'India',
  '+91 79 2325 0001',
  'commissioner@dhte.gov.in',
  '₹',
  '2024-2025',
  'Shri Anand Patel, IAS',
  'Commissioner',
  'commissioner@dhte.gov.in',
  '+91 79 2325 0002',
  ARRAY['govt_dashboard', 'circulars', 'file_tracking', 'employees', 'announcements'],
  140,
  0,
  0
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED VENUE ROOMS (EventRoute)
INSERT INTO venue_rooms (id, name, floor, zone, capacity, current_occupancy, congestion_status, coordinates) VALUES
('grand-atrium', 'Grand Atrium & Central Registration', 'Ground Floor', 'Zone Alpha', 350, 110, 'low', '{"x": 100, "y": 200}'::jsonb),
('hall-a', 'Hall A — Main Keynote Auditorium', 'Ground Floor', 'Zone Alpha', 200, 168, 'congested', '{"x": 250, "y": 120}'::jsonb),
('hall-b', 'Hall B — AI & Systems Amphitheatre', '1st Floor', 'Zone Beta', 120, 60, 'moderate', '{"x": 420, "y": 140}'::jsonb),
('hall-c', 'Hall C — Web3 & Decentralized Lab', '1st Floor', 'Zone Beta', 90, 32, 'low', '{"x": 580, "y": 150}'::jsonb),
('workshop-room-1', 'Workshop Lab 1 — Hands-on Quantum', '2nd Floor', 'Zone Gamma', 45, 41, 'congested', '{"x": 300, "y": 380}'::jsonb),
('workshop-room-2', 'Workshop Lab 2 — Hardware & Robotics', '2nd Floor', 'Zone Gamma', 50, 22, 'low', '{"x": 450, "y": 380}'::jsonb),
('food-court', 'Central Food Court & Networking Lounge', 'Ground Floor', 'Zone Delta', 400, 190, 'moderate', '{"x": 260, "y": 480}'::jsonb),
('hackathon-arena', 'Hackathon Arena 24/7 Zone', 'Basement 1', 'Zone Epsilon', 180, 75, 'low', '{"x": 520, "y": 460}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED EVENT SESSIONS (EventRoute)
INSERT INTO event_sessions (id, title, speaker_name, speaker_role, venue_id, category, start_time, end_time, tags, description) VALUES
('sess-101', 'Autonomous Agent Architecture: From Zero to Self-Executing Code', 'Dr. Aris Thorne', 'Staff AI Researcher, DeepMind', 'hall-a', 'ai', '09:30', '10:30', ARRAY['AI', 'Agents', 'NextGen'], 'Comprehensive deep-dive into multi-agent consensus protocols, continuous memory, and tool-use reasoning.'),
('sess-102', 'High-Concurrency Rust: Building Resilient Microsecond Event Pipelines', 'Elena Vance', 'Principal Infrastructure Architect, FastQueue', 'hall-b', 'systems', '10:45', '11:45', ARRAY['Rust', 'Systems', 'Performance'], 'Architectural blueprint for memory-safe zero-allocation stream handlers processing millions of telemetry events per second.'),
('sess-103', 'Hands-on Local LLM Fine-Tuning & Quantization Workshop', 'Devon Clarke', 'ML Lead, OpenForge', 'workshop-room-1', 'workshops', '13:00', '14:30', ARRAY['LLM', 'Hands-on', 'Quantization'], 'Bring your laptop: live walkthrough of LoRA adapters, 4-bit AWQ quantization, and local deployment via Ollama/vLLM.'),
('sess-104', 'Grand Closing Keynote: The Sovereign Web & The Next Computing Frontier', 'Dr. Aris Thorne & Elena Vance', 'Industry Pioneers', 'hall-a', 'keynote', '16:00', '17:00', ARRAY['Keynote', 'Future', 'Tech'], 'Visionary panel discussing distributed autonomous computing platforms and software resilience.')
ON CONFLICT (id) DO NOTHING;
