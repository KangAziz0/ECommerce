import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try{
        const {userId} = auth()
        const body = await req.json()

        const {name} = body
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!name){
            return new NextResponse('Name is required',{status:400})
        }
        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        const storeByUserId = await db.store.updateMany({
            where:{
                id:params.storeId,
                userId
            },
            data:{
                name
            }
        })

        return NextResponse.json(storeByUserId)
    }catch(error){
        console.log('[Store_patch]',error);
        return new NextResponse('Internal Error',{status:500})  
    }
}




export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try{
        const {userId} = auth()
      
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        
        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        const storeByUserId = await db.store.deleteMany({
            where:{
                id:params.storeId,
                userId
            }
        })

        return NextResponse.json(storeByUserId)
    }catch(error){
        console.log('[Store_delete]',error);
        return new NextResponse('Internal Error',{status:500})  
    }
}



