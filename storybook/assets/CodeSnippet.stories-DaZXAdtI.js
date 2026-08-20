import{bR as e}from"./iframe-BHoENCVc.js";import{C as t}from"./CodeSnippet-I1VgKYUJ.js";import{I as o}from"./InfoCard-4GJ2rLQ-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CwRuBl_7.js";import"./CardContent-BG8D4H5g.js";import"./ErrorBoundary-CZ9UvTlG.js";import"./ErrorPanel-5JzCMKOf.js";import"./WarningPanel-HXs-l0ct.js";import"./ExpandMore-BtXr0D_Z.js";import"./AccordionDetails-CpV5MvGv.js";import"./index-B9sM2jn7.js";import"./Collapse-DdtUoHqJ.js";import"./MarkdownContent-DFt8VKNH.js";import"./makeStyles-DPkHg9n9.js";import"./Link-DbaMgic8.js";import"./lodash-C1BWqHDU.js";import"./useAnalytics-Cx5c0pM3.js";import"./useApp-D78Q1Dx1.js";import"./Grid-DQ6GJWoC.js";import"./List-BP5zaq_8.js";import"./ListContext-vBgF8v9C.js";import"./ListItem-CyAObhT7.js";import"./ListItemText-BRYjbmrS.js";import"./CopyTextButton-D1NyuzKS.js";import"./useCopyToClipboard-C1eKfL6f.js";import"./useMountedState-CS6T7kHD.js";import"./Tooltip-DzM1tQjG.js";import"./useObjectRef-uSeYP5xn.js";import"./useOverlayTriggerState-Cx2c-3-p.js";import"./utils-CL0Z8V1C.js";import"./useFocusRing-MHb5XFUp.js";import"./openLink-DZP0UHC7.js";import"./number-CnfK_WTv.js";import"./I18nProvider-BHwrJH4v.js";import"./useControlledState--Wz_vfvx.js";import"./animation-D48GeWFv.js";import"./useHover-CPCQZiGU.js";import"./ButtonIcon-Dbucn7ko.js";import"./Button-BHRDpgL_.js";import"./Label-DlD4XAby.js";import"./Hidden-C6_e4Tzz.js";import"./useLabel-DLz-9M9H.js";import"./useLabels-Dx4Y77vh.js";import"./useButton-DPa3LWsd.js";import"./usePress-D96lUmWf.js";import"./textSelection-Di8U28Mz.js";import"./index-CXAyTdUW.js";import"./LinkButton-DbZ3yiga.js";import"./Button-DlQIhBPg.js";import"./CardHeader-BuxDojjA.js";import"./Divider-Sa-frcMZ.js";import"./CardActions-eTyPNZ5n.js";import"./BottomLink-B8uSz2fg.js";import"./ArrowForward-BL5GARkK.js";import"./Box-69iekKeq.js";import"./styled-DRPdZI7s.js";const xe={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
