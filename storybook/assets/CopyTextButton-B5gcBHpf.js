import{j as t}from"./jsx-runtime-CvpxdxdE.js";import{u as x,d as b}from"./useCopyToClipboard-DNK1GXOu.js";import{r as n}from"./index-DSHF18-l.js";import{c as h}from"./translation-B5WnxnAy.js";import{T}from"./Tooltip-k9rQqLX7.js";import{I as y}from"./IconButton-2jf7y2dB.js";import{u as C}from"./useTranslationRef-m705PC51.js";import{u as k}from"./ApiRef-DDVPwL0h.js";import{e as w}from"./TranslationApi-NYdUF01F.js";function g(a){const{t:i}=C(h),{text:s,tooltipDelay:p=1e3,tooltipText:l=i("copyTextButton.tooltipText"),"aria-label":c="Copy text"}=a,o=k(w),[u,r]=n.useState(!1),[{error:e},m]=x();n.useEffect(()=>{e&&o.post(e)},[e,o]);const f=d=>{d.stopPropagation(),r(!0),m(s)};return t.jsx(t.Fragment,{children:t.jsx(T,{id:"copy-test-tooltip",title:l,placement:"top",leaveDelay:p,onClose:()=>r(!1),open:u,children:t.jsx(y,{onClick:f,"aria-label":c,children:t.jsx(b,{})})})})}g.__docgenInfo={description:`Copy text button with visual feedback

@public
@remarks

Visual feedback takes form of:
 - a hover color
 - click ripple
 - Tooltip shown when user has clicked

@example

\`\`\`
<CopyTextButton
  text="My text that I want to be copied to the clipboard"
  arial-label="Accessible label for this button" />
\`\`\``,methods:[],displayName:"CopyTextButton",props:{text:{required:!0,tsType:{name:"string"},description:"The text to be copied"},tooltipDelay:{required:!1,tsType:{name:"number"},description:`Number of milliseconds that the tooltip is shown

@remarks

Default: 1000`},tooltipText:{required:!1,tsType:{name:"string"},description:`Text to show in the tooltip when user has clicked the button

@remarks

Default: "Text copied to clipboard"`},"aria-label":{required:!1,tsType:{name:"string"},description:`Text to use as aria-label prop on the button

@remarks

Default: "Copy text"`}}};export{g as C};
