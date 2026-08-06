const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

// Use strict paths based on environment
const WEBSITE_DIR = path.join('C:', 'Users', 'LENOVO', 'DYFF STUDIO', 'dyff-studio');
const BEATS_DIR = path.join('C:', 'Users', 'LENOVO', 'Documents', 'DYFF', 'beats for store');
const COVERS_DIR = path.join('C:', 'Users', 'LENOVO', '.gemini', 'antigravity', 'brain', '0fb0a73b-8215-4b71-bfb7-d634980c8280');

// Read .env.local to get Supabase credentials for Storage API
const envPath = path.join(WEBSITE_DIR, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

let SUPABASE_URL = '';
let SUPABASE_SERVICE_ROLE_KEY = '';

envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        SUPABASE_URL = line.split('=')[1].trim().replace(/['"]/g, '');
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
        SUPABASE_SERVICE_ROLE_KEY = line.split('=')[1].trim().replace(/['"]/g, '');
    }
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// User-provided direct postgres connection string
const password = "z#?enMX+&F3Etq/";
const encodedPassword = encodeURIComponent(password);
const POSTGRES_URL = `postgresql://postgres.dziubmnzcejuhzosaahv:${encodedPassword}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`;
const pgClient = new Client({ connectionString: POSTGRES_URL });

const categoryCoverMap = {
    'hiphop': 'hiphop_cover_1785869270830.jpg',
    'trap': 'trap_cover_1785869288098.jpg',
    'rnb': 'rnb_cover_1785869305416.jpg',
    'afrobeat': 'afrobeat_cover_1785869326484.jpg'
};

async function uploadFile(filePath, bucket, uploadPath, retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            if (!fs.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                return null;
            }
            
            const fileBuffer = fs.readFileSync(filePath);
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(uploadPath, fileBuffer, { upsert: true });
                
            if (error) {
                console.error(`Error uploading ${filePath} (Attempt ${i+1}):`, error.message);
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }
            
            if (bucket === 'products') {
                const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(uploadPath);
                return publicUrlData.publicUrl;
            } else if (bucket === 'assets') {
                return uploadPath;
            }
            return null;
        } catch (e) {
            console.error(`Exception during upload for ${filePath} (Attempt ${i+1}):`, e.message);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    return null;
}

async function ensureBucket(bucketName, isPublic, retries = 5) {
    for (let i = 0; i < retries; i++) {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (error) {
            console.error(`Error listing buckets (Attempt ${i+1}):`, error.message);
            await new Promise(r => setTimeout(r, 2000));
            continue;
        }
        const exists = buckets.find(b => b.name === bucketName);
        if (!exists) {
            console.log(`Bucket ${bucketName} not found, creating it...`);
            const { error: createError } = await supabase.storage.createBucket(bucketName, { public: isPublic });
            if (createError) {
                console.error(`Failed to create bucket ${bucketName}:`, createError.message);
                return;
            } else {
                console.log(`Created bucket ${bucketName}`);
            }
        }
        return; // Success
    }
}

async function main() {
    console.log("Starting Upload Pipeline with Direct Postgres Connection...");
    
    // Connect to PostgreSQL (now handled per-beat)
    // await pgClient.connect();
    
    // Ensure buckets exist
    await ensureBucket('products', true);
    await ensureBucket('assets', false);
    
    // 1. Upload Cover Arts
    console.log("Uploading cover arts...");
    const uploadedCovers = {};
    for (const [category, filename] of Object.entries(categoryCoverMap)) {
        const filePath = path.join(COVERS_DIR, filename);
        console.log(`Uploading ${filename} for ${category}...`);
        const url = await uploadFile(filePath, 'products', `covers/${filename}`);
        if (url) uploadedCovers[category] = url;
    }

    // 2. Read Beats Metadata
    const metadataPath = path.join(BEATS_DIR, 'beats_metadata.json');
    if (!fs.existsSync(metadataPath)) {
        console.error("beats_metadata.json not found!");
        return;
    }
    
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    
    // 3. Process each beat
    for (const beat of metadata) {
        console.log(`\nProcessing ${beat.title}...`);
        
        const originalFile = path.join(BEATS_DIR, beat.original_filename);
        const parsedPath = path.parse(beat.original_filename);
        const previewFilename = `${parsedPath.name}_preview.mp3`;
        const previewFile = path.join(BEATS_DIR, previewFilename);
        
        const slug = beat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + randomUUID().substring(0, 8);
        
        console.log(`  Uploading preview: ${previewFilename}`);
        const previewUrl = await uploadFile(previewFile, 'products', `previews/${previewFilename}`);
        
        console.log(`  Uploading full beat: ${beat.original_filename}`);
        const downloadUrl = await uploadFile(originalFile, 'assets', `beats/${beat.original_filename}`);
        
        const imageUrl = uploadedCovers[beat.category.toLowerCase()] || '';
        
        if (downloadUrl && previewUrl) {
            console.log(`  Inserting product row via Postgres for ${beat.title}...`);
            const query = `
                INSERT INTO products (id, name, slug, category, price_ngn, price_usd, description, image_url, download_url, preview_url, tags, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
                ON CONFLICT (slug) DO NOTHING;
            `;
            const values = [
                randomUUID(), beat.title, slug, 'beats', 45000, beat.price, beat.description, imageUrl, downloadUrl, previewUrl, `{${beat.category}}`, 'active'
            ];
            
            // Connect to Postgres per-beat to avoid connection timeouts during long uploads
            const localPgClient = new Client({ connectionString: POSTGRES_URL });
            localPgClient.on('error', err => console.error('Postgres client error:', err.message));
            
            try {
                await localPgClient.connect();
                await localPgClient.query(query, values);
                console.log(`  Successfully inserted ${beat.title}!`);
            } catch (err) {
                console.error(`  Error inserting ${beat.title} into DB:`, err.message);
            } finally {
                await localPgClient.end().catch(() => {});
            }
        } else {
            console.log(`  Skipping database insert for ${beat.title} due to missing uploads.`);
        }
    }
    
    console.log("\nUpload Pipeline Complete!");
}

main().catch(console.error);
