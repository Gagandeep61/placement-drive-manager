import { getAllDrives } from "../../../lib/services/driveService.js";

export async function GET() {
    try{
        const drives = await getAllDrives();
        return Response.json(drives);
    }
    catch (error){
        console.error("Error fetching drives:", error);
        return Response.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}