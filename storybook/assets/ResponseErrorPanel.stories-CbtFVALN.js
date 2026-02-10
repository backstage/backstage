import{j as t}from"./iframe-gtROSIwU.js";import{R as s}from"./ResponseErrorPanel-B82p5L_Y.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-DBlUZWIE.js";import"./WarningPanel-xN1aOkvL.js";import"./ExpandMore-Dy0QGkdX.js";import"./AccordionDetails-D-QssX3g.js";import"./index-B9sM2jn7.js";import"./Collapse-CUtCvRoB.js";import"./MarkdownContent-Dlgl5pdq.js";import"./CodeSnippet-BGAs7RWs.js";import"./Box-DVyEyde4.js";import"./styled-Bs_QlAid.js";import"./CopyTextButton-Ctc6sP1v.js";import"./useCopyToClipboard-BlctA6j9.js";import"./useMountedState-D4qBcejv.js";import"./Tooltip-C-NpfkzH.js";import"./Popper-DSlAm5T6.js";import"./Portal-DfJk_0nC.js";import"./Grid-Dk9zonhM.js";import"./List-4z_Kf1-d.js";import"./ListContext-DPykjs2z.js";import"./ListItem-CchOfbIa.js";import"./ListItemText-DPWCpjxc.js";import"./Divider-B608YcMs.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
