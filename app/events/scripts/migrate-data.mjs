// app/events/scripts/migrate-data.mjs
import fs from "fs/promises"
import path from "path"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

async function createTables(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS countries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      imageUrl TEXT
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      imageUrl TEXT
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      bio TEXT,
      avatar_url TEXT,
      backdrop_image_url TEXT
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS cities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      country_id TEXT REFERENCES countries(id) ON DELETE CASCADE,
      description TEXT,
      imageUrl TEXT
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city_id TEXT REFERENCES cities(id) ON DELETE CASCADE,
      address TEXT
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS artists (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category_id TEXT REFERENCES categories(id) ON DELETE SET NULL
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS events (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL UNIQUE,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      full_description TEXT,
      bullet_point_1 TEXT,
      bullet_point_2 TEXT,
      bullet_point_3 TEXT,
      date TIMESTAMPTZ NOT NULL,
      time_details TEXT,
      location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
      image_url TEXT,
      capacity INTEGER,
      simulated_attendee_count INTEGER DEFAULT 0,
      category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
      city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
      country_id TEXT REFERENCES countries(id) ON DELETE SET NULL,
      organizer_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      primary_cta_text TEXT,
      primary_cta_link TEXT,
      secondary_cta_text TEXT,
      secondary_cta_link TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS event_artists (
      event_id UUID REFERENCES events(id) ON DELETE CASCADE,
      artist_id TEXT REFERENCES artists(id) ON DELETE CASCADE,
      PRIMARY KEY (event_id, artist_id)
    )
  `)
}

async function clearData(client) {
  await client.query("TRUNCATE TABLE event_artists CASCADE")
  await client.query("TRUNCATE TABLE events CASCADE")
  await client.query("TRUNCATE TABLE artists CASCADE")
  await client.query("TRUNCATE TABLE locations CASCADE")
  await client.query("TRUNCATE TABLE cities CASCADE")
  await client.query("TRUNCATE TABLE users CASCADE")
  await client.query("TRUNCATE TABLE categories CASCADE")
  await client.query("TRUNCATE TABLE countries CASCADE")
}

async function insertData(client, data) {
  for (const country of data.countries) {
    try {
      await client.query(
        "INSERT INTO countries (id, name, slug, description, imageUrl) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING",
        [
          country.id,
          country.name,
          country.slug,
          country.description,
          country.imageUrl,
        ]
      )
    } catch (error) {
      console.error(`Error inserting country ${country.id}: ${error.message}`)
    }
  }

  for (const category of data.categories) {
    try {
      await client.query(
        "INSERT INTO categories (id, name, slug, description, imageUrl) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING",
        [
          category.id,
          category.name,
          category.slug,
          category.description,
          category.imageUrl,
        ]
      )
    } catch (error) {
      console.error(`Error inserting category ${category.id}: ${error.message}`)
    }
  }

  for (const user of data.users) {
    try {
      await client.query(
        "INSERT INTO users (id, slug, name, email, bio, avatar_url, backdrop_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING",
        [
          user.id,
          user.slug,
          user.name,
          user.email,
          user.bio,
          user.avatarUrl,
          user.backdropImageUrl,
        ]
      )
    } catch (error) {
      console.error(`Error inserting user ${user.id}: ${error.message}`)
    }
  }

  for (const city of data.cities) {
    try {
      await client.query(
        "INSERT INTO cities (id, name, slug, country_id, description, imageUrl) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING",
        [
          city.id,
          city.name,
          city.slug,
          city.countryId,
          city.description,
          city.imageUrl,
        ]
      )
    } catch (error) {
      console.error(`Error inserting city ${city.id}: ${error.message}`)
    }
  }

  for (const location of data.locations) {
    try {
      await client.query(
        "INSERT INTO locations (id, name, city_id, address) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
        [location.id, location.name, location.cityId, location.address]
      )
    } catch (error) {
      console.error(`Error inserting location ${location.id}: ${error.message}`)
    }
  }

  for (const artist of data.artists) {
    try {
      await client.query(
        `INSERT INTO artists (id, name, category_id) VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name`,
        [artist.id, artist.name, artist.categoryId]
      )
    } catch (error) {
      console.error(`Error inserting artist ${artist.id}: ${error.message}`)
    }
  }

  for (const event of data.events) {
    try {
      await client.query(
        `INSERT INTO events (
          id, title, slug, description, full_description, 
          bullet_point_1, bullet_point_2, bullet_point_3,
          date, time_details, location_id, image_url, capacity,
          category_id, city_id, country_id, organizer_user_id,
          primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
        ) ON CONFLICT (id) DO NOTHING`,
        [
          event.id,
          event.title,
          event.slug,
          event.description,
          event.fullDescription,
          event.bulletPoint1,
          event.bulletPoint2,
          event.bulletPoint3,
          new Date(event.date).toISOString(),
          event.timeDetails,
          event.locationId,
          event.imageUrl,
          event.capacity,
          event.categoryId,
          event.cityId,
          event.countryId,
          event.organizerUserId,
          event.primaryCtaText || "Details",
          event.primaryCtaLink || "#",
          event.secondaryCtaText || "",
          event.secondaryCtaLink || "#",
          event.createdAt || new Date().toISOString(),
          event.updatedAt || new Date().toISOString(),
        ]
      )

      if (event.artistIds && event.artistIds.length > 0) {
        for (const artistId of event.artistIds) {
          await client.query(
            "INSERT INTO event_artists (event_id, artist_id) VALUES ($1, $2) ON CONFLICT (event_id, artist_id) DO NOTHING",
            [event.id, artistId]
          )
        }
      }
    } catch (error) {
      console.error(
        `Error inserting event ${event.id} or its artists: ${error.message}`
      )
    }
  }
}

async function main() {
  let client
  try {
    client = await pool.connect()

    const filePath = path.join(process.cwd(), "data", "events.json")
    const jsonData = await fs.readFile(filePath, "utf-8")
    const data = JSON.parse(jsonData)

    await createTables(client)
    await clearData(client)
    await insertData(client, data)
  } catch (err) {
    console.error("FATAL ERROR during migration process:", err)
  } finally {
    if (client) {
      client.release()
      console.log("Database client released.")
    }
    await pool.end()
  }
}

main()
