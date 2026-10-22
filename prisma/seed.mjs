import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

// connect to database (same as lib/prisma.js, but no @/ shortcut here)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// sample drives
const drives = [
  {
    companyName: "TCS",
    role: "System Engineer",
    driveDate: new Date("2026-11-05T10:00:00.000Z"),
    eligibleBranch: "CSE, IT, ECE",
    minCGPA: 6.0,
    jobType: "Full-Time",
  },
  {
    companyName: "Infosys",
    role: "Software Trainee",
    driveDate: new Date("2026-11-12T09:30:00.000Z"),
    eligibleBranch: "CSE, IT",
    minCGPA: 6.5,
    jobType: "Full-Time",
  },
  {
    companyName: "Wipro",
    role: "Project Engineer",
    driveDate: new Date("2026-11-20T10:30:00.000Z"),
    eligibleBranch: "CSE, IT, ECE, EE",
    minCGPA: null,
    jobType: "Internship",
  },
  {
    companyName: "Zoho",
    role: "Software Developer",
    driveDate: new Date("2026-12-03T09:00:00.000Z"),
    eligibleBranch: "CSE",
    minCGPA: 7.5,
    jobType: "Internship + Full-Time",
  },
  {
    companyName: "Larsen & Toubro",
    role: "Graduate Engineer Trainee",
    driveDate: new Date("2026-12-10T10:00:00.000Z"),
    eligibleBranch: "ME, CE, EE",
    minCGPA: 6.5,
    jobType: "Full-Time",
  },
  {
    companyName: "HCL Technologies",
    role: "Technical Support Intern",
    driveDate: new Date("2027-01-08T11:00:00.000Z"),
    eligibleBranch: "CSE, IT, ECE",
    minCGPA: null,
    jobType: null,
  },
  {
    companyName: "Tech Mahindra",
    role: "Associate Software Engineer",
    driveDate: new Date("2027-01-20T10:00:00.000Z"),
    eligibleBranch: "CSE, IT",
    minCGPA: 6.0,
    jobType: "Internship",
  },
];

async function main() {
  // check how many drives already in table
  const total = await prisma.placementDrive.count();

  if (total > 0) {
    console.log("Table already has " + total + " drives. Seed skipped.");
    return;
  }

  const result = await prisma.placementDrive.createMany({ data: drives });
  console.log("Added " + result.count + " drives.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    // close connection, else terminal hang
    await prisma.$disconnect();
  });
