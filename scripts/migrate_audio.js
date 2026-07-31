const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const publicDir = path.join(__dirname, '..', 'public')

async function migrate() {
  const seriesDirs = [
    { dir: 'haunted heart audio series', slug: 'haunted-heart', name: 'Haunted Heart', genre: 'Horror / Thriller' },
    { dir: 'lol audio series', slug: 'legend-of-leviticus', name: 'Legend of Leviticus', genre: 'Fantasy / Adventure' }
  ]

  for (const s of seriesDirs) {
    const dirPath = path.join(publicDir, s.dir)
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory ${s.dir} does not exist, skipping...`)
      continue
    }

    // Ensure series exists in DB
    let { data: seriesData, error: seriesError } = await supabase
      .from('audio_series')
      .select('*')
      .eq('slug', s.slug)
      .single()

    if (seriesError && seriesError.code !== 'PGRST116') {
      console.error('Error fetching series', seriesError)
      continue
    }

    if (!seriesData) {
      console.log(`Creating series: ${s.name}`)
      const res = await supabase.from('audio_series').insert({
        name: s.name,
        slug: s.slug,
        genre: s.genre,
        description: `${s.name} audio series.`,
        cover_url: '',
        episode_count: 0,
        status: 'active'
      }).select().single()
      
      if (res.error) {
        console.error('Failed to create series', res.error)
        continue
      }
      seriesData = res.data
    }

    const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith('.mp3'))
    console.log(`Found ${files.length} files in ${s.dir}`)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const filePath = path.join(dirPath, file)
      const fileBuffer = fs.readFileSync(filePath)
      const safeName = file.replace(/[^a-zA-Z0-9.\-_]/g, '_')
      const storagePath = `${s.slug}/${safeName}`

      console.log(`Uploading ${file} to Supabase storage...`)
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(storagePath, fileBuffer, { upsert: true, contentType: 'audio/mpeg' })

      if (uploadError) {
        console.error(`Failed to upload ${file}`, uploadError)
        continue
      }

      const { data: publicUrlData } = supabase.storage.from('audio').getPublicUrl(storagePath)
      const audioUrl = publicUrlData.publicUrl

      // Insert episode
      console.log(`Inserting episode record for ${file}...`)
      
      let epNum
      if (file.toLowerCase().includes('orientation day')) {
        epNum = 0
      } else {
        const epMatch = file.match(/CH\s*-?\s*(\d+)/i)
        epNum = epMatch ? parseInt(epMatch[1]) : (i + 1)
      }
      
      const title = file.replace(/\.mp3$/i, '').trim()

      // Delete existing to avoid unique constraint violation
      await supabase.from('episodes').delete().match({
        series_id: seriesData.id,
        season: 1,
        episode_number: epNum
      })

      const { error: insertError } = await supabase.from('episodes').insert({
        series_id: seriesData.id,
        episode_number: epNum,
        season: 1,
        title: title,
        description: `Episode ${epNum} of ${s.name}`,
        audio_url: audioUrl,
        duration: '00:00', // Update manually later or calculate
        status: 'published'
      })

      if (insertError) {
        console.error(`Failed to insert record for ${file}`, insertError)
      } else {
        console.log(`Successfully migrated ${file}`)
        // Clean up the local file to save space
        fs.unlinkSync(filePath)
      }
    }

    // Update series episode count
    await supabase.from('audio_series')
      .update({ episode_count: files.length })
      .eq('id', seriesData.id)

    // Remove the empty directory
    if (fs.readdirSync(dirPath).length === 0) {
      fs.rmdirSync(dirPath)
      console.log(`Removed empty directory ${s.dir}`)
    }
  }
  console.log('Migration complete.')
}

migrate()
