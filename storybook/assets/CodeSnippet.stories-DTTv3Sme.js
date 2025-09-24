import{j as e}from"./iframe-Dyaavudc.js";import{C as t}from"./CodeSnippet-CvU93WqX.js";import{I as o}from"./InfoCard-DK6hsUUn.js";import"./preload-helper-D9Z9MdNV.js";import"./Box-BBMZCdvE.js";import"./styled-DUE4Vhg9.js";import"./CopyTextButton-BAX6zuMk.js";import"./useCopyToClipboard-LvANOgWh.js";import"./useMountedState-Ca6tx6sG.js";import"./Tooltip-Ty7zpOlh.js";import"./Popper-DhZ8DQVo.js";import"./Portal-CUQx1RGJ.js";import"./CardContent-CjCki9P1.js";import"./ErrorBoundary-CbyPL_-Y.js";import"./ErrorPanel-B2YZjnJe.js";import"./WarningPanel-D7uKb3M5.js";import"./ExpandMore-4_EAOpPR.js";import"./AccordionDetails-D6NyoHkL.js";import"./index-DnL3XN75.js";import"./Collapse-C_ACyz1D.js";import"./MarkdownContent-B1fiby4H.js";import"./Grid-yjQsuTcw.js";import"./List-CD5TLS8H.js";import"./ListContext-tHxur0ox.js";import"./ListItem-Cw_mLBpk.js";import"./ListItemText-C5HwvlyG.js";import"./LinkButton-CK_Oj2Uu.js";import"./Button-p78_XACY.js";import"./Link-BzX_mGVi.js";import"./lodash-CwBbdt2Q.js";import"./index-QN8QI6Oa.js";import"./useAnalytics-DFiGEzjB.js";import"./useApp-zMMbOjHG.js";import"./CardHeader-CdFGMhF2.js";import"./Divider-CazGSVhv.js";import"./CardActions-CWomgJq0.js";import"./BottomLink-BaDCUbTb.js";import"./ArrowForward-BJ4TDo_a.js";const X={title:"Data Display/CodeSnippet",component:t},d={width:300},r=`const greeting = "Hello";
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
