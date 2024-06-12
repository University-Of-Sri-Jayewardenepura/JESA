import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 w-full">
    <h1> Jessa 24 Registration </h1>
    <h2 className=" text-slate-300"> Hoooooreh! Your registration form was recieved! </h2>
    <div className=" flex flex-col">
      <Button className="mt-4"> <Link href="/"> Back to Home </Link></Button>
    </div>
</div>
  )
}

export default SuccessPage