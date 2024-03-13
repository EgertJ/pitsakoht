import React from 'react'
import Reset_passwords_form from './components/Reset_passwords_form'


export default async function unustasidparoolitokenPage({
  params,
}: {
  params: { id: string };
}) {

  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Sisesta uus parool</h1>
      </div>
     <Reset_passwords_form id={params.id}></Reset_passwords_form>
    </div>
  )
}
