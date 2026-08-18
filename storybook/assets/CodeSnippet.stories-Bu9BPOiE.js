import{bR as e}from"./iframe-Bfeun6FV.js";import{C as t}from"./CodeSnippet-J4dETvm2.js";import{I as o}from"./InfoCard-DFi9Ow4U.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bj4M52Zv.js";import"./CardContent-D0dHD1Tr.js";import"./ErrorBoundary-CfdLXyUj.js";import"./ErrorPanel-wH3aTGgG.js";import"./WarningPanel-Bh_JLXft.js";import"./ExpandMore-D8FI7LLa.js";import"./AccordionDetails-C3kQn4qo.js";import"./index-B9sM2jn7.js";import"./Collapse-COymxWJx.js";import"./MarkdownContent-BMUIE5i7.js";import"./makeStyles-C7fNhz2-.js";import"./Link-Ck5B18Ox.js";import"./lodash-BgRn0AvU.js";import"./useAnalytics-BM8yTVVe.js";import"./useApp-CxJ04SgY.js";import"./Grid-DpcxvWnM.js";import"./List-Be5BF-4X.js";import"./ListContext-xaY7-bAc.js";import"./ListItem-CVsqLCjK.js";import"./ListItemText-BA03E3jC.js";import"./CopyTextButton-CxOzeIL9.js";import"./useCopyToClipboard-DkiEyTWi.js";import"./useMountedState-BD7hbG-Z.js";import"./Tooltip-BAHNPtWJ.js";import"./useObjectRef-DpvjfcTN.js";import"./useOverlayTriggerState-DF5r881j.js";import"./utils-C1fACjU5.js";import"./useFocusRing-D2D9w2h7.js";import"./openLink-Z9FeXa0N.js";import"./number-3AeMSo45.js";import"./I18nProvider-TylybwwN.js";import"./useControlledState-CC8JDBnw.js";import"./animation-DPrX5Bmr.js";import"./useHover-Bl99Bvws.js";import"./ButtonIcon-Dk4ShQ2Z.js";import"./Button-CXBJEZu8.js";import"./Label-CMwfur8h.js";import"./Hidden-sFV-2aQN.js";import"./useLabel-fE5WpueX.js";import"./useLabels-ClA9bczX.js";import"./useButton-35EaW1qC.js";import"./usePress-TbacPce5.js";import"./textSelection-DZyb17vv.js";import"./index-CVNQhIDx.js";import"./LinkButton-DPt849sA.js";import"./Button-CYdonP1l.js";import"./CardHeader-eAX5Jfpr.js";import"./Divider-9p1EUYx5.js";import"./CardActions-DcTtm2sp.js";import"./BottomLink-CVyIgyy5.js";import"./ArrowForward-DZsyRxbF.js";import"./Box-VVBVNoPf.js";import"./styled-tsuVmXB5.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
