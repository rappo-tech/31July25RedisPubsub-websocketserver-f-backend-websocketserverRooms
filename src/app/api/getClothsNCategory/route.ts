import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoption";


export async function GET() {
console.log('req came ')
try{
const session=getServerSession(authOptions)
if(!session){
return NextResponse.json('un auth ',{status:403})
}
const allCategory= await prisma.clothCategory.findMany()
console.log(`all catphry :${allCategory}`)
const all= await Promise.all(allCategory.map(async(x)=>{
const cloths=await prisma.allCloths.findMany({
where:{categoryId:x.id}
})
const allcloth=cloths.map((x)=>x.clothName)
return ({
categoryId:x.id, 
categoryName:x.categoryName,
allCloth:allcloth
})
}))
console.log(`all cloth and catogry :${all}`)
return NextResponse.json(all,{status:201})
}catch{
return NextResponse.json('try catch err ',{status:500})
}
}