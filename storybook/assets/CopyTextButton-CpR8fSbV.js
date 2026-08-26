import{cW as x,cA as T,c8 as t,bQ as o,aQ as b,bj as h}from"./iframe-Zd-YI-2K.js";import{u as y,C}from"./useCopyToClipboard-n6dvNEJd.js";import{a as k,T as g}from"./Tooltip-CfbQy97v.js";import{B as w}from"./ButtonIcon-8KnJDrRQ.js";function j(a){const{t:i}=x(b),{text:p,tooltipDelay:l=1e3,tooltipText:c=i("copyTextButton.tooltipText"),"aria-label":u="Copy text"}=a,s=T(h),[f,n]=t.useState(!1),[{error:r},m]=y(),e=t.useRef(null);t.useEffect(()=>{r&&s.post(r)},[r,s]);const d=()=>{e.current&&clearTimeout(e.current),n(!0),m(p),e.current=setTimeout(()=>{n(!1)},l)};return t.useEffect(()=>()=>{e.current&&clearTimeout(e.current)},[]),o.jsxs(k,{isOpen:f,onOpenChange:n,children:[o.jsx(w,{icon:o.jsx(C,{}),onPress:d,"aria-label":u}),o.jsx(g,{children:c})]})}j.__docgenInfo={description:`Copy text button with visual feedback

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

Default: "Copy text"`}}};export{j as C};
