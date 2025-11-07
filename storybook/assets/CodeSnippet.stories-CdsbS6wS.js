import{j as e}from"./iframe-DGs96NRX.js";import{C as t}from"./CodeSnippet-_eOoFouG.js";import{I as o}from"./InfoCard-CVq5vFZI.js";import"./preload-helper-D9Z9MdNV.js";import"./Box-D4WzEFhv.js";import"./styled-BpF5KOwn.js";import"./CopyTextButton-BnG0iIPf.js";import"./useCopyToClipboard-CMVqWLvJ.js";import"./useMountedState-CrWRPmTB.js";import"./Tooltip-B0esBOhK.js";import"./Popper-O4AAWfmZ.js";import"./Portal-d4IyiHDj.js";import"./CardContent-D_Z8OSfu.js";import"./ErrorBoundary-Dc-3W-6w.js";import"./ErrorPanel-CNmGi6XN.js";import"./WarningPanel-Ci1uty-p.js";import"./ExpandMore-sv7y42DS.js";import"./AccordionDetails-DcDYdNfQ.js";import"./index-DnL3XN75.js";import"./Collapse-B15AMTul.js";import"./MarkdownContent-BL9CdgAN.js";import"./Grid-BHZNDkgf.js";import"./List-6sBN0fEc.js";import"./ListContext-JUKi6eaD.js";import"./ListItem-B6WkBU7i.js";import"./ListItemText-DKlzuA8v.js";import"./LinkButton-IIcYw6pZ.js";import"./Button-Nle0L9Fl.js";import"./Link-GHtCGRiO.js";import"./lodash-CwBbdt2Q.js";import"./index-Du2IYsJS.js";import"./useAnalytics-Dn6o1gMJ.js";import"./useApp-Sx5G5NdM.js";import"./CardHeader-DEMtBZ-P.js";import"./Divider-D5eOEnUc.js";import"./CardActions-BH_5asRW.js";import"./BottomLink-V5hYwYd7.js";import"./ArrowForward-D58oRGFf.js";const X={title:"Data Display/CodeSnippet",component:t},d={width:300},r=`const greeting = "Hello";
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
