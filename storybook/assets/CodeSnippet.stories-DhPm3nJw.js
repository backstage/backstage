import{j as e}from"./iframe-DXL2wfUr.js";import{C as t}from"./CodeSnippet-Bz9vYZqv.js";import{I as o}from"./InfoCard-LlH9Ipxe.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C-0D0ERV.js";import"./CardContent-Bee4ovwQ.js";import"./ErrorBoundary-Bc9ffA0E.js";import"./ErrorPanel-BkUTNdBe.js";import"./WarningPanel-CgFdixZY.js";import"./ExpandMore-BeL1yuy7.js";import"./AccordionDetails-VHP3o8bo.js";import"./index-B9sM2jn7.js";import"./Collapse-C1WK1tf6.js";import"./MarkdownContent-CLbP88ox.js";import"./makeStyles-dq_iUTd0.js";import"./Link-B77ip_ac.js";import"./lodash-Dl1dFqKb.js";import"./useAnalytics-BPKTxT6C.js";import"./useApp-B5hGsOxI.js";import"./Grid-BXM3QonJ.js";import"./List-CTh3iRsj.js";import"./ListContext-D7tGghNq.js";import"./ListItem-p8V-eNdP.js";import"./ListItemText-EBUOxn3r.js";import"./CopyTextButton-ClVimKvs.js";import"./useCopyToClipboard-DSSNv7Gj.js";import"./useMountedState-CQD-rq-n.js";import"./Tooltip-BJKgG_We.js";import"./useObjectRef-B4LXbu6C.js";import"./useOverlayTriggerState-CXXMw3IC.js";import"./utils-AUqHPGYf.js";import"./useFocusRing-Dz_6jVoa.js";import"./openLink-CjcP3ChZ.js";import"./number-BBGa0xxY.js";import"./I18nProvider-c1tBNH4d.js";import"./useControlledState-B45g810H.js";import"./animation-BTqVon43.js";import"./useHover-Ci84khs7.js";import"./ButtonIcon-QBhAzv3P.js";import"./Button-BhsXa_hO.js";import"./Label-CTSb-hLZ.js";import"./Hidden-MswoXlTM.js";import"./useLabel-Dw1khwQq.js";import"./useLabels-CUtKyTJZ.js";import"./useButton-n2_J4JRw.js";import"./usePress-DEPKiAoD.js";import"./textSelection-AY9oPxK_.js";import"./getMetaValue-BT-1afLR.js";import"./index-BXp_o7O6.js";import"./LinkButton-o-WrnDYy.js";import"./Button-CipxLtjI.js";import"./CardHeader-VyBNo6RQ.js";import"./Divider-pUsur1_V.js";import"./CardActions-DBp41qOE.js";import"./BottomLink-vHjlMITl.js";import"./ArrowForward-TsVeVMOJ.js";import"./Box-Brmk0yUT.js";import"./styled-CPtkZ7WM.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
