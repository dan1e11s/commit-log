import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";

type AuthenticatedHandler = (
    req: Request,
    session: Session,
    params?: any
) => Promise<NextResponse>;

export function withAuth(
    handler: AuthenticatedHandler,
    params?: any
) {
    return async (req: Request, { params: routeParams }: { params?: any } = {}) => {
        try {
            const session = await getServerSession(authOptions);

            if (!session?.user?.id) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            return await handler(req, session, routeParams);
        } catch (error: any) {
            console.error("API Error:", error);
            return NextResponse.json(
                { error: error.message || "Internal Server Error" },
                { status: 500 }
            );
        }
    };
}
