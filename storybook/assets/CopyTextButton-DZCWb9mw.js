import{U as h,W as b,r as t,j as o,V as y,X as C}from"./iframe-SQ-DrL5X.js";import{u as k,C as v}from"./useCopyToClipboard-C4mcqumo.js";import{T as w,a as B}from"./Tooltip-pye6v7I6.js";import{B as g}from"./ButtonIcon-DSZd6VxV.js";function j(s){const{t:i}=h(y),{text:p,tooltipDelay:l=1e3,tooltipText:c=i("copyTextButton.tooltipText"),"aria-label":u="Copy text",variant:f}=s,a=b(C),[m,n]=t.useState(!1),[{error:r},d]=k(),e=t.useRef(null);t.useEffect(()=>{r&&a.post(r)},[r,a]);const T=()=>{e.current&&clearTimeout(e.current),n(!0),d(p),e.current=setTimeout(()=>{n(!1)},l)};return t.useEffect(()=>()=>{e.current&&clearTimeout(e.current)},[]),o.jsxs(w,{isOpen:m,onOpenChange:x=>{x||n(!1)},children:[o.jsx(g,{icon:o.jsx(v,{}),onPress:T,"aria-label":u,variant:f}),o.jsx(B,{children:c})]})}j.__docgenInfo={description:`Copy text button with visual feedback

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

Default: "Copy text"`},variant:{required:!1,tsType:{name:"ButtonIconProps['variant']",raw:"ButtonIconProps['variant']"},description:`The visual variant of the button

@remarks

Default: "primary"`}}};export{j as C};
