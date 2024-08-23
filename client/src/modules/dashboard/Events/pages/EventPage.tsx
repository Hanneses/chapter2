import { Heading, Text, Flex, Tooltip, Box, Img } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Link } from 'chakra-next-link';
import { useDashboardEventQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import Actions from '../components/Actions';
import { EventUsers } from '../components/EventUsers';
import { EventVenue } from '../components/EventVenue';
import { LinkField, TextField } from '../components/Fields';
import SponsorsCard from '../../../../components/SponsorsCard';
import { TagsBox } from '../../../../components/TagsBox';
import { NextPageWithLayout } from '../../../../pages/_app';
import { AttendanceNames } from '../../../../../../common/attendance';
import { formatEventDateStartEnd } from 'util/formatDateStartEnd';

export const EventPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { param: eventId } = useParam('id');

  const { loading, error, data } = useDashboardEventQuery({
    variables: { eventId },
  });

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;
  if (!data.dashboardEvent)
    return <NextError statusCode={404} title="Event not found" />;

  const { id: chapterId, name: chapterName } = data.dashboardEvent.chapter;
  const attendees = data.dashboardEvent.event_users.filter(
    ({ attendance }) => attendance.name === AttendanceNames.confirmed,
  );

  return (
    <>
      <Flex
        p="2"
        borderWidth="1px"
        borderRadius="lg"
        gap={'3'}
        flexDirection="column"
      >
        {data.dashboardEvent.image_url && (
          <>
            <Box height={'200px'}>
              <Img
                src={data.dashboardEvent.image_url}
                maxHeight={200}
                alt="Event image"
                borderRadius="md"
                objectFit="cover"
              />
            </Box>
            <Link href={data.dashboardEvent.image_url} isExternal={true}>
              <sub>{data.dashboardEvent.image_url}</sub>
            </Link>
          </>
        )}

        <Flex alignItems="center">
          {data.dashboardEvent.invite_only && (
            <Tooltip label="Invite only">
              <LockIcon fontSize="2xl" />
            </Tooltip>
          )}
          <Heading as="h1">{data.dashboardEvent.name}</Heading>
        </Flex>

        {data.dashboardEvent.canceled && (
          <Text fontWeight={500} fontSize={'md'} color="red.500">
            Canceled
          </Text>
        )}

        <LinkField label="Event By" href={`/dashboard/chapters/${chapterId}`}>
          {chapterName}
        </LinkField>

        {!!data.dashboardEvent.event_tags.length && (
          <TagsBox tags={data.dashboardEvent.event_tags} />
        )}
        <Text fontSize={'md'}>{data.dashboardEvent.description}</Text>

        <TextField label="Date">
          {formatEventDateStartEnd(
            data.dashboardEvent.start_at,
            data.dashboardEvent.ends_at,
          )}
        </TextField>

        <TextField label="Capacity">
          {`${attendees.length} / ${data.dashboardEvent.capacity}`}
        </TextField>

        {data.dashboardEvent.url && (
          <LinkField label="Website" isExternal>
            {data.dashboardEvent.url}
          </LinkField>
        )}

        <EventVenue event={data.dashboardEvent} />

        <Actions
          event={data.dashboardEvent}
          chapter={data.dashboardEvent.chapter}
          onDelete={() => router.replace('/dashboard/events')}
        />
      </Flex>

      {!!data.dashboardEvent.sponsors.length && (
        <SponsorsCard sponsors={data.dashboardEvent.sponsors} />
      )}
      <EventUsers event={data.dashboardEvent} />
    </>
  );
};

EventPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
