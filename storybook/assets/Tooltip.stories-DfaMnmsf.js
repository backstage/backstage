import{a2 as p,al as K,r as s,j as c,a5 as Z}from"./iframe-C9MahRWh.js";import{d as Y,b as z,c as G,e as J,a as Q,f as X,$ as ee}from"./OverlayArrow-3A2vqwi_.js";import{e as te,$ as oe,a as re}from"./utils-CihhLEPA.js";import{f as ne,$ as I,b as ae}from"./useObjectRef-ZyJjxF3k.js";import{a as H,$ as ie,u as le,j as se,x as ce}from"./useFocusable-BxBTINdj.js";import{$ as k}from"./useFocusRing-h-EBRLdi.js";import{c as _}from"./clsx-B-dksMZM.js";import{u as ue}from"./useStyles-dPvM8hXG.js";import{B as A}from"./Button-BVU-PQZH.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-Cs6MCcdk.js";import"./Label-BOqyD8Cj.js";import"./Hidden-Cxji9ok1.js";import"./useLabel-6F2fj9na.js";import"./useLabels-Bh8yyRcA.js";import"./context-DKtu6Y3b.js";import"./useButton-BqQfga0C.js";import"./usePress-D3t2rjAm.js";import"./useControlledState-DAZtEiJa.js";import"./index-xrcBWgHF.js";import"./Button.module-DkEJAzA0.js";import"./useSurface-CzmEEkbu.js";const j=p.createContext(null);function pe(e){let{children:o}=e,t=s.useContext(j),[r,i]=s.useState(0),l=s.useMemo(()=>({parent:t,modalCount:r,addModal(){i(n=>n+1),t&&t.addModal()},removeModal(){i(n=>n-1),t&&t.removeModal()}}),[t,r]);return p.createElement(j.Provider,{value:l},o)}function de(){let e=s.useContext(j);return{modalProviderProps:{"aria-hidden":e&&e.modalCount>0?!0:void 0}}}function me(e){let{modalProviderProps:o}=de();return p.createElement("div",{"data-overlay-container":!0,...e,...o})}function fe(e){return p.createElement(pe,null,p.createElement(me,e))}function $e(e){let o=ne(),{portalContainer:t=o?null:document.body,...r}=e,{getContainer:i}=Y();if(!e.portalContainer&&i&&(t=i()),p.useEffect(()=>{if(t?.closest("[data-overlay-container]"))throw new Error("An OverlayContainer must not be inside another container. Please change the portalContainer prop.")},[t]),!t)return null;let l=p.createElement(fe,r);return K.createPortal(l,t)}function be(e,o){let t=H(e,{labelable:!0}),{hoverProps:r}=k({onHoverStart:()=>o?.open(!0),onHoverEnd:()=>o?.close()});return{tooltipProps:I(t,r,{role:"tooltip"})}}function ge(e,o,t){let{isDisabled:r,trigger:i}=e,l=ae(),n=s.useRef(!1),a=s.useRef(!1),d=()=>{(n.current||a.current)&&o.open(a.current)},$=B=>{!n.current&&!a.current&&o.close(B)};s.useEffect(()=>{let B=N=>{t&&t.current&&N.key==="Escape"&&(N.stopPropagation(),o.close(!0))};if(o.isOpen)return document.addEventListener("keydown",B,!0),()=>{document.removeEventListener("keydown",B,!0)}},[t,o]);let O=()=>{i!=="focus"&&(le()==="pointer"?n.current=!0:n.current=!1,d())},E=()=>{i!=="focus"&&(a.current=!1,n.current=!1,$())},C=()=>{a.current=!1,n.current=!1,$(!0)},L=()=>{se()&&(a.current=!0,d())},m=()=>{a.current=!1,n.current=!1,$(!0)},{hoverProps:U}=k({isDisabled:r,onHoverStart:O,onHoverEnd:E}),{focusableProps:V}=ie({isDisabled:r,onFocus:L,onBlur:m},t);return{triggerProps:{"aria-describedby":o.isOpen?l:void 0,...I(V,U,{onPointerDown:C,onKeyDown:C}),tabIndex:void 0},tooltipProps:{id:l}}}const Te=1500,M=500;let h={},xe=0,w=!1,f=null,v=null;function W(e={}){let{delay:o=Te,closeDelay:t=M}=e,{isOpen:r,open:i,close:l}=z(e),n=s.useMemo(()=>`${++xe}`,[]),a=s.useRef(null),d=s.useRef(l),$=()=>{h[n]=C},O=()=>{for(let m in h)m!==n&&(h[m](!0),delete h[m])},E=()=>{a.current&&clearTimeout(a.current),a.current=null,O(),$(),w=!0,i(),f&&(clearTimeout(f),f=null),v&&(clearTimeout(v),v=null)},C=m=>{m||t<=0?(a.current&&clearTimeout(a.current),a.current=null,d.current()):a.current||(a.current=setTimeout(()=>{a.current=null,d.current()},t)),f&&(clearTimeout(f),f=null),w&&(v&&clearTimeout(v),v=setTimeout(()=>{delete h[n],v=null,w=!1},Math.max(M,t)))},L=()=>{O(),$(),!r&&!f&&!w?f=setTimeout(()=>{f=null,w=!0,E()},o):r||E()};return s.useEffect(()=>{d.current=l},[l]),s.useEffect(()=>()=>{a.current&&clearTimeout(a.current),h[n]&&delete h[n]},[n]),{isOpen:r,open:m=>{!m&&o>0&&!a.current?L():E()},close:C}}const S=s.createContext(null),F=s.createContext(null);function ye(e){let o=W(e),t=s.useRef(null),{triggerProps:r,tooltipProps:i}=ge(e,o,t);return p.createElement(te,{values:[[S,o],[F,{...i,triggerRef:t}]]},p.createElement(ce,{...r,ref:t},e.children))}const he=s.forwardRef(function({UNSTABLE_portalContainer:o,...t},r){[t,r]=oe(t,r,F);let i=s.useContext(S),l=W(t),n=t.isOpen!=null||t.defaultOpen!=null||!i?l:i,a=G(r,n.isOpen)||t.isExiting||!1;return!n.isOpen&&!a?null:p.createElement($e,{portalContainer:o},p.createElement(ve,{...t,tooltipRef:r,isExiting:a}))});function ve(e){let o=s.useContext(S),t=s.useRef(null),{overlayProps:r,arrowProps:i,placement:l,triggerAnchorPoint:n}=J({placement:e.placement||"top",targetRef:e.triggerRef,overlayRef:e.tooltipRef,arrowRef:t,offset:e.offset,crossOffset:e.crossOffset,isOpen:o.isOpen,arrowBoundaryOffset:e.arrowBoundaryOffset,shouldFlip:e.shouldFlip,containerPadding:e.containerPadding,onClose:()=>o.close(!0)}),a=Q(e.tooltipRef,!!l)||e.isEntering||!1,d=re({...e,defaultClassName:"react-aria-Tooltip",values:{placement:l,isEntering:a,isExiting:e.isExiting,state:o}});e=I(e,r);let{tooltipProps:$}=be(e,o),O=H(e,{global:!0});return p.createElement("div",{...I(O,d,$),ref:e.tooltipRef,style:{...r.style,"--trigger-anchor-point":n?`${n.x}px ${n.y}px`:void 0,...d.style},"data-placement":l??void 0,"data-entering":a||void 0,"data-exiting":e.isExiting||void 0},p.createElement(X.Provider,{value:{...i,placement:l,ref:t}},d.children))}const De={classNames:{tooltip:"bui-Tooltip",arrow:"bui-TooltipArrow"}},q={"bui-Tooltip":"_bui-Tooltip_10vkn_20","bui-TooltipArrow":"_bui-TooltipArrow_10vkn_65"},R=e=>{const{delay:o=600}=e;return c.jsx(ye,{delay:o,...e})},D=s.forwardRef((e,o)=>{const{classNames:t,cleanedProps:r}=ue(De,e),{className:i,children:l,...n}=r;return c.jsxs(he,{className:_(t.tooltip,q[t.tooltip],i),...n,ref:o,children:[c.jsx(ee,{className:_(t.arrow,q[t.arrow]),children:c.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[c.jsx("path",{d:"M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z"}),c.jsx("path",{d:"M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})]})}),l]})});D.displayName="Tooltip";R.__docgenInfo={description:"@public",methods:[],displayName:"TooltipTrigger"};D.__docgenInfo={description:"@public",methods:[],displayName:"Tooltip",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["Omit"]};const P=Z.meta({title:"Backstage UI/Tooltip",component:R,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:e,isOpen:o,isDisabled:t,delay:r,closeDelay:i})=>c.jsxs(R,{isOpen:o,isDisabled:t,delay:r,closeDelay:i,children:[c.jsx(A,{children:"Button"}),c.jsx(D,{children:e??"I am a tooltip"})]})}),u=P.story({args:{children:"I am a tooltip"}}),b=P.story({args:{...u.input.args,isOpen:!0}}),g=P.story({args:{...u.input.args,isDisabled:!0}}),T=P.story({args:{...u.input.args,delay:0,closeDelay:0}}),x=P.story({parameters:{controls:{exclude:["placement"]}},args:{...u.input.args,isOpen:!0},render:({isOpen:e,children:o})=>c.jsxs(R,{isOpen:e,children:[c.jsx(A,{children:"Button"}),c.jsx(D,{placement:"top",children:o}),c.jsx(D,{placement:"right",children:o}),c.jsx(D,{placement:"bottom",children:o}),c.jsx(D,{placement:"left",children:o})]})}),y=P.story({args:{...u.input.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}});u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const Default = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
  <TooltipTrigger
    isOpen={isOpen}
    isDisabled={isDisabled}
    delay={delay}
    closeDelay={closeDelay}
  >
    <Button>Button</Button>
    <Tooltip>{children ?? "I am a tooltip"}</Tooltip>
  </TooltipTrigger>
);
`,...u.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const IsOpen = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
  <TooltipTrigger
    isOpen={isOpen}
    isDisabled={isDisabled}
    delay={delay}
    closeDelay={closeDelay}
  >
    <Button>Button</Button>
    <Tooltip>{children ?? "I am a tooltip"}</Tooltip>
  </TooltipTrigger>
);
`,...b.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const IsDisabled = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
  <TooltipTrigger
    isOpen={isOpen}
    isDisabled={isDisabled}
    delay={delay}
    closeDelay={closeDelay}
  >
    <Button>Button</Button>
    <Tooltip>{children ?? "I am a tooltip"}</Tooltip>
  </TooltipTrigger>
);
`,...g.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{code:`const NoDelays = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
  <TooltipTrigger
    isOpen={isOpen}
    isDisabled={isDisabled}
    delay={delay}
    closeDelay={closeDelay}
  >
    <Button>Button</Button>
    <Tooltip>{children ?? "I am a tooltip"}</Tooltip>
  </TooltipTrigger>
);
`,...T.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const OrthogonalPlacements = ({ isOpen, children }) => {
  return (
    <TooltipTrigger isOpen={isOpen}>
      <Button>Button</Button>
      <Tooltip placement="top">{children}</Tooltip>
      <Tooltip placement="right">{children}</Tooltip>
      <Tooltip placement="bottom">{children}</Tooltip>
      <Tooltip placement="left">{children}</Tooltip>
    </TooltipTrigger>
  );
};
`,...x.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const WithLongText = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
  <TooltipTrigger
    isOpen={isOpen}
    isDisabled={isDisabled}
    delay={delay}
    closeDelay={closeDelay}
  >
    <Button>Button</Button>
    <Tooltip>{children ?? "I am a tooltip"}</Tooltip>
  </TooltipTrigger>
);
`,...y.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'I am a tooltip'
  }
})`,...u.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isOpen: true
  }
})`,...b.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...g.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    delay: 0,
    closeDelay: 0
  }
})`,...T.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  parameters: {
    controls: {
      exclude: ['placement']
    }
  },
  args: {
    ...Default.input.args,
    isOpen: true
  },
  render: ({
    isOpen,
    children
  }) => {
    return <TooltipTrigger isOpen={isOpen}>
        <Button>Button</Button>
        <Tooltip placement="top">{children}</Tooltip>
        <Tooltip placement="right">{children}</Tooltip>
        <Tooltip placement="bottom">{children}</Tooltip>
        <Tooltip placement="left">{children}</Tooltip>
      </TooltipTrigger>;
  }
})`,...x.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isOpen: true,
    children: 'I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
})`,...y.input.parameters?.docs?.source}}};const Ke=["Default","IsOpen","IsDisabled","NoDelays","OrthogonalPlacements","WithLongText"];export{u as Default,g as IsDisabled,b as IsOpen,T as NoDelays,x as OrthogonalPlacements,y as WithLongText,Ke as __namedExportsOrder};
