import{j as e}from"./iframe-BpNetfkk.js";import{C as t}from"./CodeSnippet-BiIQ6QnU.js";import{I as o}from"./InfoCard-B2lpfx9C.js";import"./preload-helper-D9Z9MdNV.js";import"./Box-JPQ-K-XF.js";import"./styled-BVnjfZaP.js";import"./CopyTextButton-D74HsvCl.js";import"./useCopyToClipboard-B1BfXZ6A.js";import"./useMountedState-ya7tp212.js";import"./Tooltip-DuxoX6f6.js";import"./Popper-Bfi8Jp6K.js";import"./Portal-D3MaVJdo.js";import"./CardContent-B2DNk4YF.js";import"./ErrorBoundary-x8IJumU0.js";import"./ErrorPanel-C-auWv_U.js";import"./WarningPanel-BZPI4iuJ.js";import"./ExpandMore-Dg48zgbf.js";import"./AccordionDetails-CXV1bjLg.js";import"./index-DnL3XN75.js";import"./Collapse-CFskqauo.js";import"./MarkdownContent-lOphwaGa.js";import"./Grid-DGDU_W7d.js";import"./List-CcdBBh0x.js";import"./ListContext-BkpiPoXc.js";import"./ListItem-BE6uqYrF.js";import"./ListItemText-7Fv6oNRR.js";import"./LinkButton-CzXWMwoD.js";import"./Button-D2OH5WH0.js";import"./Link-Bbtl6_jS.js";import"./lodash-CwBbdt2Q.js";import"./index-DgvPNMU4.js";import"./useAnalytics-BKPjjI-y.js";import"./useApp-BAlbHaS5.js";import"./CardHeader-BzLrPpse.js";import"./Divider-2QoBmfwj.js";import"./CardActions-B_KvZC1G.js";import"./BottomLink-xNQE9YQZ.js";import"./ArrowForward-DwUrP4PQ.js";const X={title:"Data Display/CodeSnippet",component:t},d={width:300},r=`const greeting = "Hello";
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
