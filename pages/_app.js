import { useEffect } from 'react';
import hljs from 'highlight.js/lib/core';
import go from 'highlight.js/lib/languages/go';
import r from 'highlight.js/lib/languages/r';

import 'animate.css/animate.min.css';
import 'highlight.js/styles/github.css';
import "tailwindcss/tailwind.css";
import '@styles/globals.css';

// Register more languages as needed
hljs.registerLanguage('go', go);
hljs.registerLanguage('r', r);

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Highlight all multiline code blocks
    document.querySelectorAll('pre > code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  });
  return <Component {...pageProps} />
}

export default MyApp
