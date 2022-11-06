import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { BiArrowBack } from 'react-icons/bi';
import React, { useEffect } from 'react';
import { Display } from '../account';
import { supabase } from '../../lib/supabase';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  setDisplay: Function;
}

export function CreateProject(props: Props) {
  const { setDisplay } = props;
  const [title, setTitle] = React.useState<string>('');
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [createError, setCreateError] = React.useState<string | null>(null);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [uid, setUid] = React.useState<string | undefined>(undefined);
  const toast = useToast();

  const createProject = async () => {
    try {
      if (!title) {
        throw new Error('Title is required');
      }
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('projects')
        .insert({ title, created_by: user?.id });
      if (error) throw error;

      setTitle('');
      toast({
        position: 'top',
        title: 'Project created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (e: any) {
      console.log('ERROR', e);
      setCreateError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        p={2}
        top={4}
        right={4}
        rounded={'lg'}
        minW={'140px'}
        position={'absolute'}
        onClick={() => setDisplay(Display.ACCOUNT)}
        bg={useColorModeValue('gray.200', 'gray.800')}
        _hover={{
          bg: useColorModeValue('gray.300', 'gray.700'),
        }}
      >
        Account
      </Button>
      <Button
        p={2}
        top={20}
        right={4}
        rounded={'lg'}
        minW={'140px'}
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
          <Stack spacing={4} p={4}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={'Title'}
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
          <Stack mt={4} direction={'row'} spacing={4}>
            <Button
              mx={4}
              isLoading={loading}
              onClick={() => createProject()}
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
              {loading || 'Create Project'}
            </Button>
          </Stack>
        </Box>
      </Flex>
    </div>
  );
}
