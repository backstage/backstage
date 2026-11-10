import{j as e}from"./iframe-DxBRWUiK.js";import{C as t}from"./CodeSnippet-DS2Zycb8.js";import{I as o}from"./InfoCard-BDsZ0afE.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CvQne7Xm.js";import"./CardContent-DwImCrtL.js";import"./ErrorBoundary-CodWkyfb.js";import"./ErrorPanel-BCoE3qS2.js";import"./WarningPanel-DpCW17mV.js";import"./ExpandMore-BSXXttTp.js";import"./AccordionDetails-BwoejbO6.js";import"./index-B9sM2jn7.js";import"./Collapse-DD9CXN_Q.js";import"./MarkdownContent-BUd6GQ0P.js";import"./makeStyles-CpnAmrz_.js";import"./Link-DCSer0-z.js";import"./lodash-DkCje28P.js";import"./useAnalytics-DhjjGYXj.js";import"./useApp-nhNhp-L5.js";import"./Grid-Dnrsaaez.js";import"./List-M_b7JZxV.js";import"./ListContext-BOD_g-hg.js";import"./ListItem-CJmzm5qP.js";import"./ListItemText-Cm2hGlUF.js";import"./CopyTextButton-i96hU3rB.js";import"./useCopyToClipboard-DFIAMGy4.js";import"./useMountedState-DRsk22-r.js";import"./Tooltip-DBNAjYz5.js";import"./useObjectRef-VkTcKCoy.js";import"./useOverlayTriggerState-2jFvCPDw.js";import"./utils-Cv-9sHfj.js";import"./useFocusRing-BqPZGEXT.js";import"./openLink-a1B1hwMM.js";import"./number-CGe6QRer.js";import"./I18nProvider-C0Z_fwek.js";import"./useControlledState-bDAdDYhT.js";import"./animation-LN_WEzBA.js";import"./useHover-Cr5thQm_.js";import"./ButtonIcon-C-uXe0cp.js";import"./Button-Dc1PTGgx.js";import"./Label-DB2E6Ibv.js";import"./Hidden-BdHYJNpU.js";import"./useLabel-DFfcinVE.js";import"./useLabels-DXt0FSFN.js";import"./useButton-CoWwmPj-.js";import"./usePress-CsaJDvcb.js";import"./textSelection-BAaw7jcY.js";import"./getMetaValue-CUMJm42D.js";import"./index-DdTIbfdH.js";import"./LinkButton-BZketv_2.js";import"./Button-DCxJRPC3.js";import"./CardHeader-DeVG1ZGE.js";import"./Divider-XExc0LBW.js";import"./CardActions-CMORv8uK.js";import"./BottomLink-qV5gjiUS.js";import"./ArrowForward-Cdu3r-U5.js";import"./Box-ZChtCTCt.js";import"./styled-DbZYE8_6.js";const Se={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},l={width:300},r=`const greeting = "Hello";
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
