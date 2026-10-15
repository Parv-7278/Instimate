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

const supabase = createClient(url, key);

const SCHOOL_ID = 'a1111111-1111-1111-1111-111111111111';
const CORP_ID = 'c3333333-3333-3333-3333-333333333333';

async function seedData() {
  console.log('Seeding live Supabase database for school and corporate modules...');

  // 1. CLASSROOMS
  console.log('\n--- Seeding Classrooms ---');
  const classrooms = [
    {
      institution_id: SCHOOL_ID,
      room_number: 'Room 101',
      building: 'Aryabhata Academic Block',
      floor: '1st Floor',
      capacity: 45,
      current_student_count: 38,
      campus: 'Main Campus',
      assigned_class: 'Class 10-A',
      class_teacher: 'Dr. Rajesh Verma',
      amenities: ['Smart Interactive Board', 'Projector', 'Air Conditioning', 'High-Speed Wi-Fi'],
      status: 'Occupied',
    },
    {
      institution_id: SCHOOL_ID,
      room_number: 'Room 102',
      building: 'Aryabhata Academic Block',
      floor: '1st Floor',
      capacity: 40,
      current_student_count: 36,
      campus: 'Main Campus',
      assigned_class: 'Class 10-B',
      class_teacher: 'Prof. Anita Desai',
      amenities: ['Projector', 'Air Conditioning', 'Surround Sound Audio'],
      status: 'Occupied',
    },
    {
      institution_id: SCHOOL_ID,
      room_number: 'Physics Lab',
      building: 'Homi Bhabha Science Complex',
      floor: 'Ground Floor',
      capacity: 35,
      current_student_count: 30,
      campus: 'Main Campus',
      assigned_class: 'Class 11-A',
      class_teacher: 'Prof. Anita Desai',
      amenities: ['Optics Darkroom', 'Digital Oscilloscopes', 'Safety Eye Wash', 'Fume Hood'],
      status: 'Available',
    },
    {
      institution_id: SCHOOL_ID,
      room_number: 'Chemistry Lab',
      building: 'Homi Bhabha Science Complex',
      floor: 'Ground Floor',
      capacity: 35,
      current_student_count: 28,
      campus: 'Main Campus',
      assigned_class: 'Class 12-A',
      class_teacher: 'Dr. Sneha Roy',
      amenities: ['Chemical Exhaust System', 'Acid Resistant Sinks', 'Smart Screen'],
      status: 'Available',
    },
    {
      institution_id: SCHOOL_ID,
      room_number: 'CS Lab 1',
      building: 'Turing Technology Center',
      floor: '2nd Floor',
      capacity: 50,
      current_student_count: 45,
      campus: 'Main Campus',
      assigned_class: 'Class 10-A',
      class_teacher: 'Vikram Malhotra',
      amenities: ['50x Dell Core i7 Terminals', 'Gigabit Fiber', 'Server Rack', 'Dual Projectors'],
      status: 'Occupied',
    },
  ];

  for (const c of classrooms) {
    const { error } = await supabase.from('classrooms').insert(c);
    if (error) console.log(`Classroom ${c.room_number}:`, error.message);
    else console.log(`Classroom ${c.room_number}: Inserted`);
  }

  // 2. FACULTY
  console.log('\n--- Seeding Faculty ---');
  const facultyList = [
    {
      institution_id: SCHOOL_ID,
      employee_id: 'FAC-101',
      full_name: 'Dr. Rajesh Verma',
      email: 'r.verma@dpwa-delhi.edu.in',
      phone: '+91 98110 54321',
      department: 'Mathematics',
      qualification: 'Ph.D. Pure Mathematics (IIT Delhi)',
      designation: 'Senior Faculty & Dept Head',
      subjects: ['Mathematics', 'Advanced Calculus', 'Linear Algebra'],
      assigned_classes: ['Class 10-A', 'Class 12-A'],
      employment_type: 'Full-time',
      joining_date: '2019-06-01',
      status: 'Active',
      leave_balance: 14,
    },
    {
      institution_id: SCHOOL_ID,
      employee_id: 'FAC-102',
      full_name: 'Prof. Anita Desai',
      email: 'a.desai@dpwa-delhi.edu.in',
      phone: '+91 98220 65432',
      department: 'Physics',
      qualification: 'M.Sc. Theoretical Physics (IISc)',
      designation: 'Associate Professor',
      subjects: ['Physics', 'Applied Mechanics', 'Electromagnetism'],
      assigned_classes: ['Class 10-A', 'Class 11-A'],
      employment_type: 'Full-time',
      joining_date: '2020-07-15',
      status: 'Active',
      leave_balance: 12,
    },
    {
      institution_id: SCHOOL_ID,
      employee_id: 'FAC-103',
      full_name: 'Vikram Malhotra',
      email: 'v.malhotra@dpwa-delhi.edu.in',
      phone: '+91 98330 76543',
      department: 'Computer Science',
      qualification: 'M.Tech CSE (BITS Pilani)',
      designation: 'Lead CS Instructor',
      subjects: ['Computer Science', 'Data Structures', 'Python Programming'],
      assigned_classes: ['Class 10-A', 'Class 11-A'],
      employment_type: 'Full-time',
      joining_date: '2021-08-01',
      status: 'Active',
      leave_balance: 16,
    },
    {
      institution_id: SCHOOL_ID,
      employee_id: 'FAC-104',
      full_name: 'Dr. Sneha Roy',
      email: 's.roy@dpwa-delhi.edu.in',
      phone: '+91 98440 87654',
      department: 'Chemistry',
      qualification: 'Ph.D. Organic Chemistry (DU)',
      designation: 'Senior Assistant Professor',
      subjects: ['Chemistry', 'Organic Chemistry', 'Biochemistry'],
      assigned_classes: ['Class 10-A', 'Class 12-A'],
      employment_type: 'Full-time',
      joining_date: '2022-01-10',
      status: 'Active',
      leave_balance: 10,
    },
  ];

  const facultyMap: Record<string, string> = {};
  for (const f of facultyList) {
    const { data, error } = await supabase.from('faculty').insert(f).select().single();
    if (error) console.log(`Faculty ${f.full_name}:`, error.message);
    else {
      console.log(`Faculty ${f.full_name}: Inserted (ID: ${data.id})`);
      facultyMap[f.employee_id] = data.id;
    }
  }

  // 3. STUDENTS
  console.log('\n--- Seeding Students ---');
  const studentsList = [
    {
      institution_id: SCHOOL_ID,
      student_id: 'STU-2024-001',
      admission_no: 'ADM-8801',
      roll_no: '101',
      full_name: 'Aarav Patel',
      email: 'aarav.patel@dpwa-delhi.edu.in',
      phone: '+91 99887 76655',
      gender: 'Male',
      dob: '2008-04-14',
      blood_group: 'B+',
      course: 'Secondary Sciences',
      class_id: 'Class 10-A',
      section: 'A',
      academic_year: '2024-2025',
      admission_date: '2021-06-15',
      status: 'Active',
      parent_name: 'Rajesh Patel',
      parent_phone: '+91 99100 22334',
      parent_email: 'rajesh.patel@gmail.com',
      address: 'Flat 402, Royal Residency, Sector 14, Rohini, Delhi',
      attendance_rate: 92.5,
    },
    {
      institution_id: SCHOOL_ID,
      student_id: 'STU-2024-002',
      admission_no: 'ADM-8802',
      roll_no: '102',
      full_name: 'Diya Sharma',
      email: 'diya.sharma@dpwa-delhi.edu.in',
      phone: '+91 98711 22334',
      gender: 'Female',
      dob: '2008-09-22',
      blood_group: 'O+',
      course: 'Secondary Sciences',
      class_id: 'Class 10-A',
      section: 'A',
      academic_year: '2024-2025',
      admission_date: '2021-06-15',
      status: 'Active',
      parent_name: 'Sunil Sharma',
      parent_phone: '+91 98101 33445',
      parent_email: 'sunil.sharma@outlook.com',
      address: 'House 56, Pocket C, Sector 9, Rohini, Delhi',
      attendance_rate: 96.0,
    },
    {
      institution_id: SCHOOL_ID,
      student_id: 'STU-2024-003',
      admission_no: 'ADM-8803',
      roll_no: '103',
      full_name: 'Rohan Iyer',
      email: 'rohan.iyer@dpwa-delhi.edu.in',
      phone: '+91 97654 32109',
      gender: 'Male',
      dob: '2008-01-30',
      blood_group: 'A+',
      course: 'Secondary Sciences',
      class_id: 'Class 10-A',
      section: 'A',
      academic_year: '2024-2025',
      admission_date: '2021-06-15',
      status: 'Active',
      parent_name: 'Venkat Iyer',
      parent_phone: '+91 97111 44556',
      parent_email: 'venkat.iyer@gmail.com',
      address: 'B-12, Green View Apartments, Shalimar Bagh, Delhi',
      attendance_rate: 89.0,
    },
    {
      institution_id: SCHOOL_ID,
      student_id: 'STU-2024-004',
      admission_no: 'ADM-8804',
      roll_no: '104',
      full_name: 'Ananya Mukherjee',
      email: 'ananya.m@dpwa-delhi.edu.in',
      phone: '+91 98990 11223',
      gender: 'Female',
      dob: '2008-11-15',
      blood_group: 'AB+',
      course: 'Secondary Sciences',
      class_id: 'Class 10-A',
      section: 'A',
      academic_year: '2024-2025',
      admission_date: '2021-06-15',
      status: 'Active',
      parent_name: 'Debashis Mukherjee',
      parent_phone: '+91 98112 55667',
      parent_email: 'd.mukherjee@tcs.com',
      address: 'Tower 4, Apt 801, Express Greens, Pitampura, Delhi',
      attendance_rate: 94.5,
    },
  ];

  const studentMap: Record<string, string> = {};
  for (const s of studentsList) {
    const { data, error } = await supabase.from('students').insert(s).select().single();
    if (error) console.log(`Student ${s.full_name}:`, error.message);
    else {
      console.log(`Student ${s.full_name}: Inserted (ID: ${data.id})`);
      studentMap[s.student_id] = data.id;
    }
  }

  // 4. TIMETABLE SLOTS
  console.log('\n--- Seeding Timetable Slots ---');
  const slots = [
    {
      institution_id: SCHOOL_ID,
      day: 'Monday',
      time_slot: '8:00 AM - 9:00 AM',
      subject: 'Mathematics',
      faculty_id: facultyMap['FAC-101'] || null,
      faculty_name: 'Dr. Rajesh Verma',
      classroom: 'Room 101',
      class_id: 'Class 10-A',
      color: '#0d9488',
      is_break: false,
    },
    {
      institution_id: SCHOOL_ID,
      day: 'Monday',
      time_slot: '9:15 AM - 10:15 AM',
      subject: 'Physics',
      faculty_id: facultyMap['FAC-102'] || null,
      faculty_name: 'Prof. Anita Desai',
      classroom: 'Physics Lab',
      class_id: 'Class 10-A',
      color: '#2563eb',
      is_break: false,
    },
    {
      institution_id: SCHOOL_ID,
      day: 'Monday',
      time_slot: '10:30 AM - 11:30 AM',
      subject: 'Computer Science',
      faculty_id: facultyMap['FAC-103'] || null,
      faculty_name: 'Vikram Malhotra',
      classroom: 'CS Lab 1',
      class_id: 'Class 10-A',
      color: '#7c3aed',
      is_break: false,
    },
    {
      institution_id: SCHOOL_ID,
      day: 'Monday',
      time_slot: '12:00 PM - 1:00 PM',
      subject: 'Chemistry',
      faculty_id: facultyMap['FAC-104'] || null,
      faculty_name: 'Dr. Sneha Roy',
      classroom: 'Chemistry Lab',
      class_id: 'Class 10-A',
      color: '#db2777',
      is_break: false,
    },
    {
      institution_id: SCHOOL_ID,
      day: 'Tuesday',
      time_slot: '8:00 AM - 9:00 AM',
      subject: 'Physics',
      faculty_id: facultyMap['FAC-102'] || null,
      faculty_name: 'Prof. Anita Desai',
      classroom: 'Room 101',
      class_id: 'Class 10-A',
      color: '#2563eb',
      is_break: false,
    },
    {
      institution_id: SCHOOL_ID,
      day: 'Tuesday',
      time_slot: '9:15 AM - 10:15 AM',
      subject: 'Mathematics',
      faculty_id: facultyMap['FAC-101'] || null,
      faculty_name: 'Dr. Rajesh Verma',
      classroom: 'Room 101',
      class_id: 'Class 10-A',
      color: '#0d9488',
      is_break: false,
    },
  ];

  for (const sl of slots) {
    const { error } = await supabase.from('timetable_slots').insert(sl);
    if (error) console.log(`Slot ${sl.day} ${sl.time_slot}:`, error.message);
    else console.log(`Slot ${sl.day} ${sl.time_slot} (${sl.subject}): Inserted`);
  }

  // 5. ATTENDANCE RECORDS
  console.log('\n--- Seeding Attendance Records ---');
  const today = new Date().toISOString().split('T')[0];
  const attendanceRecords = [
    {
      institution_id: SCHOOL_ID,
      student_id: studentMap['STU-2024-001'],
      student_name: 'Aarav Patel',
      roll_no: '101',
      class_id: 'Class 10-A',
      subject: 'Mathematics',
      date: today,
      session: 'Full Day',
      status: 'Present',
      marked_by: 'Dr. Rajesh Verma',
    },
    {
      institution_id: SCHOOL_ID,
      student_id: studentMap['STU-2024-002'],
      student_name: 'Diya Sharma',
      roll_no: '102',
      class_id: 'Class 10-A',
      subject: 'Mathematics',
      date: today,
      session: 'Full Day',
      status: 'Present',
      marked_by: 'Dr. Rajesh Verma',
    },
    {
      institution_id: SCHOOL_ID,
      student_id: studentMap['STU-2024-003'],
      student_name: 'Rohan Iyer',
      roll_no: '103',
      class_id: 'Class 10-A',
      subject: 'Mathematics',
      date: today,
      session: 'Full Day',
      status: 'Late',
      marked_by: 'Dr. Rajesh Verma',
      remarks: 'Arrived 15 minutes late due to traffic',
    },
    {
      institution_id: SCHOOL_ID,
      student_id: studentMap['STU-2024-004'],
      student_name: 'Ananya Mukherjee',
      roll_no: '104',
      class_id: 'Class 10-A',
      subject: 'Mathematics',
      date: today,
      session: 'Full Day',
      status: 'Present',
      marked_by: 'Dr. Rajesh Verma',
    },
  ];

  for (const att of attendanceRecords) {
    if (!att.student_id) continue;
    const { error } = await supabase.from('attendance_records').insert(att as any);
    if (error) console.log(`Attendance for ${att.student_name}:`, error.message);
    else console.log(`Attendance for ${att.student_name}: Inserted (${att.status})`);
  }

  // 6. FEE INVOICES & TRANSACTIONS
  console.log('\n--- Seeding Fee Invoices & Transactions ---');
  const invoices = [
    {
      institution_id: SCHOOL_ID,
      invoice_number: 'INV-2026-001',
      student_id: studentMap['STU-2024-001'] || 'stu-1',
      student_name: 'Aarav Patel',
      roll_no: '101',
      class_id: 'Class 10-A',
      title: 'Academic Term Fee (Q1 2026)',
      category: 'Tuition',
      total_amount: 45000,
      paid_amount: 45000,
      due_amount: 0,
      due_date: '2026-11-15',
      status: 'Paid',
      payment_date: '2026-10-12',
      transaction_id: 'TXN-PAY-981120',
      payment_method: 'UPI / Net Banking',
    },
    {
      institution_id: SCHOOL_ID,
      invoice_number: 'INV-2026-002',
      student_id: studentMap['STU-2024-002'] || 'stu-2',
      student_name: 'Diya Sharma',
      roll_no: '102',
      class_id: 'Class 10-A',
      title: 'Academic Term Fee (Q1 2026)',
      category: 'Tuition',
      total_amount: 45000,
      paid_amount: 45000,
      due_amount: 0,
      due_date: '2026-11-15',
      status: 'Paid',
      payment_date: '2026-10-14',
      transaction_id: 'TXN-PAY-981121',
      payment_method: 'Razorpay Cards',
    },
    {
      institution_id: SCHOOL_ID,
      invoice_number: 'INV-2026-003',
      student_id: studentMap['STU-2024-003'] || 'stu-3',
      student_name: 'Rohan Iyer',
      roll_no: '103',
      class_id: 'Class 10-A',
      title: 'Laboratory & Science Kit Fee',
      category: 'Laboratory',
      total_amount: 12500,
      paid_amount: 0,
      due_amount: 12500,
      due_date: '2026-11-20',
      status: 'Pending',
    },
  ];

  for (const inv of invoices) {
    const { data: invData, error } = await supabase.from('fee_invoices').insert(inv as any).select().single();
    if (error) console.log(`Invoice ${inv.invoice_number}:`, error.message);
    else {
      console.log(`Invoice ${inv.invoice_number} (${inv.status}): Inserted`);
      if (inv.status === 'Paid') {
        const { error: txErr } = await supabase.from('payment_transactions').insert({
          invoice_id: invData.id,
          student_id: inv.student_id,
          amount: inv.paid_amount,
          currency: 'INR',
          payment_method: inv.payment_method || 'Online',
          status: 'Success',
          receipt_number: `RCPT-${inv.invoice_number.replace('INV-', '')}`,
        });
        if (txErr) console.log(`Transaction for ${inv.invoice_number}:`, txErr.message);
        else console.log(`Transaction receipt for ${inv.invoice_number}: Inserted`);
      }
    }
  }

  // 7. CORPORATE STAFF & PAYROLL
  console.log('\n--- Seeding Corporate Staff & Payroll ---');
  const staffMembers = [
    {
      institution_id: CORP_ID,
      employee_id: 'EMP-1001',
      full_name: 'Priya Sundaram',
      email: 'priya.s@nextechdigital.com',
      phone: '+91 99112 33445',
      department: 'Engineering',
      designation: 'Principal Software Architect',
      employment_type: 'Permanent',
      work_mode: 'On-Site',
      joining_date: '2020-03-01',
      status: 'Active',
      basic_salary: 180000,
      allowances: 45000,
      deductions: 25000,
      leave_balance: 18,
    },
    {
      institution_id: CORP_ID,
      employee_id: 'EMP-1002',
      full_name: 'Rohan Kashyap',
      email: 'rohan.k@nextechdigital.com',
      phone: '+91 99223 44556',
      department: 'Product & Design',
      designation: 'Lead Product Designer',
      employment_type: 'Permanent',
      work_mode: 'Remote',
      joining_date: '2021-06-15',
      status: 'Active',
      basic_salary: 140000,
      allowances: 35000,
      deductions: 18000,
      leave_balance: 14,
    },
    {
      institution_id: CORP_ID,
      employee_id: 'EMP-1003',
      full_name: 'Aakash Saxena',
      email: 'aakash.s@nextechdigital.com',
      phone: '+91 99334 55667',
      department: 'Finance',
      designation: 'Senior Financial Analyst',
      employment_type: 'Permanent',
      work_mode: 'On-Site',
      joining_date: '2022-09-01',
      status: 'Active',
      basic_salary: 120000,
      allowances: 30000,
      deductions: 15000,
      leave_balance: 12,
    },
  ];

  for (const st of staffMembers) {
    const { error } = await supabase.from('corporate_staff').insert(st);
    if (error) console.log(`Staff ${st.full_name}:`, error.message);
    else console.log(`Staff ${st.full_name}: Inserted`);
  }

  const payrolls = [
    {
      institution_id: CORP_ID,
      employee_id: 'EMP-1001',
      employee_name: 'Priya Sundaram',
      designation: 'Principal Software Architect',
      department: 'Engineering',
      month: 'October 2026',
      basic_pay: 180000,
      allowances: 45000,
      gross_pay: 225000,
      tax_deductions: 20000,
      pf_deductions: 5000,
      total_deductions: 25000,
      net_pay: 200000,
      status: 'Paid',
      payment_date: '2026-10-01',
      payment_ref: 'HDFC-NEFT-991823',
      payslip_number: 'PSLIP-2026-1001',
    },
    {
      institution_id: CORP_ID,
      employee_id: 'EMP-1002',
      employee_name: 'Rohan Kashyap',
      designation: 'Lead Product Designer',
      department: 'Product & Design',
      month: 'October 2026',
      basic_pay: 140000,
      allowances: 35000,
      gross_pay: 175000,
      tax_deductions: 15000,
      pf_deductions: 3000,
      total_deductions: 18000,
      net_pay: 157000,
      status: 'Paid',
      payment_date: '2026-10-01',
      payment_ref: 'ICICI-IMPS-882190',
      payslip_number: 'PSLIP-2026-1002',
    },
    {
      institution_id: CORP_ID,
      employee_id: 'EMP-1003',
      employee_name: 'Aakash Saxena',
      designation: 'Senior Financial Analyst',
      department: 'Finance',
      month: 'October 2026',
      basic_pay: 120000,
      allowances: 30000,
      gross_pay: 150000,
      tax_deductions: 12000,
      pf_deductions: 3000,
      total_deductions: 15000,
      net_pay: 135000,
      status: 'Draft',
      payslip_number: 'PSLIP-2026-1003',
    },
  ];

  for (const p of payrolls) {
    const { error } = await supabase.from('payroll_records').insert(p as any);
    if (error) console.log(`Payroll for ${p.employee_name}:`, error.message);
    else console.log(`Payroll for ${p.employee_name} (${p.status}): Inserted`);
  }

  console.log('\n========================================================');
  console.log('🎉 LIVE SUPABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('========================================================\n');
}

seedData().catch(console.error);
