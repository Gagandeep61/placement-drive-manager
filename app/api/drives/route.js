import { getAllDrives, createDrive } from "../../../lib/services/driveService.js";
import { validateDrive } from "../../../lib/validators/driveValidator.js";

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

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const result = validateDrive(body);
    if (!result.valid) {
      return Response.json(
        { error: "Validation failed", details: result.errors },
        { status: 400 }
      );
    }

    const drive = await createDrive(result.data);
    return Response.json(drive, { status: 201 });
  } catch (err) {
    console.error("POST /api/drives failed:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
