// app/api/validate/route.ts
export async function POST(req: Request) {
    const { url } = await req.json()
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

    if (!urlRegex.test(url)) {
        return Response.json({ valid: false }, { status: 400 })
    }
    return Response.json({ valid: true })
}
