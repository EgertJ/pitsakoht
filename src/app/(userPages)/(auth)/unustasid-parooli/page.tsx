import React from 'react'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import { validateRequest } from '@/lib/getUser';
import { redirect } from 'next/navigation';

export default async function unustasidparooliPage() {
    const { user } = await validateRequest();

  if (user) redirect("/");

  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Unustasid parooli?</h1>
      </div>
      <ForgotPasswordForm></ForgotPasswordForm>
    </div>
  )
}
