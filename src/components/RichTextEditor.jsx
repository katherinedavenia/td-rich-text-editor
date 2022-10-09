/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useMemo, useState } from 'react';
import isHotkey from 'is-hotkey';
import {
  withReact, useSlate, Slate, Editable
} from 'slate-react';
import { Editor, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Toolbar,
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  AutoFixHigh,
  Code,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatStrikethrough,
  FormatUnderlined,
  LooksOne,
  LooksTwo,
} from '@mui/icons-material';
import useResponsive from '../lib/useResponsive';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const HOTKEYS = {
  'ctrl+b': 'bold',
  'ctrl+i': 'italic',
  'ctrl+u': 'underline',
  'ctrl+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const toggleSelect = (editor, format, selected) => {
  Editor.addMark(editor, format, selected);
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format).toString()}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      sx={{
        minWidth: 0,
        backgroundColor: '#f9f9f9',
        mr: { xs: '7px', sm: '14px', md: 0 },
        ml: { md: '14px' },
        padding: '0px 0px !important',
        mb: { xs: '7px', md: 0 },
      }}
    >
      {icon}
    </Button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format).toString()}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      sx={{
        minWidth: 0,
        backgroundColor: '#f9f9f9',
        mr: { xs: '7px', sm: '14px', md: 0 },
        ml: { md: '14px' },
        padding: '0px 0px !important',
        mb: { xs: '7px', sm: 0 },
      }}
    >
      {icon}
    </Button>
  );
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote
          {...attributes}
          style={{ borderLeft: '3px solid #ababab', paddingLeft: '25px' }}
        >
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const LeafContainer = ({ attributes, children }) => (
  <span {...attributes}>{children}</span>
);

const Leaf = ({ children, leaf }) => {
  const style = {
    fontSize: leaf.fontSizeSelect,
    lineHeight: leaf.lineHeightSelect,
    textTransform: leaf.textCaseSelect,
  };

  if (leaf.code) {
    return <code>{children}</code>;
  }

  if (leaf.bold) {
    style.fontWeight = 'bold';
  }

  if (leaf.italic) {
    style.fontStyle = 'italic';
  }

  if (leaf.underline) {
    style.textDecoration = 'underline';
  }

  if (leaf.strikethrough) {
    style.textDecoration = 'line-through';
  }

  return <span style={style}>{children}</span>;
};

const formStyle = {
  fontSize: '14px',
  minHeight: 0,
  height: { xs: '35px', sm: '40px !important' },
  width: { xs: 'auto', sm: '125px' },
  mr: { xs: '7px', sm: '14px' },
  mb: { xs: '10px', sm: 0 },
};

const formButtonStyle = {
  color: '#000',
  padding: '6px 16px',
  minHeight: 0,
  width: '100%',
  textTransform: 'none',
};

const DropdownMenuItem = ({ value, onMouseDown, title }) => (
  <MenuItem value={value} sx={{ padding: 0 }}>
    <Button onMouseDown={onMouseDown} sx={formButtonStyle}>
      {title}
    </Button>
  </MenuItem>
);

const DropdownContainer = ({
  value,
  onChange,
  renderValue,
  placeholder,
  children,
}) => (
  <FormControl>
    <Select
      displayEmpty
      value={value}
      onChange={onChange}
      input={<OutlinedInput />}
      renderValue={renderValue}
      sx={formStyle}
    >
      <MenuItem disabled value={value}>
        <span>{placeholder}</span>
      </MenuItem>
      {children}
    </Select>
  </FormControl>
);

const FontSizePicker = ({ editor }) => {
  const fontSizes = [
    5, 5.5, 6.5, 7.5, 8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 28, 36,
    48, 72,
  ];
  const [fontSize, setFontSize] = useState(16);

  return (
    <DropdownContainer
      value={fontSize}
      onChange={(event) => setFontSize(event.target.value)}
      renderValue={() => {
        if (fontSize === 16) {
          return <span>Font Size</span>;
        }
        return <span>{fontSize}</span>;
      }}
      placeholder="Font Size"
    >
      {fontSizes.map((selected) => (
        <DropdownMenuItem
          value={selected}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleSelect(editor, 'fontSizeSelect', selected);
          }}
          title={selected.toString()}
        />
      ))}
    </DropdownContainer>
  );
};

const LineHeightPicker = ({ editor }) => {
  const lineHeights = [1.2, 1.5, 2.0, 2.5, 3.0];
  const [lineHeight, setLineHeight] = useState(1.2);
  return (
    <DropdownContainer
      value={lineHeight}
      onChange={(event) => setLineHeight(event.target.value)}
      renderValue={() => {
        if (lineHeight === 1.2) {
          return <span>Line Height</span>;
        }
        return <span>{lineHeight}</span>;
      }}
      placeholder="Line Height"
    >
      {lineHeights.map((selected) => (
        <DropdownMenuItem
          value={selected}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleSelect(editor, 'lineHeightSelect', selected);
          }}
          title={selected.toString()}
        />
      ))}
    </DropdownContainer>
  );
};

const TextCasePicker = ({ editor }) => {
  const textCases = ['Lowercase', 'Uppercase', 'Capitalize'];
  const [textCase, setTextCase] = useState('Initial');

  return (
    <DropdownContainer
      value={textCase}
      onChange={(event) => setTextCase(event.target.value)}
      renderValue={() => {
        if (textCase === 'Initial') {
          return <span>Text Case</span>;
        }
        return <span>{textCase}</span>;
      }}
      placeholder="Text Case"
    >
      {textCases.map((selected) => (
        <DropdownMenuItem
          value={selected}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleSelect(editor, 'textCaseSelect', selected);
          }}
          title={selected.toString()}
        />
      ))}
    </DropdownContainer>
  );
};

const RichTextEditor = () => {
  const { isMobile, isTablet, isTabletLandscape } = useResponsive();
  const isMobileView = (isMobile || isTablet) && !isTabletLandscape;

  const [showToolBar, setShowToolbar] = useState(true);
  const [value, setValue] = useState(initialValue);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback(
    (props) => (
      <LeafContainer attributes={props.attributes}>
        <Leaf {...props} />
      </LeafContainer>
    ),
    [],
  );

  const buttonStyle = {
    color: '#9eb9e8',
    '&:hover': {
      color: '#475266',
    },
    width: { xs: '35px', sm: '40px' },
    height: { xs: '35px', sm: '40px' },
    p: '6px 8px',
  };

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Box sx={{ position: 'relative' }}>
        {showToolBar && (
          <Toolbar
            style={{
              padding: 0,
              display: 'flex',
              flexDirection: isMobileView ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobileView ? 'start' : 'center',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                  sm: 'repeat(3, 1fr)',
                },
              }}
            >
              <FontSizePicker editor={editor} />
              <LineHeightPicker editor={editor} />
              <TextCasePicker editor={editor} />
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(5, 1fr)',
                  sm: 'repeat(10, 1fr)',
                },
              }}
            >
              <MarkButton
                format="bold"
                icon={<FormatBold sx={buttonStyle} />}
              />
              <MarkButton
                format="italic"
                icon={<FormatItalic sx={buttonStyle} />}
              />
              <MarkButton
                format="underline"
                icon={<FormatUnderlined sx={buttonStyle} />}
              />
              <MarkButton
                format="strikethrough"
                icon={<FormatStrikethrough sx={buttonStyle} />}
              />
              <MarkButton format="code" icon={<Code sx={buttonStyle} />} />
              <BlockButton
                format="heading-one"
                icon={<LooksOne sx={buttonStyle} />}
              />
              <BlockButton
                format="heading-two"
                icon={<LooksTwo sx={buttonStyle} />}
              />
              <BlockButton
                format="block-quote"
                icon={<FormatQuote sx={buttonStyle} />}
              />
              <BlockButton
                format="numbered-list"
                icon={<FormatListNumbered sx={buttonStyle} />}
              />
              <BlockButton
                format="bulleted-list"
                icon={<FormatListBulleted sx={buttonStyle} />}
              />
            </Box>
          </Toolbar>
        )}
        {!isMobileView && (
          <Box
            onClick={() => setShowToolbar(!showToolBar)}
            sx={{
              position: 'absolute',
              left: { md: '-40px', lg: '-50px' },
              top: showToolBar ? '13px' : '3px',
              cursor: 'pointer',
              opacity: 0.7,
              '&:hover': {
                opacity: 0.5,
              },
            }}
          >
            <AutoFixHigh
              sx={{
                height: '30px',
                width: 'auto',
                color: '#969696',
              }}
            />
          </Box>
        )}
      </Box>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Tell me what's on your mind... 🌈💌✨"
        spellCheck
        autoFocus
        style={{ paddingTop: showToolBar && '25px', paddingBottom: '50px' }}
        onKeyDown={(event) => {
          Object.keys(HOTKEYS).map((hotkey) => {
            let mark = '';
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              mark = HOTKEYS[hotkey];
            }
            return toggleMark(editor, mark);
          });
        }}
      />
    </Slate>
  );
};

DropdownMenuItem.propTypes = {
  value: PropTypes.node,
  onMouseDown: PropTypes.func,
  title: PropTypes.string,
};

DropdownContainer.propTypes = {
  value: PropTypes.node,
  onChange: PropTypes.func,
  renderValue: PropTypes.func,
  placeholder: PropTypes.string,
  children: PropTypes.node,
};

Element.propTypes = {
  attributes: PropTypes.shape(),
  children: PropTypes.node,
  element: PropTypes.shape(),
};

LeafContainer.propTypes = {
  attributes: PropTypes.shape(),
  children: PropTypes.node,
};

Leaf.propTypes = {
  children: PropTypes.node,
  leaf: PropTypes.shape(),
};

BlockButton.propTypes = {
  format: PropTypes.string,
  icon: PropTypes.node,
};

MarkButton.propTypes = {
  format: PropTypes.string,
  icon: PropTypes.node,
};

FontSizePicker.propTypes = {
  editor: PropTypes.shape(),
};

LineHeightPicker.propTypes = {
  editor: PropTypes.shape(),
};

TextCasePicker.propTypes = {
  editor: PropTypes.shape(),
};

export default RichTextEditor;
