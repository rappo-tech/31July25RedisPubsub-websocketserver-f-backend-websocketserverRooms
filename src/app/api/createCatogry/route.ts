import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
export async function POST(req:NextRequest) {
console.log('1. catogry req came')
try{
const body=await req.json()
const {adminName,categoryName}=body
console.log(`2.adminNmae:${adminName} and catogryName:${categoryName}`)
const findAdmin=await prisma.allAdmins.findFirst({
where:{adminName}
})
if(!findAdmin){
console.log(`cant find the admins `)
return NextResponse.json('cant find the admins ',{status:404})
}
const response= await prisma.allCategory.create({
data:{categoryName,adminId:findAdmin.id},
select:{id:true}
})
console.log('successfully created catogry ')
return NextResponse.json(response,{status:201})
}catch{
return NextResponse.json('try catch err ',{status:500})
}
}
