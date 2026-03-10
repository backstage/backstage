import{r as s,b as Z,R as C,ap as N,am as D,j as e,p as ee,B as g}from"./iframe-ByBrTvma.js";import{c as q,$ as te}from"./Button-DygmmQW3.js";import{$ as ne,b as W,f as z,g as oe,a as M}from"./utils-DVPuoPwD.js";import{d as G,f as re,c as ie,b as H,a as ae}from"./useObjectRef--wNNAN9F.js";import{a as R}from"./useFocusable-DKgeWWm7.js";import{$ as k}from"./useControlledState-ZHat3JP6.js";import{$ as ce}from"./useEvent-Bd2kloi_.js";import{a as V}from"./useFocusRing-GE4j_eMP.js";import{$ as se}from"./Heading-BMEOzqEK.js";import{m as de}from"./index-sd8Ux2S-.js";import{F as A}from"./Flex-h9vrKGEc.js";import{T as x}from"./Text-UqpB-ZNE.js";import{B as b}from"./Button-BERsJIHj.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-DYBByD6L.js";import"./Hidden-BF4ZJ44B.js";import"./useLabel-Tad-wwbL.js";import"./useLabels-DtY54nNP.js";import"./context-qznSNLgf.js";import"./useButton-CAemNEM7.js";import"./usePress-DLYRbVvc.js";import"./RSPContexts-AR8_NMpW.js";function le(c,t,o){let{isDisabled:n}=c,a=G(),i=G(),d=re(),f=s.useRef(null),m=s.useCallback(()=>{f.current=requestAnimationFrame(()=>{o.current&&o.current.setAttribute("hidden","until-found")}),Z.flushSync(()=>{t.toggle()})},[o,t]);ce(o,"beforematch",m);let h=s.useRef(null);return ie(()=>{if(f.current&&cancelAnimationFrame(f.current),o.current&&!d){let r=o.current;h.current==null||typeof r.getAnimations!="function"?t.isExpanded?(r.removeAttribute("hidden"),r.style.setProperty("--disclosure-panel-width","auto"),r.style.setProperty("--disclosure-panel-height","auto")):(r.setAttribute("hidden","until-found"),r.style.setProperty("--disclosure-panel-width","0px"),r.style.setProperty("--disclosure-panel-height","0px")):t.isExpanded!==h.current&&(t.isExpanded?(r.removeAttribute("hidden"),r.style.setProperty("--disclosure-panel-width",r.scrollWidth+"px"),r.style.setProperty("--disclosure-panel-height",r.scrollHeight+"px"),Promise.all(r.getAnimations().map(F=>F.finished)).then(()=>{r.style.setProperty("--disclosure-panel-width","auto"),r.style.setProperty("--disclosure-panel-height","auto")}).catch(()=>{})):(r.style.setProperty("--disclosure-panel-width",r.scrollWidth+"px"),r.style.setProperty("--disclosure-panel-height",r.scrollHeight+"px"),window.getComputedStyle(r).height,r.style.setProperty("--disclosure-panel-width","0px"),r.style.setProperty("--disclosure-panel-height","0px"),Promise.all(r.getAnimations().map(F=>F.finished)).then(()=>r.setAttribute("hidden","until-found")).catch(()=>{}))),h.current=t.isExpanded}},[n,o,t.isExpanded,d]),s.useEffect(()=>()=>{f.current&&cancelAnimationFrame(f.current)},[]),{buttonProps:{id:a,"aria-expanded":t.isExpanded,"aria-controls":i,onPress:r=>{!n&&r.pointerType!=="keyboard"&&t.toggle()},isDisabled:n,onPressStart(r){r.pointerType==="keyboard"&&!n&&t.toggle()}},panelProps:{id:i,role:"group","aria-labelledby":a,"aria-hidden":!t.isExpanded,hidden:d?!t.isExpanded:void 0}}}function ue(c){let[t,o]=k(c.isExpanded,c.defaultExpanded||!1,c.onExpandedChange);const n=s.useCallback(()=>{o(!0)},[o]),a=s.useCallback(()=>{o(!1)},[o]),i=s.useCallback(()=>{o(!t)},[o,t]);return{isExpanded:t,setExpanded:o,expand:n,collapse:a,toggle:i}}function pe(c){let{allowsMultipleExpanded:t=!1,isDisabled:o=!1}=c,[n,a]=k(s.useMemo(()=>c.expandedKeys?new Set(c.expandedKeys):void 0,[c.expandedKeys]),s.useMemo(()=>c.defaultExpandedKeys?new Set(c.defaultExpandedKeys):new Set,[c.defaultExpandedKeys]),c.onExpandedChange);return s.useEffect(()=>{if(!t&&n.size>1){let i=n.values().next().value;i!=null&&a(new Set([i]))}}),{allowsMultipleExpanded:t,isDisabled:o,expandedKeys:n,setExpandedKeys:a,toggleKey(i){let d;t?(d=new Set(n),d.has(i)?d.delete(i):d.add(i)):d=new Set(n.has(i)?[]:[i]),a(d)}}}const U=s.createContext(null),xe=s.forwardRef(function(t,o){let n=pe(t),a=W({...t,defaultClassName:"react-aria-DisclosureGroup",values:{isDisabled:n.isDisabled,state:n}}),i=R(t,{global:!0});return C.createElement(M.div,{...i,...a,ref:o,"data-disabled":t.isDisabled||void 0},C.createElement(U.Provider,{value:n},a.children))}),ge=s.createContext(null),fe=s.createContext(null),J=s.createContext(null),me=s.forwardRef(function(t,o){[t,o]=ne(t,o,ge);let n=s.useContext(U),{id:a,...i}=t,d=G();a||(a=d);let f=n?n.expandedKeys.has(a):t.isExpanded,m=ue({...t,isExpanded:f,onExpandedChange(Y){var I;n&&n.toggleKey(a),(I=t.onExpandedChange)===null||I===void 0||I.call(t,Y)}}),h=C.useRef(null),r=t.isDisabled||n?.isDisabled||!1,{buttonProps:F,panelProps:L}=le({...t,isExpanded:f,isDisabled:r},m,h),{isFocusVisible:K,focusProps:Q}=V({within:!0}),O=W({...t,id:void 0,defaultClassName:"react-aria-Disclosure",values:{isExpanded:m.isExpanded,isDisabled:r,isFocusVisibleWithin:K,state:m}}),X=R(i,{global:!0});return C.createElement(z,{values:[[q,{slots:{[oe]:{},trigger:F}}],[J,{panelProps:L,panelRef:h}],[fe,m]]},C.createElement(M.div,{...H(X,O,Q),ref:o,"data-expanded":m.isExpanded||void 0,"data-disabled":r||void 0,"data-focus-visible-within":K||void 0},O.children))}),Ae=s.forwardRef(function(t,o){let{role:n="group"}=t,{panelProps:a,panelRef:i}=s.useContext(J),{isFocusVisible:d,focusProps:f}=V({within:!0}),m=W({...t,defaultClassName:"react-aria-DisclosurePanel",values:{isFocusVisibleWithin:d}}),h=R(t,{global:!0,labelable:!0});return C.createElement(M.div,{...H(h,m,a,f),ref:ae(o,i),role:n,"data-focus-visible-within":d||void 0},C.createElement(z,{values:[[q,null]]},t.children))}),S={"bui-Accordion":"_bui-Accordion_1guru_20","bui-AccordionTrigger":"_bui-AccordionTrigger_1guru_38","bui-AccordionTriggerButton":"_bui-AccordionTriggerButton_1guru_46","bui-AccordionTriggerTitle":"_bui-AccordionTriggerTitle_1guru_69","bui-AccordionTriggerSubtitle":"_bui-AccordionTriggerSubtitle_1guru_75","bui-AccordionTriggerIcon":"_bui-AccordionTriggerIcon_1guru_81","bui-AccordionPanel":"_bui-AccordionPanel_1guru_92","bui-AccordionGroup":"_bui-AccordionGroup_1guru_98"},he=N()({styles:S,classNames:{root:"bui-Accordion"},bg:"provider",propDefs:{bg:{dataAttribute:!0,default:"neutral"},children:{},className:{}}}),be=N()({styles:S,classNames:{root:"bui-AccordionTrigger",button:"bui-AccordionTriggerButton",title:"bui-AccordionTriggerTitle",subtitle:"bui-AccordionTriggerSubtitle",icon:"bui-AccordionTriggerIcon"},propDefs:{className:{},title:{},subtitle:{},children:{}}}),Te=N()({styles:S,classNames:{root:"bui-AccordionPanel"},propDefs:{className:{}}}),Pe=N()({styles:S,classNames:{root:"bui-AccordionGroup"},propDefs:{className:{},allowsMultiple:{default:!1}}}),l=s.forwardRef((c,t)=>{const{ownProps:o,restProps:n,dataAttributes:a}=D(he,c),{classes:i,childrenWithBgProvider:d}=o;return e.jsx(me,{ref:t,className:i.root,...a,...n,children:d})});l.displayName="Accordion";const u=s.forwardRef((c,t)=>{const{ownProps:o,restProps:n,dataAttributes:a}=D(be,c),{classes:i,title:d,subtitle:f,children:m}=o;return e.jsx(se,{ref:t,className:i.root,...a,...n,children:e.jsxs(te,{slot:"trigger",className:i.button,children:[m||e.jsxs(A,{gap:"2",align:"center",children:[e.jsx("span",{className:i.title,children:d}),f&&e.jsx("span",{className:i.subtitle,children:f})]}),e.jsx(de,{className:i.icon,size:16})]})})});u.displayName="AccordionTrigger";const p=s.forwardRef((c,t)=>{const{ownProps:o,restProps:n,dataAttributes:a}=D(Te,c),{classes:i}=o;return e.jsx(Ae,{ref:t,className:i.root,...a,...n})});p.displayName="AccordionPanel";const _=s.forwardRef((c,t)=>{const{ownProps:o,restProps:n,dataAttributes:a}=D(Pe,c),{classes:i,allowsMultiple:d}=o;return e.jsx(xe,{ref:t,allowsMultipleExpanded:d,className:i.root,...a,...n})});_.displayName="AccordionGroup";l.__docgenInfo={description:"@public",methods:[],displayName:"Accordion",props:{bg:{required:!1,tsType:{name:"union",raw:"'neutral' | 'danger' | 'warning' | 'success'",elements:[{name:"literal",value:"'neutral'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"}]},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};u.__docgenInfo={description:"@public",methods:[],displayName:"AccordionTrigger",props:{className:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};p.__docgenInfo={description:"@public",methods:[],displayName:"AccordionPanel",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};_.__docgenInfo={description:"@public",methods:[],displayName:"AccordionGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},allowsMultiple:{required:!1,tsType:{name:"boolean"},description:`Whether multiple accordions can be expanded at the same time.
@defaultValue false`}},composes:["Omit"]};const T=()=>e.jsxs(g,{children:[e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"}),e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})]}),w=ee.meta({title:"Backstage UI/Accordion",component:l}),P=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(T,{})})]})}),y=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{title:"Advanced Settings",subtitle:"Configure additional options"}),e.jsx(p,{children:e.jsx(T,{})})]})}),j=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{children:e.jsxs(g,{children:[e.jsx(x,{as:"div",variant:"body-large",weight:"bold",children:"Custom Multi-line Trigger"}),e.jsx(x,{as:"div",variant:"body-medium",color:"secondary",children:"Click to expand additional details and configuration options"})]})}),e.jsx(p,{children:e.jsx(T,{})})]})}),B=w.story({render:()=>e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(T,{})})]})}),$=w.story({render:()=>e.jsxs(_,{children:[e.jsxs(l,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(p,{children:e.jsx(g,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(p,{children:e.jsx(g,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(p,{children:e.jsx(g,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),v=w.story({render:()=>e.jsxs(_,{allowsMultiple:!0,children:[e.jsxs(l,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(p,{children:e.jsx(g,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(p,{children:e.jsx(g,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(p,{children:e.jsx(g,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),E=w.story({render:()=>e.jsxs(A,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"Accordions automatically detect their parent bg context and increment the neutral level by 1. No prop is needed on the accordion -- it's fully automatic."}),e.jsxs(A,{direction:"column",gap:"4",children:[e.jsx(x,{children:"Default (no container)"}),e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsxs(p,{children:[e.jsx(T,{}),e.jsxs(A,{mt:"3",gap:"2",children:[e.jsx(b,{children:"Action"}),e.jsx(b,{variant:"secondary",children:"Cancel"})]})]})]})]}),e.jsxs(g,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 1 container"}),e.jsx(A,{mt:"2",children:e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-2)"}),e.jsxs(p,{children:[e.jsx(T,{}),e.jsxs(A,{mt:"3",gap:"2",children:[e.jsx(b,{children:"Action"}),e.jsx(b,{variant:"secondary",children:"Cancel"})]})]})]})})]}),e.jsx(g,{bg:"neutral",children:e.jsxs(g,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 2 container"}),e.jsx(A,{mt:"2",children:e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-3)"}),e.jsxs(p,{children:[e.jsx(T,{}),e.jsxs(A,{mt:"3",gap:"2",children:[e.jsx(b,{children:"Action"}),e.jsx(b,{variant:"secondary",children:"Cancel"})]})]})]})})]})}),e.jsx(g,{bg:"neutral",children:e.jsx(g,{bg:"neutral",children:e.jsxs(g,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 3 container"}),e.jsx(A,{mt:"2",children:e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-3)"}),e.jsxs(p,{children:[e.jsx(T,{}),e.jsxs(A,{mt:"3",gap:"2",children:[e.jsx(b,{children:"Action"}),e.jsx(b,{variant:"secondary",children:"Cancel"})]})]})]})})]})})})]})});P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{code:`const Default = () => (
  <Accordion>
    <AccordionTrigger title="Toggle Panel" />
    <AccordionPanel>
      <Content />
    </AccordionPanel>
  </Accordion>
);
`,...P.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const WithSubtitle = () => (
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
`,...y.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{code:`const CustomTrigger = () => (
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
`,...j.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{code:`const DefaultExpanded = () => (
  <Accordion defaultExpanded>
    <AccordionTrigger title="Toggle Panel" />
    <AccordionPanel>
      <Content />
    </AccordionPanel>
  </Accordion>
);
`,...B.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{code:`const GroupSingleOpen = () => (
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
`,...$.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const GroupMultipleOpen = () => (
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
`,...v.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{code:`const AutoBg = () => (
  <Flex direction="column" gap="4">
    <div style={{ maxWidth: "600px" }}>
      Accordions automatically detect their parent bg context and increment the
      neutral level by 1. No prop is needed on the accordion -- it's fully
      automatic.
    </div>
    <Flex direction="column" gap="4">
      <Text>Default (no container)</Text>
      <Accordion defaultExpanded>
        <AccordionTrigger title="Toggle Panel" />
        <AccordionPanel>
          <Content />
          <Flex mt="3" gap="2">
            <Button>Action</Button>
            <Button variant="secondary">Cancel</Button>
          </Flex>
        </AccordionPanel>
      </Accordion>
    </Flex>
    <Box bg="neutral" p="4">
      <Text>Neutral 1 container</Text>
      <Flex mt="2">
        <Accordion defaultExpanded>
          <AccordionTrigger title="Auto (neutral-2)" />
          <AccordionPanel>
            <Content />
            <Flex mt="3" gap="2">
              <Button>Action</Button>
              <Button variant="secondary">Cancel</Button>
            </Flex>
          </AccordionPanel>
        </Accordion>
      </Flex>
    </Box>
    <Box bg="neutral">
      <Box bg="neutral" p="4">
        <Text>Neutral 2 container</Text>
        <Flex mt="2">
          <Accordion defaultExpanded>
            <AccordionTrigger title="Auto (neutral-3)" />
            <AccordionPanel>
              <Content />
              <Flex mt="3" gap="2">
                <Button>Action</Button>
                <Button variant="secondary">Cancel</Button>
              </Flex>
            </AccordionPanel>
          </Accordion>
        </Flex>
      </Box>
    </Box>
    <Box bg="neutral">
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 3 container</Text>
          <Flex mt="2">
            <Accordion defaultExpanded>
              <AccordionTrigger title="Auto (neutral-3)" />
              <AccordionPanel>
                <Content />
                <Flex mt="3" gap="2">
                  <Button>Action</Button>
                  <Button variant="secondary">Cancel</Button>
                </Flex>
              </AccordionPanel>
            </Accordion>
          </Flex>
        </Box>
      </Box>
    </Box>
  </Flex>
);
`,...E.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...P.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion>
      <AccordionTrigger title="Advanced Settings" subtitle="Configure additional options" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...y.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion defaultExpanded>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...B.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...$.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...v.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <div style={{
      maxWidth: '600px'
    }}>
        Accordions automatically detect their parent bg context and increment
        the neutral level by 1. No prop is needed on the accordion -- it's fully
        automatic.
      </div>
      <Flex direction="column" gap="4">
        <Text>Default (no container)</Text>
        <Accordion defaultExpanded>
          <AccordionTrigger title="Toggle Panel" />
          <AccordionPanel>
            <Content />
            <Flex mt="3" gap="2">
              <Button>Action</Button>
              <Button variant="secondary">Cancel</Button>
            </Flex>
          </AccordionPanel>
        </Accordion>
      </Flex>
      <Box bg="neutral" p="4">
        <Text>Neutral 1 container</Text>
        <Flex mt="2">
          <Accordion defaultExpanded>
            <AccordionTrigger title="Auto (neutral-2)" />
            <AccordionPanel>
              <Content />
              <Flex mt="3" gap="2">
                <Button>Action</Button>
                <Button variant="secondary">Cancel</Button>
              </Flex>
            </AccordionPanel>
          </Accordion>
        </Flex>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 2 container</Text>
          <Flex mt="2">
            <Accordion defaultExpanded>
              <AccordionTrigger title="Auto (neutral-3)" />
              <AccordionPanel>
                <Content />
                <Flex mt="3" gap="2">
                  <Button>Action</Button>
                  <Button variant="secondary">Cancel</Button>
                </Flex>
              </AccordionPanel>
            </Accordion>
          </Flex>
        </Box>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Box bg="neutral" p="4">
            <Text>Neutral 3 container</Text>
            <Flex mt="2">
              <Accordion defaultExpanded>
                <AccordionTrigger title="Auto (neutral-3)" />
                <AccordionPanel>
                  <Content />
                  <Flex mt="3" gap="2">
                    <Button>Action</Button>
                    <Button variant="secondary">Cancel</Button>
                  </Flex>
                </AccordionPanel>
              </Accordion>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
})`,...E.input.parameters?.docs?.source}}};const He=["Default","WithSubtitle","CustomTrigger","DefaultExpanded","GroupSingleOpen","GroupMultipleOpen","AutoBg"];export{E as AutoBg,j as CustomTrigger,P as Default,B as DefaultExpanded,v as GroupMultipleOpen,$ as GroupSingleOpen,y as WithSubtitle,He as __namedExportsOrder};
