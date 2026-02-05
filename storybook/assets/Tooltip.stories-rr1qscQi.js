import{R as d,ak as Z,r as s,j as u,p as Y}from"./iframe-M9O-K8SB.js";import{b as z,a as G,c as J,d as Q,$ as X}from"./OverlayArrow-CcKR7RW9.js";import{e as ee,$ as te,a as oe}from"./utils-BXllfVt4.js";import{e as re,$ as R,a as ne}from"./useObjectRef-BPFp5snO.js";import{$ as H,a as ae,y as ie,o as le,C as se}from"./useFocusable-BwFERnd_.js";import{a as ce,$ as ue}from"./animation-D5pTcXzL.js";import{$ as k}from"./useFocusRing-COnCKKka.js";import{c as _}from"./clsx-B-dksMZM.js";import{u as pe}from"./useStyles-BRwt6BXn.js";import{B as A}from"./Button-BbTpZl37.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-Dkbd3KcU.js";import"./Label-o9S_v-xF.js";import"./Hidden-DTd05gNK.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./context-Bv6kxITJ.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./useControlledState-DzBnLbpE.js";import"./index-BKJKY9Wv.js";import"./defineComponent-BmABoWOu.js";import"./useSurface-CJaN3YoD.js";const j=d.createContext(null);function de(e){let{children:o}=e,t=s.useContext(j),[r,i]=s.useState(0),l=s.useMemo(()=>({parent:t,modalCount:r,addModal(){i(a=>a+1),t&&t.addModal()},removeModal(){i(a=>a-1),t&&t.removeModal()}}),[t,r]);return d.createElement(j.Provider,{value:l},o)}function me(){let e=s.useContext(j);return{modalProviderProps:{"aria-hidden":e&&e.modalCount>0?!0:void 0}}}function fe(e){let{modalProviderProps:o}=me();return d.createElement("div",{"data-overlay-container":!0,...e,...o})}function $e(e){return d.createElement(de,null,d.createElement(fe,e))}function be(e){let o=re(),{portalContainer:t=o?null:document.body,...r}=e,{getContainer:i}=z();if(!e.portalContainer&&i&&(t=i()),d.useEffect(()=>{if(t?.closest("[data-overlay-container]"))throw new Error("An OverlayContainer must not be inside another container. Please change the portalContainer prop.")},[t]),!t)return null;let l=d.createElement($e,r);return Z.createPortal(l,t)}function ge(e,o){let t=H(e,{labelable:!0}),{hoverProps:r}=k({onHoverStart:()=>o?.open(!0),onHoverEnd:()=>o?.close()});return{tooltipProps:R(t,r,{role:"tooltip"})}}function Te(e,o,t){let{isDisabled:r,trigger:i,shouldCloseOnPress:l=!0}=e,a=ne(),n=s.useRef(!1),c=s.useRef(!1),h=()=>{(n.current||c.current)&&o.open(c.current)},$=E=>{!n.current&&!c.current&&o.close(E)};s.useEffect(()=>{let E=N=>{t&&t.current&&N.key==="Escape"&&(N.stopPropagation(),o.close(!0))};if(o.isOpen)return document.addEventListener("keydown",E,!0),()=>{document.removeEventListener("keydown",E,!0)}},[t,o]);let C=()=>{i!=="focus"&&(ie()==="pointer"?n.current=!0:n.current=!1,h())},w=()=>{i!=="focus"&&(c.current=!1,n.current=!1,$())},I=()=>{l&&(c.current=!1,n.current=!1,$(!0))},m=()=>{le()&&(c.current=!0,h())},U=()=>{c.current=!1,n.current=!1,$(!0)},{hoverProps:V}=k({isDisabled:r,onHoverStart:C,onHoverEnd:w}),{focusableProps:K}=ae({isDisabled:r,onFocus:m,onBlur:U},t);return{triggerProps:{"aria-describedby":o.isOpen?a:void 0,...R(K,V,{onPointerDown:I,onKeyDown:I}),tabIndex:void 0},tooltipProps:{id:a}}}const ye=1500,M=500;let D={},xe=0,B=!1,f=null,v=null;function W(e={}){let{delay:o=ye,closeDelay:t=M}=e,{isOpen:r,open:i,close:l}=G(e),a=s.useMemo(()=>`${++xe}`,[]),n=s.useRef(null),c=s.useRef(l),h=()=>{D[a]=w},$=()=>{for(let m in D)m!==a&&(D[m](!0),delete D[m])},C=()=>{n.current&&clearTimeout(n.current),n.current=null,$(),h(),B=!0,i(),f&&(clearTimeout(f),f=null),v&&(clearTimeout(v),v=null)},w=m=>{m||t<=0?(n.current&&clearTimeout(n.current),n.current=null,c.current()):n.current||(n.current=setTimeout(()=>{n.current=null,c.current()},t)),f&&(clearTimeout(f),f=null),B&&(v&&clearTimeout(v),v=setTimeout(()=>{delete D[a],v=null,B=!1},Math.max(M,t)))},I=()=>{$(),h(),!r&&!f&&!B?f=setTimeout(()=>{f=null,B=!0,C()},o):r||C()};return s.useEffect(()=>{c.current=l},[l]),s.useEffect(()=>()=>{n.current&&clearTimeout(n.current),D[a]&&delete D[a]},[a]),{isOpen:r,open:m=>{!m&&o>0&&!n.current?I():C()},close:w}}const S=s.createContext(null),F=s.createContext(null);function he(e){let o=W(e),t=s.useRef(null),{triggerProps:r,tooltipProps:i}=Te(e,o,t);return d.createElement(ee,{values:[[S,o],[F,{...i,triggerRef:t}]]},d.createElement(se,{...r,ref:t},e.children))}const De=s.forwardRef(function({UNSTABLE_portalContainer:o,...t},r){[t,r]=te(t,r,F);let i=s.useContext(S),l=W(t),a=t.isOpen!=null||t.defaultOpen!=null||!i?l:i,n=ce(r,a.isOpen)||t.isExiting||!1;return!a.isOpen&&!n?null:d.createElement(be,{portalContainer:o},d.createElement(ve,{...t,tooltipRef:r,isExiting:n}))});function ve(e){let o=s.useContext(S),t=s.useRef(null),{overlayProps:r,arrowProps:i,placement:l,triggerAnchorPoint:a}=J({placement:e.placement||"top",targetRef:e.triggerRef,overlayRef:e.tooltipRef,arrowRef:t,offset:e.offset,crossOffset:e.crossOffset,isOpen:o.isOpen,arrowBoundaryOffset:e.arrowBoundaryOffset,shouldFlip:e.shouldFlip,containerPadding:e.containerPadding,onClose:()=>o.close(!0)}),n=ue(e.tooltipRef,!!l)||e.isEntering||!1,c=oe({...e,defaultClassName:"react-aria-Tooltip",values:{placement:l,isEntering:n,isExiting:e.isExiting,state:o}});e=R(e,r);let{tooltipProps:h}=ge(e,o),$=H(e,{global:!0});return d.createElement("div",{...R($,c,h),ref:e.tooltipRef,style:{...r.style,"--trigger-anchor-point":a?`${a.x}px ${a.y}px`:void 0,...c.style},"data-placement":l??void 0,"data-entering":n||void 0,"data-exiting":e.isExiting||void 0},d.createElement(Q.Provider,{value:{...i,placement:l,ref:t}},c.children))}const Oe={classNames:{tooltip:"bui-Tooltip",arrow:"bui-TooltipArrow"}},q={"bui-Tooltip":"_bui-Tooltip_1imcg_20","bui-TooltipArrow":"_bui-TooltipArrow_1imcg_65"},L=e=>{const{delay:o=600}=e;return u.jsx(he,{delay:o,...e})},O=s.forwardRef((e,o)=>{const{classNames:t,cleanedProps:r}=pe(Oe,e),{className:i,children:l,...a}=r;return u.jsxs(De,{className:_(t.tooltip,q[t.tooltip],i),...a,ref:o,children:[u.jsx(X,{className:_(t.arrow,q[t.arrow]),children:u.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[u.jsx("path",{d:"M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z"}),u.jsx("path",{d:"M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})]})}),l]})});O.displayName="Tooltip";L.__docgenInfo={description:"@public",methods:[],displayName:"TooltipTrigger"};O.__docgenInfo={description:"@public",methods:[],displayName:"Tooltip",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["Omit"]};const P=Y.meta({title:"Backstage UI/Tooltip",component:L,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:e,isOpen:o,isDisabled:t,delay:r,closeDelay:i})=>u.jsxs(L,{isOpen:o,isDisabled:t,delay:r,closeDelay:i,children:[u.jsx(A,{children:"Button"}),u.jsx(O,{children:e??"I am a tooltip"})]})}),p=P.story({args:{children:"I am a tooltip"}}),b=P.story({args:{...p.input.args,isOpen:!0}}),g=P.story({args:{...p.input.args,isDisabled:!0}}),T=P.story({args:{...p.input.args,delay:0,closeDelay:0}}),y=P.story({parameters:{controls:{exclude:["placement"]}},args:{...p.input.args,isOpen:!0},render:({isOpen:e,children:o})=>u.jsxs(L,{isOpen:e,children:[u.jsx(A,{children:"Button"}),u.jsx(O,{placement:"top",children:o}),u.jsx(O,{placement:"right",children:o}),u.jsx(O,{placement:"bottom",children:o}),u.jsx(O,{placement:"left",children:o})]})}),x=P.story({args:{...p.input.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}});p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const Default = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
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
`,...p.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const IsOpen = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
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
`,...T.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const OrthogonalPlacements = ({ isOpen, children }) => {
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
`,...y.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const WithLongText = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
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
`,...x.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'I am a tooltip'
  }
})`,...p.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...T.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...y.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isOpen: true,
    children: 'I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
})`,...x.input.parameters?.docs?.source}}};const Ye=["Default","IsOpen","IsDisabled","NoDelays","OrthogonalPlacements","WithLongText"];export{p as Default,g as IsDisabled,b as IsOpen,T as NoDelays,y as OrthogonalPlacements,x as WithLongText,Ye as __namedExportsOrder};
