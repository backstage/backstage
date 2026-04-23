import{R as d,ar as Z,r as s,ax as z,j as l,u as K,b as Y,B as G,p as J}from"./iframe-BkP0WlJq.js";import{g as Q,c as L,$ as M}from"./useObjectRef-Mf4vhbTH.js";import{b as X,a as ee,c as te,d as re,$ as oe}from"./useOverlayTriggerState-yqAD7bBJ.js";import{f as ae,$ as ne,b as ie,a as le}from"./utils-DHN8Cm_h.js";import{a as q,$ as se,y as ce,l as ue,C as de}from"./useGlobalListeners-BQ7uMXZm.js";import{$ as pe,a as fe}from"./animation-X88qEdj0.js";import{a as H}from"./useHover-eAsT_Ppr.js";import{B as k}from"./Button-Dh8sI6DJ.js";import"./preload-helper-PPVm8Dsz.js";import"./openLink-DB0Ca1x8.js";import"./number-C1OYSHYA.js";import"./I18nProvider-DmxvoEIH.js";import"./useControlledState-BVQM9Nh9.js";import"./Button-lxle6TI0.js";import"./Label-BK2ZKRuT.js";import"./Hidden-BXffHnFQ.js";import"./useLabel-5YOqhmr6.js";import"./useLabels-B-zEBY3m.js";import"./useButton-DhjtCbFy.js";import"./usePress-C8fD9tc5.js";import"./textSelection-BKZ9NYIi.js";import"./index-nUlAPM-b.js";const S=d.createContext(null);function me(e){let{children:r}=e,t=s.useContext(S),[o,i]=s.useState(0),c=s.useMemo(()=>({parent:t,modalCount:o,addModal(){i(n=>n+1),t&&t.addModal()},removeModal(){i(n=>n-1),t&&t.removeModal()}}),[t,o]);return d.createElement(S.Provider,{value:c},r)}function $e(){let e=s.useContext(S);return{modalProviderProps:{"aria-hidden":e&&e.modalCount>0?!0:void 0}}}function be(e){let{modalProviderProps:r}=$e();return d.createElement("div",{"data-overlay-container":!0,...e,...r})}function ge(e){return d.createElement(me,null,d.createElement(be,e))}function xe(e){let r=Q(),{portalContainer:t=r?null:document.body,...o}=e,{getContainer:i}=X();if(!e.portalContainer&&i&&(t=i()),d.useEffect(()=>{if(t?.closest("[data-overlay-container]"))throw new Error("An OverlayContainer must not be inside another container. Please change the portalContainer prop.")},[t]),!t)return null;let c=d.createElement(ge,o);return Z.createPortal(c,t)}const he=1500,N=500;let g={},ve=0,C=!1,f=null,x=null;function A(e={}){let{delay:r=he,closeDelay:t=N}=e,{isOpen:o,open:i,close:c}=ee(e),n=s.useMemo(()=>`${++ve}`,[]),a=s.useRef(null),u=s.useRef(c),b=()=>{g[n]=O},$=()=>{for(let p in g)p!==n&&(g[p](!0),delete g[p])},y=()=>{a.current&&clearTimeout(a.current),a.current=null,$(),b(),C=!0,i(),f&&(clearTimeout(f),f=null),x&&(clearTimeout(x),x=null)},O=p=>{p||t<=0?(a.current&&clearTimeout(a.current),a.current=null,u.current()):a.current||(a.current=setTimeout(()=>{a.current=null,u.current()},t)),f&&(clearTimeout(f),f=null),C&&(x&&clearTimeout(x),x=setTimeout(()=>{delete g[n],x=null,C=!1},Math.max(N,t)))},P=()=>{$(),b(),!o&&!C?(f&&clearTimeout(f),f=setTimeout(()=>{f=null,C=!0,y()},r)):o||y()};return s.useEffect(()=>{u.current=c},[c]),s.useEffect(()=>()=>{a.current&&clearTimeout(a.current),g[n]&&delete g[n]},[n]),{isOpen:o,open:p=>{!p&&r>0&&!a.current?P():y()},close:O}}function ye(e,r){let t=q(e,{labelable:!0}),{hoverProps:o}=H({onHoverStart:()=>r?.open(!0),onHoverEnd:()=>r?.close()});return{tooltipProps:L(t,o,{role:"tooltip"})}}function Te(e,r,t){let{isDisabled:o,trigger:i,shouldCloseOnPress:c=!0}=e,n=M(),a=s.useRef(!1),u=s.useRef(!1),b=()=>{(a.current||u.current)&&r.open(u.current)},$=T=>{!a.current&&!u.current&&r.close(T)};s.useEffect(()=>{let T=B=>{t&&t.current&&B.key==="Escape"&&(B.stopPropagation(),r.close(!0))};if(r.isOpen)return document.addEventListener("keydown",T,!0),()=>{document.removeEventListener("keydown",T,!0)}},[t,r]);let y=()=>{i!=="focus"&&(ce()==="pointer"?a.current=!0:a.current=!1,b())},O=()=>{i!=="focus"&&(u.current=!1,a.current=!1,$())},P=()=>{c&&(u.current=!1,a.current=!1,$(!0))},p=()=>{ue()&&(u.current=!0,b())},U=()=>{u.current=!1,a.current=!1,$(!0)},{hoverProps:W}=H({isDisabled:o,onHoverStart:y,onHoverEnd:O}),{focusableProps:V}=se({isDisabled:o,onFocus:p,onBlur:U},t);return{triggerProps:{"aria-describedby":r.isOpen?n:void 0,...L(V,W,{onPointerDown:P,onKeyDown:P}),tabIndex:void 0},tooltipProps:{id:n}}}const _=s.createContext(null),F=s.createContext(null);function Ce(e){let r=A(e),t=s.useRef(null),{triggerProps:o,tooltipProps:i}=Te(e,r,t);return d.createElement(ae,{values:[[_,r],[F,{...i,triggerRef:t}]]},d.createElement(de,{...o,ref:t},e.children))}const Oe=s.forwardRef(function({UNSTABLE_portalContainer:r,...t},o){[t,o]=ne(t,o,F);let i=s.useContext(_),c=A(t),n=t.isOpen!=null||t.defaultOpen!=null||!i?c:i,a=pe(o,n.isOpen)||t.isExiting||!1;return!n.isOpen&&!a?null:d.createElement(xe,{portalContainer:r},d.createElement(Pe,{...t,tooltipRef:o,isExiting:a}))});function Pe(e){let r=s.useContext(_),t=s.useRef(null),{overlayProps:o,arrowProps:i,placement:c,triggerAnchorPoint:n}=te({placement:e.placement||"top",targetRef:e.triggerRef,overlayRef:e.tooltipRef,arrowRef:t,offset:e.offset,crossOffset:e.crossOffset,isOpen:r.isOpen,arrowBoundaryOffset:e.arrowBoundaryOffset,shouldFlip:e.shouldFlip,containerPadding:e.containerPadding,onClose:()=>r.close(!0)}),a=fe(e.tooltipRef,!!c)||e.isEntering||!1,u=ie({...e,defaultClassName:"react-aria-Tooltip",values:{placement:c,isEntering:a,isExiting:e.isExiting,state:r}});e=L(e,o);let{tooltipProps:b}=ye(e,r),$=q(e,{global:!0});return d.createElement(le.div,{...L($,u,b),ref:e.tooltipRef,style:{...o.style,"--trigger-anchor-point":n?`${n.x}px ${n.y}px`:void 0,...u.style},"data-placement":c??void 0,"data-entering":a||void 0,"data-exiting":e.isExiting||void 0},d.createElement(re.Provider,{value:{...i,placement:c,ref:t}},u.children))}const Ee={"bui-Tooltip":"_bui-Tooltip_3bu1v_20","bui-TooltipContent":"_bui-TooltipContent_3bu1v_65","bui-TooltipArrow":"_bui-TooltipArrow_3bu1v_70"},De=z()({styles:Ee,classNames:{tooltip:"bui-Tooltip",content:"bui-TooltipContent",arrow:"bui-TooltipArrow"},propDefs:{children:{},className:{}}}),I=e=>{const{delay:r=600}=e;return l.jsx(Ce,{delay:r,...e})},h=s.forwardRef((e,r)=>{const{ownProps:t,restProps:o}=K(De,e),{classes:i,children:c}=t,n=M();return l.jsxs(Oe,{className:i.tooltip,...o,ref:r,children:[l.jsx(oe,{className:i.arrow,children:l.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[l.jsx("defs",{children:l.jsx("path",{id:n,fillRule:"evenodd",d:"M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})}),l.jsx("use",{href:`#${n}`}),l.jsx("use",{href:`#${n}`}),l.jsx("path",{d:"M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})]})}),l.jsx(Y,{children:l.jsx(G,{bg:"neutral",className:i.content,children:c})})]})});h.displayName="Tooltip";I.__docgenInfo={description:`A wrapper that connects a trigger element to a Tooltip, controlling its show and hide behavior with a configurable delay.

@public`,methods:[],displayName:"TooltipTrigger"};h.__docgenInfo={description:`A floating label that provides contextual information about an element when it receives hover or focus.

@public`,methods:[],displayName:"Tooltip",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const v=J.meta({title:"Backstage UI/Tooltip",component:I,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},isDisabled:{control:{type:"boolean"}},delay:{control:{type:"number"}},closeDelay:{control:{type:"number"}}},render:({children:e,isOpen:r,isDisabled:t,delay:o,closeDelay:i})=>l.jsxs(I,{isOpen:r,isDisabled:t,delay:o,closeDelay:i,children:[l.jsx(k,{children:"Button"}),l.jsx(h,{children:e??"I am a tooltip"})]})}),m=v.story({args:{children:"I am a tooltip"}}),E=v.story({parameters:{layout:"fullscreen"},decorators:[e=>l.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:l.jsx(e,{})})],args:{...m.input.args,isOpen:!0}}),D=v.story({args:{...m.input.args,isDisabled:!0}}),w=v.story({args:{...m.input.args,delay:0,closeDelay:0}}),R=v.story({parameters:{controls:{exclude:["placement"]}},args:{...m.input.args,isOpen:!0},render:({isOpen:e,children:r})=>l.jsxs(I,{isOpen:e,children:[l.jsx(k,{children:"Button"}),l.jsx(h,{placement:"top",children:r}),l.jsx(h,{placement:"right",children:r}),l.jsx(h,{placement:"bottom",children:r}),l.jsx(h,{placement:"left",children:r})]})}),j=v.story({args:{...m.input.args,isOpen:!0,children:"I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}});m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
