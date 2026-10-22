import { prisma } from "../prisma.js";

export async function getAllDrives() {
    const drives = await prisma.placementDrive.findMany({
        orderBy: [
            {driveDate: "asc"},
            {createdAt: "asc"},
        ],
    });
    return drives;
}