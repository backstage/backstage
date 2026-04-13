import{R as d,ao as Z,r as c,aw as z,j as l,au as K,av as Y,B as G,p as J}from"./iframe-v7Qh39PS.js";import{b as Q,a as X,c as ee,d as te,$ as re}from"./OverlayArrow-CIIPbG6M.js";import{f as oe,$ as ne,b as ae,a as ie}from"./utils-BTRkaVxP.js";import{f as le,b as L,d as M}from"./useObjectRef-D2k9dnBA.js";import{a as q,$ as se,t as ce,l as ue,C as de}from"./useFocusable-RTAK5qqG.js";import{$ as pe,a as fe}from"./animation-bTj1KSLO.js";import{a as H}from"./useFocusRing-BTKZdzbY.js";import{B as k}from"./Button-DbFieq7f.js";import"./preload-helper-PPVm8Dsz.js";import"./openLink-DhJYPLui.js";import"./useNumberFormatter-CujVYdJO.js";import"./context-DBZ4_gav.js";import"./useControlledState-uHAu_Mun.js";import"./Button-CvJRoXrp.js";import"./Label-dqhcKEKx.js";import"./Hidden-DQKoMRUH.js";import"./useLabel-EzumQXQv.js";import"./useLabels-BlAwLbEW.js";import"./useButton-DoRhoXC9.js";import"./usePress-d5tNe03t.js";import"./textSelection-BeaNrXk5.js";import"./index-C2rRWsJF.js";const S=d.createContext(null);function me(e){let{children:r}=e,t=c.useContext(S),[o,i]=c.useState(0),s=c.useMemo(()=>({parent:t,modalCount:o,addModal(){i(a=>a+1),t&&t.addModal()},removeModal(){i(a=>a-1),t&&t.removeModal()}}),[t,o]);return d.createElement(S.Provider,{value:s},r)}function $e(){let e=c.useContext(S);return{modalProviderProps:{"aria-hidden":e&&e.modalCount>0?!0:void 0}}}function be(e){let{modalProviderProps:r}=$e();return d.createElement("div",{"data-overlay-container":!0,...e,...r})}function ge(e){return d.createElement(me,null,d.createElement(be,e))}function xe(e){let r=le(),{portalContainer:t=r?null:document.body,...o}=e,{getContainer:i}=Q();if(!e.portalContainer&&i&&(t=i()),d.useEffect(()=>{if(t?.closest("[data-overlay-container]"))throw new Error("An OverlayContainer must not be inside another container. Please change the portalContainer prop.")},[t]),!t)return null;let s=d.createElement(ge,o);return Z.createPortal(s,t)}function ve(e,r){let t=q(e,{labelable:!0}),{hoverProps:o}=H({onHoverStart:()=>r?.open(!0),onHoverEnd:()=>r?.close()});return{tooltipProps:L(t,o,{role:"tooltip"})}}function he(e,r,t){let{isDisabled:o,trigger:i,shouldCloseOnPress:s=!0}=e,a=M(),n=c.useRef(!1),u=c.useRef(!1),b=()=>{(n.current||u.current)&&r.open(u.current)},$=T=>{!n.current&&!u.current&&r.close(T)};c.useEffect(()=>{let T=B=>{t&&t.current&&B.key==="Escape"&&(B.stopPropagation(),r.close(!0))};if(r.isOpen)return document.addEventListener("keydown",T,!0),()=>{document.removeEventListener("keydown",T,!0)}},[t,r]);let y=()=>{i!=="focus"&&(ce()==="pointer"?n.current=!0:n.current=!1,b())},O=()=>{i!=="focus"&&(u.current=!1,n.current=!1,$())},P=()=>{s&&(u.current=!1,n.current=!1,$(!0))},p=()=>{ue()&&(u.current=!0,b())},U=()=>{u.current=!1,n.current=!1,$(!0)},{hoverProps:W}=H({isDisabled:o,onHoverStart:y,onHoverEnd:O}),{focusableProps:V}=se({isDisabled:o,onFocus:p,onBlur:U},t);return{triggerProps:{"aria-describedby":r.isOpen?a:void 0,...L(V,W,{onPointerDown:P,onKeyDown:P}),tabIndex:void 0},tooltipProps:{id:a}}}const ye=1500,N=500;let g={},Te=0,C=!1,f=null,x=null;function A(e={}){let{delay:r=ye,closeDelay:t=N}=e,{isOpen:o,open:i,close:s}=X(e),a=c.useMemo(()=>`${++Te}`,[]),n=c.useRef(null),u=c.useRef(s),b=()=>{g[a]=O},$=()=>{for(let p in g)p!==a&&(g[p](!0),delete g[p])},y=()=>{n.current&&clearTimeout(n.current),n.current=null,$(),b(),C=!0,i(),f&&(clearTimeout(f),f=null),x&&(clearTimeout(x),x=null)},O=p=>{p||t<=0?(n.current&&clearTimeout(n.current),n.current=null,u.current()):n.current||(n.current=setTimeout(()=>{n.current=null,u.current()},t)),f&&(clearTimeout(f),f=null),C&&(x&&clearTimeout(x),x=setTimeout(()=>{delete g[a],x=null,C=!1},Math.max(N,t)))},P=()=>{$(),b(),!o&&!C?(f&&clearTimeout(f),f=setTimeout(()=>{f=null,C=!0,y()},r)):o||y()};return c.useEffect(()=>{u.current=s},[s]),c.useEffect(()=>()=>{n.current&&clearTimeout(n.current),g[a]&&delete g[a]},[a]),{isOpen:o,open:p=>{!p&&r>0&&!n.current?P():y()},close:O}}const _=c.createContext(null),F=c.createContext(null);function Ce(e){let r=A(e),t=c.useRef(null),{triggerProps:o,tooltipProps:i}=he(e,r,t);return d.createElement(oe,{values:[[_,r],[F,{...i,triggerRef:t}]]},d.createElement(de,{...o,ref:t},e.children))}const Oe=c.forwardRef(function({UNSTABLE_portalContainer:r,...t},o){[t,o]=ne(t,o,F);let i=c.useContext(_),s=A(t),a=t.isOpen!=null||t.defaultOpen!=null||!i?s:i,n=pe(o,a.isOpen)||t.isExiting||!1;return!a.isOpen&&!n?null:d.createElement(xe,{portalContainer:r},d.createElement(Pe,{...t,tooltipRef:o,isExiting:n}))});function Pe(e){let r=c.useContext(_),t=c.useRef(null),{overlayProps:o,arrowProps:i,placement:s,triggerAnchorPoint:a}=ee({placement:e.placement||"top",targetRef:e.triggerRef,overlayRef:e.tooltipRef,arrowRef:t,offset:e.offset,crossOffset:e.crossOffset,isOpen:r.isOpen,arrowBoundaryOffset:e.arrowBoundaryOffset,shouldFlip:e.shouldFlip,containerPadding:e.containerPadding,onClose:()=>r.close(!0)}),n=fe(e.tooltipRef,!!s)||e.isEntering||!1,u=ae({...e,defaultClassName:"react-aria-Tooltip",values:{placement:s,isEntering:n,isExiting:e.isExiting,state:r}});e=L(e,o);let{tooltipProps:b}=ve(e,r),$=q(e,{global:!0});return d.createElement(ie.div,{...L($,u,b),ref:e.tooltipRef,style:{...o.style,"--trigger-anchor-point":a?`${a.x}px ${a.y}px`:void 0,...u.style},"data-placement":s??void 0,"data-entering":n||void 0,"data-exiting":e.isExiting||void 0},d.createElement(te.Provider,{value:{...i,placement:s,ref:t}},u.children))}const Ee={"bui-Tooltip":"_bui-Tooltip_3bu1v_20","bui-TooltipContent":"_bui-TooltipContent_3bu1v_65","bui-TooltipArrow":"_bui-TooltipArrow_3bu1v_70"},De=z()({styles:Ee,classNames:{tooltip:"bui-Tooltip",content:"bui-TooltipContent",arrow:"bui-TooltipArrow"},propDefs:{children:{},className:{}}}),I=e=>{const{delay:r=600}=e;return l.jsx(Ce,{delay:r,...e})},v=c.forwardRef((e,r)=>{const{ownProps:t,restProps:o}=K(De,e),{classes:i,children:s}=t,a=M();return l.jsxs(Oe,{className:i.tooltip,...o,ref:r,children:[l.jsx(re,{className:i.arrow,children:l.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[l.jsx("defs",{children:l.jsx("path",{id:a,fillRule:"evenodd",d:"M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})}),l.jsx("use",{href:`#${a}`}),l.jsx("use",{href:`#${a}`}),l.jsx("path",{d:"M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})]})}),l.jsx(Y,{children:l.jsx(G,{bg:"neutral",className:i.content,children:s})})]})});v.displayName="Tooltip";I.__docgenInfo={description:`A wrapper that connects a trigger element to a Tooltip, controlling its show and hide behavior with a configurable delay.

@public`,methods:[],displayName:"TooltipTrigger"};v.__docgenInfo={description:`A floating label that provides contextual information about an element when it receives hover or focus.

@public`,methods:[],displayName:"Tooltip",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const h=J.meta({title:"Backstage UI/Tooltip",component:I,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:e,isOpen:r,isDisabled:t,delay:o,closeDelay:i})=>l.jsxs(I,{isOpen:r,isDisabled:t,delay:o,closeDelay:i,children:[l.jsx(k,{children:"Button"}),l.jsx(v,{children:e??"I am a tooltip"})]})}),m=h.story({args:{children:"I am a tooltip"}}),E=h.story({parameters:{layout:"fullscreen"},decorators:[e=>l.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:l.jsx(e,{})})],args:{...m.input.args,isOpen:!0}}),D=h.story({args:{...m.input.args,isDisabled:!0}}),w=h.story({args:{...m.input.args,delay:0,closeDelay:0}}),R=h.story({parameters:{controls:{exclude:["placement"]}},args:{...m.input.args,isOpen:!0},render:({isOpen:e,children:r})=>l.jsxs(I,{isOpen:e,children:[l.jsx(k,{children:"Button"}),l.jsx(v,{placement:"top",children:r}),l.jsx(v,{placement:"right",children:r}),l.jsx(v,{placement:"bottom",children:r}),l.jsx(v,{placement:"left",children:r})]})}),j=h.story({args:{...m.input.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}});m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'I am a tooltip'
  }
})`,...m.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...E.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...D.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    delay: 0,
    closeDelay: 0
  }
})`,...w.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...R.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isOpen: true,
    children: 'I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
})`,...j.input.parameters?.docs?.source}}};const Ge=["Default","IsOpen","IsDisabled","NoDelays","OrthogonalPlacements","WithLongText"];export{m as Default,D as IsDisabled,E as IsOpen,w as NoDelays,R as OrthogonalPlacements,j as WithLongText,Ge as __namedExportsOrder};
