import{j as e}from"./iframe-WUTgIN9N.js";import{C as t}from"./CodeSnippet-BPpVm8z0.js";import{I as o}from"./InfoCard-BdoJYLI7.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DBvvfb3N.js";import"./CardContent-Ci02FdP5.js";import"./ErrorBoundary-D9CEd11V.js";import"./ErrorPanel-CkOctCWY.js";import"./WarningPanel-Sxu00y49.js";import"./ExpandMore-DIy80QFO.js";import"./AccordionDetails-DFhVCqjY.js";import"./index-B9sM2jn7.js";import"./Collapse-CE1N4KeO.js";import"./MarkdownContent-0-vvjMKh.js";import"./makeStyles-D1P9beTg.js";import"./Link-CuRGlsNT.js";import"./lodash-Dgk92AEG.js";import"./useAnalytics-gQW0QBIW.js";import"./useApp-C9iKSsIv.js";import"./Grid-QAEhh-IU.js";import"./List-BwP59E3R.js";import"./ListContext-CASXpzwL.js";import"./ListItem-CuOMG44s.js";import"./ListItemText-zrcvi365.js";import"./CopyTextButton-CCvx3icw.js";import"./useCopyToClipboard-C9AH3TNR.js";import"./useMountedState-hBsZdgf2.js";import"./Tooltip-1KTus1LO.js";import"./useObjectRef-CHIArbS8.js";import"./useOverlayTriggerState-Cw8HJspH.js";import"./utils-e_ANvV3R.js";import"./useFocusRing-BzNQUgBS.js";import"./openLink-C4ChH1Hb.js";import"./number-QltqjbkG.js";import"./I18nProvider-DmKJ1bjB.js";import"./useControlledState-CP3bPIEi.js";import"./animation-gc98-Tq1.js";import"./useHover-BXi1yiSF.js";import"./ButtonIcon-CBUq3vfF.js";import"./Button-uNEF8Zyb.js";import"./Label-DYgvNgnu.js";import"./Hidden-cqxb7NEw.js";import"./useLabel-BntByxux.js";import"./useLabels-DVXgHCjp.js";import"./useButton-D7XqHIUl.js";import"./usePress-BuMIReV1.js";import"./textSelection-DRp-kAWi.js";import"./index-BmfM_P7U.js";import"./LinkButton-BKZZdu98.js";import"./Button-BtKK-8iw.js";import"./CardHeader-mhJvsd6B.js";import"./Divider-LpG7fity.js";import"./CardActions-DuiHE7eG.js";import"./BottomLink-vWvI2lEI.js";import"./ArrowForward-BeZKrbdl.js";import"./Box-Dz1w66KV.js";import"./styled-DY6u-KGu.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
