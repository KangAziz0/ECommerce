import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { NextResponse } from "next/server";

export async function POST(req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, bannerId } = body

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        if (!name) {
            return new NextResponse('name is required', { status: 400 })
        }
        if (!bannerId) {
            return new NextResponse(' Banner Id is required', { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 })
        }

        const banner = await db.category.create({
            data: {
                name,
                bannerId,
                storeId: params.storeId
            }
        })
        return NextResponse.json(banner)
    } catch (error) {
        console.log('category_post', error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function GET(req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }
        const banner = await db.category.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(banner)
    } catch (error) {
        console.log('category_get', error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}