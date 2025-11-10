import{r as l,H as J,a4 as P,j as e}from"./iframe-Dg7jNfgV.js";import{a as M,$ as L}from"./Button-DMfefpCO.js";import{d as D,k as Q,e as X,$ as Y,c as R,i as K,n as Z,b as W,m as ee}from"./utils-DlhuadZk.js";import{d as F,a as I}from"./useFocusRing-Qh6jG-2Q.js";import{$ as q}from"./useControlledState-t75cWlZQ.js";import{$ as re}from"./useEvent-SJSt4b76.js";import{$ as oe}from"./Heading-B3fhv2cn.js";import{f as te}from"./index-BQGsxAyO.js";import{c as m}from"./clsx-B-dksMZM.js";import{u as C}from"./useStyles-CF8dTXWk.js";import{F as ie}from"./Flex-CPbcRrPB.js";import{B as A}from"./Box-BFG0jD_w.js";import{T as x}from"./Text-Br1Gc74q.js";import"./preload-helper-D9Z9MdNV.js";import"./Hidden-HB7QdOxe.js";import"./usePress-DCHo0S64.js";import"./RSPContexts-DDPOJnuj.js";function ne(a,r,t){let{isDisabled:o}=a,n=D(),d=D(),s=Q(),u=l.useRef(null),g=l.useCallback(()=>{u.current=requestAnimationFrame(()=>{t.current&&t.current.setAttribute("hidden","until-found")}),J.flushSync(()=>{r.toggle()})},[t,r]);re(t,"beforematch",g);let h=l.useRef(null);return X(()=>{if(u.current&&cancelAnimationFrame(u.current),t.current&&!o&&!s){let i=t.current;h.current==null||typeof i.getAnimations!="function"?r.isExpanded?(i.removeAttribute("hidden"),i.style.setProperty("--disclosure-panel-width","auto"),i.style.setProperty("--disclosure-panel-height","auto")):(i.setAttribute("hidden","until-found"),i.style.setProperty("--disclosure-panel-width","0px"),i.style.setProperty("--disclosure-panel-height","0px")):r.isExpanded!==h.current&&(r.isExpanded?(i.removeAttribute("hidden"),i.style.setProperty("--disclosure-panel-width",i.scrollWidth+"px"),i.style.setProperty("--disclosure-panel-height",i.scrollHeight+"px"),Promise.all(i.getAnimations().map($=>$.finished)).then(()=>{i.style.setProperty("--disclosure-panel-width","auto"),i.style.setProperty("--disclosure-panel-height","auto")}).catch(()=>{})):(i.style.setProperty("--disclosure-panel-width",i.scrollWidth+"px"),i.style.setProperty("--disclosure-panel-height",i.scrollHeight+"px"),window.getComputedStyle(i).height,i.style.setProperty("--disclosure-panel-width","0px"),i.style.setProperty("--disclosure-panel-height","0px"),Promise.all(i.getAnimations().map($=>$.finished)).then(()=>i.setAttribute("hidden","until-found")).catch(()=>{}))),h.current=r.isExpanded}},[o,t,r.isExpanded,s]),l.useEffect(()=>()=>{u.current&&cancelAnimationFrame(u.current)},[]),{buttonProps:{id:n,"aria-expanded":r.isExpanded,"aria-controls":d,onPress:i=>{!o&&i.pointerType!=="keyboard"&&r.toggle()},isDisabled:o,onPressStart(i){i.pointerType==="keyboard"&&!o&&r.toggle()}},panelProps:{id:d,role:"group","aria-labelledby":n,"aria-hidden":!r.isExpanded,hidden:s||o?o||!r.isExpanded:void 0}}}function se(a){let[r,t]=q(a.isExpanded,a.defaultExpanded||!1,a.onExpandedChange);const o=l.useCallback(()=>{t(!0)},[t]),n=l.useCallback(()=>{t(!1)},[t]),d=l.useCallback(()=>{t(!r)},[t,r]);return{isExpanded:r,setExpanded:t,expand:o,collapse:n,toggle:d}}function ae(a){let{allowsMultipleExpanded:r=!1,isDisabled:t=!1}=a,[o,n]=q(l.useMemo(()=>a.expandedKeys?new Set(a.expandedKeys):void 0,[a.expandedKeys]),l.useMemo(()=>a.defaultExpandedKeys?new Set(a.defaultExpandedKeys):new Set,[a.defaultExpandedKeys]),a.onExpandedChange);return l.useEffect(()=>{if(!r&&o.size>1){let d=o.values().next().value;d!=null&&n(new Set([d]))}}),{allowsMultipleExpanded:r,isDisabled:t,expandedKeys:o,setExpandedKeys:n,toggleKey(d){let s;r?(s=new Set(o),s.has(d)?s.delete(d):s.add(d)):s=new Set(o.has(d)?[]:[d]),n(s)}}}const H=l.createContext(null),de=l.forwardRef(function(r,t){let o=ae(r),n=R({...r,defaultClassName:"react-aria-DisclosureGroup",values:{isDisabled:o.isDisabled,state:o}}),d=I(r,{global:!0});return P.createElement("div",{...d,...n,ref:t,"data-disabled":r.isDisabled||void 0},P.createElement(H.Provider,{value:o},n.children))}),le=l.createContext(null),ce=l.createContext(null),k=l.createContext(null),ue=l.forwardRef(function(r,t){[r,t]=Y(r,t,le);let o=l.useContext(H),{id:n,...d}=r,s=D();n||(n=s);let u=o?o.expandedKeys.has(n):r.isExpanded,g=se({...r,isExpanded:u,onExpandedChange(U){var N;o&&o.toggleKey(n),(N=r.onExpandedChange)===null||N===void 0||N.call(r,U)}}),h=P.useRef(null),i=r.isDisabled||o?.isDisabled||!1,{buttonProps:$,panelProps:z}=ne({...r,isExpanded:u,isDisabled:i},g,h),{isFocusVisible:B,focusProps:O}=F({within:!0}),G=R({...r,id:void 0,defaultClassName:"react-aria-Disclosure",values:{isExpanded:g.isExpanded,isDisabled:i,isFocusVisibleWithin:B,state:g}}),V=I(d,{global:!0});return P.createElement(K,{values:[[M,{slots:{[Z]:{},trigger:$}}],[k,{panelProps:z,panelRef:h}],[ce,g]]},P.createElement("div",{...W(V,G,O),ref:t,"data-expanded":g.isExpanded||void 0,"data-disabled":i||void 0,"data-focus-visible-within":B||void 0},G.children))}),pe=l.forwardRef(function(r,t){let{role:o="group"}=r,{panelProps:n,panelRef:d}=l.useContext(k),{isFocusVisible:s,focusProps:u}=F({within:!0}),g=R({...r,defaultClassName:"react-aria-DisclosurePanel",values:{isFocusVisibleWithin:s}}),h=I(r,{global:!0});return P.createElement("div",{...W(h,g,n,u),ref:ee(t,d),role:o,"data-focus-visible-within":s||void 0},P.createElement(K,{values:[[M,null]]},r.children))}),b={"bui-Accordion":"_bui-Accordion_1vd3l_20","bui-AccordionTrigger":"_bui-AccordionTrigger_1vd3l_27","bui-AccordionTriggerButton":"_bui-AccordionTriggerButton_1vd3l_35","bui-AccordionTriggerTitle":"_bui-AccordionTriggerTitle_1vd3l_58","bui-AccordionTriggerSubtitle":"_bui-AccordionTriggerSubtitle_1vd3l_64","bui-AccordionTriggerIcon":"_bui-AccordionTriggerIcon_1vd3l_70","bui-AccordionPanel":"_bui-AccordionPanel_1vd3l_81","bui-AccordionGroup":"_bui-AccordionGroup_1vd3l_87"},c=l.forwardRef(({className:a,...r},t)=>{const{classNames:o,cleanedProps:n}=C("Accordion",r);return e.jsx(ue,{ref:t,className:m(o.root,b[o.root],a),...n})});c.displayName="Accordion";const p=l.forwardRef(({className:a,title:r,subtitle:t,children:o,...n},d)=>{const{classNames:s,cleanedProps:u}=C("Accordion",n);return e.jsx(oe,{ref:d,className:m(s.trigger,b[s.trigger],a),...u,children:e.jsxs(L,{slot:"trigger",className:m(s.triggerButton,b[s.triggerButton]),children:[o||e.jsxs(ie,{gap:"2",align:"center",children:[e.jsx("span",{className:m(s.triggerTitle,b[s.triggerTitle]),children:r}),t&&e.jsx("span",{className:m(s.triggerSubtitle,b[s.triggerSubtitle]),children:t})]}),e.jsx(te,{className:m(s.triggerIcon,b[s.triggerIcon]),size:16})]})})});p.displayName="AccordionTrigger";const f=l.forwardRef(({className:a,...r},t)=>{const{classNames:o,cleanedProps:n}=C("Accordion",r);return e.jsx(pe,{ref:t,className:m(o.panel,b[o.panel],a),...n})});f.displayName="AccordionPanel";const _=l.forwardRef(({className:a,allowsMultiple:r=!1,...t},o)=>{const{classNames:n,cleanedProps:d}=C("Accordion",t);return e.jsx(de,{ref:o,allowsMultipleExpanded:r,className:m(n.group,b[n.group],a),...d})});_.displayName="AccordionGroup";c.__docgenInfo={description:"@public",methods:[],displayName:"Accordion",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["RADisclosureProps"]};p.__docgenInfo={description:"@public",methods:[],displayName:"AccordionTrigger",props:{className:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["RAHeadingProps"]};f.__docgenInfo={description:"@public",methods:[],displayName:"AccordionPanel",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["RADisclosurePanelProps"]};_.__docgenInfo={description:"@public",methods:[],displayName:"AccordionGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},allowsMultiple:{required:!1,tsType:{name:"boolean"},description:`Whether multiple accordions can be expanded at the same time.
@defaultValue false`,defaultValue:{value:"false",computed:!1}}},composes:["RADisclosureGroupProps"]};const S=()=>e.jsxs(A,{children:[e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"}),e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})]}),Se={title:"Backstage UI/Accordion",component:c},y={render:()=>e.jsxs(c,{children:[e.jsx(p,{title:"Toggle Panel"}),e.jsx(f,{children:e.jsx(S,{})})]})},T={render:()=>e.jsxs(c,{children:[e.jsx(p,{title:"Advanced Settings",subtitle:"Configure additional options"}),e.jsx(f,{children:e.jsx(S,{})})]})},j={render:()=>e.jsxs(c,{children:[e.jsx(p,{children:e.jsxs(A,{children:[e.jsx(x,{as:"div",variant:"body-large",weight:"bold",children:"Custom Multi-line Trigger"}),e.jsx(x,{as:"div",variant:"body-medium",color:"secondary",children:"Click to expand additional details and configuration options"})]})}),e.jsx(f,{children:e.jsx(S,{})})]})},E={render:()=>e.jsxs(c,{defaultExpanded:!0,children:[e.jsx(p,{title:"Toggle Panel"}),e.jsx(f,{children:e.jsx(S,{})})]})},v={render:()=>e.jsxs(_,{children:[e.jsxs(c,{children:[e.jsx(p,{title:"First Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Second Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Third Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})},w={render:()=>e.jsxs(_,{allowsMultiple:!0,children:[e.jsxs(c,{children:[e.jsx(p,{title:"First Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's the edge of the world and all of Western civilization"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Second Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"The sun may rise in the East, at least it settled in a final location"})})})]}),e.jsxs(c,{children:[e.jsx(p,{title:"Third Panel"}),e.jsx(f,{children:e.jsx(A,{children:e.jsx(x,{as:"p",children:"It's understood that Hollywood sells Californication"})})})]})]})};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
}`,...y.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion>
      <AccordionTrigger title="Advanced Settings" subtitle="Configure additional options" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
}`,...T.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}};const Ne=["Default","WithSubtitle","CustomTrigger","DefaultExpanded","GroupSingleOpen","GroupMultipleOpen"];export{j as CustomTrigger,y as Default,E as DefaultExpanded,w as GroupMultipleOpen,v as GroupSingleOpen,T as WithSubtitle,Ne as __namedExportsOrder,Se as default};
