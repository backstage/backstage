import{r as c,F as Q,a2 as E,j as e,a5 as X}from"./iframe-Vo5gUnCl.js";import{c as F,$ as Y}from"./Button-Bu-Jni_F.js";import{$ as Z,a as R,e as K,g as ee,f as oe}from"./utils-CxJb9RRu.js";import{a as I,e as re,b as ne,$ as H}from"./useObjectRef-DPm83nRg.js";import{a as G}from"./useFocusable-DDJ8DyJC.js";import{$ as q}from"./useControlledState-D6LAcrsN.js";import{$ as te}from"./useEvent-w5D-Op8K.js";import{a as z}from"./useFocusRing-tr7OGK-g.js";import{$ as ie}from"./Heading-Ca5JYHiS.js";import{m as ae}from"./index-BKpDU6T2.js";import{c as A}from"./clsx-B-dksMZM.js";import{a as S}from"./useStyles-DsV1TFgP.js";import{F as se}from"./Flex-Ceh1w4t8.js";import{B as v}from"./Box-wqMpmAlw.js";import{T as f}from"./Text-9KRDZBvS.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-BuzdhL8G.js";import"./Hidden-O6N3pCC7.js";import"./useLabel-3OTs8m_1.js";import"./useLabels-BmtpBEi9.js";import"./context-CokduHcg.js";import"./useButton-DHxXCmig.js";import"./usePress-tmBIh7GS.js";import"./RSPContexts-MXyT8MOS.js";import"./useSurface-BWG__pt_.js";import"./defineComponent-U8Ri8PQS.js";function de(s,o,n){let{isDisabled:r}=s,i=I(),d=I(),a=re(),p=c.useRef(null),g=c.useCallback(()=>{p.current=requestAnimationFrame(()=>{n.current&&n.current.setAttribute("hidden","until-found")}),Q.flushSync(()=>{o.toggle()})},[n,o]);te(n,"beforematch",g);let m=c.useRef(null);return ne(()=>{if(p.current&&cancelAnimationFrame(p.current),n.current&&!a){let t=n.current;m.current==null||typeof t.getAnimations!="function"?o.isExpanded?(t.removeAttribute("hidden"),t.style.setProperty("--disclosure-panel-width","auto"),t.style.setProperty("--disclosure-panel-height","auto")):(t.setAttribute("hidden","until-found"),t.style.setProperty("--disclosure-panel-width","0px"),t.style.setProperty("--disclosure-panel-height","0px")):o.isExpanded!==m.current&&(o.isExpanded?(t.removeAttribute("hidden"),t.style.setProperty("--disclosure-panel-width",t.scrollWidth+"px"),t.style.setProperty("--disclosure-panel-height",t.scrollHeight+"px"),Promise.all(t.getAnimations().map(C=>C.finished)).then(()=>{t.style.setProperty("--disclosure-panel-width","auto"),t.style.setProperty("--disclosure-panel-height","auto")}).catch(()=>{})):(t.style.setProperty("--disclosure-panel-width",t.scrollWidth+"px"),t.style.setProperty("--disclosure-panel-height",t.scrollHeight+"px"),window.getComputedStyle(t).height,t.style.setProperty("--disclosure-panel-width","0px"),t.style.setProperty("--disclosure-panel-height","0px"),Promise.all(t.getAnimations().map(C=>C.finished)).then(()=>t.setAttribute("hidden","until-found")).catch(()=>{}))),m.current=o.isExpanded}},[r,n,o.isExpanded,a]),c.useEffect(()=>()=>{p.current&&cancelAnimationFrame(p.current)},[]),{buttonProps:{id:i,"aria-expanded":o.isExpanded,"aria-controls":d,onPress:t=>{!r&&t.pointerType!=="keyboard"&&o.toggle()},isDisabled:r,onPressStart(t){t.pointerType==="keyboard"&&!r&&o.toggle()}},panelProps:{id:d,role:"group","aria-labelledby":i,"aria-hidden":!o.isExpanded,hidden:a?!o.isExpanded:void 0}}}function ce(s){let[o,n]=q(s.isExpanded,s.defaultExpanded||!1,s.onExpandedChange);const r=c.useCallback(()=>{n(!0)},[n]),i=c.useCallback(()=>{n(!1)},[n]),d=c.useCallback(()=>{n(!o)},[n,o]);return{isExpanded:o,setExpanded:n,expand:r,collapse:i,toggle:d}}function le(s){let{allowsMultipleExpanded:o=!1,isDisabled:n=!1}=s,[r,i]=q(c.useMemo(()=>s.expandedKeys?new Set(s.expandedKeys):void 0,[s.expandedKeys]),c.useMemo(()=>s.defaultExpandedKeys?new Set(s.defaultExpandedKeys):new Set,[s.defaultExpandedKeys]),s.onExpandedChange);return c.useEffect(()=>{if(!o&&r.size>1){let d=r.values().next().value;d!=null&&i(new Set([d]))}}),{allowsMultipleExpanded:o,isDisabled:n,expandedKeys:r,setExpandedKeys:i,toggleKey(d){let a;o?(a=new Set(r),a.has(d)?a.delete(d):a.add(d)):a=new Set(r.has(d)?[]:[d]),i(a)}}}const O=c.createContext(null),pe=c.forwardRef(function(o,n){let r=le(o),i=R({...o,defaultClassName:"react-aria-DisclosureGroup",values:{isDisabled:r.isDisabled,state:r}}),d=G(o,{global:!0});return E.createElement("div",{...d,...i,ref:n,"data-disabled":o.isDisabled||void 0},E.createElement(O.Provider,{value:r},i.children))}),ue=c.createContext(null),xe=c.createContext(null),k=c.createContext(null),fe=c.forwardRef(function(o,n){[o,n]=Z(o,n,ue);let r=c.useContext(O),{id:i,...d}=o,a=I();i||(i=a);let p=r?r.expandedKeys.has(i):o.isExpanded,g=ce({...o,isExpanded:p,onExpandedChange(L){var N;r&&r.toggleKey(i),(N=o.onExpandedChange)===null||N===void 0||N.call(o,L)}}),m=E.useRef(null),t=o.isDisabled||r?.isDisabled||!1,{buttonProps:C,panelProps:V}=de({...o,isExpanded:p,isDisabled:t},g,m),{isFocusVisible:M,focusProps:U}=z({within:!0}),W=R({...o,id:void 0,defaultClassName:"react-aria-Disclosure",values:{isExpanded:g.isExpanded,isDisabled:t,isFocusVisibleWithin:M,state:g}}),J=G(d,{global:!0});return E.createElement(K,{values:[[F,{slots:{[ee]:{},trigger:C}}],[k,{panelProps:V,panelRef:m}],[xe,g]]},E.createElement("div",{...H(J,W,U),ref:n,"data-expanded":g.isExpanded||void 0,"data-disabled":t||void 0,"data-focus-visible-within":M||void 0},W.children))}),ge=c.forwardRef(function(o,n){let{role:r="group"}=o,{panelProps:i,panelRef:d}=c.useContext(k),{isFocusVisible:a,focusProps:p}=z({within:!0}),g=R({...o,defaultClassName:"react-aria-DisclosurePanel",values:{isFocusVisibleWithin:a}}),m=G(o,{global:!0,labelable:!0});return E.createElement("div",{...H(m,g,i,p),ref:oe(n,d),role:r,"data-focus-visible-within":a||void 0},E.createElement(K,{values:[[F,null]]},o.children))}),B={classNames:{root:"bui-Accordion",trigger:"bui-AccordionTrigger",triggerButton:"bui-AccordionTriggerButton",triggerTitle:"bui-AccordionTriggerTitle",triggerSubtitle:"bui-AccordionTriggerSubtitle",triggerIcon:"bui-AccordionTriggerIcon",panel:"bui-AccordionPanel",group:"bui-AccordionGroup"}},h={"bui-Accordion":"_bui-Accordion_1vd3l_20","bui-AccordionTrigger":"_bui-AccordionTrigger_1vd3l_27","bui-AccordionTriggerButton":"_bui-AccordionTriggerButton_1vd3l_35","bui-AccordionTriggerTitle":"_bui-AccordionTriggerTitle_1vd3l_58","bui-AccordionTriggerSubtitle":"_bui-AccordionTriggerSubtitle_1vd3l_64","bui-AccordionTriggerIcon":"_bui-AccordionTriggerIcon_1vd3l_70","bui-AccordionPanel":"_bui-AccordionPanel_1vd3l_81","bui-AccordionGroup":"_bui-AccordionGroup_1vd3l_87"},l=c.forwardRef(({className:s,...o},n)=>{const{classNames:r,cleanedProps:i}=S(B,o);return e.jsx(fe,{ref:n,className:A(r.root,h[r.root],s),...i})});l.displayName="Accordion";const u=c.forwardRef(({className:s,title:o,subtitle:n,children:r,...i},d)=>{const{classNames:a,cleanedProps:p}=S(B,i);return e.jsx(ie,{ref:d,className:A(a.trigger,h[a.trigger],s),...p,children:e.jsxs(Y,{slot:"trigger",className:A(a.triggerButton,h[a.triggerButton]),children:[r||e.jsxs(se,{gap:"2",align:"center",children:[e.jsx("span",{className:A(a.triggerTitle,h[a.triggerTitle]),children:o}),n&&e.jsx("span",{className:A(a.triggerSubtitle,h[a.triggerSubtitle]),children:n})]}),e.jsx(ae,{className:A(a.triggerIcon,h[a.triggerIcon]),size:16})]})})});u.displayName="AccordionTrigger";const x=c.forwardRef(({className:s,...o},n)=>{const{classNames:r,cleanedProps:i}=S(B,o);return e.jsx(ge,{ref:n,className:A(r.panel,h[r.panel],s),...i})});x.displayName="AccordionPanel";const _=c.forwardRef(({className:s,allowsMultiple:o=!1,...n},r)=>{const{classNames:i,cleanedProps:d}=S(B,n);return e.jsx(pe,{ref:r,allowsMultipleExpanded:o,className:A(i.group,h[i.group],s),...d})});_.displayName="AccordionGroup";l.__docgenInfo={description:"@public",methods:[],displayName:"Accordion",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["RADisclosureProps"]};u.__docgenInfo={description:"@public",methods:[],displayName:"AccordionTrigger",props:{className:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["RAHeadingProps"]};x.__docgenInfo={description:"@public",methods:[],displayName:"AccordionPanel",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["RADisclosurePanelProps"]};_.__docgenInfo={description:"@public",methods:[],displayName:"AccordionGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},allowsMultiple:{required:!1,tsType:{name:"boolean"},description:`Whether multiple accordions can be expanded at the same time.
@defaultValue false`,defaultValue:{value:"false",computed:!1}}},composes:["RADisclosureGroupProps"]};const D=()=>e.jsxs(v,{children:[e.jsx(f,{as:"p",children:"It's the edge of the world and all of Western civilization"}),e.jsx(f,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(f,{as:"p",children:"It's understood that Hollywood sells Californication"})]}),w=X.meta({title:"Backstage UI/Accordion",component:l}),b=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(x,{children:e.jsx(D,{})})]})}),T=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{title:"Advanced Settings",subtitle:"Configure additional options"}),e.jsx(x,{children:e.jsx(D,{})})]})}),P=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{children:e.jsxs(v,{children:[e.jsx(f,{as:"div",variant:"body-large",weight:"bold",children:"Custom Multi-line Trigger"}),e.jsx(f,{as:"div",variant:"body-medium",color:"secondary",children:"Click to expand additional details and configuration options"})]})}),e.jsx(x,{children:e.jsx(D,{})})]})}),y=w.story({render:()=>e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(x,{children:e.jsx(D,{})})]})}),$=w.story({render:()=>e.jsxs(_,{children:[e.jsxs(l,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(x,{children:e.jsx(v,{children:e.jsx(f,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(x,{children:e.jsx(v,{children:e.jsx(f,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(x,{children:e.jsx(v,{children:e.jsx(f,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),j=w.story({render:()=>e.jsxs(_,{allowsMultiple:!0,children:[e.jsxs(l,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(x,{children:e.jsx(v,{children:e.jsx(f,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(x,{children:e.jsx(v,{children:e.jsx(f,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(x,{children:e.jsx(v,{children:e.jsx(f,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})});b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const Default = () => (
  <Accordion>
    <AccordionTrigger title="Toggle Panel" />
    <AccordionPanel>
      <Content />
    </AccordionPanel>
  </Accordion>
);
`,...b.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{code:`const WithSubtitle = () => (
  <Accordion>
    <AccordionTrigger
      title="Advanced Settings"
      subtitle="Configure additional options"
    />
    <AccordionPanel>
      <Content />
    </AccordionPanel>
  </Accordion>
);
`,...T.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{code:`const CustomTrigger = () => (
  <Accordion>
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
);
`,...P.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const DefaultExpanded = () => (
  <Accordion defaultExpanded>
    <AccordionTrigger title="Toggle Panel" />
    <AccordionPanel>
      <Content />
    </AccordionPanel>
  </Accordion>
);
`,...y.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{code:`const GroupSingleOpen = () => (
  <AccordionGroup>
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
);
`,...$.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{code:`const GroupMultipleOpen = () => (
  <AccordionGroup allowsMultiple>
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
);
`,...j.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...b.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion>
      <AccordionTrigger title="Advanced Settings" subtitle="Configure additional options" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...T.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...P.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion defaultExpanded>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...y.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...$.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};const qe=["Default","WithSubtitle","CustomTrigger","DefaultExpanded","GroupSingleOpen","GroupMultipleOpen"];export{P as CustomTrigger,b as Default,y as DefaultExpanded,j as GroupMultipleOpen,$ as GroupSingleOpen,T as WithSubtitle,qe as __namedExportsOrder};
