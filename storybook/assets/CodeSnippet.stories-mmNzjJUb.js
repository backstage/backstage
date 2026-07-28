import{bR as e}from"./iframe-X5mwL4tp.js";import{C as t}from"./CodeSnippet-BxsH0MRn.js";import{I as o}from"./InfoCard-BcLQnTkt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C5TKpozf.js";import"./CardContent-BQNkwvQV.js";import"./ErrorBoundary-DrjPIOR9.js";import"./ErrorPanel-Bsb7ePRe.js";import"./WarningPanel-BeyNgmg1.js";import"./ExpandMore-CjRmFKjy.js";import"./AccordionDetails-CnHNXwLn.js";import"./index-B9sM2jn7.js";import"./Collapse-D_dmr9DU.js";import"./MarkdownContent-DZx4bAGD.js";import"./makeStyles-CTt1csqa.js";import"./Link-Bmr8Hz-w.js";import"./lodash-DbDoiTXZ.js";import"./useAnalytics-M9bf2v34.js";import"./useApp-B4BHpcqM.js";import"./Grid-DtctBXEt.js";import"./List-BY4TlFRU.js";import"./ListContext-DWMy4CLq.js";import"./ListItem-DM3el4vg.js";import"./ListItemText-BVJrYxBd.js";import"./CopyTextButton-BfLMDgTR.js";import"./useCopyToClipboard-CCH7TXN4.js";import"./useMountedState-9MODhG_9.js";import"./Tooltip-Be8BRkWP.js";import"./useObjectRef-B4ikIkxr.js";import"./useOverlayTriggerState-DadPaReJ.js";import"./utils-DbglA0qc.js";import"./useFocusRing-C-qV4ltP.js";import"./openLink-iaf6h5Vg.js";import"./number-BgaIE-sV.js";import"./I18nProvider-Cp8YwWQe.js";import"./useControlledState-VUJiIP94.js";import"./animation-DwrFgyaB.js";import"./useHover-iQz_in6H.js";import"./ButtonIcon-B5N6B-GF.js";import"./Button-Mr7_7LVv.js";import"./Label-Du0ObhKE.js";import"./Hidden-DXcGagMc.js";import"./useLabel-DttWp7u_.js";import"./useLabels-CyId-J7Z.js";import"./useButton-b3MTXzJF.js";import"./usePress-C87_1f3H.js";import"./textSelection-DtJZPEXI.js";import"./index-BaDW95zO.js";import"./LinkButton-7Lx0JL9Z.js";import"./Button-BUMewLQr.js";import"./CardHeader-RtCqdlDI.js";import"./Divider-Di2k_0vY.js";import"./CardActions-B_AeyfeP.js";import"./BottomLink-Cgs9rHqO.js";import"./ArrowForward-mPWBgHxw.js";import"./Box-ClEyY_Z1.js";import"./styled-DVG5Lz2h.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
