import{r as l,f as Y,R as j,aw as D,au as _,j as e,B as f,p as Z}from"./iframe-BemVm3iW.js";import{b as q,$ as ee}from"./Button-DUM7otWK.js";import{$ as te,b as R,f as O,g as ne,a as G}from"./utils-67UUfq9j.js";import{$ as oe}from"./useEvent-BrF9lIRf.js";import{d as I,g as re,c as ie,b as H,a as ae}from"./useObjectRef-DNY1z9xy.js";import{$ as k}from"./useControlledState-65WJWsue.js";import{a as M}from"./useGlobalListeners-DjNZsfXO.js";import{b as z}from"./useHover-qzmeHD-I.js";import{$ as se}from"./Heading-BqekBLXw.js";import{H as le}from"./index-CfKAs8sV.js";import{F as m}from"./Flex-2Li_3wSq.js";import{T as x}from"./Text-Bdw4vaXh.js";import{B as A}from"./Button-BTRq1p7x.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-CfLV2GEV.js";import"./Hidden-PdwGn6CK.js";import"./useLabel-BKeoaEj8.js";import"./useLabels-Cns4Y3S6.js";import"./number-BY_G_BRf.js";import"./I18nProvider-KlzMPuIO.js";import"./useButton-CPe_l3Qv.js";import"./usePress-CoePygci.js";import"./textSelection-ctslQtv7.js";import"./openLink-DsdV9ckj.js";function ce(a,t,n){let{isDisabled:o}=a,s=I(),i=I(),c=re(),g=l.useRef(null),h=l.useCallback(()=>{g.current=requestAnimationFrame(()=>{n.current&&n.current.setAttribute("hidden","until-found")}),Y.flushSync(()=>{t.toggle()})},[n,t]);oe(n,"beforematch",h);let b=l.useRef(null);return ie(()=>{if(g.current&&cancelAnimationFrame(g.current),n.current&&!c){let r=n.current;b.current==null||typeof r.getAnimations!="function"?t.isExpanded?(r.removeAttribute("hidden"),r.style.setProperty("--disclosure-panel-width","auto"),r.style.setProperty("--disclosure-panel-height","auto")):(r.setAttribute("hidden","until-found"),r.style.setProperty("--disclosure-panel-width","0px"),r.style.setProperty("--disclosure-panel-height","0px")):t.isExpanded!==b.current&&(t.isExpanded?(r.removeAttribute("hidden"),r.style.setProperty("--disclosure-panel-width",r.scrollWidth+"px"),r.style.setProperty("--disclosure-panel-height",r.scrollHeight+"px"),Promise.all(r.getAnimations().map(T=>T.finished)).then(()=>{r.style.setProperty("--disclosure-panel-width","auto"),r.style.setProperty("--disclosure-panel-height","auto")}).catch(()=>{})):(r.style.setProperty("--disclosure-panel-width",r.scrollWidth+"px"),r.style.setProperty("--disclosure-panel-height",r.scrollHeight+"px"),window.getComputedStyle(r).height,r.style.setProperty("--disclosure-panel-width","0px"),r.style.setProperty("--disclosure-panel-height","0px"),Promise.all(r.getAnimations().map(T=>T.finished)).then(()=>r.setAttribute("hidden","until-found")).catch(()=>{}))),b.current=t.isExpanded}},[o,n,t.isExpanded,c]),l.useEffect(()=>()=>{g.current&&cancelAnimationFrame(g.current)},[]),{buttonProps:{id:s,"aria-expanded":t.isExpanded,"aria-controls":i,onPress:r=>{!o&&r.pointerType!=="keyboard"&&t.toggle()},isDisabled:o,onPressStart(r){r.pointerType==="keyboard"&&!o&&t.toggle()}},panelProps:{id:i,role:"group","aria-labelledby":s,"aria-hidden":!t.isExpanded,hidden:c?!t.isExpanded:void 0}}}function de(a){let{allowsMultipleExpanded:t=!1,isDisabled:n=!1}=a,[o,s]=k(l.useMemo(()=>a.expandedKeys?new Set(a.expandedKeys):void 0,[a.expandedKeys]),l.useMemo(()=>a.defaultExpandedKeys?new Set(a.defaultExpandedKeys):new Set,[a.defaultExpandedKeys]),a.onExpandedChange);return l.useEffect(()=>{if(!t&&o.size>1){let i=o.values().next().value;i!=null&&s(new Set([i]))}}),{allowsMultipleExpanded:t,isDisabled:n,expandedKeys:o,setExpandedKeys:s,toggleKey(i){let c;t?(c=new Set(o),c.has(i)?c.delete(i):c.add(i)):c=new Set(o.has(i)?[]:[i]),s(c)}}}function ue(a){let[t,n]=k(a.isExpanded,a.defaultExpanded||!1,a.onExpandedChange);const o=l.useCallback(()=>{n(!0)},[n]),s=l.useCallback(()=>{n(!1)},[n]),i=l.useCallback(()=>{n(!t)},[n,t]);return{isExpanded:t,setExpanded:n,expand:o,collapse:s,toggle:i}}const V=l.createContext(null),pe=l.forwardRef(function(t,n){let o=de(t),s=R({...t,defaultClassName:"react-aria-DisclosureGroup",values:{isDisabled:o.isDisabled,state:o}}),i=M(t,{global:!0});return j.createElement(G.div,{...i,...s,ref:n,"data-disabled":t.isDisabled||void 0},j.createElement(V.Provider,{value:o},s.children))}),xe=l.createContext(null),fe=l.createContext(null),U=l.createContext(null),ge=l.forwardRef(function(t,n){[t,n]=te(t,n,xe);let o=l.useContext(V),{id:s,...i}=t,c=I();s||=c;let g=o?o.expandedKeys.has(s):t.isExpanded,h=ue({...t,isExpanded:g,onExpandedChange(X){o&&o.toggleKey(s),t.onExpandedChange?.(X)}}),b=j.useRef(null),r=t.isDisabled||o?.isDisabled||!1,{buttonProps:T,panelProps:J}=ce({...t,isExpanded:g,isDisabled:r},h,b),{isFocusVisible:W,focusProps:L}=z({within:!0}),K=R({...t,id:void 0,defaultClassName:"react-aria-Disclosure",values:{isExpanded:h.isExpanded,isDisabled:r,isFocusVisibleWithin:W,state:h}}),Q=M(i,{global:!0});return j.createElement(O,{values:[[q,{slots:{[ne]:{},trigger:T}}],[U,{panelProps:J,panelRef:b}],[fe,h]]},j.createElement(G.div,{...H(Q,K,L),ref:n,"data-expanded":h.isExpanded||void 0,"data-disabled":r||void 0,"data-focus-visible-within":W||void 0},K.children))}),he=l.forwardRef(function(t,n){let{role:o="group"}=t,{panelProps:s,panelRef:i}=l.useContext(U),{isFocusVisible:c,focusProps:g}=z({within:!0}),h=R({...t,defaultClassName:"react-aria-DisclosurePanel",values:{isFocusVisibleWithin:c}}),b=M(t,{global:!0,labelable:!0});return j.createElement(G.div,{...H(b,h,s,g),ref:ae(n,i),role:o,"data-focus-visible-within":c||void 0},j.createElement(O,{values:[[q,null]]},t.children))}),S={"bui-Accordion":"_bui-Accordion_y5950_20","bui-AccordionTrigger":"_bui-AccordionTrigger_y5950_38","bui-AccordionTriggerButton":"_bui-AccordionTriggerButton_y5950_46","bui-AccordionTriggerTitle":"_bui-AccordionTriggerTitle_y5950_69","bui-AccordionTriggerSubtitle":"_bui-AccordionTriggerSubtitle_y5950_75","bui-AccordionTriggerIcon":"_bui-AccordionTriggerIcon_y5950_81","bui-AccordionPanel":"_bui-AccordionPanel_y5950_92","bui-AccordionGroup":"_bui-AccordionGroup_y5950_98"},me=D()({styles:S,classNames:{root:"bui-Accordion"},bg:"provider",propDefs:{bg:{dataAttribute:!0,default:"neutral"},children:{},className:{}}}),be=D()({styles:S,classNames:{root:"bui-AccordionTrigger",button:"bui-AccordionTriggerButton",title:"bui-AccordionTriggerTitle",subtitle:"bui-AccordionTriggerSubtitle",icon:"bui-AccordionTriggerIcon"},propDefs:{className:{},title:{},subtitle:{},children:{}}}),Ae=D()({styles:S,classNames:{root:"bui-AccordionPanel"},propDefs:{className:{}}}),ye=D()({styles:S,classNames:{root:"bui-AccordionGroup"},propDefs:{className:{},allowsMultiple:{default:!1}}}),d=l.forwardRef((a,t)=>{const{ownProps:n,restProps:o,dataAttributes:s}=_(me,a),{classes:i,childrenWithBgProvider:c}=n;return e.jsx(ge,{ref:t,className:i.root,...s,...o,children:c})});d.displayName="Accordion";const u=l.forwardRef((a,t)=>{const{ownProps:n,restProps:o,dataAttributes:s}=_(be,a),{classes:i,title:c,subtitle:g,children:h}=n;return e.jsx(se,{ref:t,className:i.root,...s,...o,children:e.jsxs(ee,{slot:"trigger",className:i.button,children:[h||e.jsxs(m,{gap:"2",align:"center",children:[e.jsx("span",{className:i.title,children:c}),g&&e.jsx("span",{className:i.subtitle,children:g})]}),e.jsx(le,{className:i.icon,size:16})]})})});u.displayName="AccordionTrigger";const p=l.forwardRef((a,t)=>{const{ownProps:n,restProps:o,dataAttributes:s}=_(Ae,a),{classes:i}=n;return e.jsx(he,{ref:t,className:i.root,...s,...o})});p.displayName="AccordionPanel";const F=l.forwardRef((a,t)=>{const{ownProps:n,restProps:o,dataAttributes:s}=_(ye,a),{classes:i,allowsMultiple:c}=n;return e.jsx(pe,{ref:t,allowsMultipleExpanded:c,className:i.root,...s,...o})});F.displayName="AccordionGroup";d.__docgenInfo={description:`A collapsible section that reveals or hides its content when the trigger is activated.

@public`,methods:[],displayName:"Accordion",props:{bg:{required:!1,tsType:{name:"union",raw:"'neutral' | 'danger' | 'warning' | 'success'",elements:[{name:"literal",value:"'neutral'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"}]},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};u.__docgenInfo={description:`The clickable heading that toggles the visibility of an accordion panel.

@public`,methods:[],displayName:"AccordionTrigger",props:{className:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};p.__docgenInfo={description:`The content area of an accordion that is revealed when the trigger is activated.

@public`,methods:[],displayName:"AccordionPanel",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};F.__docgenInfo={description:`A container that groups multiple Accordion items, optionally allowing several panels to be expanded at once.

@public`,methods:[],displayName:"AccordionGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},allowsMultiple:{required:!1,tsType:{name:"boolean"},description:`Whether multiple accordions can be expanded at the same time.
@defaultValue false`}},composes:["Omit"]};const y=()=>e.jsxs(f,{children:[e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"}),e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})]}),P=Z.meta({title:"Backstage UI/Accordion",component:d}),$=P.story({render:()=>e.jsxs(d,{children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(y,{})})]})}),v=P.story({render:()=>e.jsxs(d,{children:[e.jsx(u,{title:"Advanced Settings",subtitle:"Configure additional options"}),e.jsx(p,{children:e.jsx(y,{})})]})}),E=P.story({render:()=>e.jsxs(d,{children:[e.jsx(u,{children:e.jsxs(f,{children:[e.jsx(x,{as:"div",variant:"body-large",weight:"bold",children:"Custom Multi-line Trigger"}),e.jsx(x,{as:"div",variant:"body-medium",color:"secondary",children:"Click to expand additional details and configuration options"})]})}),e.jsx(p,{children:e.jsx(y,{})})]})}),w=P.story({render:()=>e.jsxs(d,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsx(p,{children:e.jsx(y,{})})]})}),B=P.story({render:()=>e.jsxs(F,{children:[e.jsxs(d,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(d,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(d,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),C=P.story({render:()=>e.jsxs(F,{allowsMultiple:!0,children:[e.jsxs(d,{children:[e.jsx(u,{title:"First Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(d,{children:[e.jsx(u,{title:"Second Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(d,{children:[e.jsx(u,{title:"Third Panel"}),e.jsx(p,{children:e.jsx(f,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})}),N=P.story({render:()=>e.jsxs(m,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"Accordions automatically detect their parent bg context and increment the neutral level by 1. No prop is needed on the accordion -- it's fully automatic."}),e.jsxs(m,{direction:"column",gap:"4",children:[e.jsx(x,{children:"Default (no container)"}),e.jsxs(d,{defaultExpanded:!0,children:[e.jsx(u,{title:"Toggle Panel"}),e.jsxs(p,{children:[e.jsx(y,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})]}),e.jsxs(f,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 1 container"}),e.jsx(m,{mt:"2",children:e.jsxs(d,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-2)"}),e.jsxs(p,{children:[e.jsx(y,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})})]}),e.jsx(f,{bg:"neutral",children:e.jsxs(f,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 2 container"}),e.jsx(m,{mt:"2",children:e.jsxs(d,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-3)"}),e.jsxs(p,{children:[e.jsx(y,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})})]})}),e.jsx(f,{bg:"neutral",children:e.jsx(f,{bg:"neutral",children:e.jsxs(f,{bg:"neutral",p:"4",children:[e.jsx(x,{children:"Neutral 3 container"}),e.jsx(m,{mt:"2",children:e.jsxs(d,{defaultExpanded:!0,children:[e.jsx(u,{title:"Auto (neutral-3)"}),e.jsxs(p,{children:[e.jsx(y,{}),e.jsxs(m,{mt:"3",gap:"2",children:[e.jsx(A,{children:"Action"}),e.jsx(A,{variant:"secondary",children:"Cancel"})]})]})]})})]})})})]})});$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...N.input.parameters?.docs?.source}}};const ze=["Default","WithSubtitle","CustomTrigger","DefaultExpanded","GroupSingleOpen","GroupMultipleOpen","AutoBg"];export{N as AutoBg,E as CustomTrigger,$ as Default,w as DefaultExpanded,C as GroupMultipleOpen,B as GroupSingleOpen,v as WithSubtitle,ze as __namedExportsOrder};
