/* eslint-disable react/function-component-definition */
import React, { useMemo } from 'react';
import { Box, Container } from '@mui/material';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import RichTextEditor from './RichTextEditor';
import useResponsive from '../lib/useResponsive';

const initialValueTitle = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];

const initialValueSubtitle = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];

const Body = () => {
  const { isMobile, isTablet } = useResponsive();
  const editorTitle = useMemo(() => withHistory(withReact(createEditor())), []);
  const editorSubtitle = useMemo(
    () => withHistory(withReact(createEditor())),
    [],
  );

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 300px)',
        px: { sm: '30px', md: '50px', lg: 0 },
      }}
    >
      <Container maxWidth="lg" sx={{ minHeight: 'calc(100vh - 300px)' }}>
        <Box sx={{ pt: '75px', pb: '25px' }}>
          <Slate editor={editorTitle} value={initialValueTitle}>
            <Editable
              style={{
                fontSize: isMobile ? '26px' : isTablet ? '34px' : '38px',
                fontWeight: 600,
              }}
              placeholder="New title here...📝✨"
            />
          </Slate>
          <Slate editor={editorSubtitle} value={initialValueSubtitle}>
            <Editable
              style={{
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: 400,
                marginTop: '10px',
                color: '#969696',
              }}
              placeholder="What's this topic about?"
            />
          </Slate>
        </Box>
        <RichTextEditor />
      </Container>
    </Box>
  );
};

export default Body;
