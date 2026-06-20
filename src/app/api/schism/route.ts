import { runSchismGenerator } from "../../../lib/schism/generateSchisms";

export async function POST(): Promise<Response> {
  try {
    const results = await runSchismGenerator();
    return Response.json({ ok: true, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown schism error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
