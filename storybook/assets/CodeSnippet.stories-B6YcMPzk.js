import{bQ as e}from"./iframe-J3scbCK7.js";import{C as t}from"./CodeSnippet-D548JLic.js";import{I as o}from"./InfoCard-YftiJ1mA.js";import"./preload-helper-PPVm8Dsz.js";import"./index-0GTWXkVd.js";import"./CardContent-D26zFl6I.js";import"./ErrorBoundary-CTG_60Bn.js";import"./ErrorPanel-Btsx6J0H.js";import"./WarningPanel-BbywA0GE.js";import"./ExpandMore-eh3mRtPp.js";import"./AccordionDetails-COl426Gb.js";import"./index-B9sM2jn7.js";import"./Collapse-Bf-5GB7B.js";import"./MarkdownContent-CziNpqFO.js";import"./makeStyles-D29HlZax.js";import"./Link-B5rKxH23.js";import"./lodash-CTYyc8_x.js";import"./useAnalytics-B_NPlYH5.js";import"./useApp-BFoiUE5i.js";import"./Grid-BOYW9g7Y.js";import"./List-CuJDX_kH.js";import"./ListContext-BFUyXz-d.js";import"./ListItem-B5Wpm8B5.js";import"./ListItemText-DKunB6f2.js";import"./CopyTextButton-uT95cKbu.js";import"./useCopyToClipboard-C1B8_neO.js";import"./useMountedState-B356xsyg.js";import"./Tooltip-gmbmHZ4e.js";import"./useObjectRef-CYiyNzgW.js";import"./useOverlayTriggerState-Djk9kxal.js";import"./utils-CXCc_oGJ.js";import"./useFocusRing-lNGJkQ5U.js";import"./openLink-BYbBBzFI.js";import"./number-B1XZmGQH.js";import"./I18nProvider-BmKrAj2D.js";import"./useControlledState-DShAbZI7.js";import"./animation-CIWnDDLd.js";import"./useHover-CwRlhx06.js";import"./ButtonIcon-DjGciNd5.js";import"./Button-BRjZSFG-.js";import"./Label-CZdg3p-k.js";import"./Hidden-RMOzfft_.js";import"./useLabel-CdAWakw3.js";import"./useLabels-tuukLlho.js";import"./useButton-Dz9TOBMM.js";import"./usePress-oQ0Te5kE.js";import"./textSelection-QyuURRcd.js";import"./index-dtgEZu1w.js";import"./LinkButton-C65dtc8i.js";import"./Button-KHQxhUrL.js";import"./CardHeader-Crv1z9LH.js";import"./Divider-BltfAChQ.js";import"./CardActions-ylqHp-6O.js";import"./BottomLink-C_ySTxcD.js";import"./ArrowForward-Rx6GKEfc.js";import"./Box-CAvHx8RQ.js";import"./styled-VY2eV-L4.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
