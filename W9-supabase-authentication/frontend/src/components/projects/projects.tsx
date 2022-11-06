import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';
import React, { useEffect } from 'react';
import { Display } from '../account';
import { supabase } from '../../lib/supabase';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  setDisplay: Function;
}

export function Projects(props: Props) {
  const { setDisplay } = props;
  const [title, setTitle] = React.useState<string>('');
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [createError, setCreateError] = React.useState<string | null>(null);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [uid, setUid] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUid(user?.id);
        const { data, error } = await supabase
          .from('projects')
          .select('id, title')
          .eq('created_by', user?.id)
          .order('id', { ascending: false });
        if (error) {
          setFetchError(error.message);
          console.log(error);
        }
        if (data) {
          console.log('DATA', data);
          setProjects(data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
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
        onClick={() => setDisplay(Display.ACCOUNT)}
        bg={useColorModeValue('gray.200', 'gray.800')}
        _hover={{
          bg: useColorModeValue('gray.300', 'gray.700'),
        }}
      >
        Account
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
          <Flex justify={'center'} align={'center'} direction={'column'}>
            <Stack mt={8} flexDirection={'column'} spacing={4}>
              {!loading && projects && projects.length > 0 ? (
                projects.map((project) => (
                  <Box
                    key={project.id}
                    p={4}
                    bg={useColorModeValue('gray.100', 'gray.600')}
                    rounded={'lg'}
                  >
                    {project.title}
                  </Box>
                ))
              ) : (
                <Box p={4} rounded={'lg'}>
                  No projects
                </Box>
              )}
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </div>
  );
}
