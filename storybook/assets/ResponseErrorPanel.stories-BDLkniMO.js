import{j as t}from"./iframe-Zkjja1CZ.js";import{R as s}from"./ResponseErrorPanel-pBMdn2Vn.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-Dy9T_vRY.js";import"./ErrorPanel-DXPEEABK.js";import"./WarningPanel-SonS1I9E.js";import"./ExpandMore-DJWeiOFB.js";import"./AccordionDetails-COvZRTzy.js";import"./index-B9sM2jn7.js";import"./Collapse-By5xx0Hx.js";import"./MarkdownContent-B3IgYOVG.js";import"./CodeSnippet-DPrivACZ.js";import"./Box-BMvVsAhI.js";import"./styled-BgXxje-f.js";import"./CopyTextButton-D6itQlND.js";import"./useCopyToClipboard-DGD3nvhE.js";import"./useMountedState-D9kI3ita.js";import"./Tooltip-9gNW0pGl.js";import"./Popper-HBCr7d9w.js";import"./Portal-BlfvlNo0.js";import"./Grid-CmkVhak9.js";import"./List-CDBWKecp.js";import"./ListContext-R-tftgRd.js";import"./ListItem-WvMtEKfL.js";import"./ListItemText-CBfYDWFP.js";import"./Divider-CQnbFZ8k.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
