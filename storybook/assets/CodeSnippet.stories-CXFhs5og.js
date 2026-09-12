import{bQ as e}from"./iframe-Di5Wv8w_.js";import{C as t}from"./CodeSnippet-C3q3rE7D.js";import{I as o}from"./InfoCard-CiiKWQur.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BE_MD4Ey.js";import"./CardContent-MfmYDCE0.js";import"./ErrorBoundary-D7fKmXZT.js";import"./ErrorPanel-CDwn1Hrm.js";import"./WarningPanel-CjS9JdM2.js";import"./ExpandMore-D5FtygCV.js";import"./AccordionDetails-DCohjdjE.js";import"./index-B9sM2jn7.js";import"./Collapse-BePVl3gM.js";import"./MarkdownContent-BgyzCdaC.js";import"./makeStyles-D-4gmWAY.js";import"./Link-C0kM2CWc.js";import"./lodash-DWZxpKTZ.js";import"./useAnalytics-B3tqbWl4.js";import"./useApp-WmaZUnnG.js";import"./Grid-D2BXyWtR.js";import"./List-DO8RbCmD.js";import"./ListContext-B1eYXRXz.js";import"./ListItem-Ct7mIZpE.js";import"./ListItemText-Dap07-T7.js";import"./CopyTextButton-B3yQMEnv.js";import"./useCopyToClipboard-xoGrWAxd.js";import"./useMountedState-BBb1bjBJ.js";import"./Tooltip-kTdyksyc.js";import"./useObjectRef-VfTF6kKY.js";import"./useOverlayTriggerState-BbiImD-e.js";import"./utils-B6tfyu-3.js";import"./useFocusRing-BPuyfxah.js";import"./openLink-BAk59qtu.js";import"./number-CGr55I-p.js";import"./I18nProvider-Dxi4hkuu.js";import"./useControlledState-BMloOWSe.js";import"./animation-DXfiyiY4.js";import"./useHover-BfN1GoIh.js";import"./ButtonIcon-CeqKDHWs.js";import"./Button-CUbHo8av.js";import"./Label-C3XyxUp7.js";import"./Hidden-CQX9C-br.js";import"./useLabel-CGVvVLBl.js";import"./useLabels-B0juHqyU.js";import"./useButton-BchjX23Y.js";import"./usePress-C2lMTGjY.js";import"./textSelection-D0hNc5Yy.js";import"./index-C_LMY1zh.js";import"./LinkButton-ay1Xo65i.js";import"./Button-Dlk368Gr.js";import"./CardHeader-DgRzJNLu.js";import"./Divider-BG9n4Dr2.js";import"./CardActions-D3g3AK7S.js";import"./BottomLink-DZzAuTsR.js";import"./ArrowForward-B7jcwG8u.js";import"./Box-6skH1RcB.js";import"./styled-BQfLikGu.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
