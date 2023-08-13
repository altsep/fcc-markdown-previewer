import { useState } from 'react';

export default function useInput() {
  const [input, setInput] = useState(
    localStorage.getItem('altsep_markdown-previewer_input') || defaultText
  );

  return {
    input,
    setInput,
    clear: () => setInput(''),
    reset: () => {
      setInput(defaultText);
      localStorage.removeItem('altsep_markdown-previewer_input');
    },
  };
}

const defaultText = `\`// Input gets sanitized by DOMPurify before being rendered and therefore may not be displayed correctly\`

# Welcome to my markdown previewer!

## Sub-heading...
### Other things:

Inline code: \`<div class='class'></div>\`

\`\`\`js
// Multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

**Bold text**

_Italic text_

**_Both at once_**

~~Line-through~~

[Url](https://www.freecodecamp.com)

> Block quote

Table:

H0 | H1 | H2
00 | 10 | 90
AA | CC | FF

- List
- Bulleted list
   - X
      - Y
        - Z

1. Numbererd list.
1. Q
1. W
1. E

![React Logo](https://i.imgur.com/Gq2XDWR.png)
`;
