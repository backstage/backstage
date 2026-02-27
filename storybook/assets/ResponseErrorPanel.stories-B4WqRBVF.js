import{j as t}from"./iframe-D342WmTn.js";import{R as s}from"./ResponseErrorPanel-BlylkLzC.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-Dl2xR7o6.js";import"./ErrorPanel-BejzLp58.js";import"./WarningPanel-BucODKgY.js";import"./ExpandMore-BFgvzGeJ.js";import"./AccordionDetails-Dhf4dUjN.js";import"./index-B9sM2jn7.js";import"./Collapse-DbFKF3cZ.js";import"./MarkdownContent-BHItj7X2.js";import"./CodeSnippet-BX42FQI9.js";import"./Box-SEVcZsv4.js";import"./styled-SYFPJtfS.js";import"./CopyTextButton-Coyv0YUS.js";import"./useCopyToClipboard-CAP2hEgw.js";import"./useMountedState-BNluGJjz.js";import"./Tooltip-BHw6Amth.js";import"./Popper-DdIQvNsr.js";import"./Portal-D4InWYUl.js";import"./Grid-DonucUYR.js";import"./List-C_CbbNXo.js";import"./ListContext-hf1vC8cB.js";import"./ListItem-BrpO8RHr.js";import"./ListItemText-CJBKST13.js";import"./Divider-dvh6pOOF.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...e.parameters?.docs?.source}}};const N=["Default","WithTitle"];export{r as Default,e as WithTitle,N as __namedExportsOrder,I as default};
