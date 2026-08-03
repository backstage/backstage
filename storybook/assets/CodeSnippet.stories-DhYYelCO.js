import{bR as e}from"./iframe-BErNvpjr.js";import{C as t}from"./CodeSnippet-BeMik3xT.js";import{I as o}from"./InfoCard-B6PrCAc-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CCyVLSfT.js";import"./CardContent-BJr4F9-m.js";import"./ErrorBoundary-CKSe6ZD_.js";import"./ErrorPanel-DUJWY3Dj.js";import"./WarningPanel-aeS1uxlY.js";import"./ExpandMore-cdbn0UMB.js";import"./AccordionDetails-BHPknckT.js";import"./index-B9sM2jn7.js";import"./Collapse-CH6-pVPs.js";import"./MarkdownContent-OKD1FB1e.js";import"./makeStyles-BfJTzYxE.js";import"./Link-CW9uhsyO.js";import"./lodash-0cH3ibhz.js";import"./useAnalytics-AQKAppCK.js";import"./useApp-C0t03fHF.js";import"./Grid-DJysy46s.js";import"./List-D-_MzgLt.js";import"./ListContext-uCf9E0gM.js";import"./ListItem-CeLlFv2m.js";import"./ListItemText-DwxzA3ij.js";import"./CopyTextButton-gR9BLXAd.js";import"./useCopyToClipboard-BN932-yp.js";import"./useMountedState-D3TlKKjE.js";import"./Tooltip-XMa2Y4y3.js";import"./useObjectRef-BTVJqnIZ.js";import"./useOverlayTriggerState-dtDxw6VN.js";import"./utils-CkI-fiaI.js";import"./useFocusRing-DhH0pnm8.js";import"./openLink-VEX9Ze2_.js";import"./number-B7KdHmdZ.js";import"./I18nProvider-Co2RDX0c.js";import"./useControlledState-DHvityQM.js";import"./animation-vcnj4bnB.js";import"./useHover-n_zdByGl.js";import"./ButtonIcon-DzHq31Aa.js";import"./Button-ZmGKrZ8S.js";import"./Label-CdvKSS9p.js";import"./Hidden-BXpNp4mY.js";import"./useLabel-0LCDbxSL.js";import"./useLabels-BfB1Y_Ok.js";import"./useButton-CuzCCNla.js";import"./usePress-BuVIReZf.js";import"./textSelection-Beclu5dQ.js";import"./index-9xGCRmTA.js";import"./LinkButton-r1Qmband.js";import"./Button-xu9yKhtH.js";import"./CardHeader-CcntMew2.js";import"./Divider-rnFOpPZ9.js";import"./CardActions-CwoLqw7r.js";import"./BottomLink-Dowxi2CD.js";import"./ArrowForward-BcklMEJA.js";import"./Box-DlU-DYqp.js";import"./styled-CONJ26HT.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
  </InfoCard>`,...m.parameters?.docs?.source}}};const Se=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{m as CopyCode,i as Default,p as Languages,a as LineNumbers,s as MultipleLines,n as Overflow,Se as __namedExportsOrder,xe as default};
