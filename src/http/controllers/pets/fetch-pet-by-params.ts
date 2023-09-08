import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeFetchPetByParamsUseCase } from '@/use-cases/factories/make-fetch-pet-by-params-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function fetchPetByParams(request: FastifyRequest, reply: FastifyReply) {
  const fetchPetByParamsQuerySchema = z.object({
    city: z.string(),
    age: z.number().optional(),
    energyLevel: z.number().optional(),
    independenceLevel: z.number().optional(),
    dogSize: z.enum(['MINI', 'SMALL', 'MEDIUM', 'BIG', 'GIANT']).optional(),
    page: z.coerce.number().min(1).default(1),
  });

  const { city, age, dogSize, energyLevel, independenceLevel, page } = fetchPetByParamsQuerySchema.parse(request.query);

  try {
    const fetchPetByParamsUseCase = makeFetchPetByParamsUseCase();

    const { pet } = await fetchPetByParamsUseCase.execute({
      city,
      page,
      age,
      dogSize,
      energyLevel,
      independenceLevel,
    });

    return reply.status(200).send({ pet });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
