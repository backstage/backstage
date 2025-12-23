import{r as l,F as Q,a2 as y,j as e,a3 as X}from"./iframe-Hw755TNi.js";import{b as K,$ as Y}from"./Button-DwgHingZ.js";import{$ as Z,a as R,e as W,g as ee,f as re}from"./utils-BUVUUeFt.js";import{a as B,f as te,c as ie,b as q}from"./useObjectRef-Cc5_Ey3_.js";import{$ as G}from"./useFocusable-m4FGHcow.js";import{$ as H}from"./useControlledState-BXR-fBbB.js";import{$ as oe}from"./useEvent-B8Xs39KX.js";import{a as z}from"./useFocusRing-B7_LwlYY.js";import{$ as ne}from"./Heading-DQPeElZD.js";import{h as se}from"./index-DEcR4k_l.js";import{c as h}from"./clsx-B-dksMZM.js";import{u as _}from"./useStyles-B00qSMeS.js";import{F as ae}from"./Flex-qn2HiTG0.js";import{B as A}from"./Box-B-n_QqX5.js";import{T as x}from"./Text-CsKFcROI.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-CorDF3tZ.js";import"./Hidden-Dbya7mrA.js";import"./useLabel-NzZqVTci.js";import"./useLabels-Cj-GaSS9.js";import"./context-BGVznzgA.js";import"./usePress-BD667nug.js";import"./RSPContexts-8F24Wau_.js";function de(a,r,i){let{isDisabled:t}=a,n=B(),d=B(),s=te(),u=l.useRef(null),g=l.useCallback(()=>{u.current=requestAnimationFrame(()=>{i.current&&i.current.setAttribute("hidden","until-found")}),Q.flushSync(()=>{r.toggle()})},[i,r]);oe(i,"beforematch",g);let m=l.useRef(null);return ie(()=>{if(u.current&&cancelAnimationFrame(u.current),i.current&&!t&&!s){let o=i.current;m.current==null||typeof o.getAnimations!="function"?r.isExpanded?(o.removeAttribute("hidden"),o.style.setProperty("--disclosure-panel-width","auto"),o.style.setProperty("--disclosure-panel-height","auto")):(o.setAttribute("hidden","until-found"),o.style.setProperty("--disclosure-panel-width","0px"),o.style.setProperty("--disclosure-panel-height","0px")):r.isExpanded!==m.current&&(r.isExpanded?(o.removeAttribute("hidden"),o.style.setProperty("--disclosure-panel-width",o.scrollWidth+"px"),o.style.setProperty("--disclosure-panel-height",o.scrollHeight+"px"),Promise.all(o.getAnimations().map($=>$.finished)).then(()=>{o.style.setProperty("--disclosure-panel-width","auto"),o.style.setProperty("--disclosure-panel-height","auto")}).catch(()=>{})):(o.style.setProperty("--disclosure-panel-width",o.scrollWidth+"px"),o.style.setProperty("--disclosure-panel-height",o.scrollHeight+"px"),window.getComputedStyle(o).height,o.style.setProperty("--disclosure-panel-width","0px"),o.style.setProperty("--disclosure-panel-height","0px"),Promise.all(o.getAnimations().map($=>$.finished)).then(()=>o.setAttribute("hidden","until-found")).catch(()=>{}))),m.current=r.isExpanded}},[t,i,r.isExpanded,s]),l.useEffect(()=>()=>{u.current&&cancelAnimationFrame(u.current)},[]),{buttonProps:{id:n,"aria-expanded":r.isExpanded,"aria-controls":d,onPress:o=>{!t&&o.pointerType!=="keyboard"&&r.toggle()},isDisabled:t,onPressStart(o){o.pointerType==="keyboard"&&!t&&r.toggle()}},panelProps:{id:d,role:"group","aria-labelledby":n,"aria-hidden":!r.isExpanded,hidden:s||t?t||!r.isExpanded:void 0}}}function le(a){let[r,i]=H(a.isExpanded,a.defaultExpanded||!1,a.onExpandedChange);const t=l.useCallback(()=>{i(!0)},[i]),n=l.useCallback(()=>{i(!1)},[i]),d=l.useCallback(()=>{i(!r)},[i,r]);return{isExpanded:r,setExpanded:i,expand:t,collapse:n,toggle:d}}function ce(a){let{allowsMultipleExpanded:r=!1,isDisabled:i=!1}=a,[t,n]=H(l.useMemo(()=>a.expandedKeys?new Set(a.expandedKeys):void 0,[a.expandedKeys]),l.useMemo(()=>a.defaultExpandedKeys?new Set(a.defaultExpandedKeys):new Set,[a.defaultExpandedKeys]),a.onExpandedChange);return l.useEffect(()=>{if(!r&&t.size>1){let d=t.values().next().value;d!=null&&n(new Set([d]))}}),{allowsMultipleExpanded:r,isDisabled:i,expandedKeys:t,setExpandedKeys:n,toggleKey(d){let s;r?(s=new Set(t),s.has(d)?s.delete(d):s.add(d)):s=new Set(t.has(d)?[]:[d]),n(s)}}}const k=l.createContext(null),ue=l.forwardRef(function(r,i){let t=ce(r),n=R({...r,defaultClassName:"react-aria-DisclosureGroup",values:{isDisabled:t.isDisabled,state:t}}),d=G(r,{global:!0});return y.createElement("div",{...d,...n,ref:i,"data-disabled":r.isDisabled||void 0},y.createElement(k.Provider,{value:t},n.children))}),pe=l.createContext(null),fe=l.createContext(null),O=l.createContext(null),xe=l.forwardRef(function(r,i){[r,i]=Z(r,i,pe);let t=l.useContext(k),{id:n,...d}=r,s=B();n||(n=s);let u=t?t.expandedKeys.has(n):r.isExpanded,g=le({...r,isExpanded:u,onExpandedChange(L){var I;t&&t.toggleKey(n),(I=r.onExpandedChange)===null||I===void 0||I.call(r,L)}}),m=y.useRef(null),o=r.isDisabled||t?.isDisabled||!1,{buttonProps:$,panelProps:V}=de({...r,isExpanded:u,isDisabled:o},g,m),{isFocusVisible:M,focusProps:U}=z({within:!0}),F=R({...r,id:void 0,defaultClassName:"react-aria-Disclosure",values:{isExpanded:g.isExpanded,isDisabled:o,isFocusVisibleWithin:M,state:g}}),J=G(d,{global:!0});return y.createElement(W,{values:[[K,{slots:{[ee]:{},trigger:$}}],[O,{panelProps:V,panelRef:m}],[fe,g]]},y.createElement("div",{...q(J,F,U),ref:i,"data-expanded":g.isExpanded||void 0,"data-disabled":o||void 0,"data-focus-visible-within":M||void 0},F.children))}),ge=l.forwardRef(function(r,i){let{role:t="group"}=r,{panelProps:n,panelRef:d}=l.useContext(O),{isFocusVisible:s,focusProps:u}=z({within:!0}),g=R({...r,defaultClassName:"react-aria-DisclosurePanel",values:{isFocusVisibleWithin:s}}),m=G(r,{global:!0});return y.createElement("div",{...q(m,g,n,u),ref:re(i,d),role:t,"data-focus-visible-within":s||void 0},y.createElement(W,{values:[[K,null]]},r.children))}),S={classNames:{root:"bui-Accordion",trigger:"bui-AccordionTrigger",triggerButton:"bui-AccordionTriggerButton",triggerTitle:"bui-AccordionTriggerTitle",triggerSubtitle:"bui-AccordionTriggerSubtitle",triggerIcon:"bui-AccordionTriggerIcon",panel:"bui-AccordionPanel",group:"bui-AccordionGroup"}},b={"bui-Accordion":"_bui-Accordion_1vd3l_20","bui-AccordionTrigger":"_bui-AccordionTrigger_1vd3l_27","bui-AccordionTriggerButton":"_bui-AccordionTriggerButton_1vd3l_35","bui-AccordionTriggerTitle":"_bui-AccordionTriggerTitle_1vd3l_58","bui-AccordionTriggerSubtitle":"_bui-AccordionTriggerSubtitle_1vd3l_64","bui-AccordionTriggerIcon":"_bui-AccordionTriggerIcon_1vd3l_70","bui-AccordionPanel":"_bui-AccordionPanel_1vd3l_81","bui-AccordionGroup":"_bui-AccordionGroup_1vd3l_87"},c=l.forwardRef(({className:a,...r},i)=>{const{classNames:t,cleanedProps:n}=_(S,r);return e.jsx(xe,{ref:i,className:h(t.root,b[t.root],a),...n})});c.displayName="Accordion";const p=l.forwardRef(({className:a,title:r,subtitle:i,children:t,...n},d)=>{const{classNames:s,cleanedProps:u}=_(S,n);return e.jsx(ne,{ref:d,className:h(s.trigger,b[s.trigger],a),...u,children:e.jsxs(Y,{slot:"trigger",className:h(s.triggerButton,b[s.triggerButton]),children:[t||e.jsxs(ae,{gap:"2",align:"center",children:[e.jsx("span",{className:h(s.triggerTitle,b[s.triggerTitle]),children:r}),i&&e.jsx("span",{className:h(s.triggerSubtitle,b[s.triggerSubtitle]),children:i})]}),e.jsx(se,{className:h(s.triggerIcon,b[s.triggerIcon]),size:16})]})})});p.displayName="AccordionTrigger";const f=l.forwardRef(({className:a,...r},i)=>{const{classNames:t,cleanedProps:n}=_(S,r);return e.jsx(ge,{ref:i,className:h(t.panel,b[t.panel],a),...n})});f.displayName="AccordionPanel";const N=l.forwardRef(({className:a,allowsMultiple:r=!1,...i},t)=>{const{classNames:n,cleanedProps:d}=_(S,i);return e.jsx(ue,{ref:t,allowsMultipleExpanded:r,className:h(n.group,b[n.group],a),...d})});N.displayName="AccordionGroup";c.__docgenInfo={description:"@public",methods:[],displayName:"Accordion",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["RADisclosureProps"]};p.__docgenInfo={description:"@public",methods:[],displayName:"AccordionTrigger",props:{className:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["RAHeadingProps"]};f.__docgenInfo={description:"@public",methods:[],displayName:"AccordionPanel",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["RADisclosurePanelProps"]};N.__docgenInfo={description:"@public",methods:[],displayName:"AccordionGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},allowsMultiple:{required:!1,tsType:{name:"boolean"},description:`Whether multiple accordions can be expanded at the same time.
@defaultValue false`,defaultValue:{value:"false",computed:!1}}},composes:["RADisclosureGroupProps"]};const D=()=>e.jsxs(A,{children:[e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"}),e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})]}),P=X.meta({title:"Backstage UI/Accordion",component:c}),T=P.story({render:()=>e.jsxs(c,{children:[e.jsx(p,{title:"Toggle Panel"}),e.jsx(f,{children:e.jsx(D,{})})]})}),j=P.story({render:()=>e.jsxs(c,{children:[e.jsx(p,{title:"Advanced Settings",subtitle:"Configure additional options"}),e.jsx(f,{children:e.jsx(D,{})})]})}),E=P.story({render:()=>e.jsxs(c,{children:[e.jsx(p,{children:e.jsxs(A,{children:[e.jsx(x,{as:"div",variant:"body-large",weight:"bold",children:"Custom Multi-line Trigger"}),e.jsx(x,{as:"div",variant:"body-medium",color:"secondary",children:"Click to expand additional details and configuration options"})]})}),e.jsx(f,{children:e.jsx(D,{})})]})}),v=P.story({render:()=>e.jsxs(c,{defaultExpanded:!0,children:[e.jsx(p,{title:"Toggle Panel"}),e.jsx(f,{children:e.jsx(D,{})})]})}),w=P.story({render:()=>e.jsxs(N,{children:[e.jsxs(c,{children:[e.jsx(p,{title:"First Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Second Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Third Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),C=P.story({render:()=>e.jsxs(N,{allowsMultiple:!0,children:[e.jsxs(c,{children:[e.jsx(p,{title:"First Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Second Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Third Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})});T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...T.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion>
      <AccordionTrigger title="Advanced Settings" subtitle="Configure additional options" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...j.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion>
      <AccordionTrigger>
        <Box>
          <Text as="div" variant="body-large" weight="bold">
            Custom Multi-line Trigger
          </Text>
          <Text as="div" variant="body-medium" color="secondary">
            Click to expand additional details and configuration options
          </Text>
        </Box>
      </AccordionTrigger>
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...E.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion defaultExpanded>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...v.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <AccordionGroup>
      <Accordion>
        <AccordionTrigger title="First Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              It's the edge of the world and all of Western civilization
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Second Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              The sun may rise in the East, at least it settled in a final
              location
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Third Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              It's understood that Hollywood sells Californication
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
    </AccordionGroup>
})`,...w.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <AccordionGroup allowsMultiple>
      <Accordion>
        <AccordionTrigger title="First Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              It's the edge of the world and all of Western civilization
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Second Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              The sun may rise in the East, at least it settled in a final
              location
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Third Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              It's understood that Hollywood sells Californication
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
    </AccordionGroup>
})`,...C.input.parameters?.docs?.source}}};const Ke=["Default","WithSubtitle","CustomTrigger","DefaultExpanded","GroupSingleOpen","GroupMultipleOpen"];export{E as CustomTrigger,T as Default,v as DefaultExpanded,C as GroupMultipleOpen,w as GroupSingleOpen,j as WithSubtitle,Ke as __namedExportsOrder};
