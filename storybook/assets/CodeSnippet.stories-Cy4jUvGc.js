import{j as e}from"./iframe-BY8lR-L8.js";import{C as t}from"./CodeSnippet-ajdkoRYg.js";import{I as o}from"./InfoCard-9a18SuEb.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-COui6GIh.js";import"./styled-Ckl9NdN2.js";import"./CopyTextButton-HjsOaOKI.js";import"./useCopyToClipboard-Bl5GfTuC.js";import"./useMountedState-DwTRr6Bf.js";import"./Tooltip-CQzh8PM4.js";import"./Popper-CAf4oxXD.js";import"./Portal-9M61fEx6.js";import"./CardContent-B8GBl9qU.js";import"./ErrorBoundary-BxthC0Iq.js";import"./ErrorPanel-DUhzHP9c.js";import"./WarningPanel-wg4n1CXF.js";import"./ExpandMore-fkHecgaQ.js";import"./AccordionDetails-Fks5AbbD.js";import"./index-B9sM2jn7.js";import"./Collapse-B6v7_Lug.js";import"./MarkdownContent-CEOHELvX.js";import"./Grid-BjrJvsR3.js";import"./List-Zd71n2FM.js";import"./ListContext-CBZm9pJe.js";import"./ListItem-CGZ3ypeU.js";import"./ListItemText-BFb2Grym.js";import"./LinkButton-0O3nZFeQ.js";import"./Button-DOtnJgPP.js";import"./Link-CG56jGaN.js";import"./lodash-Y_-RFQgK.js";import"./index-BS6rRTnv.js";import"./useAnalytics-BVxeCBFY.js";import"./useApp-BvPEffuf.js";import"./CardHeader-Hrxg6OrZ.js";import"./Divider-C9c6KGoD.js";import"./CardActions-D47ZvRGZ.js";import"./BottomLink-C0C-DKvG.js";import"./ArrowForward-BmZGDfYA.js";const X={title:"Data Display/CodeSnippet",component:t},d={width:300},r=`const greeting = "Hello";
const world = "World";

const greet = person => greeting + " " + person + "!";

greet(world);
`,m=`const greeting: string = "Hello";
const world: string = "World";

const greet = (person: string): string => greeting + " " + person + "!";

greet(world);
`,c=`greeting = "Hello"
world = "World"

def greet(person):
    return f"{greeting} {person}!"

greet(world)
`,s=()=>e.jsx(o,{title:"JavaScript example",children:e.jsx(t,{text:"const hello = 'World';",language:"javascript"})}),a=()=>e.jsx(o,{title:"JavaScript multi-line example",children:e.jsx(t,{text:r,language:"javascript"})}),i=()=>e.jsx(o,{title:"Show line numbers",children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})}),n=()=>e.jsxs(o,{title:"Overflow",children:[e.jsx("div",{style:d,children:e.jsx(t,{text:r,language:"javascript"})}),e.jsx("div",{style:d,children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})})]}),p=()=>e.jsxs(o,{title:"Multiple languages",children:[e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0}),e.jsx(t,{text:m,language:"typescript",showLineNumbers:!0}),e.jsx(t,{text:c,language:"python",showLineNumbers:!0})]}),l=()=>e.jsx(o,{title:"Copy Code",children:e.jsx(t,{text:r,language:"javascript",showCopyCodeButton:!0})});s.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"MultipleLines"};i.__docgenInfo={description:"",methods:[],displayName:"LineNumbers"};n.__docgenInfo={description:"",methods:[],displayName:"Overflow"};p.__docgenInfo={description:"",methods:[],displayName:"Languages"};l.__docgenInfo={description:"",methods:[],displayName:"CopyCode"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript example">
    <CodeSnippet text="const hello = 'World';" language="javascript" />
  </InfoCard>`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript multi-line example">
    <CodeSnippet text={JAVASCRIPT} language="javascript" />
  </InfoCard>`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => <InfoCard title="Show line numbers">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
  </InfoCard>`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => <InfoCard title="Overflow">
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
  </InfoCard>`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => <InfoCard title="Copy Code">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showCopyCodeButton />
  </InfoCard>`,...l.parameters?.docs?.source}}};const Z=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{l as CopyCode,s as Default,p as Languages,i as LineNumbers,a as MultipleLines,n as Overflow,Z as __namedExportsOrder,X as default};
