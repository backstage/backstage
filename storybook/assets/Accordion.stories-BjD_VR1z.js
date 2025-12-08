import{r as l,F as L,a2 as P,j as e}from"./iframe-CA0Xqitl.js";import{b as F,$ as Q}from"./Button-CjoOUm65.js";import{$ as X,a as B,e as K,g as Y,f as Z}from"./utils-CxRSQOHD.js";import{a as I,f as ee,c as re,b as W}from"./useObjectRef-galIu8y9.js";import{$ as R}from"./useFocusable-B_K0Toxg.js";import{$ as q}from"./useControlledState-8zGhBtdn.js";import{$ as oe}from"./useEvent-CkLerqy-.js";import{a as H}from"./useFocusRing-XSvWfqXQ.js";import{$ as ie}from"./Heading-1COdLHHt.js";import{h as te}from"./index-Uz4cXNx-.js";import{c as h}from"./clsx-B-dksMZM.js";import{u as C}from"./useStyles-DWCTEpsL.js";import{F as ne}from"./Flex-UeRHtQGJ.js";import{B as A}from"./Box-TuEfIAW3.js";import{T as x}from"./Text-BE_v3cq4.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-9E4Aif6g.js";import"./Hidden-DiEvt5li.js";import"./useLabel-CJ64sIWi.js";import"./useLabels-DoeKqma6.js";import"./context-C_kA5pZC.js";import"./usePress-Cm_6NlmW.js";import"./RSPContexts-BkSlNiDX.js";function se(a,r,i){let{isDisabled:o}=a,n=I(),d=I(),s=ee(),u=l.useRef(null),g=l.useCallback(()=>{u.current=requestAnimationFrame(()=>{i.current&&i.current.setAttribute("hidden","until-found")}),L.flushSync(()=>{r.toggle()})},[i,r]);oe(i,"beforematch",g);let m=l.useRef(null);return re(()=>{if(u.current&&cancelAnimationFrame(u.current),i.current&&!o&&!s){let t=i.current;m.current==null||typeof t.getAnimations!="function"?r.isExpanded?(t.removeAttribute("hidden"),t.style.setProperty("--disclosure-panel-width","auto"),t.style.setProperty("--disclosure-panel-height","auto")):(t.setAttribute("hidden","until-found"),t.style.setProperty("--disclosure-panel-width","0px"),t.style.setProperty("--disclosure-panel-height","0px")):r.isExpanded!==m.current&&(r.isExpanded?(t.removeAttribute("hidden"),t.style.setProperty("--disclosure-panel-width",t.scrollWidth+"px"),t.style.setProperty("--disclosure-panel-height",t.scrollHeight+"px"),Promise.all(t.getAnimations().map($=>$.finished)).then(()=>{t.style.setProperty("--disclosure-panel-width","auto"),t.style.setProperty("--disclosure-panel-height","auto")}).catch(()=>{})):(t.style.setProperty("--disclosure-panel-width",t.scrollWidth+"px"),t.style.setProperty("--disclosure-panel-height",t.scrollHeight+"px"),window.getComputedStyle(t).height,t.style.setProperty("--disclosure-panel-width","0px"),t.style.setProperty("--disclosure-panel-height","0px"),Promise.all(t.getAnimations().map($=>$.finished)).then(()=>t.setAttribute("hidden","until-found")).catch(()=>{}))),m.current=r.isExpanded}},[o,i,r.isExpanded,s]),l.useEffect(()=>()=>{u.current&&cancelAnimationFrame(u.current)},[]),{buttonProps:{id:n,"aria-expanded":r.isExpanded,"aria-controls":d,onPress:t=>{!o&&t.pointerType!=="keyboard"&&r.toggle()},isDisabled:o,onPressStart(t){t.pointerType==="keyboard"&&!o&&r.toggle()}},panelProps:{id:d,role:"group","aria-labelledby":n,"aria-hidden":!r.isExpanded,hidden:s||o?o||!r.isExpanded:void 0}}}function ae(a){let[r,i]=q(a.isExpanded,a.defaultExpanded||!1,a.onExpandedChange);const o=l.useCallback(()=>{i(!0)},[i]),n=l.useCallback(()=>{i(!1)},[i]),d=l.useCallback(()=>{i(!r)},[i,r]);return{isExpanded:r,setExpanded:i,expand:o,collapse:n,toggle:d}}function de(a){let{allowsMultipleExpanded:r=!1,isDisabled:i=!1}=a,[o,n]=q(l.useMemo(()=>a.expandedKeys?new Set(a.expandedKeys):void 0,[a.expandedKeys]),l.useMemo(()=>a.defaultExpandedKeys?new Set(a.defaultExpandedKeys):new Set,[a.defaultExpandedKeys]),a.onExpandedChange);return l.useEffect(()=>{if(!r&&o.size>1){let d=o.values().next().value;d!=null&&n(new Set([d]))}}),{allowsMultipleExpanded:r,isDisabled:i,expandedKeys:o,setExpandedKeys:n,toggleKey(d){let s;r?(s=new Set(o),s.has(d)?s.delete(d):s.add(d)):s=new Set(o.has(d)?[]:[d]),n(s)}}}const z=l.createContext(null),le=l.forwardRef(function(r,i){let o=de(r),n=B({...r,defaultClassName:"react-aria-DisclosureGroup",values:{isDisabled:o.isDisabled,state:o}}),d=R(r,{global:!0});return P.createElement("div",{...d,...n,ref:i,"data-disabled":r.isDisabled||void 0},P.createElement(z.Provider,{value:o},n.children))}),ce=l.createContext(null),ue=l.createContext(null),k=l.createContext(null),pe=l.forwardRef(function(r,i){[r,i]=X(r,i,ce);let o=l.useContext(z),{id:n,...d}=r,s=I();n||(n=s);let u=o?o.expandedKeys.has(n):r.isExpanded,g=ae({...r,isExpanded:u,onExpandedChange(J){var D;o&&o.toggleKey(n),(D=r.onExpandedChange)===null||D===void 0||D.call(r,J)}}),m=P.useRef(null),t=r.isDisabled||o?.isDisabled||!1,{buttonProps:$,panelProps:O}=se({...r,isExpanded:u,isDisabled:t},g,m),{isFocusVisible:G,focusProps:V}=H({within:!0}),M=B({...r,id:void 0,defaultClassName:"react-aria-Disclosure",values:{isExpanded:g.isExpanded,isDisabled:t,isFocusVisibleWithin:G,state:g}}),U=R(d,{global:!0});return P.createElement(K,{values:[[F,{slots:{[Y]:{},trigger:$}}],[k,{panelProps:O,panelRef:m}],[ue,g]]},P.createElement("div",{...W(U,M,V),ref:i,"data-expanded":g.isExpanded||void 0,"data-disabled":t||void 0,"data-focus-visible-within":G||void 0},M.children))}),fe=l.forwardRef(function(r,i){let{role:o="group"}=r,{panelProps:n,panelRef:d}=l.useContext(k),{isFocusVisible:s,focusProps:u}=H({within:!0}),g=B({...r,defaultClassName:"react-aria-DisclosurePanel",values:{isFocusVisibleWithin:s}}),m=R(r,{global:!0});return P.createElement("div",{...W(m,g,n,u),ref:Z(i,d),role:o,"data-focus-visible-within":s||void 0},P.createElement(K,{values:[[F,null]]},r.children))}),_={classNames:{root:"bui-Accordion",trigger:"bui-AccordionTrigger",triggerButton:"bui-AccordionTriggerButton",triggerTitle:"bui-AccordionTriggerTitle",triggerSubtitle:"bui-AccordionTriggerSubtitle",triggerIcon:"bui-AccordionTriggerIcon",panel:"bui-AccordionPanel",group:"bui-AccordionGroup"}},b={"bui-Accordion":"_bui-Accordion_1vd3l_20","bui-AccordionTrigger":"_bui-AccordionTrigger_1vd3l_27","bui-AccordionTriggerButton":"_bui-AccordionTriggerButton_1vd3l_35","bui-AccordionTriggerTitle":"_bui-AccordionTriggerTitle_1vd3l_58","bui-AccordionTriggerSubtitle":"_bui-AccordionTriggerSubtitle_1vd3l_64","bui-AccordionTriggerIcon":"_bui-AccordionTriggerIcon_1vd3l_70","bui-AccordionPanel":"_bui-AccordionPanel_1vd3l_81","bui-AccordionGroup":"_bui-AccordionGroup_1vd3l_87"},c=l.forwardRef(({className:a,...r},i)=>{const{classNames:o,cleanedProps:n}=C(_,r);return e.jsx(pe,{ref:i,className:h(o.root,b[o.root],a),...n})});c.displayName="Accordion";const p=l.forwardRef(({className:a,title:r,subtitle:i,children:o,...n},d)=>{const{classNames:s,cleanedProps:u}=C(_,n);return e.jsx(ie,{ref:d,className:h(s.trigger,b[s.trigger],a),...u,children:e.jsxs(Q,{slot:"trigger",className:h(s.triggerButton,b[s.triggerButton]),children:[o||e.jsxs(ne,{gap:"2",align:"center",children:[e.jsx("span",{className:h(s.triggerTitle,b[s.triggerTitle]),children:r}),i&&e.jsx("span",{className:h(s.triggerSubtitle,b[s.triggerSubtitle]),children:i})]}),e.jsx(te,{className:h(s.triggerIcon,b[s.triggerIcon]),size:16})]})})});p.displayName="AccordionTrigger";const f=l.forwardRef(({className:a,...r},i)=>{const{classNames:o,cleanedProps:n}=C(_,r);return e.jsx(fe,{ref:i,className:h(o.panel,b[o.panel],a),...n})});f.displayName="AccordionPanel";const S=l.forwardRef(({className:a,allowsMultiple:r=!1,...i},o)=>{const{classNames:n,cleanedProps:d}=C(_,i);return e.jsx(le,{ref:o,allowsMultipleExpanded:r,className:h(n.group,b[n.group],a),...d})});S.displayName="AccordionGroup";c.__docgenInfo={description:"@public",methods:[],displayName:"Accordion",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["RADisclosureProps"]};p.__docgenInfo={description:"@public",methods:[],displayName:"AccordionTrigger",props:{className:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["RAHeadingProps"]};f.__docgenInfo={description:"@public",methods:[],displayName:"AccordionPanel",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["RADisclosurePanelProps"]};S.__docgenInfo={description:"@public",methods:[],displayName:"AccordionGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},allowsMultiple:{required:!1,tsType:{name:"boolean"},description:`Whether multiple accordions can be expanded at the same time.
@defaultValue false`,defaultValue:{value:"false",computed:!1}}},composes:["RADisclosureGroupProps"]};const N=()=>e.jsxs(A,{children:[e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"}),e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})]}),Me={title:"Backstage UI/Accordion",component:c},T={render:()=>e.jsxs(c,{children:[e.jsx(p,{title:"Toggle Panel"}),e.jsx(f,{children:e.jsx(N,{})})]})},y={render:()=>e.jsxs(c,{children:[e.jsx(p,{title:"Advanced Settings",subtitle:"Configure additional options"}),e.jsx(f,{children:e.jsx(N,{})})]})},j={render:()=>e.jsxs(c,{children:[e.jsx(p,{children:e.jsxs(A,{children:[e.jsx(x,{as:"div",variant:"body-large",weight:"bold",children:"Custom Multi-line Trigger"}),e.jsx(x,{as:"div",variant:"body-medium",color:"secondary",children:"Click to expand additional details and configuration options"})]})}),e.jsx(f,{children:e.jsx(N,{})})]})},E={render:()=>e.jsxs(c,{defaultExpanded:!0,children:[e.jsx(p,{title:"Toggle Panel"}),e.jsx(f,{children:e.jsx(N,{})})]})},v={render:()=>e.jsxs(S,{children:[e.jsxs(c,{children:[e.jsx(p,{title:"First Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Second Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Third Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})},w={render:()=>e.jsxs(S,{allowsMultiple:!0,children:[e.jsxs(c,{children:[e.jsx(p,{title:"First Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Second Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Third Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
}`,...T.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion>
      <AccordionTrigger title="Advanced Settings" subtitle="Configure additional options" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
}`,...y.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion defaultExpanded>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
}`,...E.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}};const Fe=["Default","WithSubtitle","CustomTrigger","DefaultExpanded","GroupSingleOpen","GroupMultipleOpen"];export{j as CustomTrigger,T as Default,E as DefaultExpanded,w as GroupMultipleOpen,v as GroupSingleOpen,y as WithSubtitle,Fe as __namedExportsOrder,Me as default};
