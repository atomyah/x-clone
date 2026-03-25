import React from 'react'
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex h-full min-h-0 items-center justify-center">
      <SignIn />
    </div>
  )
}
