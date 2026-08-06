const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
            
            console.log(`Successfully uploaded new cover art!`);
            return;
        } catch (e) {
            console.error(`Exception during upload for ${filePath} (Attempt ${i+1}):`, e.message);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    return null;
}

async function main() {
    console.log("Replacing Book Cover...");
    
    // We will look for the real book cover
    let newCoverPath = path.join(WEBSITE_DIR, 'public', 'THE ART OF PSYCHOLOGICAL EROSION.jpg');

    if (!fs.existsSync(newCoverPath)) {
        console.error("Could not find the cover image at: " + newCoverPath);
        return;
    }

    // Overwrite the existing cover in the Supabase bucket
    await uploadFile(newCoverPath, 'products', 'covers/the_art_of_psychological_erossion_cover.png');
}

main().catch(console.error);
