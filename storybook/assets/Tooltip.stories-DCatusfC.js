import{R as d,ah as Z,r as c,ap as z,j as l,am as K,an as Y,B as G,p as J}from"./iframe-DC0HuKGF.js";import{b as Q,a as X,c as ee,d as te,$ as oe}from"./OverlayArrow-Bq-Tcr_a.js";import{e as re,$ as ne,a as ae}from"./utils-Cn61JNwH.js";import{e as ie,$ as R,a as M}from"./useObjectRef-CUy8bK3M.js";import{a as q,$ as le,y as se,o as ce,C as ue}from"./useFocusable-CworoZuF.js";import{a as pe,$ as de}from"./animation-kImUn86E.js";import{$ as H}from"./useFocusRing-DL_VlKxz.js";import{B as k}from"./Button-CLkU6z9C.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-DgKGkMSg.js";import"./Label-DZKGqgzf.js";import"./Hidden-KSwhlm6b.js";import"./useLabel-MIMNbo6g.js";import"./useLabels-DEEXvcdx.js";import"./context-CvHDVD3r.js";import"./useButton-DlNeywlF.js";import"./usePress-ohDWbPX7.js";import"./useControlledState-C0mzGUjt.js";import"./index-DnwCBnK_.js";const L=d.createContext(null);function me(e){let{children:o}=e,t=c.useContext(L),[r,i]=c.useState(0),s=c.useMemo(()=>({parent:t,modalCount:r,addModal(){i(a=>a+1),t&&t.addModal()},removeModal(){i(a=>a-1),t&&t.removeModal()}}),[t,r]);return d.createElement(L.Provider,{value:s},o)}function fe(){let e=c.useContext(L);return{modalProviderProps:{"aria-hidden":e&&e.modalCount>0?!0:void 0}}}function be(e){let{modalProviderProps:o}=fe();return d.createElement("div",{"data-overlay-container":!0,...e,...o})}function ge(e){return d.createElement(me,null,d.createElement(be,e))}function $e(e){let o=ie(),{portalContainer:t=o?null:document.body,...r}=e,{getContainer:i}=Q();if(!e.portalContainer&&i&&(t=i()),d.useEffect(()=>{if(t?.closest("[data-overlay-container]"))throw new Error("An OverlayContainer must not be inside another container. Please change the portalContainer prop.")},[t]),!t)return null;let s=d.createElement(ge,r);return Z.createPortal(s,t)}function xe(e,o){let t=q(e,{labelable:!0}),{hoverProps:r}=H({onHoverStart:()=>o?.open(!0),onHoverEnd:()=>o?.close()});return{tooltipProps:R(t,r,{role:"tooltip"})}}function Te(e,o,t){let{isDisabled:r,trigger:i,shouldCloseOnPress:s=!0}=e,a=M(),n=c.useRef(!1),u=c.useRef(!1),h=()=>{(n.current||u.current)&&o.open(u.current)},b=E=>{!n.current&&!u.current&&o.close(E)};c.useEffect(()=>{let E=_=>{t&&t.current&&_.key==="Escape"&&(_.stopPropagation(),o.close(!0))};if(o.isOpen)return document.addEventListener("keydown",E,!0),()=>{document.removeEventListener("keydown",E,!0)}},[t,o]);let P=()=>{i!=="focus"&&(se()==="pointer"?n.current=!0:n.current=!1,h())},I=()=>{i!=="focus"&&(u.current=!1,n.current=!1,b())},w=()=>{s&&(u.current=!1,n.current=!1,b(!0))},m=()=>{ce()&&(u.current=!0,h())},F=()=>{u.current=!1,n.current=!1,b(!0)},{hoverProps:U}=H({isDisabled:r,onHoverStart:P,onHoverEnd:I}),{focusableProps:V}=le({isDisabled:r,onFocus:m,onBlur:F},t);return{triggerProps:{"aria-describedby":o.isOpen?a:void 0,...R(V,U,{onPointerDown:w,onKeyDown:w}),tabIndex:void 0},tooltipProps:{id:a}}}const ye=1500,N=500;let v={},he=0,B=!1,f=null,D=null;function A(e={}){let{delay:o=ye,closeDelay:t=N}=e,{isOpen:r,open:i,close:s}=X(e),a=c.useMemo(()=>`${++he}`,[]),n=c.useRef(null),u=c.useRef(s),h=()=>{v[a]=I},b=()=>{for(let m in v)m!==a&&(v[m](!0),delete v[m])},P=()=>{n.current&&clearTimeout(n.current),n.current=null,b(),h(),B=!0,i(),f&&(clearTimeout(f),f=null),D&&(clearTimeout(D),D=null)},I=m=>{m||t<=0?(n.current&&clearTimeout(n.current),n.current=null,u.current()):n.current||(n.current=setTimeout(()=>{n.current=null,u.current()},t)),f&&(clearTimeout(f),f=null),B&&(D&&clearTimeout(D),D=setTimeout(()=>{delete v[a],D=null,B=!1},Math.max(N,t)))},w=()=>{b(),h(),!r&&!f&&!B?f=setTimeout(()=>{f=null,B=!0,P()},o):r||P()};return c.useEffect(()=>{u.current=s},[s]),c.useEffect(()=>()=>{n.current&&clearTimeout(n.current),v[a]&&delete v[a]},[a]),{isOpen:r,open:m=>{!m&&o>0&&!n.current?w():P()},close:I}}const S=c.createContext(null),W=c.createContext(null);function ve(e){let o=A(e),t=c.useRef(null),{triggerProps:r,tooltipProps:i}=Te(e,o,t);return d.createElement(re,{values:[[S,o],[W,{...i,triggerRef:t}]]},d.createElement(ue,{...r,ref:t},e.children))}const De=c.forwardRef(function({UNSTABLE_portalContainer:o,...t},r){[t,r]=ne(t,r,W);let i=c.useContext(S),s=A(t),a=t.isOpen!=null||t.defaultOpen!=null||!i?s:i,n=pe(r,a.isOpen)||t.isExiting||!1;return!a.isOpen&&!n?null:d.createElement($e,{portalContainer:o},d.createElement(Oe,{...t,tooltipRef:r,isExiting:n}))});function Oe(e){let o=c.useContext(S),t=c.useRef(null),{overlayProps:r,arrowProps:i,placement:s,triggerAnchorPoint:a}=ee({placement:e.placement||"top",targetRef:e.triggerRef,overlayRef:e.tooltipRef,arrowRef:t,offset:e.offset,crossOffset:e.crossOffset,isOpen:o.isOpen,arrowBoundaryOffset:e.arrowBoundaryOffset,shouldFlip:e.shouldFlip,containerPadding:e.containerPadding,onClose:()=>o.close(!0)}),n=de(e.tooltipRef,!!s)||e.isEntering||!1,u=ae({...e,defaultClassName:"react-aria-Tooltip",values:{placement:s,isEntering:n,isExiting:e.isExiting,state:o}});e=R(e,r);let{tooltipProps:h}=xe(e,o),b=q(e,{global:!0});return d.createElement("div",{...R(b,u,h),ref:e.tooltipRef,style:{...r.style,"--trigger-anchor-point":a?`${a.x}px ${a.y}px`:void 0,...u.style},"data-placement":s??void 0,"data-entering":n||void 0,"data-exiting":e.isExiting||void 0},d.createElement(te.Provider,{value:{...i,placement:s,ref:t}},u.children))}const Ce={"bui-Tooltip":"_bui-Tooltip_3bu1v_20","bui-TooltipContent":"_bui-TooltipContent_3bu1v_65","bui-TooltipArrow":"_bui-TooltipArrow_3bu1v_70"},Pe=z()({styles:Ce,classNames:{tooltip:"bui-Tooltip",content:"bui-TooltipContent",arrow:"bui-TooltipArrow"},propDefs:{children:{},className:{}}}),j=e=>{const{delay:o=600}=e;return l.jsx(ve,{delay:o,...e})},O=c.forwardRef((e,o)=>{const{ownProps:t,restProps:r}=K(Pe,e),{classes:i,children:s}=t,a=M();return l.jsxs(De,{className:i.tooltip,...r,ref:o,children:[l.jsx(oe,{className:i.arrow,children:l.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[l.jsx("defs",{children:l.jsx("path",{id:a,fillRule:"evenodd",d:"M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})}),l.jsx("use",{href:`#${a}`}),l.jsx("use",{href:`#${a}`}),l.jsx("path",{d:"M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})]})}),l.jsx(Y,{children:l.jsx(G,{bg:"neutral",className:i.content,children:s})})]})});O.displayName="Tooltip";j.__docgenInfo={description:"@public",methods:[],displayName:"TooltipTrigger"};O.__docgenInfo={description:"@public",methods:[],displayName:"Tooltip",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const C=J.meta({title:"Backstage UI/Tooltip",component:j,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:e,isOpen:o,isDisabled:t,delay:r,closeDelay:i})=>l.jsxs(j,{isOpen:o,isDisabled:t,delay:r,closeDelay:i,children:[l.jsx(k,{children:"Button"}),l.jsx(O,{children:e??"I am a tooltip"})]})}),p=C.story({args:{children:"I am a tooltip"}}),g=C.story({parameters:{layout:"fullscreen"},decorators:[e=>l.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:l.jsx(e,{})})],args:{...p.input.args,isOpen:!0}}),$=C.story({args:{...p.input.args,isDisabled:!0}}),x=C.story({args:{...p.input.args,delay:0,closeDelay:0}}),T=C.story({parameters:{controls:{exclude:["placement"]}},args:{...p.input.args,isOpen:!0},render:({isOpen:e,children:o})=>l.jsxs(j,{isOpen:e,children:[l.jsx(k,{children:"Button"}),l.jsx(O,{placement:"top",children:o}),l.jsx(O,{placement:"right",children:o}),l.jsx(O,{placement:"bottom",children:o}),l.jsx(O,{placement:"left",children:o})]})}),y=C.story({args:{...p.input.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}});p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const Default = ({ children, isOpen, isDisabled, delay, closeDelay }) => (
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
})`,...y.input.parameters?.docs?.source}}};const Ze=["Default","IsOpen","IsDisabled","NoDelays","OrthogonalPlacements","WithLongText"];export{p as Default,$ as IsDisabled,g as IsOpen,x as NoDelays,T as OrthogonalPlacements,y as WithLongText,Ze as __namedExportsOrder};
