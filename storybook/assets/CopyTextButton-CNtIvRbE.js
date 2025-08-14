import{j as t}from"./jsx-runtime-hv06LKfz.js";import{u as x,C as b}from"./useCopyToClipboard-Bz0ScI6A.js";import{r}from"./index-D8-PC79C.js";import{c as h}from"./translation-BlsjZX4-.js";import{T}from"./Tooltip-fGAyvfC5.js";import{I as y}from"./IconButton-tgA3biVt.js";import{u as C}from"./useTranslationRef-DKy5gnX5.js";import{u as k}from"./ApiRef-ByCJBjX1.js";import{e as w}from"./TranslationApi-CV0OlCW4.js";function g(a){const{t:i}=C(h),{text:s,tooltipDelay:p=1e3,tooltipText:l=i("copyTextButton.tooltipText"),"aria-label":c="Copy text"}=a,o=k(w),[m,n]=r.useState(!1),[{error:e},u]=x();r.useEffect(()=>{e&&o.post(e)},[e,o]);const f=d=>{d.stopPropagation(),n(!0),u(s)};return t.jsx(t.Fragment,{children:t.jsx(T,{id:"copy-test-tooltip",title:l,placement:"top",leaveDelay:p,onClose:()=>n(!1),open:m,children:t.jsx(y,{onClick:f,"aria-label":c,children:t.jsx(b,{})})})})}g.__docgenInfo={description:`Copy text button with visual feedback

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
