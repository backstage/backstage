import{R as d,ak as K,r as c,j as i,ap as L,aq as Y,B as G,p as J}from"./iframe-CAn0lpb7.js";import{b as Q,a as X,c as ee,d as te,$ as oe}from"./OverlayArrow-C7vxO_Jc.js";import{e as re,$ as ne,a as ae}from"./utils-CErzHk2O.js";import{e as ie,$ as R,a as H}from"./useObjectRef-B_ULXnmC.js";import{a as k,$ as le,y as se,o as ce,C as ue}from"./useFocusable-B-1CwqMl.js";import{a as pe,$ as de}from"./animation-7DEOMvzH.js";import{$ as A}from"./useFocusRing-BpOIXJlE.js";import{u as me}from"./useStyles-RM57Yp59.js";import{B as W}from"./Button-L2BnomAs.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-CJioj41W.js";import"./Label-CCLyJ_Ef.js";import"./Hidden-D0X4hvc8.js";import"./useLabel-CYsM0HII.js";import"./useLabels-BlsVAVzq.js";import"./context-3Z9cJv_U.js";import"./useButton-Bj01Iinc.js";import"./usePress-hi0KmkGu.js";import"./useControlledState-CjhAUExh.js";import"./index-DaCp2aen.js";const _=d.createContext(null);function fe(e){let{children:o}=e,t=c.useContext(_),[n,l]=c.useState(0),s=c.useMemo(()=>({parent:t,modalCount:n,addModal(){l(a=>a+1),t&&t.addModal()},removeModal(){l(a=>a-1),t&&t.removeModal()}}),[t,n]);return d.createElement(_.Provider,{value:s},o)}function be(){let e=c.useContext(_);return{modalProviderProps:{"aria-hidden":e&&e.modalCount>0?!0:void 0}}}function ge(e){let{modalProviderProps:o}=be();return d.createElement("div",{"data-overlay-container":!0,...e,...o})}function $e(e){return d.createElement(fe,null,d.createElement(ge,e))}function xe(e){let o=ie(),{portalContainer:t=o?null:document.body,...n}=e,{getContainer:l}=Q();if(!e.portalContainer&&l&&(t=l()),d.useEffect(()=>{if(t?.closest("[data-overlay-container]"))throw new Error("An OverlayContainer must not be inside another container. Please change the portalContainer prop.")},[t]),!t)return null;let s=d.createElement($e,n);return K.createPortal(s,t)}function Te(e,o){let t=k(e,{labelable:!0}),{hoverProps:n}=A({onHoverStart:()=>o?.open(!0),onHoverEnd:()=>o?.close()});return{tooltipProps:R(t,n,{role:"tooltip"})}}function ye(e,o,t){let{isDisabled:n,trigger:l,shouldCloseOnPress:s=!0}=e,a=H(),r=c.useRef(!1),u=c.useRef(!1),h=()=>{(r.current||u.current)&&o.open(u.current)},b=E=>{!r.current&&!u.current&&o.close(E)};c.useEffect(()=>{let E=M=>{t&&t.current&&M.key==="Escape"&&(M.stopPropagation(),o.close(!0))};if(o.isOpen)return document.addEventListener("keydown",E,!0),()=>{document.removeEventListener("keydown",E,!0)}},[t,o]);let P=()=>{l!=="focus"&&(se()==="pointer"?r.current=!0:r.current=!1,h())},I=()=>{l!=="focus"&&(u.current=!1,r.current=!1,b())},w=()=>{s&&(u.current=!1,r.current=!1,b(!0))},m=()=>{ce()&&(u.current=!0,h())},V=()=>{u.current=!1,r.current=!1,b(!0)},{hoverProps:Z}=A({isDisabled:n,onHoverStart:P,onHoverEnd:I}),{focusableProps:z}=le({isDisabled:n,onFocus:m,onBlur:V},t);return{triggerProps:{"aria-describedby":o.isOpen?a:void 0,...R(z,Z,{onPointerDown:w,onKeyDown:w}),tabIndex:void 0},tooltipProps:{id:a}}}const he=1500,q=500;let v={},ve=0,B=!1,f=null,D=null;function F(e={}){let{delay:o=he,closeDelay:t=q}=e,{isOpen:n,open:l,close:s}=X(e),a=c.useMemo(()=>`${++ve}`,[]),r=c.useRef(null),u=c.useRef(s),h=()=>{v[a]=I},b=()=>{for(let m in v)m!==a&&(v[m](!0),delete v[m])},P=()=>{r.current&&clearTimeout(r.current),r.current=null,b(),h(),B=!0,l(),f&&(clearTimeout(f),f=null),D&&(clearTimeout(D),D=null)},I=m=>{m||t<=0?(r.current&&clearTimeout(r.current),r.current=null,u.current()):r.current||(r.current=setTimeout(()=>{r.current=null,u.current()},t)),f&&(clearTimeout(f),f=null),B&&(D&&clearTimeout(D),D=setTimeout(()=>{delete v[a],D=null,B=!1},Math.max(q,t)))},w=()=>{b(),h(),!n&&!f&&!B?f=setTimeout(()=>{f=null,B=!0,P()},o):n||P()};return c.useEffect(()=>{u.current=s},[s]),c.useEffect(()=>()=>{r.current&&clearTimeout(r.current),v[a]&&delete v[a]},[a]),{isOpen:n,open:m=>{!m&&o>0&&!r.current?w():P()},close:I}}const N=c.createContext(null),U=c.createContext(null);function De(e){let o=F(e),t=c.useRef(null),{triggerProps:n,tooltipProps:l}=ye(e,o,t);return d.createElement(re,{values:[[N,o],[U,{...l,triggerRef:t}]]},d.createElement(ue,{...n,ref:t},e.children))}const Oe=c.forwardRef(function({UNSTABLE_portalContainer:o,...t},n){[t,n]=ne(t,n,U);let l=c.useContext(N),s=F(t),a=t.isOpen!=null||t.defaultOpen!=null||!l?s:l,r=pe(n,a.isOpen)||t.isExiting||!1;return!a.isOpen&&!r?null:d.createElement(xe,{portalContainer:o},d.createElement(Ce,{...t,tooltipRef:n,isExiting:r}))});function Ce(e){let o=c.useContext(N),t=c.useRef(null),{overlayProps:n,arrowProps:l,placement:s,triggerAnchorPoint:a}=ee({placement:e.placement||"top",targetRef:e.triggerRef,overlayRef:e.tooltipRef,arrowRef:t,offset:e.offset,crossOffset:e.crossOffset,isOpen:o.isOpen,arrowBoundaryOffset:e.arrowBoundaryOffset,shouldFlip:e.shouldFlip,containerPadding:e.containerPadding,onClose:()=>o.close(!0)}),r=de(e.tooltipRef,!!s)||e.isEntering||!1,u=ae({...e,defaultClassName:"react-aria-Tooltip",values:{placement:s,isEntering:r,isExiting:e.isExiting,state:o}});e=R(e,n);let{tooltipProps:h}=Te(e,o),b=k(e,{global:!0});return d.createElement("div",{...R(b,u,h),ref:e.tooltipRef,style:{...n.style,"--trigger-anchor-point":a?`${a.x}px ${a.y}px`:void 0,...u.style},"data-placement":s??void 0,"data-entering":r||void 0,"data-exiting":e.isExiting||void 0},d.createElement(te.Provider,{value:{...l,placement:s,ref:t}},u.children))}const Pe={classNames:{tooltip:"bui-Tooltip",content:"bui-TooltipContent",arrow:"bui-TooltipArrow"}},S={"bui-Tooltip":"_bui-Tooltip_3bu1v_20","bui-TooltipContent":"_bui-TooltipContent_3bu1v_65","bui-TooltipArrow":"_bui-TooltipArrow_3bu1v_70"},j=e=>{const{delay:o=600}=e;return i.jsx(De,{delay:o,...e})},O=c.forwardRef((e,o)=>{const{classNames:t,cleanedProps:n}=me(Pe,e),{className:l,children:s,...a}=n,r=H();return i.jsxs(Oe,{className:L(t.tooltip,S[t.tooltip],l),...a,ref:o,children:[i.jsx(oe,{className:L(t.arrow,S[t.arrow]),children:i.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[i.jsx("defs",{children:i.jsx("path",{id:r,fillRule:"evenodd",d:"M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})}),i.jsx("use",{href:`#${r}`}),i.jsx("use",{href:`#${r}`}),i.jsx("path",{d:"M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})]})}),i.jsx(Y,{children:i.jsx(G,{bg:"neutral",className:L(t.content,S[t.content]),children:s})})]})});O.displayName="Tooltip";j.__docgenInfo={description:"@public",methods:[],displayName:"TooltipTrigger"};O.__docgenInfo={description:"@public",methods:[],displayName:"Tooltip",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["Omit"]};const C=J.meta({title:"Backstage UI/Tooltip",component:j,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:e,isOpen:o,isDisabled:t,delay:n,closeDelay:l})=>i.jsxs(j,{isOpen:o,isDisabled:t,delay:n,closeDelay:l,children:[i.jsx(W,{children:"Button"}),i.jsx(O,{children:e??"I am a tooltip"})]})}),p=C.story({args:{children:"I am a tooltip"}}),g=C.story({parameters:{layout:"fullscreen"},decorators:[e=>i.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:i.jsx(e,{})})],args:{...p.input.args,isOpen:!0}}),$=C.story({args:{...p.input.args,isDisabled:!0}}),x=C.story({args:{...p.input.args,delay:0,closeDelay:0}}),T=C.story({parameters:{controls:{exclude:["placement"]}},args:{...p.input.args,isOpen:!0},render:({isOpen:e,children:o})=>i.jsxs(j,{isOpen:e,children:[i.jsx(W,{children:"Button"}),i.jsx(O,{placement:"top",children:o}),i.jsx(O,{placement:"right",children:o}),i.jsx(O,{placement:"bottom",children:o}),i.jsx(O,{placement:"left",children:o})]})}),y=C.story({args:{...p.input.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}});p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const Default = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
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
`,...p.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const IsOpen = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
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
`,...g.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{code:`const IsDisabled = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
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
`,...$.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const NoDelays = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
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
`,...x.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{code:`const OrthogonalPlacements = ({ isOpen, children }) => {
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
`,...T.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const WithLongText = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
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
`,...y.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'I am a tooltip'
  }
})`,...p.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [Story => <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)',
    backgroundSize: '16px 16px'
  }}>
        <Story />
      </div>],
  args: {
    ...Default.input.args,
    isOpen: true
  }
})`,...g.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...$.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    delay: 0,
    closeDelay: 0
  }
})`,...x.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...T.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isOpen: true,
    children: 'I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
})`,...y.input.parameters?.docs?.source}}};const ze=["Default","IsOpen","IsDisabled","NoDelays","OrthogonalPlacements","WithLongText"];export{p as Default,$ as IsDisabled,g as IsOpen,x as NoDelays,T as OrthogonalPlacements,y as WithLongText,ze as __namedExportsOrder};
