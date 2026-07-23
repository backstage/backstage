import{bR as e}from"./iframe-DEB_XKCy.js";import{C as t}from"./CodeSnippet-BBeCJGrA.js";import{I as o}from"./InfoCard-CqYRYSMA.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D9sSfquE.js";import"./CardContent-B6Va21OS.js";import"./ErrorBoundary-BIcPELWN.js";import"./ErrorPanel-CkpQwtYQ.js";import"./WarningPanel-BO4revjh.js";import"./ExpandMore-D1Fu8MfR.js";import"./AccordionDetails-9KpCPVWq.js";import"./index-B9sM2jn7.js";import"./Collapse-CxwyE9Og.js";import"./MarkdownContent-Bmux6UAj.js";import"./makeStyles-C8eWtwMZ.js";import"./Link-BIYNobCf.js";import"./lodash-fMOpK_K8.js";import"./useAnalytics-mLXG6yYh.js";import"./useApp-VyPYetGM.js";import"./Grid-CEjxPXH5.js";import"./List-BRkGi2Sl.js";import"./ListContext-4fnJmzGu.js";import"./ListItem-D1TJUFze.js";import"./ListItemText-_AAoWrN6.js";import"./CopyTextButton-DF3B6Ur_.js";import"./useCopyToClipboard-4UnV7oUY.js";import"./useMountedState-_5Y0jkw3.js";import"./Tooltip-DtgnmWuT.js";import"./useObjectRef-Ctp5tGlo.js";import"./useOverlayTriggerState-Bzrpe4h8.js";import"./utils-CrlF93yQ.js";import"./useFocusRing-DOwaR7bd.js";import"./openLink-D4lCVjTw.js";import"./number-DUI_xCBM.js";import"./I18nProvider-BHXvn5NR.js";import"./useControlledState-CdUkXr5H.js";import"./animation-EQr5ceW1.js";import"./useHover-BBgMw-bK.js";import"./ButtonIcon-BmcRjrhZ.js";import"./Button-CD6RS4NW.js";import"./Label-CunX4hTS.js";import"./Hidden-Bcf80zYT.js";import"./useLabel-CTUJJsAz.js";import"./useLabels-BcoDEarN.js";import"./useButton-DVtgz3c1.js";import"./usePress-RLqNI-Pb.js";import"./textSelection-LJfdl7Co.js";import"./index-BI-bQJz8.js";import"./LinkButton-CYaD0hxw.js";import"./Button-C_kKbrXk.js";import"./CardHeader-DH9nqs34.js";import"./Divider-D9LukFhi.js";import"./CardActions-D2R7j6Fp.js";import"./BottomLink-C7dv9xtN.js";import"./ArrowForward--w_L3DI9.js";import"./Box-DFSyaomf.js";import"./styled-EI2gKmN5.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
