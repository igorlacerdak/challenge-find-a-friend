import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeFetchProfileUseCase } from '@/use-cases/factories/make-fetch-profile-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function fetchProfilePet(request: FastifyRequest, reply: FastifyReply) {
  const registerPetBodySchema = z.object({
    id: z.string(),
  });

  const { id } = registerPetBodySchema.parse(request.params);

  try {
    const createPetUseCase = makeFetchProfileUseCase();

    const { pet } = await createPetUseCase.execute({
      id,
    });

    return reply.status(200).send({ pet });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
