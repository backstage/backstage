import{j as t}from"./iframe-Bakz1Oty.js";import{R as s}from"./ResponseErrorPanel-CRbtBJXw.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-3_kuKRiN.js";import"./ErrorPanel-DYcTCw8V.js";import"./WarningPanel-D5WhcjPu.js";import"./ExpandMore-Br5OM40x.js";import"./AccordionDetails-C_Yniy8T.js";import"./index-B9sM2jn7.js";import"./Collapse-CPJ3YqpA.js";import"./MarkdownContent-CHVNvlVN.js";import"./CodeSnippet-C_df_a4F.js";import"./Box-BnRbKBR1.js";import"./styled-CVPCEBvL.js";import"./CopyTextButton-BHRhg4cl.js";import"./useCopyToClipboard-D5bdUPjr.js";import"./useMountedState-B1G3Agp-.js";import"./Tooltip-G4tQ9l7u.js";import"./Popper-BPZuuPZ9.js";import"./Portal-CHaHYX6z.js";import"./Grid-ORZV85AM.js";import"./List-B_gy8x3o.js";import"./ListContext-C1Qr8NkX.js";import"./ListItem-CDsyXI4L.js";import"./ListItemText-G1PMliPa.js";import"./Divider-7y2QWIg8.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
