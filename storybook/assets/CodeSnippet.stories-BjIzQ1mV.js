import{j as e}from"./iframe-BKMB85pu.js";import{C as t}from"./CodeSnippet-DcKj-6qM.js";import{I as o}from"./InfoCard-Bu1-JBcD.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CxKjejfY.js";import"./CardContent-D-Egn4yc.js";import"./ErrorBoundary-DzXMA5OY.js";import"./ErrorPanel-DMnVYPRB.js";import"./WarningPanel-DeZlQeYj.js";import"./ExpandMore-Bs02VRS8.js";import"./AccordionDetails-D0Ke5GTc.js";import"./index-B9sM2jn7.js";import"./Collapse-DeMnbEls.js";import"./MarkdownContent-5Nh2VUb_.js";import"./makeStyles-BbaqMEn9.js";import"./Grid-viPz66aT.js";import"./List-DE1EjvNy.js";import"./ListContext-CjUxhhLX.js";import"./ListItem-t7nuvK6y.js";import"./ListItemText-sdDqdehA.js";import"./CopyTextButton-CxBpZbdV.js";import"./useCopyToClipboard-BuPEM0nO.js";import"./useMountedState-DH0AZbbi.js";import"./Tooltip-BemYkD6q.js";import"./useObjectRef-CqnWYM4T.js";import"./useOverlayTriggerState-BIOnmv4V.js";import"./utils-Nyu7VTFu.js";import"./useFocusRing-jnagQyYL.js";import"./number-CuQ36X_j.js";import"./I18nProvider-29Kr0hRB.js";import"./useControlledState-D3rG0KvC.js";import"./animation-R0urY-IW.js";import"./useHover-BaAG1-q2.js";import"./ButtonIcon-DlomWlgb.js";import"./Button-BvAYTrV8.js";import"./Label-Y7OAC7uK.js";import"./Hidden-DHN5dLew.js";import"./useLabel-CeJz4BMW.js";import"./useLabels-CFKWkPDt.js";import"./useButton-BR5xtNl4.js";import"./usePress-BpVHvCO3.js";import"./textSelection-Cj_b9rbF.js";import"./getMetaValue-TGQihhTK.js";import"./index-CSiDGQP5.js";import"./LinkButton-CZSDHAr0.js";import"./Link-fH8EKjwa.js";import"./lodash-BeJ40VgY.js";import"./useApp-CJurmApE.js";import"./index-DT_vTdsS.js";import"./useAnalytics-Byp1p_wz.js";import"./Button-D3uSp3Yv.js";import"./CardHeader-CZpnyxGM.js";import"./Divider-s0tWw9xa.js";import"./CardActions-BWS3egja.js";import"./BottomLink-9PLL8Xlz.js";import"./ArrowForward-7pjN-cYV.js";import"./Box-BIjxIEHL.js";import"./styled-CmE3HJ3H.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
