import React, { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

const Navbar = dynamic(() => import('../components/Navbar'), {
  suspense: true,
});
const Header = dynamic(() => import('../components/Header'), {
  suspense: true,
});
const Body = dynamic(() => import('../components/Body'), {
  suspense: true,
});

export default function Home() {
  const [headerEmoji, setHeaderEmoji] = useState('');
  const [emojiPickerisOpen, setEmojiPickerisOpen] = useState(false);

  const [bgImage, setBgImage] = useState('');
  const [uploadBgImageisOpen, setUploadBgImageisOpen] = useState(false);

  return (
    <Suspense fallback="Loading...">
      <Box onClick={() => emojiPickerisOpen && setEmojiPickerisOpen(false)}>
        <Navbar bgImage={bgImage} />
        <Header
          headerEmoji={headerEmoji}
          setHeaderEmoji={setHeaderEmoji}
          emojiPickerisOpen={emojiPickerisOpen}
          setEmojiPickerisOpen={setEmojiPickerisOpen}
          bgImage={bgImage}
          setBgImage={setBgImage}
          uploadBgImageisOpen={uploadBgImageisOpen}
          setUploadBgImageisOpen={setUploadBgImageisOpen}
        />
        <Body />
      </Box>
    </Suspense>
  );
}
