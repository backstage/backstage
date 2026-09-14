import{bQ as e}from"./iframe-Bbqeoxyy.js";import{C as t}from"./CodeSnippet-DWUHhZ0c.js";import{I as o}from"./InfoCard-1RGvI5EV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-KzxoBRt_.js";import"./CardContent-BdlBFMAO.js";import"./ErrorBoundary-DWLsClZ2.js";import"./ErrorPanel-BcGDf_vy.js";import"./WarningPanel-BbJx_kd7.js";import"./ExpandMore-DLJ_FpHY.js";import"./AccordionDetails-DDWkg8jt.js";import"./index-B9sM2jn7.js";import"./Collapse-CJjxMxkO.js";import"./MarkdownContent-m8bFswZ4.js";import"./makeStyles-DFmhOTr7.js";import"./Link-Cr34xYgP.js";import"./lodash-Bx6Dz-vC.js";import"./useAnalytics-meCmxkTG.js";import"./useApp-D-XDRZX8.js";import"./Grid-DzJPcTRQ.js";import"./List-DxT-GkgB.js";import"./ListContext-Cf3kUXlp.js";import"./ListItem--VGhdB2A.js";import"./ListItemText-lg2s-VSy.js";import"./CopyTextButton-BZOmoZRL.js";import"./useCopyToClipboard-ODYpAmVN.js";import"./useMountedState-BNNLW-R1.js";import"./Tooltip-CFwX76yy.js";import"./useObjectRef-Cou_yZVk.js";import"./useOverlayTriggerState-WXzfO5cP.js";import"./utils-DuG_PdhV.js";import"./useFocusRing-CJyvvUb2.js";import"./openLink-DSranXhD.js";import"./number-B0As9b-E.js";import"./I18nProvider-o7BfuMCW.js";import"./useControlledState-Dwmvm7Z8.js";import"./animation-UzooCWZq.js";import"./useHover-8JiRj4U9.js";import"./ButtonIcon-bZXMNDvR.js";import"./Button-DBxI9neY.js";import"./Label-BYZanQTo.js";import"./Hidden-wfkm4vEc.js";import"./useLabel-CueqYSAw.js";import"./useLabels-CD6Jijpq.js";import"./useButton-CP9W9vY-.js";import"./usePress-DupziYu-.js";import"./textSelection-CSZvk6XP.js";import"./index-CWg0XmG9.js";import"./LinkButton-DIXcO_NR.js";import"./Button-A0o30eJi.js";import"./CardHeader-Dk2WuNhO.js";import"./Divider-CjIx6zL2.js";import"./CardActions-D3orFapr.js";import"./BottomLink-CBxuHb3a.js";import"./ArrowForward-BjEddO6G.js";import"./Box-BxF7iS_5.js";import"./styled-B7YU-aJo.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
