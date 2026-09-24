import { handleForm } from '@/lib/forms/handler'

export async function POST(req: Request) {
  return handleForm('pqr', req)
}
