import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        const {userId} = auth();
        const body = await req.json();

        const {name} = body

        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!name){
            return new NextResponse('Name is required',{status:400})
        }
        
        const storePost = await db.store.create({
            data:{
                userId,
                name
            }
        })
        return NextResponse.json(storePost)
    }catch(error){
        console.log('store_post',error);
        return new NextResponse('Internal Error',{status:500})
    }
}