import { JwtPayload } from '@/lib/types'
import * as jose from 'jose'

export default async function Jwt() {
  const payload: JwtPayload = {
    username: 'test123',
    name: 'test',
    email: 'test@givecentral.org',
    location_id: 1,
    // location_name: 'Fort Worth Advancement Foundation'
  }

  const secretKey = process.env.JWT_SECRET as string
  const token = await new jose.SignJWT(payload) // details to  encode in the token
    .setProtectedHeader({
      alg: 'HS256'
    }) // algorithm
    .setIssuedAt()
    // .setIssuer(process.env.JWT_ISSUER) // issuer
    // .setAudience(process.env.JWT_AUDIENCE) // audience
    // .setExpirationTime(process.env.JWT_EXPIRATION_TIME) // token expiration time, e.g., "1 day"
    .sign(new TextEncoder().encode(secretKey)) //

  console.log(token)
}
