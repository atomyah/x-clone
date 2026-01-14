// app/api/test/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // ユーザー数を取得
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      userCount,
      message: 'Database connected!'
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 }
    )
  }
}