import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import breaks from 'remark-breaks';
import DOMPurify from 'dompurify';
import useInput from './hooks/useInput';
import usePrevious from './hooks/usePrevious';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism, okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme);

  const { input, setInput, clear, reset } = useInput();

  const clean = DOMPurify.sanitize(input);
  if (DOMPurify.removed.length > 0) {
    console.log('Data removed by dompurify: ');
    DOMPurify.removed.forEach((item) => console.dir(item));
  }

  const prevInput = usePrevious(input);

  const Highlighted = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const inlineProps = (inline || !match) && {
        PreTag: 'span',
        language: 'html',
        // useInlineStyles: false,
        customStyle: {
          padding: '2px 0px',
          margin: 'none',
          fontSize: '14px',
          backgroundColor: theme === 'light' ? '#fafafa' : '#202020',
        },
      };
      return (
        <SyntaxHighlighter
          style={theme === 'dark' ? okaidia : prism}
          language={match ? match[1] : 'javascript'}
          PreTag='div'
          wrapLongLines
          customStyle={{
            fontSize: '14px',
            backgroundColor: theme === 'light' ? '#fafafa' : '#202020',
          }}
          {...props}
          {...inlineProps}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    },
  };

  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current.focus();
  }, []);

  return (
    <div id='main'>
      <div id='editor-container'>
        <textarea
          rows='50'
          cols='50'
          id='editor'
          placeholder={`Input markdown...`}
          type='text'
          value={input !== undefined ? input : ''}
          onChange={(e) => {
            const { value } = e.target;
            setInput(value);
            localStorage.setItem('input', value);
          }}
          ref={editorRef}
        />
        <div id='buttons'>
          <button onClick={clear}>Clear</button>
          <button onClick={() => setInput(prevInput)}>Restore</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
      <div
        style={input === '' || input === undefined ? { border: 'none' } : null}
        id='preview'
      >
        <ReactMarkdown
          components={Highlighted}
          remarkPlugins={[gfm, breaks]}
          children={clean}
        />
      </div>
      <div
        id='theme-switch'
        onClick={() => {
          const documentTheme = document.documentElement.dataset.theme;
          if (documentTheme === 'light') {
            setTheme('dark');
            document.documentElement.dataset.theme = 'dark';
            localStorage.setItem('theme', 'dark');
          } else if (documentTheme === 'dark') {
            setTheme('light');
            document.documentElement.dataset.theme = 'light';
            localStorage.setItem('theme', 'light');
          }
        }}
      ></div>
    </div>
  );
}

export default App;
