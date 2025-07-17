'use client'
import Link from "next/link"
export default  function Home() {

return (<div>

<Link href={'/client1'}>
<button className="bg-amber-500">go to create</button>
</Link>

</div>)
}