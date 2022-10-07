/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React, { useCallback, useMemo, useState } from 'react';
import isHotkey from 'is-hotkey';
import { withReact, useSlate, Slate, Editable } from 'slate-react';
import { Editor, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import {
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Toolbar,
} from '@mui/material';
import PropTypes from 'prop-types';

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

const toggleSelect = (editor, format, selected) => {
  Editor.addMark(editor, format, selected);
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
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
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
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
    textAlign: leaf.textAlignSelect,
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

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const RichTextEditor = () => {
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

  const fontSizes = [
    5, 5.5, 6.5, 7.5, 8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 28, 36,
    48, 72,
  ];
  const [fontSize, setFontSize] = useState(16);

  const lineHeights = [1.2, 1.5, 2.0, 2.5, 3.0];
  const [lineHeight, setLineHeight] = useState(1.2);

  const textCases = ['lowercase', 'uppercase', 'capitalize'];
  const [textCase, setTextCase] = useState('initial');

  const textAligns = ['left', 'center', 'right'];
  const [textAlign, setTextAlign] = useState('left');

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Toolbar>
        <FormControl>
          <Select
            displayEmpty
            value={fontSize}
            onChange={(event) => setFontSize(event.target.value)}
            input={<OutlinedInput />}
            renderValue={() => {
              if (fontSize === 16) {
                return <span>Font Size</span>;
              }
              return <span>{fontSize}</span>;
            }}
          >
            <MenuItem disabled value={16}>
              <span>Font Size</span>
            </MenuItem>
            {fontSizes.map((size, index) => (
              <MenuItem key={index.toString()} value={size}>
                <Button
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleSelect(editor, 'fontSizeSelect', size);
                  }}
                >
                  {size}
                </Button>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Select
            displayEmpty
            value={lineHeight}
            onChange={(event) => setLineHeight(event.target.value)}
            input={<OutlinedInput />}
            renderValue={() => {
              if (lineHeight === 1.2) {
                return <span>Line Height</span>;
              }
              return <span>{lineHeight}</span>;
            }}
          >
            <MenuItem disabled value={1.2}>
              <span>Line Height</span>
            </MenuItem>
            {lineHeights.map((height, index) => (
              <MenuItem key={index.toString()} value={height}>
                <Button
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleSelect(editor, 'lineHeightSelect', height);
                  }}
                >
                  {height}
                </Button>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Select
            displayEmpty
            value={textCase}
            onChange={(event) => setTextCase(event.target.value)}
            input={<OutlinedInput />}
            renderValue={() => {
              if (textCase === 'initial') {
                return <span>Text Case</span>;
              }
              return <span>{textCase}</span>;
            }}
          >
            <MenuItem disabled value="initial">
              <span>Text Case</span>
            </MenuItem>
            {textCases.map((height, index) => (
              <MenuItem key={index.toString()} value="height">
                <Button
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleSelect(editor, 'textCaseSelect', height);
                  }}
                >
                  {height}
                </Button>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Select
            displayEmpty
            value={textAlign}
            onChange={(event) => setTextAlign(event.target.value)}
            input={<OutlinedInput />}
            renderValue={() => {
              if (textAlign === 'left') {
                return <span>Text Align</span>;
              }
              return <span>{textAlign}</span>;
            }}
          >
            <MenuItem disabled value="initial">
              <span>Text Align</span>
            </MenuItem>
            {textAligns.map((align, index) => (
              <MenuItem key={index.toString()} value="align">
                <Button
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleSelect(editor, 'textAlignSelect', align);
                  }}
                >
                  {align}
                </Button>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underline" />
        <MarkButton format="strikethrough" icon="format_strikethrough" />
        <MarkButton format="code" icon="format_code" />
        <BlockButton format="heading-one" icon="format_h1" />
        <BlockButton format="heading-two" icon="format_h2" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_numbered_list" />
        <BlockButton format="bulleted-list" icon="format_bulleted_list" />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="✨Tell me 💖✍🏻, what are you thinking about right now..? 🧚🏼‍♀️🌈✨"
        spellCheck
        autoFocus
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

Element.propTypes = {
  attributes: PropTypes.objectOf(),
  children: PropTypes.node,
  element: PropTypes.objectOf(),
};

LeafContainer.propTypes = {
  attributes: PropTypes.objectOf(),
  children: PropTypes.node,
};

Leaf.propTypes = {
  children: PropTypes.node,
  leaf: PropTypes.objectOf(),
};

BlockButton.propTypes = {
  format: PropTypes.string,
  icon: PropTypes.string,
};

MarkButton.propTypes = {
  format: PropTypes.string,
  icon: PropTypes.string,
};

export default RichTextEditor;
