import{bR as e}from"./iframe-CNmrqhdp.js";import{C as t}from"./CodeSnippet-B4QHrZxA.js";import{I as o}from"./InfoCard-zPitxVsw.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CecqzQJ6.js";import"./CardContent-DOANJvxI.js";import"./ErrorBoundary-1bG2IjZO.js";import"./ErrorPanel-r6vIQ9Y1.js";import"./WarningPanel-kTOcUjWz.js";import"./ExpandMore-C1SJEl53.js";import"./AccordionDetails-C0yuhCvO.js";import"./index-B9sM2jn7.js";import"./Collapse-DkReGfOr.js";import"./MarkdownContent-CcNF5Ko8.js";import"./makeStyles-CoULisOM.js";import"./Link-Buntv2pG.js";import"./lodash-DcRUHytK.js";import"./useAnalytics-BfmOd9pS.js";import"./useApp-DjNgU9QR.js";import"./Grid-BGPHOMQP.js";import"./List-ahum0BRu.js";import"./ListContext-B5UlMvnw.js";import"./ListItem-B6bQ60ol.js";import"./ListItemText-BeWx-Vvf.js";import"./CopyTextButton-1pXQlLSE.js";import"./useCopyToClipboard-BX3Cc1_x.js";import"./useMountedState-CokGl4ZB.js";import"./Tooltip-BQ2DH04K.js";import"./Popper-zherBlvX.js";import"./Portal-BeWhklMr.js";import"./LinkButton-BrQM7ISL.js";import"./Button-9-qLVWPx.js";import"./CardHeader-RoZCxyFJ.js";import"./Divider-DvCVn6dj.js";import"./CardActions-AFZ7said.js";import"./BottomLink-DFnpl2bO.js";import"./ArrowForward-CUAAGA4B.js";import"./Box-1MBd1NdD.js";import"./styled-wlFTiasm.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
