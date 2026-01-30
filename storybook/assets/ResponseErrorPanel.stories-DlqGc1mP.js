import{j as t}from"./iframe-q37i5wh7.js";import{R as s}from"./ResponseErrorPanel-BRRLFP_t.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-F1yEZWbU.js";import"./WarningPanel-C_8iIf0P.js";import"./ExpandMore-Dh8PJJ4O.js";import"./AccordionDetails-SWAG835D.js";import"./index-B9sM2jn7.js";import"./Collapse-EBwNTQD_.js";import"./MarkdownContent-Cy41HZJg.js";import"./CodeSnippet-CLlJVEMw.js";import"./Box-COPOq1Uf.js";import"./styled-Cr1yRHHC.js";import"./CopyTextButton-D-U2fpdK.js";import"./useCopyToClipboard-DKocU9ZU.js";import"./useMountedState-rIY5swUn.js";import"./Tooltip-1ydGyrcT.js";import"./Popper-KbPRvRer.js";import"./Portal-Cg2yUny5.js";import"./Grid-C05v6eeb.js";import"./List-PIZxoj_p.js";import"./ListContext-CjbrLwST.js";import"./ListItem-CpM31wZi.js";import"./ListItemText-DrEGNqUi.js";import"./Divider-DMqMfewh.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
  <ResponseErrorPanel
    error={new Error("Error message from error object")}
    defaultExpanded={false}
  />
);
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const WithTitle = () => (
  <ResponseErrorPanel
    error={new Error("test")}
    defaultExpanded={false}
    title="Title prop is passed"
  />
);
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...e.parameters?.docs?.source}}};const I=["Default","WithTitle"];export{r as Default,e as WithTitle,I as __namedExportsOrder,F as default};
