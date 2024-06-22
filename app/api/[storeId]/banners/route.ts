import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { NextResponse } from "next/server";

export async function POST(req:Request,
    {params} : {params:{storeId:string}}
){
    try{
        const {userId} = auth();
        const body = await req.json();

        const {label , imageUrl} = body

        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!label){
            return new NextResponse('Label is required',{status:400})
        }
        if(!imageUrl){
            return new NextResponse('Image Banner is required',{status:400})
        }
        
        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }

        const storeByUserId = await db.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        if(!storeByUserId){
            return new NextResponse('Unauthorized',{status:403})
        }
        
        const banner = await db.banner.create({
            data:{
                label,
                imageUrl,
                storeId:params.storeId
            }
        })
        return NextResponse.json(banner)
    }catch(error){
        console.log('banner_post',error);
        return new NextResponse('Internal Error',{status:500})
    }
}

export async function GET(req:Request,
    {params} : {params:{storeId:string}}
){
    try{
        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        const banner = await db.banner.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(banner)
    }catch(error){
        console.log('banner_get',error);
        return new NextResponse('Internal Error',{status:500})
    }
}