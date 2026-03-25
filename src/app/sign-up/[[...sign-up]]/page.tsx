import React from 'react'
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex h-full min-h-0 items-center justify-center">
      <SignUp />
    </div>
  )
}
