import{cW as T,cA as b,c8 as t,bQ as o,aQ as h,bj as y}from"./iframe-CLUDVQ5J.js";import{u as C,C as k}from"./useCopyToClipboard-DNcv9faM.js";import{a as g,T as w}from"./Tooltip-BgYCttf5.js";import{B as j}from"./ButtonIcon-oVA306rU.js";function B(a){const{t:i}=T(h),{text:l,tooltipDelay:p=1e3,tooltipText:c=i("copyTextButton.tooltipText"),"aria-label":u="Copy text"}=a,s=b(y),[f,n]=t.useState(!1),[{error:r},m]=C(),e=t.useRef(null);t.useEffect(()=>{r&&s.post(r)},[r,s]);const d=()=>{e.current&&clearTimeout(e.current),n(!0),m(l),e.current=setTimeout(()=>{n(!1)},p)};return t.useEffect(()=>()=>{e.current&&clearTimeout(e.current)},[]),o.jsxs(g,{isOpen:f,onOpenChange:x=>{x||n(!1)},children:[o.jsx(j,{icon:o.jsx(k,{}),onPress:d,"aria-label":u}),o.jsx(w,{children:c})]})}B.__docgenInfo={description:`Copy text button with visual feedback

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

Default: "Copy text"`}}};export{B as C};
