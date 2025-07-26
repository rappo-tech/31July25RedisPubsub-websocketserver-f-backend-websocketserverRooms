'use client'
import Link from "next/link"




export default  function Home() {

return (<div>

<Link href={'/adminClient'}>
<button className="bg-amber-500">go to create</button>
</Link>

</div>)
}