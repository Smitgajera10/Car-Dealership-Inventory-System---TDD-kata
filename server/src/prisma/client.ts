import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({adapter});

export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('Auth database connected successfully')
  } catch (error) {
    console.error('Failed to connect to database:', error)
    process.exit(1)
  }
}