import { createHmac } from 'crypto'

export async function POST(req) {
  const body = await req.json();
  const { code, hashedCode } = body || {};
  if (typeof code !== 'string' || typeof hashedCode !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid input' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const secret = process.env.HASH_SECRET
  if (!secret) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const computedHash = createHmac('sha256', secret)
    .update(code)
    .digest('hex')
  
  const isValid = computedHash === hashedCode
  return new Response(JSON.stringify({ isValid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}