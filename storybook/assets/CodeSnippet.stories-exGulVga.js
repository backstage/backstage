import{j as e}from"./iframe-CMSX-Slv.js";import{C as t}from"./CodeSnippet-CZA_HRyb.js";import{I as o}from"./InfoCard-f-5M9Gya.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CrZisxgt.js";import"./CardContent-C2ce6hyO.js";import"./ErrorBoundary--HL8PNeL.js";import"./ErrorPanel-BpJTolUg.js";import"./WarningPanel-CVXsWPFb.js";import"./ExpandMore-CxD86Ymg.js";import"./AccordionDetails-CG6VB7z5.js";import"./index-B9sM2jn7.js";import"./Collapse-B7qWjyOd.js";import"./MarkdownContent-DE-av-nW.js";import"./makeStyles-C56sb6JC.js";import"./Link-CWhz2WXp.js";import"./lodash-CziDWmf6.js";import"./useAnalytics-BQThuKWZ.js";import"./useApp-ghU1X1ft.js";import"./Grid-CftEnNEm.js";import"./List-C_4Wuvt0.js";import"./ListContext-DVytDPzj.js";import"./ListItem-zoeI7a-b.js";import"./ListItemText-C3Uz1I1p.js";import"./CopyTextButton-CBQR8gRU.js";import"./useCopyToClipboard-4CXQdWGo.js";import"./useMountedState-CRdqm6Ni.js";import"./Tooltip-Dd1GWXAA.js";import"./useObjectRef-BtQagX3Q.js";import"./useOverlayTriggerState-u57ke4k2.js";import"./utils-lN068qtb.js";import"./useFocusRing-DUZK2ZXK.js";import"./openLink-p0OhMCOD.js";import"./number-gVXFFl9I.js";import"./I18nProvider-B2rLmNuT.js";import"./useControlledState-DUMTY9Yj.js";import"./animation-rB_Nrf2Y.js";import"./useHover-D7owYt-e.js";import"./ButtonIcon-DN3nNPiF.js";import"./Button-C89HVwFt.js";import"./Label-QJ7mfr_v.js";import"./Hidden-kIQntXwy.js";import"./useLabel-BoN1kqrs.js";import"./useLabels-B9A8JaNL.js";import"./useButton-C_sygl1c.js";import"./usePress-BzSNyydx.js";import"./textSelection-CwsB_5f_.js";import"./getMetaValue-DyXwXlFD.js";import"./index-DnnZFGoL.js";import"./LinkButton-D2Fh6lK2.js";import"./Button-prFNS_lF.js";import"./CardHeader-7iCHlFLr.js";import"./Divider-DrJnGvnU.js";import"./CardActions-DBmZgSao.js";import"./BottomLink-DxaZd3qv.js";import"./ArrowForward-BQeQx_3c.js";import"./Box-DUV89UkZ.js";import"./styled-EAA9K7Rc.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
