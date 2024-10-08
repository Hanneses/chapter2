import { useApolloClient } from '@apollo/client';
import NextError from 'next/error';
import React from 'react';
import { Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { useConfirmDelete } from 'chakra-confirm';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';

import { Link } from 'chakra-next-link';
import { CloseIcon, DownloadIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import {
  useDeleteMeMutation,
  useUpdateMeMutation,
  UpdateUserInputs,
  useUserProfileQuery,
  useUserDownloadLazyQuery,
  UserDownloadQuery,
} from '../../../generated/graphql';
import { getNameText } from '../../../components/UserName';
import { Loading } from '../../../components/Loading';
import { meQuery } from '../../auth/graphql/queries';
import { userProfileQuery } from '../graphql/queries';
import { ProfileForm } from '../component/ProfileForm';
import { useAlert } from '../../../hooks/useAlert';
import { useSession } from '../../../hooks/useSession';
import { useUser } from '../../auth/user';

const createDataUrl = (userData: UserDownloadQuery['userDownload']) => {
  const dataString = JSON.stringify(userData, (key, value) =>
    key === '__typename' ? undefined : value,
  );
  const dataUrl = `data:text/json;charset=utf-8,${encodeURIComponent(
    dataString,
  )}`;
  return dataUrl;
};

const RequireLogin = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loadingUser } = useUser();

  if (loadingUser) return <Loading />;
  if (!isLoggedIn)
    return <NextError statusCode={401} title={'Log in to see this page'} />;

  return <>{children}</>;
};

const UserProfile = () => {
  const { data, loading, error } = useUserProfileQuery();
  const [getData, { data: userDownloadData, loading: loadingDownloadData }] =
    useUserDownloadLazyQuery();
  const userDownload = userDownloadData?.userDownload;

  const { logout } = useSession();
  const router = useRouter();
  const client = useApolloClient();

  const confirmDelete = useConfirmDelete({
    body: 'Are you sure you want to delete your account? Account deletion cannot be reversed.',
    buttonText: 'Delete account',
  });
  const [deleteMe] = useDeleteMeMutation();
  const [updateMe] = useUpdateMeMutation({
    refetchQueries: [{ query: meQuery }, { query: userProfileQuery }],
  });

  const addAlert = useAlert();

  const submitUpdateMe = async (data: UpdateUserInputs) => {
    const name = data.name?.trim();
    const image_url = data.image_url;
    const { data: userData, errors } = await updateMe({
      variables: {
        data: { name, auto_subscribe: data.auto_subscribe, image_url },
      },
    });
    if (errors) throw errors;
    if (userData) {
      addAlert({ title: 'Profile saved!', status: 'success' });
    }
  };

  const clickDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    await deleteMe();
    await logout();
    await router.push('/');
    await client.resetStore();
  };

  const isLoading = loading || !data;
  if (isLoading || error) return <Loading error={error} />;
  const userInfo = data.userProfile;

  return (
    <div>
      <Heading as="h1" marginBlock={'.5em'}>
        Profile
      </Heading>

      <Heading as="h2" size={'lg'}>
        Welcome, {getNameText(userInfo.name)}
      </Heading>

      {userInfo.admined_chapters.length > 0 && (
        <>
          <Text marginBlock={'.5em'} size="md">
            You are an administrator for these Chapters:
          </Text>
          <Flex
            marginTop={'1em'}
            marginLeft={'2em'}
            maxWidth={'fit-content'}
            flexDirection={'column'}
            gap={2}
          >
            {userInfo.admined_chapters.map(({ name, id }) => (
              <Link key={id} href={`/chapters/${id}`}>
                {name}
              </Link>
            ))}
          </Flex>
        </>
      )}

      <Text marginTop={'2em'} size="md" fontWeight={500}>
        Email address:{' '}
        <Text as="span" fontWeight={700}>
          {userInfo.email}
        </Text>
      </Text>

      <ProfileForm
        onSubmit={submitUpdateMe}
        data={userInfo}
        loadingText={'Saving Profile Changes'}
        submitText={'Save Profile Changes'}
      />

      <Flex gap="1em" marginBlock={'1em'} marginTop={'3em'}>
        <Button
          colorScheme="blue"
          onClick={() => getData()}
          isDisabled={!!userDownload}
          leftIcon={<InfoOutlineIcon />}
        >
          Request my account data
        </Button>
        {loadingDownloadData ? (
          <Spinner />
        ) : (
          userDownload && (
            <Link
              download={`${userDownload?.name}.json`}
              href={createDataUrl(userDownload)}
            >
              <Button colorScheme={'green'} leftIcon={<DownloadIcon />}>
                Download data
              </Button>
            </Link>
          )
        )}
      </Flex>

      <Button
        colorScheme={'red'}
        onClick={clickDelete}
        leftIcon={<CloseIcon />}
      >
        Delete my account
      </Button>
    </div>
  );
};

export const UserProfilePage = () => {
  return (
    <RequireLogin>
      <UserProfile />
    </RequireLogin>
  );
};
