import { Avatar, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  url: string;
  onUpload: Function;
}

export function PersonalAvatar(props: Props) {
  const { url, onUpload } = props;
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [uplaoding, setUploading] = useState<boolean>(false);

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) throw error;
      const u = URL.createObjectURL(data);
      setAvatarUrl(u);
    } catch (e: any) {
      console.log('Error downloading image', e.message);
    }
  };

  const uploadAvatar = async (e: any) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      onUpload(filePath);
    } catch (error: any) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  return (
    <div>
      {avatarUrl ? (
        <Avatar
          size={'2xl'}
          src={avatarUrl}
          name={'avatar'}
          mb={4}
          pos={'relative'}
          _after={{
            content: '""',
            w: 4,
            h: 4,
            bg: 'green.300',
            border: '2px solid white',
            rounded: 'full',
            pos: 'absolute',
            bottom: 0,
            right: 3,
          }}
        />
      ) : (
        <Avatar
          size={'2xl'}
          src={avatarUrl}
          name={'avatar'}
          mb={4}
          pos={'relative'}
          _after={{
            content: '""',
            w: 4,
            h: 4,
            bg: 'green.300',
            border: '2px solid white',
            rounded: 'full',
            pos: 'absolute',
            bottom: 0,
            right: 3,
          }}
        />
      )}
      <div>
        <Button
          size={'sm'}
          flex={1}
          mb={4}
          fontSize={'sm'}
          rounded={'full'}
          _focus={{
            bg: 'gray.200',
          }}
        >
          <label className="button primary block" htmlFor="single">
            {uplaoding ? 'Uploading...' : 'Upload'}
          </label>
        </Button>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          id="single"
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uplaoding}
        />
      </div>
    </div>
  );
}
