import {
  Box,
  Flex,
  useColorModeValue,
  useToast,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';

import { PersonalAvatar } from '.';
import { supabase } from '../../lib/supabase';
import { CreateProject, Projects } from '../projects';

// eslint-disable-next-line no-unused-vars
export enum Display {
  ACCOUNT = 'account',
  PROJECTS = 'projects',
  CREATE_PROJECT = 'create_project',
}

export function Account({ session }: { session: any }) {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [website, setWebsite] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [display, setDisplay] = useState<Display>(Display.ACCOUNT);

  const getProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error, status } = await supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (err: any) {
      console.log(err);
      toast({
        title: 'Error',
        position: 'top',
        description: err.error_description || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async ({
    u,
    w,
    a,
  }: {
    u: string | null;
    w: string | null;
    a: string | null;
  }) => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const updates = {
        id: user?.id,
        username: u,
        website: w,
        avatar_url: a,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates, {
        onConflict: 'id',
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Profile updated',
        position: 'top',
        description: 'Your profile has been updated',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err: any) {
      console.log(err);
      toast({
        title: 'Error',
        position: 'top',
        description: err.error_description || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, [session]);

  return (
    <div>
      {display === Display.PROJECTS ? (
        <Projects setDisplay={setDisplay} />
      ) : display === Display.CREATE_PROJECT ? (
        <CreateProject setDisplay={setDisplay} />
      ) : (
        <>
          <Button
            p={2}
            top={4}
            right={4}
            minW={'140px'}
            rounded={'lg'}
            position={'absolute'}
            onClick={() => setDisplay(Display.CREATE_PROJECT)}
            bg={useColorModeValue('gray.200', 'gray.800')}
            _hover={{
              bg: useColorModeValue('gray.300', 'gray.700'),
            }}
          >
            Add Project
            <Flex pl={2}>
              <AiOutlinePlus />
            </Flex>
          </Button>
          <Button
            p={2}
            top={20}
            right={4}
            minW={'140px'}
            rounded={'lg'}
            position={'absolute'}
            onClick={() => setDisplay(Display.PROJECTS)}
            bg={useColorModeValue('gray.200', 'gray.800')}
            _hover={{
              bg: useColorModeValue('gray.300', 'gray.700'),
            }}
          >
            Projects
          </Button>
          <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.700')}
          >
            <Box
              maxW={'445px'}
              w={'full'}
              bg={useColorModeValue('white', 'gray.900')}
              boxShadow={'2xl'}
              rounded={'lg'}
              p={6}
              textAlign={'center'}
              justifyItems={'center'}
              justifyContent={'center'}
            >
              <PersonalAvatar
                url={avatarUrl}
                onUpload={(url: string) => {
                  setAvatarUrl(url);
                  updateProfile({ u: username, w: website, a: url });
                }}
              />
              <Text fontSize={'sm'} fontWeight={500} color={'gray.500'} mb={4}>
                {session.user.email}
              </Text>
              <Stack spacing={4} p={4}>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={username || 'Username'}
                    color={useColorModeValue('gray.800', 'gray.200')}
                    bg={useColorModeValue('gray.100', 'gray.600')}
                    border={0}
                    rounded={'full'}
                    _focus={{
                      bg: useColorModeValue('gray.200', 'gray.800'),
                      outline: 'none',
                    }}
                  />
                </FormControl>
              </Stack>
              <Stack spacing={4} p={4}>
                <FormControl>
                  <FormLabel>Website</FormLabel>
                  <Input
                    type="text"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder={website || 'Website'}
                    color={useColorModeValue('gray.800', 'gray.200')}
                    bg={useColorModeValue('gray.100', 'gray.600')}
                    border={0}
                    rounded={'full'}
                    _focus={{
                      bg: useColorModeValue('gray.200', 'gray.800'),
                      outline: 'none',
                    }}
                  />
                </FormControl>
              </Stack>
              <Stack mt={8} direction={'row'} spacing={4}>
                <Button
                  onClick={() => supabase.auth.signOut()}
                  flex={1}
                  fontSize={'sm'}
                  rounded={'full'}
                  _focus={{
                    bg: 'gray.200',
                  }}
                >
                  Logout
                </Button>
                <Button
                  isLoading={loading}
                  onClick={() => updateProfile({ u: username, w: website, a: avatarUrl })}
                  flex={1}
                  fontSize={'sm'}
                  rounded={'full'}
                  bg={'blue.400'}
                  color={'white'}
                  boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
                  _hover={{
                    bg: 'green.500',
                  }}
                  _focus={{
                    bg: 'green.500',
                  }}
                >
                  {loading || 'Update'}
                </Button>
              </Stack>
            </Box>
          </Flex>
        </>
      )}
    </div>
  );
}
