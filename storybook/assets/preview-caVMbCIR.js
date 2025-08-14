const{STORY_CHANGED:r}=__STORYBOOK_MODULE_CORE_EVENTS__,{addons:s}=__STORYBOOK_MODULE_PREVIEW_API__,{global:O}=__STORYBOOK_MODULE_GLOBAL__;var n="storybook/highlight",d="storybookHighlight",g=`${n}/add`,E=`${n}/reset`,{document:_}=O,H=(e="#FF4785",t="dashed")=>`
  outline: 2px ${t} ${e};
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(255,255,255,0.6);
`,l=s.getChannel(),T=e=>{let t=d;h();let i=Array.from(new Set(e.elements)),o=_.createElement("style");o.setAttribute("id",t),o.innerHTML=i.map(a=>`${a}{
          ${H(e.color,e.style)}
         }`).join(" "),_.head.appendChild(o)},h=()=>{let e=d,t=_.getElementById(e);t&&t.parentNode?.removeChild(t)};l.on(r,h);l.on(E,h);l.on(g,T);
