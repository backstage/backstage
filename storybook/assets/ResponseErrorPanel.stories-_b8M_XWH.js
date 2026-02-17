import{j as t}from"./iframe-CIst4AKw.js";import{R as s}from"./ResponseErrorPanel-nmRj4Hs7.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-CyiKs3qI.js";import"./ErrorPanel-CSLFCz79.js";import"./WarningPanel-DRyT3bmw.js";import"./ExpandMore-DDyKCygW.js";import"./AccordionDetails-BVXzfQoI.js";import"./index-B9sM2jn7.js";import"./Collapse-ClxFdAvN.js";import"./MarkdownContent-sxVUvLR7.js";import"./CodeSnippet-DrKLKQZ9.js";import"./Box-bOt6Vm_d.js";import"./styled-BTP3bkaJ.js";import"./CopyTextButton-BbIPK9qT.js";import"./useCopyToClipboard-D-RPhu7o.js";import"./useMountedState-DqqbXNe-.js";import"./Tooltip-BXoJmvrU.js";import"./Popper-B5gGl_yS.js";import"./Portal-CKExw2or.js";import"./Grid-DSn-A5sL.js";import"./List-xkDrwxCe.js";import"./ListContext-CV9XkK9z.js";import"./ListItem-DzW8sEcw.js";import"./ListItemText-D8ywHulE.js";import"./Divider-TqV_o75H.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
