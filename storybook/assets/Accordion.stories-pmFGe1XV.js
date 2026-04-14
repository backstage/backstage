import{r as l,f as Z,R as j,aw as D,au as _,j as e,B as f,p as ee}from"./iframe-KINrIo_f.js";import{b as O,$ as te}from"./Button-B_WSb347.js";import{$ as ne,b as G,f as k,g as oe,a as M}from"./utils-Dp48jrsX.js";import{d as R,f as re,c as ie,b as z,a as ae}from"./useObjectRef-Cl-GJEjw.js";import{a as W}from"./useFocusable-CaaSd55t.js";import{$ as H}from"./useControlledState-CmWPFpjF.js";import{$ as se}from"./useEvent-BOGlR7Jp.js";import{b as V}from"./useFocusRing-BZvEHQX6.js";import{$ as le}from"./Heading-CfKbaTVP.js";import{F as de}from"./index-Dv1l67z5.js";import{F as m}from"./Flex-3FJaFP3S.js";import{T as x}from"./Text-CNN97s-C.js";import{B as A}from"./Button-DJZRNjgN.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-CJonN38k.js";import"./Hidden-CKUXjs7V.js";import"./useNumberFormatter-BRRCv1PA.js";import"./context-B896Pv5S.js";import"./useLabel-CtWiwLqZ.js";import"./useLabels-mheEzMbZ.js";import"./useButton-DEkJAlCo.js";import"./usePress-BRBPsLh-.js";import"./textSelection-1F9aHMh8.js";import"./openLink-BCV1Ju3v.js";import"./RSPContexts-BB815QrL.js";function ce(s,t,o){let{isDisabled:n}=s,a=R(),i=R(),d=re(),g=l.useRef(null),h=l.useCallback(()=>{g.current=requestAnimationFrame(()=>{o.current&&o.current.setAttribute("hidden","until-found")}),Z.flushSync(()=>{t.toggle()})},[o,t]);se(o,"beforematch",h);let b=l.useRef(null);return ie(()=>{if(g.current&&cancelAnimationFrame(g.current),o.current&&!d){let r=o.current;b.current==null||typeof r.getAnimations!="function"?t.isExpanded?(r.removeAttribute("hidden"),r.style.setProperty("--disclosure-panel-width","auto"),r.style.setProperty("--disclosure-panel-height","auto")):(r.setAttribute("hidden","until-found"),r.style.setProperty("--disclosure-panel-width","0px"),r.style.setProperty("--disclosure-panel-height","0px")):t.isExpanded!==b.current&&(t.isExpanded?(r.removeAttribute("hidden"),r.style.setProperty("--disclosure-panel-width",r.scrollWidth+"px"),r.style.setProperty("--disclosure-panel-height",r.scrollHeight+"px"),Promise.all(r.getAnimations().map(T=>T.finished)).then(()=>{r.style.setProperty("--disclosure-panel-width","auto"),r.style.setProperty("--disclosure-panel-height","auto")}).catch(()=>{})):(r.style.setProperty("--disclosure-panel-width",r.scrollWidth+"px"),r.style.setProperty("--disclosure-panel-height",r.scrollHeight+"px"),window.getComputedStyle(r).height,r.style.setProperty("--disclosure-panel-width","0px"),r.style.setProperty("--disclosure-panel-height","0px"),Promise.all(r.getAnimations().map(T=>T.finished)).then(()=>r.setAttribute("hidden","until-found")).catch(()=>{}))),b.current=t.isExpanded}},[n,o,t.isExpanded,d]),l.useEffect(()=>()=>{g.current&&cancelAnimationFrame(g.current)},[]),{buttonProps:{id:a,"aria-expanded":t.isExpanded,"aria-controls":i,onPress:r=>{!n&&r.pointerType!=="keyboard"&&t.toggle()},isDisabled:n,onPressStart(r){r.pointerType==="keyboard"&&!n&&t.toggle()}},panelProps:{id:i,role:"group","aria-labelledby":a,"aria-hidden":!t.isExpanded,hidden:d?!t.isExpanded:void 0}}}function ue(s){let[t,o]=H(s.isExpanded,s.defaultExpanded||!1,s.onExpandedChange);const n=l.useCallback(()=>{o(!0)},[o]),a=l.useCallback(()=>{o(!1)},[o]),i=l.useCallback(()=>{o(!t)},[o,t]);return{isExpanded:t,setExpanded:o,expand:n,collapse:a,toggle:i}}function pe(s){let{allowsMultipleExpanded:t=!1,isDisabled:o=!1}=s,[n,a]=H(l.useMemo(()=>s.expandedKeys?new Set(s.expandedKeys):void 0,[s.expandedKeys]),l.useMemo(()=>s.defaultExpandedKeys?new Set(s.defaultExpandedKeys):new Set,[s.defaultExpandedKeys]),s.onExpandedChange);return l.useEffect(()=>{if(!t&&n.size>1){let i=n.values().next().value;i!=null&&a(new Set([i]))}}),{allowsMultipleExpanded:t,isDisabled:o,expandedKeys:n,setExpandedKeys:a,toggleKey(i){let d;t?(d=new Set(n),d.has(i)?d.delete(i):d.add(i)):d=new Set(n.has(i)?[]:[i]),a(d)}}}const U=l.createContext(null),xe=l.forwardRef(function(t,o){let n=pe(t),a=G({...t,defaultClassName:"react-aria-DisclosureGroup",values:{isDisabled:n.isDisabled,state:n}}),i=W(t,{global:!0});return j.createElement(M.div,{...i,...a,ref:o,"data-disabled":t.isDisabled||void 0},j.createElement(U.Provider,{value:n},a.children))}),fe=l.createContext(null),ge=l.createContext(null),J=l.createContext(null),he=l.forwardRef(function(t,o){[t,o]=ne(t,o,fe);let n=l.useContext(U),{id:a,...i}=t,d=R();a||(a=d);let g=n?n.expandedKeys.has(a):t.isExpanded,h=ue({...t,isExpanded:g,onExpandedChange(Y){var I;n&&n.toggleKey(a),(I=t.onExpandedChange)===null||I===void 0||I.call(t,Y)}}),b=j.useRef(null),r=t.isDisabled||n?.isDisabled||!1,{buttonProps:T,panelProps:L}=ce({...t,isExpanded:g,isDisabled:r},h,b),{isFocusVisible:K,focusProps:Q}=V({within:!0}),q=G({...t,id:void 0,defaultClassName:"react-aria-Disclosure",values:{isExpanded:h.isExpanded,isDisabled:r,isFocusVisibleWithin:K,state:h}}),X=W(i,{global:!0});return j.createElement(k,{values:[[O,{slots:{[oe]:{},trigger:T}}],[J,{panelProps:L,panelRef:b}],[ge,h]]},j.createElement(M.div,{...z(X,q,Q),ref:o,"data-expanded":h.isExpanded||void 0,"data-disabled":r||void 0,"data-focus-visible-within":K||void 0},q.children))}),me=l.forwardRef(function(t,o){let{role:n="group"}=t,{panelProps:a,panelRef:i}=l.useContext(J),{isFocusVisible:d,focusProps:g}=V({within:!0}),h=G({...t,defaultClassName:"react-aria-DisclosurePanel",values:{isFocusVisibleWithin:d}}),b=W(t,{global:!0,labelable:!0});return j.createElement(M.div,{...z(b,h,a,g),ref:ae(o,i),role:n,"data-focus-visible-within":d||void 0},j.createElement(k,{values:[[O,null]]},t.children))}),F={"bui-Accordion":"_bui-Accordion_y5950_20","bui-AccordionTrigger":"_bui-AccordionTrigger_y5950_38","bui-AccordionTriggerButton":"_bui-AccordionTriggerButton_y5950_46","bui-AccordionTriggerTitle":"_bui-AccordionTriggerTitle_y5950_69","bui-AccordionTriggerSubtitle":"_bui-AccordionTriggerSubtitle_y5950_75","bui-AccordionTriggerIcon":"_bui-AccordionTriggerIcon_y5950_81","bui-AccordionPanel":"_bui-AccordionPanel_y5950_92","bui-AccordionGroup":"_bui-AccordionGroup_y5950_98"},be=D()({styles:F,classNames:{root:"bui-Accordion"},bg:"provider",propDefs:{bg:{dataAttribute:!0,default:"neutral"},children:{},className:{}}}),Ae=D()({styles:F,classNames:{root:"bui-AccordionTrigger",button:"bui-AccordionTriggerButton",title:"bui-AccordionTriggerTitle",subtitle:"bui-AccordionTriggerSubtitle",icon:"bui-AccordionTriggerIcon"},propDefs:{className:{},title:{},subtitle:{},children:{}}}),ye=D()({styles:F,classNames:{root:"bui-AccordionPanel"},propDefs:{className:{}}}),je=D()({styles:F,classNames:{root:"bui-AccordionGroup"},propDefs:{className:{},allowsMultiple:{default:!1}}}),c=l.forwardRef((s,t)=>{const{ownProps:o,restProps:n,dataAttributes:a}=_(be,s),{classes:i,childrenWithBgProvider:d}=o;return e.jsx(he,{ref:t,className:i.root,...a,...n,children:d})});c.displayName="Accordion";const u=l.forwardRef((s,t)=>{const{ownProps:o,restProps:n,dataAttributes:a}=_(Ae,s),{classes:i,title:d,subtitle:g,children:h}=o;return e.jsx(le,{ref:t,className:i.root,...a,...n,children:e.jsxs(te,{slot:"trigger",className:i.button,children:[h||e.jsxs(m,{gap:"2",align:"center",children:[e.jsx("span",{className:i.title,children:d}),g&&e.jsx("span",{className:i.subtitle,children:g})]}),e.jsx(de,{className:i.icon,size:16})]})})});u.displayName="AccordionTrigger";const p=l.forwardRef((s,t)=>{const{ownProps:o,restProps:n,dataAttributes:a}=_(ye,s),{classes:i}=o;return e.jsx(me,{ref:t,className:i.root,...a,...n})});p.displayName="AccordionPanel";const S=l.forwardRef((s,t)=>{const{ownProps:o,restProps:n,dataAttributes:a}=_(je,s),{classes:i,allowsMultiple:d}=o;return e.jsx(xe,{ref:t,allowsMultipleExpanded:d,className:i.root,...a,...n})});S.displayName="AccordionGroup";c.__docgenInfo={description:`A collapsible section that reveals or hides its content when the trigger is activated.

@public`,methods:[],displayName:"Accordion",props:{bg:{required:!1,tsType:{name:"union",raw:"'neutral' | 'danger' | 'warning' | 'success'",elements:[{name:"literal",value:"'neutral'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"}]},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};u.__docgenInfo={description:`The clickable heading that toggles the visibility of an accordion panel.

@public`,methods:[],displayName:"AccordionTrigger",props:{className:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};p.__docgenInfo={description:`The content area of an accordion that is revealed when the trigger is activated.

@public`,methods:[],displayName:"AccordionPanel",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};S.__docgenInfo={description:`A container that groups multiple Accordion items, optionally allowing several panels to be expanded at once.

@public`,methods:[],displayName:"AccordionGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},allowsMultiple:{required:!1,tsType:{name:"boolean"},description:`Whether multiple accordions can be expanded at the same time.
@defaultValue false`}},composes:["Omit"]};const y=()=>e.jsxs(f,{children:[e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"}),e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})]}),P=ee.meta({title:"Backstage UI/Accordion",component:c}),$=P.story({render:()=>e.jsxs(c,{children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(y,{})})]})}),v=P.story({render:()=>e.jsxs(c,{children:[e.jsx(u,{title:"Advanced Settings",subtitle:"Configure additional options"}),e.jsx(p,{children:e.jsx(y,{})})]})}),E=P.story({render:()=>e.jsxs(c,{children:[e.jsx(u,{children:e.jsxs(f,{children:[e.jsx(x,{as:"div",variant:"body-large",weight:"bold",children:"Custom Multi-line Trigger"}),e.jsx(x,{as:"div",variant:"body-medium",color:"secondary",children:"Click to expand additional details and configuration options"})]})}),e.jsx(p,{children:e.jsx(y,{})})]})}),w=P.story({render:()=>e.jsxs(c,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(y,{})})]})}),B=P.story({render:()=>e.jsxs(S,{children:[e.jsxs(c,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(c,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(c,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),C=P.story({render:()=>e.jsxs(S,{allowsMultiple:!0,children:[e.jsxs(c,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(c,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(c,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),N=P.story({render:()=>e.jsxs(m,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"Accordions automatically detect their parent bg context and increment the neutral level by 1. No prop is needed on the accordion -- it's fully automatic."}),e.jsxs(m,{direction:"column",gap:"4",children:[e.jsx(x,{children:"Default (no container)"}),e.jsxs(c,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsxs(p,{children:[e.jsx(y,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})]}),e.jsxs(f,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 1 container"}),e.jsx(m,{mt:"2",children:e.jsxs(c,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-2)"}),e.jsxs(p,{children:[e.jsx(y,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})})]}),e.jsx(f,{bg:"neutral",children:e.jsxs(f,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 2 container"}),e.jsx(m,{mt:"2",children:e.jsxs(c,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-3)"}),e.jsxs(p,{children:[e.jsx(y,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})})]})}),e.jsx(f,{bg:"neutral",children:e.jsx(f,{bg:"neutral",children:e.jsxs(f,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 3 container"}),e.jsx(m,{mt:"2",children:e.jsxs(c,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-3)"}),e.jsxs(p,{children:[e.jsx(y,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})})]})})})]})});$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...$.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion>
      <AccordionTrigger title="Advanced Settings" subtitle="Configure additional options" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...v.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...E.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Accordion defaultExpanded>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
})`,...w.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...B.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...C.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...N.input.parameters?.docs?.source}}};const Ue=["Default","WithSubtitle","CustomTrigger","DefaultExpanded","GroupSingleOpen","GroupMultipleOpen","AutoBg"];export{N as AutoBg,E as CustomTrigger,$ as Default,w as DefaultExpanded,C as GroupMultipleOpen,B as GroupSingleOpen,v as WithSubtitle,Ue as __namedExportsOrder};
