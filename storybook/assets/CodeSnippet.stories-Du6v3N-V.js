import{j as e}from"./iframe-DWvOg1Nr.js";import{C as t}from"./CodeSnippet-ezk9Eue2.js";import{I as o}from"./InfoCard-D0RHekOf.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-zyqdCy3P.js";import"./styled-RIBlsQy0.js";import"./CopyTextButton-DimktF9n.js";import"./useCopyToClipboard-CxVcS6P-.js";import"./useMountedState--89EdGyj.js";import"./Tooltip-DwFxLD2U.js";import"./Popper-Dvaylqi7.js";import"./Portal-y55DOJ_z.js";import"./index-BUDLY78-.js";import"./CardContent-DcxN574S.js";import"./ErrorBoundary-D1Ur3zLp.js";import"./ErrorPanel-D3vNh4S-.js";import"./WarningPanel-BZtrrDpu.js";import"./ExpandMore-DPLbvTgi.js";import"./AccordionDetails-IDw-tlej.js";import"./index-B9sM2jn7.js";import"./Collapse-DYLsDfAh.js";import"./MarkdownContent--ubLUnxB.js";import"./makeStyles-CHGG-m_x.js";import"./Link-C6IojI8B.js";import"./lodash-BszOACSM.js";import"./useAnalytics-CLrtpPO4.js";import"./useApp-QYowGE2r.js";import"./Grid-Xzlg2O4n.js";import"./List-BFA7b6ty.js";import"./ListContext-BV1W3iGS.js";import"./ListItem-CYRCHcIm.js";import"./ListItemText-B4brgRyM.js";import"./LinkButton-B0qyXvUG.js";import"./Button-BbevIr3Z.js";import"./CardHeader-BNUf5KQo.js";import"./Divider-l_Tw4Y2t.js";import"./CardActions-B-4b2uSg.js";import"./BottomLink-Bhm7-K4G.js";import"./ArrowForward-DUaLA1W5.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
  </InfoCard>`,...l.parameters?.docs?.source}}};const $=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{l as CopyCode,s as Default,p as Languages,i as LineNumbers,a as MultipleLines,n as Overflow,$ as __namedExportsOrder,Z as default};
