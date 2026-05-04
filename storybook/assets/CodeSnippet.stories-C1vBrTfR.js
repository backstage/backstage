import{j as e}from"./iframe-COJz9F1o.js";import{C as t}from"./CodeSnippet-DGfpD5_2.js";import{I as o}from"./InfoCard-31dl04IT.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-Dnr7lIgc.js";import"./styled-CHgYw-aN.js";import"./CopyTextButton-CNIHQblK.js";import"./useCopyToClipboard-Dz7fum6I.js";import"./useMountedState-C3abf_5z.js";import"./Tooltip-fO89vQyA.js";import"./Popper-CxR6N-KO.js";import"./Portal-Df_bDRFp.js";import"./index-DiZHcWFF.js";import"./CardContent-DBt_a8KO.js";import"./ErrorBoundary-DOTSeCOy.js";import"./ErrorPanel-YGyA9VEC.js";import"./WarningPanel-WsMFaOZw.js";import"./ExpandMore-DXunSdYg.js";import"./AccordionDetails-whFAo4IX.js";import"./index-B9sM2jn7.js";import"./Collapse-D_FlMLCQ.js";import"./MarkdownContent-XYn3I-kg.js";import"./makeStyles-DfpJxphG.js";import"./Link-SgQWsjcg.js";import"./lodash-CDGQ6Log.js";import"./useAnalytics-K4Yw9kGl.js";import"./useApp-BuWghqmQ.js";import"./Grid-QH0IRglv.js";import"./List-DxjCJy_8.js";import"./ListContext-D1BzRUpQ.js";import"./ListItem-BeM9N7OL.js";import"./ListItemText-BjqwjiRt.js";import"./LinkButton-DO7vPVuJ.js";import"./Button-BHosKEx7.js";import"./CardHeader-CStX9efF.js";import"./Divider-zKAuOCNJ.js";import"./CardActions-DG4rgF4N.js";import"./BottomLink-BGSVnyd6.js";import"./ArrowForward-CzyFZdH2.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
