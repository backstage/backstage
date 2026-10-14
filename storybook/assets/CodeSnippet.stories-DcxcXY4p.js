import{j as e}from"./iframe-BboAvpku.js";import{C as t}from"./CodeSnippet-tKgRAv2c.js";import{I as o}from"./InfoCard-DP3DQvhV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bseu-KSo.js";import"./CardContent-DRVTa_uM.js";import"./ErrorBoundary-DtlyMFhd.js";import"./ErrorPanel-TqNQNmhF.js";import"./WarningPanel-V20DwlQC.js";import"./ExpandMore-BjuwtgxK.js";import"./AccordionDetails-DX8tynby.js";import"./index-B9sM2jn7.js";import"./Collapse-Cw4T2uQ_.js";import"./MarkdownContent-Cj_r4xeT.js";import"./makeStyles-iFGDkJwR.js";import"./Link-js1uqTlL.js";import"./lodash-DkpW-IpZ.js";import"./useAnalytics-CgDc_Zie.js";import"./useApp-CGvPwDHO.js";import"./Grid-BGOrXcY9.js";import"./List-OZSHlN34.js";import"./ListContext-BOEEedU_.js";import"./ListItem-Dkgy1Td7.js";import"./ListItemText-YTyAL1wR.js";import"./CopyTextButton-D1x-Ruaz.js";import"./useCopyToClipboard-BKMmrM2p.js";import"./useMountedState-Bzk4ehad.js";import"./Tooltip-B92S_96o.js";import"./useObjectRef-BBnfzFd-.js";import"./useOverlayTriggerState-Bs6TYJ4q.js";import"./utils-RjN6cOlV.js";import"./useFocusRing-BIuw5o9K.js";import"./openLink-TmJYTFGY.js";import"./number-2cz8Gb4T.js";import"./I18nProvider-XE_7i8YB.js";import"./useControlledState-DOt2_KtG.js";import"./animation-8A7n9uPm.js";import"./useHover-Cg57FJ61.js";import"./ButtonIcon-WVia_wbC.js";import"./Button-lIgsiol8.js";import"./Label-CSCfT4hg.js";import"./Hidden-B9xv55fQ.js";import"./useLabel-BJaNI2Tj.js";import"./useLabels-C3K2MhXi.js";import"./useButton-Cy5D_Qbf.js";import"./usePress-DjSnnouJ.js";import"./textSelection-CDb6_zJX.js";import"./getMetaValue-Dkox27la.js";import"./index-CsJ4-CBU.js";import"./LinkButton-CF5XE7dA.js";import"./Button-DYvPrSIp.js";import"./CardHeader-ClbmANKO.js";import"./Divider-SqGTKvAo.js";import"./CardActions-asWEOwuO.js";import"./BottomLink-B2bOjYwh.js";import"./ArrowForward-Bk0cF1Fr.js";import"./Box-AqVT1Pws.js";import"./styled-DoG2XfKF.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
