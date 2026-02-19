import{r as s,b as X,R as v,j as e,p as Y}from"./iframe-BBTbmRF3.js";import{c as z,$ as Z}from"./Button-njB1KHQa.js";import{$ as ee,a as G,e as K,g as oe,f as te}from"./utils-DwFG2D_J.js";import{a as I,e as ne,b as re,$ as O}from"./useObjectRef-Dq__QF3p.js";import{$ as M}from"./useFocusable-By4R4ClH.js";import{$ as q}from"./useControlledState-CHabID6C.js";import{$ as ie}from"./useEvent-0i6axtJN.js";import{a as H}from"./useFocusRing-5h-7jkYt.js";import{$ as ae}from"./Heading-BdW5XtUM.js";import{m as ce}from"./index-BaH7ue7C.js";import{d as N,u as D}from"./defineComponent-DoPKM1jS.js";import{F as C}from"./Flex-Dvn5PWY5.js";import{B as m}from"./Box-CUq8QMq0.js";import{T as x}from"./Text-8YHdAaE0.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-D8rP5iam.js";import"./Hidden-CdQI9ZbX.js";import"./useLabel-YJ8z3G4q.js";import"./useLabels-DEhw4i7w.js";import"./context-Bi_jlNb-.js";import"./useButton-BrSwTyJr.js";import"./usePress-JQADM0AO.js";import"./clsx-B-dksMZM.js";import"./RSPContexts-DMvdLKa2.js";import"./useStyles-DkiinFPC.js";import"./useBg-BKE7wWOd.js";function se(c,o,n){let{isDisabled:t}=c,a=I(),i=I(),d=ne(),f=s.useRef(null),g=s.useCallback(()=>{f.current=requestAnimationFrame(()=>{n.current&&n.current.setAttribute("hidden","until-found")}),X.flushSync(()=>{o.toggle()})},[n,o]);ie(n,"beforematch",g);let A=s.useRef(null);return re(()=>{if(f.current&&cancelAnimationFrame(f.current),n.current&&!d){let r=n.current;A.current==null||typeof r.getAnimations!="function"?o.isExpanded?(r.removeAttribute("hidden"),r.style.setProperty("--disclosure-panel-width","auto"),r.style.setProperty("--disclosure-panel-height","auto")):(r.setAttribute("hidden","until-found"),r.style.setProperty("--disclosure-panel-width","0px"),r.style.setProperty("--disclosure-panel-height","0px")):o.isExpanded!==A.current&&(o.isExpanded?(r.removeAttribute("hidden"),r.style.setProperty("--disclosure-panel-width",r.scrollWidth+"px"),r.style.setProperty("--disclosure-panel-height",r.scrollHeight+"px"),Promise.all(r.getAnimations().map(B=>B.finished)).then(()=>{r.style.setProperty("--disclosure-panel-width","auto"),r.style.setProperty("--disclosure-panel-height","auto")}).catch(()=>{})):(r.style.setProperty("--disclosure-panel-width",r.scrollWidth+"px"),r.style.setProperty("--disclosure-panel-height",r.scrollHeight+"px"),window.getComputedStyle(r).height,r.style.setProperty("--disclosure-panel-width","0px"),r.style.setProperty("--disclosure-panel-height","0px"),Promise.all(r.getAnimations().map(B=>B.finished)).then(()=>r.setAttribute("hidden","until-found")).catch(()=>{}))),A.current=o.isExpanded}},[t,n,o.isExpanded,d]),s.useEffect(()=>()=>{f.current&&cancelAnimationFrame(f.current)},[]),{buttonProps:{id:a,"aria-expanded":o.isExpanded,"aria-controls":i,onPress:r=>{!t&&r.pointerType!=="keyboard"&&o.toggle()},isDisabled:t,onPressStart(r){r.pointerType==="keyboard"&&!t&&o.toggle()}},panelProps:{id:i,role:"group","aria-labelledby":a,"aria-hidden":!o.isExpanded,hidden:d?!o.isExpanded:void 0}}}function de(c){let[o,n]=q(c.isExpanded,c.defaultExpanded||!1,c.onExpandedChange);const t=s.useCallback(()=>{n(!0)},[n]),a=s.useCallback(()=>{n(!1)},[n]),i=s.useCallback(()=>{n(!o)},[n,o]);return{isExpanded:o,setExpanded:n,expand:t,collapse:a,toggle:i}}function le(c){let{allowsMultipleExpanded:o=!1,isDisabled:n=!1}=c,[t,a]=q(s.useMemo(()=>c.expandedKeys?new Set(c.expandedKeys):void 0,[c.expandedKeys]),s.useMemo(()=>c.defaultExpandedKeys?new Set(c.defaultExpandedKeys):new Set,[c.defaultExpandedKeys]),c.onExpandedChange);return s.useEffect(()=>{if(!o&&t.size>1){let i=t.values().next().value;i!=null&&a(new Set([i]))}}),{allowsMultipleExpanded:o,isDisabled:n,expandedKeys:t,setExpandedKeys:a,toggleKey(i){let d;o?(d=new Set(t),d.has(i)?d.delete(i):d.add(i)):d=new Set(t.has(i)?[]:[i]),a(d)}}}const k=s.createContext(null),ue=s.forwardRef(function(o,n){let t=le(o),a=G({...o,defaultClassName:"react-aria-DisclosureGroup",values:{isDisabled:t.isDisabled,state:t}}),i=M(o,{global:!0});return v.createElement("div",{...i,...a,ref:n,"data-disabled":o.isDisabled||void 0},v.createElement(k.Provider,{value:t},a.children))}),pe=s.createContext(null),xe=s.createContext(null),V=s.createContext(null),fe=s.forwardRef(function(o,n){[o,n]=ee(o,n,pe);let t=s.useContext(k),{id:a,...i}=o,d=I();a||(a=d);let f=t?t.expandedKeys.has(a):o.isExpanded,g=de({...o,isExpanded:f,onExpandedChange(Q){var F;t&&t.toggleKey(a),(F=o.onExpandedChange)===null||F===void 0||F.call(o,Q)}}),A=v.useRef(null),r=o.isDisabled||t?.isDisabled||!1,{buttonProps:B,panelProps:U}=se({...o,isExpanded:f,isDisabled:r},g,A),{isFocusVisible:W,focusProps:J}=H({within:!0}),R=G({...o,id:void 0,defaultClassName:"react-aria-Disclosure",values:{isExpanded:g.isExpanded,isDisabled:r,isFocusVisibleWithin:W,state:g}}),L=M(i,{global:!0});return v.createElement(K,{values:[[z,{slots:{[oe]:{},trigger:B}}],[V,{panelProps:U,panelRef:A}],[xe,g]]},v.createElement("div",{...O(L,R,J),ref:n,"data-expanded":g.isExpanded||void 0,"data-disabled":r||void 0,"data-focus-visible-within":W||void 0},R.children))}),ge=s.forwardRef(function(o,n){let{role:t="group"}=o,{panelProps:a,panelRef:i}=s.useContext(V),{isFocusVisible:d,focusProps:f}=H({within:!0}),g=G({...o,defaultClassName:"react-aria-DisclosurePanel",values:{isFocusVisibleWithin:d}}),A=M(o,{global:!0,labelable:!0});return v.createElement("div",{...O(A,g,a,f),ref:te(n,i),role:t,"data-focus-visible-within":d||void 0},v.createElement(K,{values:[[z,null]]},o.children))}),S={"bui-Accordion":"_bui-Accordion_1jlz0_20","bui-AccordionTrigger":"_bui-AccordionTrigger_1jlz0_39","bui-AccordionTriggerButton":"_bui-AccordionTriggerButton_1jlz0_47","bui-AccordionTriggerTitle":"_bui-AccordionTriggerTitle_1jlz0_70","bui-AccordionTriggerSubtitle":"_bui-AccordionTriggerSubtitle_1jlz0_76","bui-AccordionTriggerIcon":"_bui-AccordionTriggerIcon_1jlz0_82","bui-AccordionPanel":"_bui-AccordionPanel_1jlz0_93","bui-AccordionGroup":"_bui-AccordionGroup_1jlz0_99"},me=N()({styles:S,classNames:{root:"bui-Accordion"},bg:"consumer",propDefs:{className:{}}}),Ae=N()({styles:S,classNames:{root:"bui-AccordionTrigger",button:"bui-AccordionTriggerButton",title:"bui-AccordionTriggerTitle",subtitle:"bui-AccordionTriggerSubtitle",icon:"bui-AccordionTriggerIcon"},propDefs:{className:{},title:{},subtitle:{},children:{}}}),he=N()({styles:S,classNames:{root:"bui-AccordionPanel"},propDefs:{className:{}}}),be=N()({styles:S,classNames:{root:"bui-AccordionGroup"},propDefs:{className:{},allowsMultiple:{default:!1}}}),l=s.forwardRef((c,o)=>{const{ownProps:n,restProps:t,dataAttributes:a}=D(me,c),{classes:i}=n;return e.jsx(fe,{ref:o,className:i.root,...a,...t})});l.displayName="Accordion";const u=s.forwardRef((c,o)=>{const{ownProps:n,restProps:t,dataAttributes:a}=D(Ae,c),{classes:i,title:d,subtitle:f,children:g}=n;return e.jsx(ae,{ref:o,className:i.root,...a,...t,children:e.jsxs(Z,{slot:"trigger",className:i.button,children:[g||e.jsxs(C,{gap:"2",align:"center",children:[e.jsx("span",{className:i.title,children:d}),f&&e.jsx("span",{className:i.subtitle,children:f})]}),e.jsx(ce,{className:i.icon,size:16})]})})});u.displayName="AccordionTrigger";const p=s.forwardRef((c,o)=>{const{ownProps:n,restProps:t,dataAttributes:a}=D(he,c),{classes:i}=n;return e.jsx(ge,{ref:o,className:i.root,...a,...t})});p.displayName="AccordionPanel";const _=s.forwardRef((c,o)=>{const{ownProps:n,restProps:t,dataAttributes:a}=D(be,c),{classes:i,allowsMultiple:d}=n;return e.jsx(ue,{ref:o,allowsMultipleExpanded:d,className:i.root,...a,...t})});_.displayName="AccordionGroup";l.__docgenInfo={description:"@public",methods:[],displayName:"Accordion",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};u.__docgenInfo={description:"@public",methods:[],displayName:"AccordionTrigger",props:{className:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};p.__docgenInfo={description:"@public",methods:[],displayName:"AccordionPanel",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};_.__docgenInfo={description:"@public",methods:[],displayName:"AccordionGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},allowsMultiple:{required:!1,tsType:{name:"boolean"},description:`Whether multiple accordions can be expanded at the same time.
@defaultValue false`}},composes:["Omit"]};const h=()=>e.jsxs(m,{children:[e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"}),e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})]}),w=Y.meta({title:"Backstage UI/Accordion",component:l}),b=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(h,{})})]})}),T=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{title:"Advanced Settings",subtitle:"Configure additional options"}),e.jsx(p,{children:e.jsx(h,{})})]})}),P=w.story({render:()=>e.jsxs(l,{children:[e.jsx(u,{children:e.jsxs(m,{children:[e.jsx(x,{as:"div",variant:"body-large",weight:"bold",children:"Custom Multi-line Trigger"}),e.jsx(x,{as:"div",variant:"body-medium",color:"secondary",children:"Click to expand additional details and configuration options"})]})}),e.jsx(p,{children:e.jsx(h,{})})]})}),y=w.story({render:()=>e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(h,{})})]})}),j=w.story({render:()=>e.jsxs(_,{children:[e.jsxs(l,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(p,{children:e.jsx(m,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(p,{children:e.jsx(m,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(p,{children:e.jsx(m,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),$=w.story({render:()=>e.jsxs(_,{allowsMultiple:!0,children:[e.jsxs(l,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(p,{children:e.jsx(m,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(p,{children:e.jsx(m,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(l,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(p,{children:e.jsx(m,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),E=w.story({render:()=>e.jsxs(C,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"Accordions automatically detect their parent bg context and increment the neutral level by 1. No prop is needed on the accordion -- it's fully automatic."}),e.jsxs(C,{direction:"column",gap:"4",children:[e.jsx(x,{children:"Default (no container)"}),e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(h,{})})]})]}),e.jsxs(m,{bg:"neutral-1",p:"4",children:[e.jsx(x,{children:"Neutral 1 container"}),e.jsx(C,{mt:"2",children:e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-2)"}),e.jsx(p,{children:e.jsx(h,{})})]})})]}),e.jsxs(m,{bg:"neutral-2",p:"4",children:[e.jsx(x,{children:"Neutral 2 container"}),e.jsx(C,{mt:"2",children:e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-3)"}),e.jsx(p,{children:e.jsx(h,{})})]})})]}),e.jsxs(m,{bg:"neutral-3",p:"4",children:[e.jsx(x,{children:"Neutral 3 container"}),e.jsx(C,{mt:"2",children:e.jsxs(l,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-4)"}),e.jsx(p,{children:e.jsx(h,{})})]})})]})]})});b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const Default = () => (
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
`,...y.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{code:`const GroupSingleOpen = () => (
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
`,...j.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{code:`const GroupMultipleOpen = () => (
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
`,...$.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{code:`const AutoBg = () => (
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
        </AccordionPanel>
      </Accordion>
    </Flex>
    <Box bg="neutral-1" p="4">
      <Text>Neutral 1 container</Text>
      <Flex mt="2">
        <Accordion defaultExpanded>
          <AccordionTrigger title="Auto (neutral-2)" />
          <AccordionPanel>
            <Content />
          </AccordionPanel>
        </Accordion>
      </Flex>
    </Box>
    <Box bg="neutral-2" p="4">
      <Text>Neutral 2 container</Text>
      <Flex mt="2">
        <Accordion defaultExpanded>
          <AccordionTrigger title="Auto (neutral-3)" />
          <AccordionPanel>
            <Content />
          </AccordionPanel>
        </Accordion>
      </Flex>
    </Box>
    <Box bg="neutral-3" p="4">
      <Text>Neutral 3 container</Text>
      <Flex mt="2">
        <Accordion defaultExpanded>
          <AccordionTrigger title="Auto (neutral-4)" />
          <AccordionPanel>
            <Content />
          </AccordionPanel>
        </Accordion>
      </Flex>
    </Box>
  </Flex>
);
`,...E.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...y.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...$.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{originalSource:`meta.story({
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
          </AccordionPanel>
        </Accordion>
      </Flex>
      <Box bg="neutral-1" p="4">
        <Text>Neutral 1 container</Text>
        <Flex mt="2">
          <Accordion defaultExpanded>
            <AccordionTrigger title="Auto (neutral-2)" />
            <AccordionPanel>
              <Content />
            </AccordionPanel>
          </Accordion>
        </Flex>
      </Box>
      <Box bg="neutral-2" p="4">
        <Text>Neutral 2 container</Text>
        <Flex mt="2">
          <Accordion defaultExpanded>
            <AccordionTrigger title="Auto (neutral-3)" />
            <AccordionPanel>
              <Content />
            </AccordionPanel>
          </Accordion>
        </Flex>
      </Box>
      <Box bg="neutral-3" p="4">
        <Text>Neutral 3 container</Text>
        <Flex mt="2">
          <Accordion defaultExpanded>
            <AccordionTrigger title="Auto (neutral-4)" />
            <AccordionPanel>
              <Content />
            </AccordionPanel>
          </Accordion>
        </Flex>
      </Box>
    </Flex>
})`,...E.input.parameters?.docs?.source}}};const Ve=["Default","WithSubtitle","CustomTrigger","DefaultExpanded","GroupSingleOpen","GroupMultipleOpen","AutoBg"];export{E as AutoBg,P as CustomTrigger,b as Default,y as DefaultExpanded,$ as GroupMultipleOpen,j as GroupSingleOpen,T as WithSubtitle,Ve as __namedExportsOrder};
