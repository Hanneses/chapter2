import {
  Heading,
  VStack,
  Grid,
  GridItem,
  Flex,
  Text,
  Card,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Link } from 'chakra-next-link';

import { Loading } from '../../components/Loading';
import { ChapterCard } from '../../components/ChapterCard';
import { EventCard } from '../../components/EventCard';
import {
  usePaginatedEventsWithTotalQuery,
  useChaptersLazyQuery,
} from '../../generated/graphql';
import { Pagination } from '../util/pagination';
import { UserContextType, useUser } from '../auth/user';
import { getNameText } from '../../components/UserName';

const eventsPerPage = 2;

type User = NonNullable<UserContextType['user']>;

const Welcome = ({ user }: { user: User }) => {
  return (
    <Flex
      alignItems={'start'}
      justifyContent="space-between"
      marginBlockStart="1.25em"
      flexDirection={'column'}
    >
      <Heading as="h1">Welcome, {getNameText(user.name)}</Heading>

      {!user.name && (
        <Text>
          You can set your name on your{' '}
          <Link
            href="/profile"
            textDecoration={'underline'}
            _hover={{ textDecoration: 'none' }}
          >
            profile page
          </Link>
          .
        </Text>
      )}
    </Flex>
  );
};
const Home = () => {
  const [getChapters, { error: chapterErrors, data: chapterDatas }] =
    useChaptersLazyQuery();

  const { loading, error, data, fetchMore } = usePaginatedEventsWithTotalQuery({
    variables: { offset: 0, limit: eventsPerPage },
  });
  const { user } = useUser();

  useEffect(() => {
    if (!loading) {
      getChapters();
    }
  }, [loading]);

  const isLoading = loading || !data;
  if (isLoading) return <Loading error={error} />;

  const items = data.paginatedEventsWithTotal.events.map((event) => (
    <EventCard key={event.id} event={event} />
  ));

  return (
    <>
      {user ? (
        <Welcome user={user} />
      ) : (
        <Heading as="h1" marginBlockStart="1.25em">
          Welcome to Chapter
        </Heading>
      )}
      <Grid templateColumns="repeat(2, 1fr)" gap={10} mt="5">
        <GridItem colSpan={{ base: 2, xl: 1 }}>
          <VStack align="flex-start">
            <Card padding={6} marginBottom={6}>
              <Text>Hi {user?.name ? user?.name : 'there'}! 👋</Text>

              <Text marginTop={2}>
                This is <strong>Demo Organization&apos;s</strong> event
                platform. <strong>Demo Organization</strong> and our chapters
                organize events for several topics. We&apos;ve been looking
                forward to see you soon. Welcome!
              </Text>

              <Text marginTop={2}>
                You have a question? Great. <br />
                Please contact us via{' '}
                <Link
                  to="mailto:contact@chapter-organization.com"
                  fontWeight={'bold'}
                >
                  contact@chapter-organization.com
                </Link>
                . 📫
              </Text>
            </Card>

            <Heading as="h2" size={'md'} marginBottom={4}>
              Upcoming events
            </Heading>

            <Pagination
              items={items}
              fetchMore={fetchMore}
              limit={eventsPerPage}
              total={data.paginatedEventsWithTotal.total || 0}
              displayOnEmpty={
                <Text marginTop={4}>
                  Check out the{' '}
                  <Link href="/events" fontWeight="bold">
                    Event page
                  </Link>{' '}
                  to see past events.
                </Text>
              }
            />
          </VStack>
        </GridItem>

        <GridItem colSpan={{ base: 2, xl: 1 }}>
          <VStack align="flex-start">
            <Heading as="h2" size={'md'}>
              Chapters
            </Heading>

            {chapterDatas ? (
              chapterDatas.chapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))
            ) : (
              <Loading error={chapterErrors} />
            )}
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
};

export default Home;
