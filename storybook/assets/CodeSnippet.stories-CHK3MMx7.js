import{j as e}from"./iframe-DvObL_em.js";import{C as t}from"./CodeSnippet-ta_ZtIb9.js";import{I as o}from"./InfoCard-Bj_tIUR2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-7QwSRqxh.js";import"./CardContent-bkO_T-QZ.js";import"./ErrorBoundary-CrgTyS-_.js";import"./ErrorPanel-BGlPlf1U.js";import"./WarningPanel-DKgWQShY.js";import"./ExpandMore-BPw42VZj.js";import"./AccordionDetails-BjGpGUQw.js";import"./index-B9sM2jn7.js";import"./Collapse-nQM4YuR3.js";import"./MarkdownContent-BYBbURLA.js";import"./makeStyles-CUBlkZ58.js";import"./Link-D58R_yeB.js";import"./lodash-BX0jKKjM.js";import"./useAnalytics-Cik4L6Xq.js";import"./useApp-C8xACzk4.js";import"./Grid-D0oIIaci.js";import"./List-2eV0WyBd.js";import"./ListContext-DWdyoQ2B.js";import"./ListItem-HID7QX3w.js";import"./ListItemText-CdvKngye.js";import"./CopyTextButton-Cium_hFz.js";import"./useCopyToClipboard-v9MY_fxM.js";import"./useMountedState-qWdGL57P.js";import"./Tooltip-Ee6WRrpT.js";import"./useObjectRef-DwzLjeGu.js";import"./useOverlayTriggerState-DTpXlUK_.js";import"./utils-BE29XZkF.js";import"./useFocusRing-piHZ0Lw1.js";import"./openLink-Ba7f2eDn.js";import"./number-Brjj_L0c.js";import"./I18nProvider-D9Ed_WqX.js";import"./useControlledState-DTrBQisE.js";import"./animation-PoAPtwJr.js";import"./useHover-BBinV-uq.js";import"./ButtonIcon-CxBdcPMM.js";import"./Button-BnuV3xvc.js";import"./Label-DVU8J7bE.js";import"./Hidden-9nwWkQxZ.js";import"./useLabel-Dnkr3wg9.js";import"./useLabels-B4Qm2p4e.js";import"./useButton-1rnyv_zw.js";import"./usePress-YbeHGM9M.js";import"./textSelection-C86JgNxW.js";import"./getMetaValue-aV81Iu2D.js";import"./index-D2Zpwq-Q.js";import"./LinkButton-WLt2P26S.js";import"./Button-C3iCIf_W.js";import"./CardHeader-Feq57Dji.js";import"./Divider-DztT0DPF.js";import"./CardActions-CqhTlpuw.js";import"./BottomLink-QeZesGGY.js";import"./ArrowForward-DiQGJ5uj.js";import"./Box-vIlJQZHO.js";import"./styled-BUTQ37RD.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
const world = "World";

const greet = person => greeting + " " + person + "!";

greet(world);
`,d=`const greeting: string = "Hello";
const world: string = "World";

const greet = (person: string): string => greeting + " " + person + "!";

greet(world);
`,c=`greeting = "Hello"
world = "World"

def greet(person):
    return f"{greeting} {person}!"

greet(world)
`,i=()=>e.jsx(o,{title:"JavaScript example",children:e.jsx(t,{text:"const hello = 'World';",language:"javascript"})}),s=()=>e.jsx(o,{title:"JavaScript multi-line example",children:e.jsx(t,{text:r,language:"javascript"})}),a=()=>e.jsx(o,{title:"Show line numbers",children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})}),n=()=>e.jsxs(o,{title:"Overflow",children:[e.jsx("div",{style:l,children:e.jsx(t,{text:r,language:"javascript"})}),e.jsx("div",{style:l,children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})})]}),p=()=>e.jsxs(o,{title:"Multiple languages",children:[e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0}),e.jsx(t,{text:d,language:"typescript",showLineNumbers:!0}),e.jsx(t,{text:c,language:"python",showLineNumbers:!0})]}),m=()=>e.jsx(o,{title:"Copy Code",children:e.jsx(t,{text:r,language:"javascript",showCopyCodeButton:!0})});i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"MultipleLines"};a.__docgenInfo={description:"",methods:[],displayName:"LineNumbers"};n.__docgenInfo={description:"",methods:[],displayName:"Overflow"};p.__docgenInfo={description:"",methods:[],displayName:"Languages"};m.__docgenInfo={description:"",methods:[],displayName:"CopyCode"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript example">
    <CodeSnippet text="const hello = 'World';" language="javascript" />
  </InfoCard>`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript multi-line example">
    <CodeSnippet text={JAVASCRIPT} language="javascript" />
  </InfoCard>`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <InfoCard title="Show line numbers">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
  </InfoCard>`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => <InfoCard title="Overflow">
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" />
    </div>
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    </div>
  </InfoCard>`,...n.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => <InfoCard title="Multiple languages">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    <CodeSnippet text={TYPESCRIPT} language="typescript" showLineNumbers />
    <CodeSnippet text={PYTHON} language="python" showLineNumbers />
  </InfoCard>`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => <InfoCard title="Copy Code">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showCopyCodeButton />
  </InfoCard>`,...m.parameters?.docs?.source}}};const fe=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{m as CopyCode,i as Default,p as Languages,a as LineNumbers,s as MultipleLines,n as Overflow,fe as __namedExportsOrder,Se as default};
