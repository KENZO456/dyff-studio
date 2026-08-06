const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const WEBSITE_DIR = path.join('C:', 'Users', 'LENOVO', 'DYFF STUDIO', 'dyff-studio');
const DOCUMENTS_DIR = path.join('C:', 'Users', 'LENOVO', 'Documents', 'DYFF');

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

const password = "z#?enMX+&F3Etq/";
const encodedPassword = encodeURIComponent(password);
const POSTGRES_URL = `postgresql://postgres.dziubmnzcejuhzosaahv:${encodedPassword}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`;

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

async function main() {
    console.log("Starting Book Upload...");
    
    const coverPath = path.join(DOCUMENTS_DIR, 'the_art_of_psychological_erossion_cover.png');
    const pdfPath = path.join(DOCUMENTS_DIR, 'The_Art_of_Psychological_Erosion.pdf');
    const epubPath = path.join(DOCUMENTS_DIR, 'The_Art_of_Psychological_Erosion.epub');

    console.log("Uploading cover...");
    const imageUrl = await uploadFile(coverPath, 'products', 'covers/the_art_of_psychological_erossion_cover.png');
    
    console.log("Uploading PDF...");
    const downloadUrl = await uploadFile(pdfPath, 'assets', 'books/The_Art_of_Psychological_Erosion.pdf');
    
    console.log("Uploading EPUB...");
    await uploadFile(epubPath, 'assets', 'books/The_Art_of_Psychological_Erosion.epub'); // Upload EPUB as an extra format

    if (imageUrl && downloadUrl) {
        console.log("Inserting book into database...");
        
        const query = `
            INSERT INTO products (id, name, slug, category, price_ngn, price_usd, description, image_url, download_url, preview_url, tags, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
            ON CONFLICT (slug) DO NOTHING;
        `;
        
        const slug = 'the-art-of-psychological-erosion';
        const description = "A sophisticated, analytical, and authoritative exploration of psychological erosion. Written in the style of Robert Greene, this book delves into the subtle ways power, influence, and mental fortitude are tested.";
        
        const values = [
            randomUUID(), 
            "The Art of Psychological EROSsion", 
            slug, 
            'books', 
            15000, 
            25.00, 
            description, 
            imageUrl, 
            downloadUrl, 
            '', 
            '{psychology,power,strategy}', 
            'active'
        ];
        
        const localPgClient = new Client({ connectionString: POSTGRES_URL });
        localPgClient.on('error', err => console.error('Postgres client error:', err.message));
        
        try {
            await localPgClient.connect();
            await localPgClient.query(query, values);
            console.log("Successfully inserted The Art of Psychological EROSsion!");
        } catch (err) {
            console.error("Error inserting Book into DB:", err.message);
        } finally {
            await localPgClient.end().catch(() => {});
        }
    } else {
        console.log("Failed to upload book files, skipping DB insertion.");
    }
}

main().catch(console.error);
