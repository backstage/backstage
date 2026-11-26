import{j as e}from"./iframe-bb_jNxxL.js";import{C as t}from"./CodeSnippet-CE86ZW0y.js";import{I as o}from"./InfoCard-Cf8UxPIw.js";import"./preload-helper-PPVm8Dsz.js";import"./index-dQxF3Oj4.js";import"./CardContent-D3jThAyt.js";import"./ErrorBoundary-BlUpQK4q.js";import"./ErrorPanel-BV0RjseS.js";import"./WarningPanel-CHsT-ENQ.js";import"./ExpandMore-DJjOoNS8.js";import"./AccordionDetails-DTiGxQIY.js";import"./index-B9sM2jn7.js";import"./Collapse-C1vt9U0h.js";import"./MarkdownContent-Chp8Woi7.js";import"./makeStyles-CgTSz4WE.js";import"./Grid-BTQv340N.js";import"./List-BoIjCh7L.js";import"./ListContext-oQxTFKFx.js";import"./ListItem-BW0PV3ll.js";import"./ListItemText-h_XmDgas.js";import"./CopyTextButton-B7qnFsel.js";import"./useCopyToClipboard-CmNq9oJ2.js";import"./useMountedState-COkifDVC.js";import"./Tooltip-BiZdYZQM.js";import"./useObjectRef-CTDjzFB8.js";import"./useOverlayTriggerState-Cwdw0na1.js";import"./utils-Cyge8L4m.js";import"./useFocusRing-DDqjVrJn.js";import"./number-DwC5Q0g4.js";import"./I18nProvider-B9G7Dj3y.js";import"./useControlledState-B45Nf08u.js";import"./animation-BLiFJPlN.js";import"./useHover-dfqWQZHs.js";import"./ButtonIcon-D9OaYA-z.js";import"./Button-B0WaVeZf.js";import"./Label-C64Zc2HQ.js";import"./Hidden-7ff-isZb.js";import"./useLabel-DvDKUI6U.js";import"./useLabels-B5_kFWwx.js";import"./useButton-Dgm20RBw.js";import"./usePress-iPbewX15.js";import"./textSelection-DLp-xbkE.js";import"./getMetaValue-BAPq9Qsv.js";import"./index-gvfFGbLs.js";import"./LinkButton-BOCmzcgr.js";import"./Link-BhEUyXEZ.js";import"./lodash-CwxrZd2c.js";import"./useApp-BYyXk-4Q.js";import"./index-B6EXqJ8A.js";import"./useAnalytics-BwMaIldS.js";import"./Button-BO623MIw.js";import"./CardHeader-D30WQNY8.js";import"./Divider-BI-7TC7K.js";import"./CardActions-BJn7pIqj.js";import"./BottomLink-DgaTYiar.js";import"./ArrowForward-DL6A2C2k.js";import"./Box-DOhXTkmR.js";import"./styled-Bf8yAc5R.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
  </InfoCard>`,...m.parameters?.docs?.source}}};const fe=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{m as CopyCode,i as Default,p as Languages,a as LineNumbers,s as MultipleLines,n as Overflow,fe as __namedExportsOrder,Se as default};
