import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';
import { selectTags } from '../lib/util';

const { company, location } = faker;

const createVenues = async (
  chapterIds: number[],
): Promise<{ [x: number]: number[] }> => {
  const chapterIdToVenueIds: {
    [x: number]: number[];
  } = chapterIds
    .map((id) => ({ [id]: [] }))
    .reduce((acc, curr) => ({ ...acc, ...curr }));

  for (const chapterId of chapterIds) {
    for (let i = 0; i < 4; i++) {
      const tagsCount = Math.round(Math.random() * 4);
      const selectedTags = selectTags(tagsCount);
      const connectOrCreateTags = selectedTags.map((name) => ({
        tag: { connectOrCreate: { where: { name }, create: { name } } },
      }));
      const venueData: Prisma.venuesCreateInput = {
        name: company.name(),
        city: location.city(),
        region: location.state(),
        postal_code: location.zipCode(),
        country: location.country(),
        street_address:
          Math.random() > 0.5 ? location.streetAddress() : undefined,
        chapter: { connect: { id: chapterId } },
        venue_tags: { create: connectOrCreateTags },
      };

      // TODO: batch this once createMany returns the records.
      const venue = await prisma.venues.create({ data: venueData });

      chapterIdToVenueIds[chapterId].push(venue.id);
    }
  }

  return chapterIdToVenueIds;
};

export default createVenues;
