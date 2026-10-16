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
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'] || '';

const supabase = createClient(url, serviceRoleKey);

async function createBuckets() {
  console.log('Configuring Storage Buckets on Supabase at:', url);

  const buckets = [
    {
      id: 'avatars',
      name: 'avatars',
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
    },
    {
      id: 'documents',
      name: 'documents',
      public: true,
      fileSizeLimit: 20971520, // 20MB
      allowedMimeTypes: ['application/pdf', 'application/msword', 'image/png', 'image/jpeg']
    },
    {
      id: 'assignments',
      name: 'assignments',
      public: true,
      fileSizeLimit: 20971520, // 20MB
      allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg', 'application/zip']
    }
  ];

  for (const b of buckets) {
    const { data, error } = await supabase.storage.createBucket(b.id, {
      public: b.public,
      fileSizeLimit: b.fileSizeLimit,
      allowedMimeTypes: b.allowedMimeTypes
    });

    if (error) {
      if (error.message.toLowerCase().includes('already exists')) {
        console.log(`ℹ️ Bucket '${b.id}' already exists.`);
      } else {
        console.error(`❌ Error creating bucket '${b.id}':`, error.message);
      }
    } else {
      console.log(`✅ Bucket '${b.id}' created successfully!`);
    }
  }

  const { data: list, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) {
    console.error('Error listing buckets:', listErr.message);
  } else {
    console.log('\n📦 Active Storage Buckets:');
    list.forEach(b => console.log(` - ${b.name} (public: ${b.public})`));
  }
}

createBuckets();
