import{j as e}from"./iframe-CxlUpTpq.js";import{C as t}from"./CodeSnippet-DNItfSxA.js";import{I as o}from"./InfoCard-D75MiOPQ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-22DygKJ2.js";import"./CardContent-C78XZ7YK.js";import"./ErrorBoundary-BsvjCmyZ.js";import"./ErrorPanel-DVQwZFE4.js";import"./WarningPanel-DujtwXI3.js";import"./ExpandMore-JdlG67sm.js";import"./AccordionDetails-DoQbYKV5.js";import"./index-B9sM2jn7.js";import"./Collapse-CV0Gnfx7.js";import"./MarkdownContent-DNdcex5U.js";import"./makeStyles-DbA2ZWGd.js";import"./Link-bOvDEdKZ.js";import"./lodash-7klT_A_g.js";import"./useAnalytics-CsE2FyHM.js";import"./useApp-xRl_5Yzb.js";import"./Grid-BLfllSxx.js";import"./List-DdEJ-kwg.js";import"./ListContext-T4foTbcb.js";import"./ListItem-CFzuWqPn.js";import"./ListItemText-DTWT_exv.js";import"./CopyTextButton-BZZjHxUE.js";import"./useCopyToClipboard-QnRjVoLF.js";import"./useMountedState-DkDBMh4e.js";import"./Tooltip-CHTJ2CJI.js";import"./useObjectRef-Dh3jViZn.js";import"./useOverlayTriggerState-G8ih59XW.js";import"./utils-BiH69BEF.js";import"./useFocusRing-DKBxNAkp.js";import"./openLink-DT4-HiOA.js";import"./number-wfr-a2dw.js";import"./I18nProvider-g-YIgX08.js";import"./useControlledState-CxsccuSa.js";import"./animation-D6w75ks6.js";import"./useHover-DMFi8o2f.js";import"./ButtonIcon-BJxB3R9Y.js";import"./Button-Dk1TuodQ.js";import"./Label-Ci2BW9le.js";import"./Hidden-f_G1o6Y7.js";import"./useLabel-DDDO_Y6W.js";import"./useLabels-ZAvHqBgR.js";import"./useButton-DqI1YsZH.js";import"./usePress-BAaUvFTM.js";import"./textSelection-B_r4mkkT.js";import"./index-m_RVXM54.js";import"./LinkButton-Dxn4whRU.js";import"./Button-Bsb_Sxli.js";import"./CardHeader-iOKi-vow.js";import"./Divider-Bkd74j0H.js";import"./CardActions-B2K1EsIb.js";import"./BottomLink-D4Rg_W2j.js";import"./ArrowForward-CamZmv32.js";import"./Box-BmCEZaGT.js";import"./styled-ri-sX4kt.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
