import{j as e,c as o}from"./iframe-DvAQ9TL9.js";import{W as n}from"./WarningPanel-Bxcykx1i.js";import{L as i}from"./Link-Dtd7Q6IF.js";import{B as p}from"./Button-CSzRzmAr.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DvoBn6N_.js";import"./makeStyles-DIoIr_Gz.js";import"./AccordionDetails-DY-ZFezw.js";import"./index-B9sM2jn7.js";import"./Collapse-B8ccB9dL.js";import"./MarkdownContent-FsJ6V0Ex.js";import"./CodeSnippet-Cw8HO4Ms.js";import"./Box-DF8-c6JA.js";import"./styled-CoguSFmS.js";import"./CopyTextButton-BY3AYvWV.js";import"./useCopyToClipboard-CJ3bK8Wv.js";import"./useMountedState-CA4Rdt3V.js";import"./Tooltip-Do0H6o91.js";import"./Popper-DAdC7LWr.js";import"./Portal-CZWMCv81.js";import"./Grid-R-6Q3RAr.js";import"./index-D2kk_IGh.js";import"./lodash-BuTd1Mhz.js";import"./index-Bpd4QHCD.js";import"./useAnalytics-Dn-hivLl.js";import"./useApp-Ce7sGxgT.js";const B={title:"Feedback/Warning Panel",component:n,tags:["!manifest"]},s=()=>e.jsx(n,{title:"Entity missing annotation",message:e.jsxs(e.Fragment,{children:["This example entity is missing an annotation. If this is unexpected, please make sure you have set up everything correctly by following"," ",e.jsx(i,{to:"http://example.com",children:"this guide"}),"."]})}),t=()=>e.jsxs(n,{title:"Could not contact backend system",children:[e.jsxs(o,{children:["Supports custom children - for example these text elements. This can be used to hide/expose stack traces for warnings, like this example:",e.jsx("br",{}),"SyntaxError: Error transforming /home/user/github/backstage/packages/core-components/src/components/WarningPanel/WarningPanel.stories.tsx: Unexpected token (42:16) at unexpected (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/util.js:83:15) at tsParseMaybeAssignWithJSX (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1399:22) at tsParseMaybeAssign (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1373:12) at parseMaybeAssign (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:118:43) at parseExprListItem (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:969:5)"]}),e.jsx(p,{variant:"contained",children:"Learn More"})]}),a=()=>e.jsx(n,{title:"Could not contact backend system",message:"The backend system failed to respond. It is possible the service is down; please try again in a few minutes.",children:"HTTP 500 Bad Gateway response from https://usefulservice.mycompany.com/api/entity?44433"}),r=()=>e.jsx(n,{title:"Could not load data."});s.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"Children"};a.__docgenInfo={description:"",methods:[],displayName:"FullExample"};r.__docgenInfo={description:"",methods:[],displayName:"TitleOnly"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => (
  <WarningPanel
    title="Entity missing annotation"
    message={
      <>
        This example entity is missing an annotation. If this is unexpected,
        please make sure you have set up everything correctly by following{" "}
        <Link to="http://example.com">this guide</Link>.
      </>
    }
  />
);
`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Children = () => (
  <WarningPanel title="Could not contact backend system">
    <Typography>
      Supports custom children - for example these text elements. This can be
      used to hide/expose stack traces for warnings, like this example:
      <br />
      SyntaxError: Error transforming
      /home/user/github/backstage/packages/core-components/src/components/WarningPanel/WarningPanel.stories.tsx:
      Unexpected token (42:16) at unexpected
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/util.js:83:15)
      at tsParseMaybeAssignWithJSX
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1399:22)
      at tsParseMaybeAssign
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1373:12)
      at parseMaybeAssign
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:118:43)
      at parseExprListItem
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:969:5)
    </Typography>
    <Button variant="contained">Learn More</Button>
  </WarningPanel>
);
`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const FullExample = () => (
  <WarningPanel
    title="Could not contact backend system"
    message="The backend system failed to respond. It is possible the service is down; please try again in a few minutes."
  >
    HTTP 500 Bad Gateway response from
    https://usefulservice.mycompany.com/api/entity?44433
  </WarningPanel>
);
`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const TitleOnly = () => <WarningPanel title="Could not load data." />;
`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <WarningPanel title="Entity missing annotation" message={<>
        This example entity is missing an annotation. If this is unexpected,
        please make sure you have set up everything correctly by following{' '}
        <Link to="http://example.com">this guide</Link>.
      </>} />`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => <WarningPanel title="Could not contact backend system">
    <Typography>
      Supports custom children - for example these text elements. This can be
      used to hide/expose stack traces for warnings, like this example:
      <br />
      SyntaxError: Error transforming
      /home/user/github/backstage/packages/core-components/src/components/WarningPanel/WarningPanel.stories.tsx:
      Unexpected token (42:16) at unexpected
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/util.js:83:15)
      at tsParseMaybeAssignWithJSX
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1399:22)
      at tsParseMaybeAssign
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/plugins/typescript.js:1373:12)
      at parseMaybeAssign
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:118:43)
      at parseExprListItem
      (/home/user/github/backstage/node_modules/sucrase/dist/parser/traverser/expression.js:969:5)
    </Typography>
    <Button variant="contained">Learn More</Button>
  </WarningPanel>`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <WarningPanel title="Could not contact backend system" message="The backend system failed to respond. It is possible the service is down; please try again in a few minutes.">
    HTTP 500 Bad Gateway response from
    https://usefulservice.mycompany.com/api/entity?44433
  </WarningPanel>`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:'() => <WarningPanel title="Could not load data." />',...r.parameters?.docs?.source}}};const F=["Default","Children","FullExample","TitleOnly"];export{t as Children,s as Default,a as FullExample,r as TitleOnly,F as __namedExportsOrder,B as default};
