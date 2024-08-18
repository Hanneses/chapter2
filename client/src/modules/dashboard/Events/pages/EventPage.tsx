import { Heading, Text, Flex, Tooltip, Box, Img } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

import { useDashboardEventQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import { formatDate } from '../../../../util/date';
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

  const startAt = formatDate(data.dashboardEvent.start_at);
  const endAt = formatDate(data.dashboardEvent.ends_at);
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
        {!!data.dashboardEvent.event_tags.length && (
          <TagsBox tags={data.dashboardEvent.event_tags} />
        )}
        <Text fontSize={'md'}>{data.dashboardEvent.description}</Text>
        {data.dashboardEvent.image_url && (
          <LinkField
            label="Image"
            isExternal
            href={data.dashboardEvent.image_url}
          >
            <Box height={'150px'}>
              <Img src={data.dashboardEvent.image_url} maxHeight={150} />
            </Box>
          </LinkField>
        )}
        {data.dashboardEvent.url && (
          <LinkField label="Event Url" isExternal>
            {data.dashboardEvent.url}
          </LinkField>
        )}
        <TextField label="Starting">{startAt}</TextField>
        <TextField label="Ending">{endAt}</TextField>
        <TextField label="Capacity">
          {`${attendees.length} / ${data.dashboardEvent.capacity}`}
        </TextField>
        <LinkField label="Event By" href={`/dashboard/chapters/${chapterId}`}>
          {chapterName}
        </LinkField>
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
