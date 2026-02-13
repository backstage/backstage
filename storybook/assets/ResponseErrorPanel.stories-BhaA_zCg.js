import{j as t}from"./iframe--eVtoH1I.js";import{R as s}from"./ResponseErrorPanel-xJoRFMoI.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-qwoBpcZQ.js";import"./ErrorPanel-Cd-XmSSh.js";import"./WarningPanel-CMvz4y_g.js";import"./ExpandMore-Dj8ixIgf.js";import"./AccordionDetails-Dwi-Tbu2.js";import"./index-B9sM2jn7.js";import"./Collapse-DZhtlU8B.js";import"./MarkdownContent-CYgDtkzo.js";import"./CodeSnippet-C8435I_3.js";import"./Box-AxOQv2ZW.js";import"./styled-BNUMKqxB.js";import"./CopyTextButton-Bwnn4YZT.js";import"./useCopyToClipboard-CD7ySspH.js";import"./useMountedState-BJxTErpD.js";import"./Tooltip-Ckjn1o_Q.js";import"./Popper-C6VLYrWu.js";import"./Portal-Cqdnd4y_.js";import"./Grid-BxPVFZFG.js";import"./List-erwGNY81.js";import"./ListContext-Dy_vV088.js";import"./ListItem-BKyGWKlr.js";import"./ListItemText-Dvl5ZL1u.js";import"./Divider-CMMgfVe7.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
