import{j as e}from"./iframe-COehFrpL.js";import{C as t}from"./CodeSnippet-DANPGiIq.js";import{I as o}from"./InfoCard-CUq7q2tO.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-B7PQop3d.js";import"./styled-CHPGtv4W.js";import"./CopyTextButton-CqT9rzTe.js";import"./useCopyToClipboard-XYtayGRj.js";import"./useMountedState-B99v9kbG.js";import"./Tooltip-D5cXJRas.js";import"./Popper-Dg2-j-PV.js";import"./Portal-BDUo5n07.js";import"./index-a-YDJ9fl.js";import"./CardContent-DvtrGVzB.js";import"./ErrorBoundary-Bwcs06iG.js";import"./ErrorPanel-sHOo08CV.js";import"./WarningPanel-C3YsvByL.js";import"./ExpandMore-Dty7EJAS.js";import"./AccordionDetails-D82uV10E.js";import"./index-B9sM2jn7.js";import"./Collapse-B1e5vrwf.js";import"./MarkdownContent-Bgg942nC.js";import"./makeStyles-D7As8WbR.js";import"./Link-B7XO7g3U.js";import"./lodash-FtczDCAx.js";import"./useAnalytics-MdDpEXUp.js";import"./useApp-B2bmOZiO.js";import"./Grid-BJ0wK3FV.js";import"./List-CiizdJ3F.js";import"./ListContext-BRvGbkkj.js";import"./ListItem-KCvGwAe0.js";import"./ListItemText-DrxBjBT1.js";import"./LinkButton-C0RAUi7P.js";import"./Button-D7f3kZ7f.js";import"./CardHeader-CwVBGOfb.js";import"./Divider-e4wJPda_.js";import"./CardActions-DoGR-D7b.js";import"./BottomLink-B-qqEqc4.js";import"./ArrowForward-DXylIA_F.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
