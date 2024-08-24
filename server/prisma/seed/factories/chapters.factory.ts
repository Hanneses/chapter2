import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';
import { selectTags } from '../lib/util';

const { company, lorem, location, image } = faker;

const createChapters = async (userId: number): Promise<number[]> => {
  const chapterIds: number[] = [];

  for (let i = 0; i < 4; i++) {
    const name = company.name();
    const description = lorem.words();
    const category = lorem.word();

    const tagsCount = Math.round(Math.random() * 4);
    const selectedTags = selectTags(tagsCount);
    const connectOrCreateTags = selectedTags.map((name) => ({
      tag: { connectOrCreate: { where: { name }, create: { name } } },
    }));

    // TODO: we shouldn't need to use the unchecked type here. The database
    // schema may need modifying.
    const chapterData: Prisma.chaptersUncheckedCreateInput = {
      name,
      description,
      category,
      creator_id: userId,
      country: location.country(),
      city: location.city(),
      region: location.state(),
      logo_url: image.url({ width: 150, height: 150 }),
      banner_url: image.url({ width: 150, height: 150 }),
      chapter_tags: { create: connectOrCreateTags },
    };

    // TODO: batch this once createMany returns the records.
    const chapter = await prisma.chapters.create({ data: chapterData });

    chapterIds.push(chapter.id);
  }

  return chapterIds;
};

export default createChapters;
