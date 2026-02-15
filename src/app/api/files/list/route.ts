
import { r2, BUCKET_NAME } from '@/utils/r2'
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
        })

        const data = await r2.send(command)

        // Generate signed URLs for all objects
        const files = await Promise.all(
            (data.Contents || []).map(async (item) => {
                const signedUrl = await getSignedUrl(
                    r2,
                    new GetObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: item.Key,
                    }),
                    { expiresIn: 3600 } // 1 hour
                )

                return {
                    key: item.Key,
                    lastModified: item.LastModified,
                    size: item.Size,
                    url: signedUrl,
                }
            })
        )

        return NextResponse.json({ files })
    } catch (error) {
        console.error('Error listing files:', error)
        return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
    }
}
