import { NextResponse } from "next/server";
import { listTenants } from "@/lib/demo/tenants";

export function GET() {
  return NextResponse.json({ tenants: listTenants() });
}
