import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerPetBodySchema = z.object({
    name: z.string(),
    biography: z.string(),
    age: z.number(),
    dogSize: z.enum(['MINI', 'SMALL', 'MEDIUM', 'BIG', 'GIANT']),
    energyLevel: z.number(),
    independenceLevel: z.number(),
  });

  const { name, biography, age, dogSize, energyLevel, independenceLevel } = registerPetBodySchema.parse(request.body);

  try {
    const createPetUseCase = makeCreatePetUseCase();

    await createPetUseCase.execute({
      name,
      biography,
      age,
      dogSize,
      energyLevel,
      independenceLevel,
      organizationId: request.user.sub,
    });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
