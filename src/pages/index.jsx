import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Body from '../components/Body';

export default function Home() {
  const [headerEmoji, setHeaderEmoji] = useState('');
  const [emojiPickerisOpen, setEmojiPickerisOpen] = useState(false);

  const [bgImage, setBgImage] = useState('');
  const [uploadBgImageisOpen, setUploadBgImageisOpen] = useState(false);

  return (
    <Box>
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
  );
}
