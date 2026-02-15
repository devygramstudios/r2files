
import { r2, BUCKET_NAME } from '@/utils/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { filename, contentType } = body

        if (!filename || !contentType) {
            return NextResponse.json({ error: 'Filename and content type are required' }, { status: 400 })
        }

        const key = `${Date.now()}-${filename}` // Simple unique key strategy
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        })

        const signedUrl = await getSignedUrl(r2, command, { expiresIn: 600 }) // 10 minutes

        return NextResponse.json({ uploadUrl: signedUrl, key })
    } catch (error) {
        console.error('Error generating upload URL:', error)
        return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
    }
}
