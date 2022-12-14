import {
  Flex,
  Heading,
  Stack,
  useColorModeValue,
  useToast,
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Auth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const toast = useToast();

  const handleLogin = async (e: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email: e });
      if (error) throw error;
      toast({
        title: 'Account created',
        position: 'top',
        description: 'Check your email for the login link!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err: any) {
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

  return (
    <div>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to supabase</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              via magic link with your email below ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id={'email'}>
                <FormLabel>Email address</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogin(email);
                  }}
                  isLoading={loading}
                  loadingText="Signining in..."
                  colorScheme="teal"
                  variant="outline"
                  spinnerPlacement="start"
                  textColor={'white'}
                  bg={'blue.400'}
                  _hover={{ bg: 'blue.500' }}
                >
                  {loading || 'Send magic link'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </div>
  );
}
