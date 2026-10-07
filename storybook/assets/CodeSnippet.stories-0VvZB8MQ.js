import{j as e}from"./iframe-DsaViRt6.js";import{C as t}from"./CodeSnippet-BJsB8wjm.js";import{I as o}from"./InfoCard--g-XhD-l.js";import"./preload-helper-PPVm8Dsz.js";import"./index-kl08ino_.js";import"./CardContent-BllGyscE.js";import"./ErrorBoundary-DHCX9BdB.js";import"./ErrorPanel-DcyTyiAX.js";import"./WarningPanel-CoM8knqw.js";import"./ExpandMore-BJmwiUAU.js";import"./AccordionDetails-Bmn9Uyiw.js";import"./index-B9sM2jn7.js";import"./Collapse-BxUF1mA9.js";import"./MarkdownContent-xtsadi98.js";import"./makeStyles-DomhxC8K.js";import"./Link-Ddg_NHNk.js";import"./lodash-MieUkT6_.js";import"./useAnalytics-C8e92oTN.js";import"./useApp-Fb2uCB2O.js";import"./Grid-8AdasDhF.js";import"./List-DXgisE-a.js";import"./ListContext-DhuLCPQN.js";import"./ListItem-C0JUr0PJ.js";import"./ListItemText-RuCxYiQf.js";import"./CopyTextButton-CMXm_7GY.js";import"./useCopyToClipboard-BDWSkNch.js";import"./useMountedState-tMdzOAMm.js";import"./Tooltip-CsEou8gd.js";import"./useObjectRef-C8p51AiY.js";import"./useOverlayTriggerState-AJWVqgd9.js";import"./utils-BMtDQ3Mp.js";import"./useFocusRing-BGqp868t.js";import"./openLink-DOqnQA7B.js";import"./number-DJMv4vuV.js";import"./I18nProvider-C_4m3VHk.js";import"./useControlledState-C9PUVjXY.js";import"./animation-BJNMN6_t.js";import"./useHover-DqXkt4DH.js";import"./ButtonIcon-DZtq07FP.js";import"./Button-S9X553hq.js";import"./Label-BVmI6bof.js";import"./Hidden-D546-sk9.js";import"./useLabel-yKsWsykb.js";import"./useLabels-DdirUbZa.js";import"./useButton-Tyy1zmtL.js";import"./usePress-DMXgY0oY.js";import"./textSelection-8YvAK-Rq.js";import"./index-B0Q9OrQR.js";import"./LinkButton-DSw0LgHt.js";import"./Button-Bm1v57IW.js";import"./CardHeader-C7gZvhb3.js";import"./Divider-DtY1Y9Is.js";import"./CardActions-BH2FksSN.js";import"./BottomLink-DGxcu_kp.js";import"./ArrowForward-BseKChuu.js";import"./Box-CkIMQTPE.js";import"./styled-C9i7J3Hk.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
