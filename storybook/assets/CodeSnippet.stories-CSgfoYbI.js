import{j as e}from"./iframe-VdnJkTLn.js";import{C as t}from"./CodeSnippet-CdaUErN3.js";import{I as o}from"./InfoCard-KVSNgXC6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CCaKtv_x.js";import"./CardContent-C-roUUAw.js";import"./ErrorBoundary-C0fIWmjd.js";import"./ErrorPanel-PkIjvDcW.js";import"./WarningPanel-CYEGIdhF.js";import"./ExpandMore-mkAIJqTP.js";import"./AccordionDetails-nh60_z0O.js";import"./index-B9sM2jn7.js";import"./Collapse-Ds_KmWd3.js";import"./MarkdownContent-yaK8_iES.js";import"./makeStyles-Cp7Yf1JD.js";import"./Link-MVqLQhLF.js";import"./lodash-DattC6St.js";import"./useAnalytics-olN0zlPD.js";import"./useApp-C1mvMRCJ.js";import"./Grid-DMas_M46.js";import"./List-CiPqBeP2.js";import"./ListContext-C7-lmNu8.js";import"./ListItem-CB_5m-On.js";import"./ListItemText-Dtaqq766.js";import"./CopyTextButton-D_wMe0Fa.js";import"./useCopyToClipboard-BizPGJgH.js";import"./useMountedState-Lohgsq4f.js";import"./Tooltip-B0XS0Rob.js";import"./useObjectRef-DROp5jky.js";import"./useOverlayTriggerState-DSnKjkPC.js";import"./utils-e0WViHPf.js";import"./useFocusRing-Co2F4F7Z.js";import"./openLink-CXHSNm_V.js";import"./number-LCWSkLep.js";import"./I18nProvider-DuHW1abH.js";import"./useControlledState-BaeUY-xI.js";import"./animation-5xKztEYB.js";import"./useHover-g0RbdZFi.js";import"./ButtonIcon-Bxuh7WRh.js";import"./Button-FF_83t8w.js";import"./Label-DrU_Nnv8.js";import"./Hidden-CrjggcFY.js";import"./useLabel-Bo0JsgFk.js";import"./useLabels-BVBXvlsz.js";import"./useButton-DimFA1zM.js";import"./usePress-CP53JbFw.js";import"./textSelection-KD-GHk6k.js";import"./getMetaValue-Bnreontc.js";import"./index-CJ6_QBDM.js";import"./LinkButton-DI12g0j0.js";import"./Button-CIbPWJSS.js";import"./CardHeader-Bi8MsWFz.js";import"./Divider-CLedju32.js";import"./CardActions-BLWoCr5F.js";import"./BottomLink-2pD45XfJ.js";import"./ArrowForward-k-kTGAdx.js";import"./Box-C8SNIygF.js";import"./styled-BeOa9MJM.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
