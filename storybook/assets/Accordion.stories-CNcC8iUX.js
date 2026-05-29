import{r as l,h as Y,R as y,ax as D,f as _,j as e,B as f,p as Z}from"./iframe-CY7lbe83.js";import{b as k,$ as ee}from"./Button-DkPUEGj-.js";import{$ as te,b as q,f as K,g as ne,a as R}from"./utils-VYcEwieo.js";import{$ as oe}from"./useEvent-CGzLQHsh.js";import{d as I,g as re,c as ie,b as O,a as ae}from"./useObjectRef-CgmSUdjG.js";import{$ as z}from"./useControlledState-D-EZ3Xb3.js";import{i as H,a as G}from"./useFocusRing--SoVj0Ul.js";import{$ as se}from"./Heading-CqENNOCa.js";import{N as le}from"./index-BOd6gQGa.js";import{F as m}from"./Flex-CWr8tAwa.js";import{T as x}from"./Text-t1BpvbUJ.js";import{B as A}from"./Button-BpI6sFNl.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-c4yIVKxR.js";import"./Hidden-tSGVjCBQ.js";import"./useLabel-D0Y-IO0Y.js";import"./useLabels-DZeRL03G.js";import"./number-DaFt9bAO.js";import"./I18nProvider-BwtzYg6c.js";import"./useButton-B-JKHCjV.js";import"./usePress-Bv61y3b6.js";import"./textSelection-CyJ29i24.js";import"./openLink-BO2-TBpk.js";import"./useHover-Bn9Qukxg.js";function ce(a,t,n){let{isDisabled:o}=a,s=I(),i=I(),c=re(),g=l.useRef(null),h=l.useCallback(()=>{g.current=requestAnimationFrame(()=>{n.current&&n.current.setAttribute("hidden","until-found")}),Y.flushSync(()=>{t.toggle()})},[n,t]);oe(n,"beforematch",h);let b=l.useRef(null);return ie(()=>{if(g.current&&cancelAnimationFrame(g.current),n.current&&!c){let r=n.current;b.current==null||typeof r.getAnimations!="function"?t.isExpanded?(r.removeAttribute("hidden"),r.style.setProperty("--disclosure-panel-width","auto"),r.style.setProperty("--disclosure-panel-height","auto")):(r.setAttribute("hidden","until-found"),r.style.setProperty("--disclosure-panel-width","0px"),r.style.setProperty("--disclosure-panel-height","0px")):t.isExpanded!==b.current&&(t.isExpanded?(r.removeAttribute("hidden"),r.style.setProperty("--disclosure-panel-width",r.scrollWidth+"px"),r.style.setProperty("--disclosure-panel-height",r.scrollHeight+"px"),Promise.all(r.getAnimations().map(T=>T.finished)).then(()=>{r.style.setProperty("--disclosure-panel-width","auto"),r.style.setProperty("--disclosure-panel-height","auto")}).catch(()=>{})):(r.style.setProperty("--disclosure-panel-width",r.scrollWidth+"px"),r.style.setProperty("--disclosure-panel-height",r.scrollHeight+"px"),window.getComputedStyle(r).height,r.style.setProperty("--disclosure-panel-width","0px"),r.style.setProperty("--disclosure-panel-height","0px"),Promise.all(r.getAnimations().map(T=>T.finished)).then(()=>r.setAttribute("hidden","until-found")).catch(()=>{}))),b.current=t.isExpanded}},[o,n,t.isExpanded,c]),l.useEffect(()=>()=>{g.current&&cancelAnimationFrame(g.current)},[]),{buttonProps:{id:s,"aria-expanded":t.isExpanded,"aria-controls":i,onPress:r=>{!o&&r.pointerType!=="keyboard"&&t.toggle()},isDisabled:o,onPressStart(r){r.pointerType==="keyboard"&&!o&&t.toggle()}},panelProps:{id:i,role:"group","aria-labelledby":s,"aria-hidden":!t.isExpanded,hidden:c?!t.isExpanded:void 0}}}function de(a){let{allowsMultipleExpanded:t=!1,isDisabled:n=!1}=a,[o,s]=z(l.useMemo(()=>a.expandedKeys?new Set(a.expandedKeys):void 0,[a.expandedKeys]),l.useMemo(()=>a.defaultExpandedKeys?new Set(a.defaultExpandedKeys):new Set,[a.defaultExpandedKeys]),a.onExpandedChange);return l.useEffect(()=>{if(!t&&o.size>1){let i=o.values().next().value;i!=null&&s(new Set([i]))}}),{allowsMultipleExpanded:t,isDisabled:n,expandedKeys:o,setExpandedKeys:s,toggleKey(i){let c;t?(c=new Set(o),c.has(i)?c.delete(i):c.add(i)):c=new Set(o.has(i)?[]:[i]),s(c)}}}function ue(a){let[t,n]=z(a.isExpanded,a.defaultExpanded||!1,a.onExpandedChange);const o=l.useCallback(()=>{n(!0)},[n]),s=l.useCallback(()=>{n(!1)},[n]),i=l.useCallback(()=>{n(!t)},[n,t]);return{isExpanded:t,setExpanded:n,expand:o,collapse:s,toggle:i}}const V=l.createContext(null),pe=l.forwardRef(function(t,n){let o=de(t),s=q({...t,defaultClassName:"react-aria-DisclosureGroup",values:{isDisabled:o.isDisabled,state:o}}),i=G(t,{global:!0});return y.createElement(R.div,{...i,...s,ref:n,"data-disabled":t.isDisabled||void 0},y.createElement(V.Provider,{value:o},s.children))}),xe=l.createContext(null),fe=l.createContext(null),U=l.createContext(null),ge=l.forwardRef(function(t,n){[t,n]=te(t,n,xe);let o=l.useContext(V),{id:s,...i}=t,c=I();s||=c;let g=o?o.expandedKeys.has(s):t.isExpanded,h=ue({...t,isExpanded:g,onExpandedChange(X){o&&o.toggleKey(s),t.onExpandedChange?.(X)}}),b=y.useRef(null),r=t.isDisabled||o?.isDisabled||!1,{buttonProps:T,panelProps:J}=ce({...t,isExpanded:g,isDisabled:r},h,b),{isFocusVisible:M,focusProps:L}=H({within:!0}),W=q({...t,id:void 0,defaultClassName:"react-aria-Disclosure",values:{isExpanded:h.isExpanded,isDisabled:r,isFocusVisibleWithin:M,state:h}}),Q=G(i,{global:!0});return y.createElement(K,{values:[[k,{slots:{[ne]:{},trigger:T}}],[U,{panelProps:J,panelRef:b}],[fe,h]]},y.createElement(R.div,{...O(Q,W,L),ref:n,"data-expanded":h.isExpanded||void 0,"data-disabled":r||void 0,"data-focus-visible-within":M||void 0},W.children))}),he=l.forwardRef(function(t,n){let{role:o="group"}=t,{panelProps:s,panelRef:i}=l.useContext(U),{isFocusVisible:c,focusProps:g}=H({within:!0}),h=q({...t,defaultClassName:"react-aria-DisclosurePanel",values:{isFocusVisibleWithin:c}}),b=G(t,{global:!0,labelable:!0});return y.createElement(R.div,{...O(b,h,s,g),ref:ae(n,i),role:o,"data-focus-visible-within":c||void 0},y.createElement(K,{values:[[k,null]]},t.children))}),S={"bui-Accordion":"_bui-Accordion_1fqks_20","bui-AccordionTrigger":"_bui-AccordionTrigger_1fqks_32","bui-AccordionTriggerButton":"_bui-AccordionTriggerButton_1fqks_40","bui-AccordionTriggerTitle":"_bui-AccordionTriggerTitle_1fqks_63","bui-AccordionTriggerSubtitle":"_bui-AccordionTriggerSubtitle_1fqks_69","bui-AccordionTriggerIcon":"_bui-AccordionTriggerIcon_1fqks_75","bui-AccordionPanel":"_bui-AccordionPanel_1fqks_86","bui-AccordionGroup":"_bui-AccordionGroup_1fqks_92"},me=D()({styles:S,classNames:{root:"bui-Accordion"},bg:"provider",propDefs:{bg:{dataAttribute:!0,default:"neutral"},children:{},className:{}}}),be=D()({styles:S,classNames:{root:"bui-AccordionTrigger",button:"bui-AccordionTriggerButton",title:"bui-AccordionTriggerTitle",subtitle:"bui-AccordionTriggerSubtitle",icon:"bui-AccordionTriggerIcon"},propDefs:{className:{},title:{},subtitle:{},children:{}}}),Ae=D()({styles:S,classNames:{root:"bui-AccordionPanel"},propDefs:{className:{}}}),je=D()({styles:S,classNames:{root:"bui-AccordionGroup"},propDefs:{className:{},allowsMultiple:{default:!1}}}),d=l.forwardRef((a,t)=>{const{ownProps:n,restProps:o,dataAttributes:s}=_(me,a),{classes:i,childrenWithBgProvider:c}=n;return e.jsx(ge,{ref:t,className:i.root,...s,...o,children:c})});d.displayName="Accordion";const u=l.forwardRef((a,t)=>{const{ownProps:n,restProps:o,dataAttributes:s}=_(be,a),{classes:i,title:c,subtitle:g,children:h}=n;return e.jsx(se,{ref:t,className:i.root,...s,...o,children:e.jsxs(ee,{slot:"trigger",className:i.button,children:[h||e.jsxs(m,{gap:"2",align:"center",children:[e.jsx("span",{className:i.title,children:c}),g&&e.jsx("span",{className:i.subtitle,children:g})]}),e.jsx(le,{className:i.icon,size:16})]})})});u.displayName="AccordionTrigger";const p=l.forwardRef((a,t)=>{const{ownProps:n,restProps:o,dataAttributes:s}=_(Ae,a),{classes:i}=n;return e.jsx(he,{ref:t,className:i.root,...s,...o})});p.displayName="AccordionPanel";const F=l.forwardRef((a,t)=>{const{ownProps:n,restProps:o,dataAttributes:s}=_(je,a),{classes:i,allowsMultiple:c}=n;return e.jsx(pe,{ref:t,allowsMultipleExpanded:c,className:i.root,...s,...o})});F.displayName="AccordionGroup";d.__docgenInfo={description:`A collapsible section that reveals or hides its content when the trigger is activated.

@public`,methods:[],displayName:"Accordion",props:{bg:{required:!1,tsType:{name:"union",raw:"'neutral' | 'danger' | 'warning' | 'success'",elements:[{name:"literal",value:"'neutral'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"}]},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};u.__docgenInfo={description:`The clickable heading that toggles the visibility of an accordion panel.

@public`,methods:[],displayName:"AccordionTrigger",props:{className:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};p.__docgenInfo={description:`The content area of an accordion that is revealed when the trigger is activated.

@public`,methods:[],displayName:"AccordionPanel",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};F.__docgenInfo={description:`A container that groups multiple Accordion items, optionally allowing several panels to be expanded at once.

@public`,methods:[],displayName:"AccordionGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},allowsMultiple:{required:!1,tsType:{name:"boolean"},description:`Whether multiple accordions can be expanded at the same time.
@defaultValue false`}},composes:["Omit"]};const j=()=>e.jsxs(f,{children:[e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"}),e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})]}),P=Z.meta({title:"Backstage UI/Accordion",component:d}),$=P.story({render:()=>e.jsxs(d,{children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(j,{})})]})}),v=P.story({render:()=>e.jsxs(d,{children:[e.jsx(u,{title:"Advanced Settings",subtitle:"Configure additional options"}),e.jsx(p,{children:e.jsx(j,{})})]})}),E=P.story({render:()=>e.jsxs(d,{children:[e.jsx(u,{children:e.jsxs(f,{children:[e.jsx(x,{as:"div",variant:"body-large",weight:"bold",children:"Custom Multi-line Trigger"}),e.jsx(x,{as:"div",variant:"body-medium",color:"secondary",children:"Click to expand additional details and configuration options"})]})}),e.jsx(p,{children:e.jsx(j,{})})]})}),w=P.story({render:()=>e.jsxs(d,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(j,{})})]})}),B=P.story({render:()=>e.jsxs(F,{children:[e.jsxs(d,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(d,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(d,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),C=P.story({render:()=>e.jsxs(F,{allowsMultiple:!0,children:[e.jsxs(d,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(d,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(d,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),N=P.story({render:()=>e.jsxs(m,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"Accordions automatically detect their parent bg context and increment the neutral level by 1. No prop is needed on the accordion -- it's fully automatic."}),e.jsxs(m,{direction:"column",gap:"4",children:[e.jsx(x,{children:"Default (no container)"}),e.jsxs(d,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsxs(p,{children:[e.jsx(j,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})]}),e.jsxs(f,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 1 container"}),e.jsx(m,{mt:"2",children:e.jsxs(d,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-2)"}),e.jsxs(p,{children:[e.jsx(j,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})})]}),e.jsx(f,{bg:"neutral",children:e.jsxs(f,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 2 container"}),e.jsx(m,{mt:"2",children:e.jsxs(d,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-3)"}),e.jsxs(p,{children:[e.jsx(j,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})})]})}),e.jsx(f,{bg:"neutral",children:e.jsx(f,{bg:"neutral",children:e.jsxs(f,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 3 container"}),e.jsx(m,{mt:"2",children:e.jsxs(d,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-3)"}),e.jsxs(p,{children:[e.jsx(j,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})})]})})})]})});$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...N.input.parameters?.docs?.source}}};const He=["Default","WithSubtitle","CustomTrigger","DefaultExpanded","GroupSingleOpen","GroupMultipleOpen","AutoBg"];export{N as AutoBg,E as CustomTrigger,$ as Default,w as DefaultExpanded,C as GroupMultipleOpen,B as GroupSingleOpen,v as WithSubtitle,He as __namedExportsOrder};
