import React, { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import breaks from "remark-breaks";
import DOMPurify from "dompurify";
import useInput from "./Hooks/Input";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  vs2015,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

function App() {
  const { input, setInput, reset } = useInput();
  const [btnTrigger, setbtnTrigger] = useState(false);

  const clean = DOMPurify.sanitize(input);
  console.log("Data removed by dompurify: " + DOMPurify.removed);

  const prevInputRef = useRef();
  useEffect(() => {
    prevInputRef.current = input;
  });
  const prevInput = prevInputRef.current;

  const btnClass = btnTrigger ? "dark" : "light";
  const elements = useRef();
  useEffect(() => {
    if (document.querySelector("body")) {
      elements.current = document.querySelector("body");
      elements.current.style.backgroundColor =
        btnClass === "light" ? "" : "#202020";
    }
  });

  const renderers = {
    code: ({ language, value }) => {
      return (
        <SyntaxHighlighter
          style={btnClass === "dark" ? vs2015 : atomOneLight}
          language="javascript"
          children={value}
        />
      );
    },
    inlineCode: ({ language, value }) => {
      return (
        <SyntaxHighlighter
          style={btnClass === "dark" ? vs2015 : atomOneLight}
          language="htmlbars"
          children={value}
        />
      );
    },
  };

  var addRule = (function (style) {
    var sheet = document.head.appendChild(style).sheet;
    return function (selector, css) {
      var propText = Object.keys(css)
        .map(function (p) {
          return p + ":" + css[p];
        })
        .join(";");
      sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
    };
  })(document.createElement("style"));
  addRule(
    "a",
    btnClass === "light"
      ? {
          color: "blue",
        }
      : { color: "#a2c0ff" }
  );
  addRule(
    "a:visited",
    btnClass === "light"
      ? {
          color: "#551a8b",
        }
      : { color: "#cfcff9" }
  );

  return (
    <>
      <div id="main" className={btnClass}>
        <div>
          <textarea
            rows="50"
            cols="50"
            id="editor"
            className={btnClass}
            placeholder="input data"
            type="text"
            value={input !== undefined ? input : ""}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div id="buttons" className={btnClass}>
          <button className={btnClass} onClick={reset}>
            Reset
          </button>
          <button className={btnClass} onClick={() => setInput(prevInput)}>
            Restore
          </button>
        </div>
        <div
          style={
            input === "" || input === undefined ? { border: "none" } : null
          }
          id="preview"
          className={btnClass}
        >
          <ReactMarkdown
            renderers={renderers}
            plugins={[gfm, breaks]}
            children={clean}
          />
        </div>
      </div>
      <div
        id="theme-switch"
        className={btnClass}
        onClick={() => setbtnTrigger(!btnTrigger)}
      >
        <div id="theme-switch-inner" className={btnClass}></div>
      </div>
    </>
  );
}

export default App;
