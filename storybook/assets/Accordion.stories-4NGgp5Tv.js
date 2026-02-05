import{r as d,b as Q,R as v,j as e,p as X}from"./iframe-M9O-K8SB.js";import{c as F,$ as Y}from"./Button-Dkbd3KcU.js";import{$ as Z,a as R,e as K,g as ee,f as oe}from"./utils-BXllfVt4.js";import{a as I,e as re,b as ne,$ as H}from"./useObjectRef-BPFp5snO.js";import{$ as G}from"./useFocusable-BwFERnd_.js";import{$ as q}from"./useControlledState-DzBnLbpE.js";import{$ as te}from"./useEvent-BRbGx-1q.js";import{a as z}from"./useFocusRing-COnCKKka.js";import{$ as ie}from"./Heading-i6qdobEN.js";import{m as ae}from"./index-BKJKY9Wv.js";import{c as A}from"./clsx-B-dksMZM.js";import{u as S}from"./useStyles-BRwt6BXn.js";import{F as se}from"./Flex-Bz2InqMs.js";import{B as E}from"./Box-FY2l0ff9.js";import{T as f}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-o9S_v-xF.js";import"./Hidden-DTd05gNK.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./context-Bv6kxITJ.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./RSPContexts-BdpIjeVF.js";import"./useSurface-CJaN3YoD.js";import"./defineComponent-BmABoWOu.js";function ce(s,o,n){let{isDisabled:r}=s,i=I(),c=I(),a=re(),p=d.useRef(null),g=d.useCallback(()=>{p.current=requestAnimationFrame(()=>{n.current&&n.current.setAttribute("hidden","until-found")}),Q.flushSync(()=>{o.toggle()})},[n,o]);te(n,"beforematch",g);let m=d.useRef(null);return ne(()=>{if(p.current&&cancelAnimationFrame(p.current),n.current&&!a){let t=n.current;m.current==null||typeof t.getAnimations!="function"?o.isExpanded?(t.removeAttribute("hidden"),t.style.setProperty("--disclosure-panel-width","auto"),t.style.setProperty("--disclosure-panel-height","auto")):(t.setAttribute("hidden","until-found"),t.style.setProperty("--disclosure-panel-width","0px"),t.style.setProperty("--disclosure-panel-height","0px")):o.isExpanded!==m.current&&(o.isExpanded?(t.removeAttribute("hidden"),t.style.setProperty("--disclosure-panel-width",t.scrollWidth+"px"),t.style.setProperty("--disclosure-panel-height",t.scrollHeight+"px"),Promise.all(t.getAnimations().map(C=>C.finished)).then(()=>{t.style.setProperty("--disclosure-panel-width","auto"),t.style.setProperty("--disclosure-panel-height","auto")}).catch(()=>{})):(t.style.setProperty("--disclosure-panel-width",t.scrollWidth+"px"),t.style.setProperty("--disclosure-panel-height",t.scrollHeight+"px"),window.getComputedStyle(t).height,t.style.setProperty("--disclosure-panel-width","0px"),t.style.setProperty("--disclosure-panel-height","0px"),Promise.all(t.getAnimations().map(C=>C.finished)).then(()=>t.setAttribute("hidden","until-found")).catch(()=>{}))),m.current=o.isExpanded}},[r,n,o.isExpanded,a]),d.useEffect(()=>()=>{p.current&&cancelAnimationFrame(p.current)},[]),{buttonProps:{id:i,"aria-expanded":o.isExpanded,"aria-controls":c,onPress:t=>{!r&&t.pointerType!=="keyboard"&&o.toggle()},isDisabled:r,onPressStart(t){t.pointerType==="keyboard"&&!r&&o.toggle()}},panelProps:{id:c,role:"group","aria-labelledby":i,"aria-hidden":!o.isExpanded,hidden:a?!o.isExpanded:void 0}}}function de(s){let[o,n]=q(s.isExpanded,s.defaultExpanded||!1,s.onExpandedChange);const r=d.useCallback(()=>{n(!0)},[n]),i=d.useCallback(()=>{n(!1)},[n]),c=d.useCallback(()=>{n(!o)},[n,o]);return{isExpanded:o,setExpanded:n,expand:r,collapse:i,toggle:c}}function le(s){let{allowsMultipleExpanded:o=!1,isDisabled:n=!1}=s,[r,i]=q(d.useMemo(()=>s.expandedKeys?new Set(s.expandedKeys):void 0,[s.expandedKeys]),d.useMemo(()=>s.defaultExpandedKeys?new Set(s.defaultExpandedKeys):new Set,[s.defaultExpandedKeys]),s.onExpandedChange);return d.useEffect(()=>{if(!o&&r.size>1){let c=r.values().next().value;c!=null&&i(new Set([c]))}}),{allowsMultipleExpanded:o,isDisabled:n,expandedKeys:r,setExpandedKeys:i,toggleKey(c){let a;o?(a=new Set(r),a.has(c)?a.delete(c):a.add(c)):a=new Set(r.has(c)?[]:[c]),i(a)}}}const O=d.createContext(null),pe=d.forwardRef(function(o,n){let r=le(o),i=R({...o,defaultClassName:"react-aria-DisclosureGroup",values:{isDisabled:r.isDisabled,state:r}}),c=G(o,{global:!0});return v.createElement("div",{...c,...i,ref:n,"data-disabled":o.isDisabled||void 0},v.createElement(O.Provider,{value:r},i.children))}),ue=d.createContext(null),xe=d.createContext(null),k=d.createContext(null),fe=d.forwardRef(function(o,n){[o,n]=Z(o,n,ue);let r=d.useContext(O),{id:i,...c}=o,a=I();i||(i=a);let p=r?r.expandedKeys.has(i):o.isExpanded,g=de({...o,isExpanded:p,onExpandedChange(L){var N;r&&r.toggleKey(i),(N=o.onExpandedChange)===null||N===void 0||N.call(o,L)}}),m=v.useRef(null),t=o.isDisabled||r?.isDisabled||!1,{buttonProps:C,panelProps:V}=ce({...o,isExpanded:p,isDisabled:t},g,m),{isFocusVisible:M,focusProps:U}=z({within:!0}),W=R({...o,id:void 0,defaultClassName:"react-aria-Disclosure",values:{isExpanded:g.isExpanded,isDisabled:t,isFocusVisibleWithin:M,state:g}}),J=G(c,{global:!0});return v.createElement(K,{values:[[F,{slots:{[ee]:{},trigger:C}}],[k,{panelProps:V,panelRef:m}],[xe,g]]},v.createElement("div",{...H(J,W,U),ref:n,"data-expanded":g.isExpanded||void 0,"data-disabled":t||void 0,"data-focus-visible-within":M||void 0},W.children))}),ge=d.forwardRef(function(o,n){let{role:r="group"}=o,{panelProps:i,panelRef:c}=d.useContext(k),{isFocusVisible:a,focusProps:p}=z({within:!0}),g=R({...o,defaultClassName:"react-aria-DisclosurePanel",values:{isFocusVisibleWithin:a}}),m=G(o,{global:!0,labelable:!0});return v.createElement("div",{...H(m,g,i,p),ref:oe(n,c),role:r,"data-focus-visible-within":a||void 0},v.createElement(K,{values:[[F,null]]},o.children))}),B={classNames:{root:"bui-Accordion",trigger:"bui-AccordionTrigger",triggerButton:"bui-AccordionTriggerButton",triggerTitle:"bui-AccordionTriggerTitle",triggerSubtitle:"bui-AccordionTriggerSubtitle",triggerIcon:"bui-AccordionTriggerIcon",panel:"bui-AccordionPanel",group:"bui-AccordionGroup"}},h={"bui-Accordion":"_bui-Accordion_15exx_20","bui-AccordionTrigger":"_bui-AccordionTrigger_15exx_27","bui-AccordionTriggerButton":"_bui-AccordionTriggerButton_15exx_35","bui-AccordionTriggerTitle":"_bui-AccordionTriggerTitle_15exx_58","bui-AccordionTriggerSubtitle":"_bui-AccordionTriggerSubtitle_15exx_64","bui-AccordionTriggerIcon":"_bui-AccordionTriggerIcon_15exx_70","bui-AccordionPanel":"_bui-AccordionPanel_15exx_81","bui-AccordionGroup":"_bui-AccordionGroup_15exx_87"},l=d.forwardRef(({className:s,...o},n)=>{const{classNames:r,cleanedProps:i}=S(B,o);return e.jsx(fe,{ref:n,className:A(r.root,h[r.root],s),...i})});l.displayName="Accordion";const u=d.forwardRef(({className:s,title:o,subtitle:n,children:r,...i},c)=>{const{classNames:a,cleanedProps:p}=S(B,i);return e.jsx(ie,{ref:c,className:A(a.trigger,h[a.trigger],s),...p,children:e.jsxs(Y,{slot:"trigger",className:A(a.triggerButton,h[a.triggerButton]),children:[r||e.jsxs(se,{gap:"2",align:"center",children:[e.jsx("span",{className:A(a.triggerTitle,h[a.triggerTitle]),children:o}),n&&e.jsx("span",{className:A(a.triggerSubtitle,h[a.triggerSubtitle]),children:n})]}),e.jsx(ae,{className:A(a.triggerIcon,h[a.triggerIcon]),size:16})]})})});u.displayName="AccordionTrigger";const x=d.forwardRef(({className:s,...o},n)=>{const{classNames:r,cleanedProps:i}=S(B,o);return e.jsx(ge,{ref:n,className:A(r.panel,h[r.panel],s),...i})});x.displayName="AccordionPanel";const _=d.forwardRef(({className:s,allowsMultiple:o=!1,...n},r)=>{const{classNames:i,cleanedProps:c}=S(B,n);return e.jsx(pe,{ref:r,allowsMultipleExpanded:o,className:A(i.group,h[i.group],s),...c})});_.displayName="AccordionGroup";l.__docgenInfo={description:"@public",methods:[],displayName:"Accordion",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["RADisclosureProps"]};u.__docgenInfo={description:"@public",methods:[],displayName:"AccordionTrigger",props:{className:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["RAHeadingProps"]};x.__docgenInfo={description:"@public",methods:[],displayName:"AccordionPanel",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["RADisclosurePanelProps"]};_.__docgenInfo={description:"@public",methods:[],displayName:"AccordionGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},allowsMultiple:{required:!1,tsType:{name:"boolean"},description:`Whether multiple accordions can be expanded at the same time.
@defaultValue false`,defaultValue:{value:"false",computed:!1}}},composes:["RADisclosureGroupProps"]};const D=()=>e.jsxs(E,{children:[e.jsx(f,{as:"p",children:"It's the edge of the world and all of Western civilization"}),e.jsx(f,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(f,{as:"p",children:"It's understood that Hollywood sells Californication"})]}),w=X.meta({title:"Backstage UI/Accordion",component:l}),b=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(x,{children:e.jsx(D,{})})]})}),T=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{title:"Advanced Settings",subtitle:"Configure additional options"}),e.jsx(x,{children:e.jsx(D,{})})]})}),P=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{children:e.jsxs(E,{children:[e.jsx(f,{as:"div",variant:"body-large",weight:"bold",children:"Custom Multi-line Trigger"}),e.jsx(f,{as:"div",variant:"body-medium",color:"secondary",children:"Click to expand additional details and configuration options"})]})}),e.jsx(x,{children:e.jsx(D,{})})]})}),y=w.story({render:()=>e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(x,{children:e.jsx(D,{})})]})}),$=w.story({render:()=>e.jsxs(_,{children:[e.jsxs(l,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(x,{children:e.jsx(E,{children:e.jsx(f,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(x,{children:e.jsx(E,{children:e.jsx(f,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(x,{children:e.jsx(E,{children:e.jsx(f,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),j=w.story({render:()=>e.jsxs(_,{allowsMultiple:!0,children:[e.jsxs(l,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(x,{children:e.jsx(E,{children:e.jsx(f,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(x,{children:e.jsx(E,{children:e.jsx(f,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(x,{children:e.jsx(E,{children:e.jsx(f,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})});b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const Default = () => (
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
