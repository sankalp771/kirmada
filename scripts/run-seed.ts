import { seedProphets } from '../src/lib/f1/seedProphets';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    console.log("Starting database seeding for Oracle, Virus, and Collective...");
    const res = await seedProphets();
    console.log("Seeding complete! Seeded ideologies and prophets successfully.");
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}
main();
