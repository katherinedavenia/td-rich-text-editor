import React from 'react';
import { Box, Button, Container } from '@mui/material';
import { AddPhotoAlternate, InsertEmoticon } from '@mui/icons-material';
import { Emoji } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const Header = ({
  headerEmoji,
  setHeaderEmoji,
  emojiPickerisOpen,
  setEmojiPickerisOpen,
  bgImage,
  setBgImage,
  uploadBgImageisOpen,
  setUploadBgImageisOpen,
}) => (
  <Box
    sx={{
      height: '300px',
      backgroundImage: bgImage
        ? `url('${bgImage}')`
        : 'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}
  >
    <Container
      maxWidth="lg"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {headerEmoji ? (
        <Box
          onClick={() => setEmojiPickerisOpen(!emojiPickerisOpen)}
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            bottom: '-50px',
            left: '24px',
          }}
        >
          <Emoji unified={headerEmoji} size="80" />
        </Box>
      ) : (
        <Box
          onClick={() => setEmojiPickerisOpen(!emojiPickerisOpen)}
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            bottom: '-55px',
            left: '24px',
          }}
        >
          <Button
            sx={{
              border: '2px solid rgba(220, 220, 220, 0.5)',
              p: '3px 14px',
              borderRadius: '6px',
              color: 'rgba(0, 0, 0, 0.4)',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 0.9,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(220, 220, 220, 0.2)',
              },
            }}
          >
            <InsertEmoticon sx={{ height: '30px', mr: '5px', opacity: 0.7 }} />
            add icon
          </Button>
        </Box>
      )}
      {emojiPickerisOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: '320px',
            left: '165px',
            transform: 'translateY(-4px)',
            zIndex: 10,
          }}
        >
          <EmojiPicker
            onEmojiClick={(a) => {
              setHeaderEmoji(a.unified);
              setEmojiPickerisOpen(false);
            }}
          />
        </Box>
      )}
      <Box
        onClick={() => setUploadBgImageisOpen(!uploadBgImageisOpen)}
        sx={{
          position: 'absolute',
          bottom: '15px',
          right: '24px',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'end',
          opacity: bgImage ? 0 : 1,
          '&:hover': {
            opacity: 1,
            transition: '200ms',
          },
        }}
      >
        <Button
          sx={{
            border: '2px solid rgba(255, 255, 255, 0.8)',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: 'rgba(255, 255, 255, 0.8)',
            p: '3px 14px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: 0.9,
            width: 'fit-content',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          <AddPhotoAlternate sx={{ height: '30px', mr: '5px' }} />
          change cover
          <input
            type="file"
            id="cover-banner"
            name="cover-banner"
            accept="image/png, image/jpeg, image/jpg"
            style={{
              height: '100%',
              width: '300px',
              position: 'absolute',
              opacity: 0,
              cursor: 'pointer',
            }}
            onChange={(e) => {
              if (e.target.files?.length !== 0) {
                setBgImage(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
        </Button>
      </Box>
    </Container>
  </Box>
);

Header.propTypes = {
  headerEmoji: PropTypes.string,
  setHeaderEmoji: PropTypes.func,
  emojiPickerisOpen: PropTypes.bool,
  setEmojiPickerisOpen: PropTypes.func,
  bgImage: PropTypes.string,
  setBgImage: PropTypes.func,
  uploadBgImageisOpen: PropTypes.bool,
  setUploadBgImageisOpen: PropTypes.func,
};

export default Header;
