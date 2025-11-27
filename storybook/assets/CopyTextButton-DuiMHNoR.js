import{k as m,n as b,r as a,j as e,I as h,l as T,Q as y}from"./iframe-B6vHPHUS.js";import{u as C,C as k}from"./useCopyToClipboard-DyRiVU--.js";import{T as w}from"./Tooltip-BKT0sHqR.js";function g(s){const{t:r}=m(T),{text:i,tooltipDelay:l=1e3,tooltipText:p=r("copyTextButton.tooltipText"),"aria-label":c="Copy text"}=s,o=b(y),[u,n]=a.useState(!1),[{error:t},d]=C();a.useEffect(()=>{t&&o.post(t)},[t,o]);const x=f=>{f.stopPropagation(),n(!0),d(i)};return e.jsx(e.Fragment,{children:e.jsx(w,{id:"copy-test-tooltip",title:p,placement:"top",leaveDelay:l,onClose:()=>n(!1),open:u,children:e.jsx(h,{onClick:x,"aria-label":c,children:e.jsx(k,{})})})})}g.__docgenInfo={description:`Copy text button with visual feedback

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
