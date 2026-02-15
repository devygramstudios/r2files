
import { r2, BUCKET_NAME } from '@/utils/r2'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')
        const expiresIn = parseInt(searchParams.get('expiresIn') || '3600') // Default 1 hour

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 })
        }

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        })

        const signedUrl = await getSignedUrl(r2, command, { expiresIn })

        return NextResponse.json({ url: signedUrl })
    } catch (error) {
        console.error('Error generating share URL:', error)
        return NextResponse.json({ error: 'Failed to generate share URL' }, { status: 500 })
    }
}
