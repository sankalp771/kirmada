import { getProphetCard } from "../../../../../lib/prophet/card";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const params = await context.params;
    const payload = await getProphetCard(params.id);
    return Response.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 404 });
  }
}
