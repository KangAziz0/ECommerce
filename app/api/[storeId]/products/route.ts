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

        const {
            name,
            price,
            categoryId,
            images,
            isFeatured,
            isArchived
        } = body

        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!name){
            return new NextResponse('Name is required',{status:400})
        }
        if(!price){
            return new NextResponse('Price is required',{status:400})
        }
        if(!categoryId){
            return new NextResponse('Category Id is required',{status:400})
        }
        if(!images || !images.length){
            return new NextResponse('Image is required',{status:400})
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
        
        const product = await db.product.create({
            data:{
                name,
                price,
                categoryId,
                isFeatured,
                isArchived,
                storeId:params.storeId,
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=> image) 
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product)
    }catch(error){
        console.log('product_post',error);
        return new NextResponse('Internal Error',{status:500})
    }
}

export async function GET(req:Request,
    {params} : {params:{storeId:string}}
){
    try{
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined
        const isFeatured = searchParams.get('isFeatured')
        const isArchived = searchParams.get('isArchived')
        
        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        const product = await db.product.findMany({
            where:{
                storeId:params.storeId,
                categoryId,
                isFeatured:isFeatured ? true : undefined,
                isArchived:isArchived ? true : undefined
            },
            include:{
                images:true,
                category:true
            },
            orderBy:{
                createdAt:'desc'
            }
        })
        return NextResponse.json(product)
    }catch(error){
        console.log('product_get',error);
        return new NextResponse('Internal Error',{status:500})
    }
}