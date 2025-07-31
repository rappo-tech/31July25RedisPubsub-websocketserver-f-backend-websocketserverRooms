'use client'
import Link from "next/link"
import {useSession, signIn,signOut} from 'next-auth/react'




export default  function Home() {
const{data:session,status}=useSession()
if(status==='unauthenticated'){
return <button className="bg-green-700" onClick={()=>signIn('google')} >sign in </button>
}


if(status==='loading'){
return <button className="bg-yellow-400">checking auth... </button>
}

return (<div>

<p className="bg-pink-400">{session?.user?.name}</p>
<button className="bg-red-500" onClick={()=>signOut()}> sign out </button>


<Link href={'/userClient'}>
<button className="bg-amber-500">go to create</button>
</Link>

</div>)
}