import { Heading, HStack, List, ListItem } from '@chakra-ui/react';
import Avatar from '../../../components/Avatar';
import UserName from '../../../components/UserName';

export const UsersList = ({
  text,
  users,
}: {
  text: string;
  users: {
    user: { id: number; name: string; image_url?: string | null | undefined };
  }[];
}) => (
  <>
    <Heading
      data-cy={`${text.toLowerCase()}-heading`} // [data-cy="attendees-heading"] // [data-cy="waitlist-heading"]
      fontSize={['sm', 'md', 'lg']}
      as={'h2'}
    >
      {text}:
    </Heading>
    <List>
      {!users.length ? (
        <i>nobody</i>
      ) : (
        users.map(({ user }) => (
          <ListItem key={user.id} mb="2">
            <HStack>
              <Avatar user={user} />
              <UserName user={user} fontSize="xl" fontWeight="bold" />
            </HStack>
          </ListItem>
        ))
      )}
    </List>
  </>
);
