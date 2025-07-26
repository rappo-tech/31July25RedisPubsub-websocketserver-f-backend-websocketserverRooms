import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
export async function GET() {
    try{

const allCategory=await prisma.allCategory.findMany()

const arr =await Promise.all(allCategory.map(async(x)=>{
const prods=await prisma.allProds.findMany({
where:{categoryId:x.id}
})
const prodsArr=prods.map((x)=>x.prodName)
return ({
categoryName:x.categoryName, 
categoryId:x.id, 
prodsArr
})

}))
return NextResponse.json(arr,{status:201})
    }catch{
return NextResponse.json('try catch err ',{status:500})
    }
}