import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateOrganizationUseCase } from '@/use-cases/factories/make-authenticate-organization-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const createOrganizationBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = createOrganizationBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateOrganizationUseCase();

    const { organization } = await authenticateUseCase.execute({
      email,
      password,
    });

    const token = await reply.jwtSign({}, { sign: { sub: organization.id } });

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: organization.id,
          expiresIn: '7d',
        },
      },
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}
