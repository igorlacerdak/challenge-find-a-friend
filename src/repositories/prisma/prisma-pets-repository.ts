import { Pet, Prisma } from '@prisma/client';
import { PetsRepository, fetchByParamsInterface } from '../interface/pets-repository';
import { prisma } from '@/db/prisma';

export class PrismaPetsRepository implements PetsRepository {
  public async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({ data });

    return pet;
  }

  public async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({ where: { id } });

    return pet;
  }

  public async fetchByParams({
    city,
    page,
    age,
    dogSize,
    energyLevel,
    independenceLevel,
  }: fetchByParamsInterface): Promise<Pet[]> {
    const pets = await prisma.pet.findMany({
      where: {
        Organization: {
          address_name: city,
        },
        age,
        dog_size: dogSize,
        energy_level: energyLevel,
        independence_level: independenceLevel,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return pets;
  }
}
