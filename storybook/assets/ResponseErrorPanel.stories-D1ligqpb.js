import{j as t}from"./iframe-DcAecAau.js";import{R as s}from"./ResponseErrorPanel-Dyfik0_b.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-Cdr7b8Bk.js";import"./ErrorPanel-DqTa6nhJ.js";import"./WarningPanel-D-CK0fsi.js";import"./ExpandMore-Bv6wh0Jn.js";import"./AccordionDetails-CFArFB8R.js";import"./index-B9sM2jn7.js";import"./Collapse-LuntTC0U.js";import"./MarkdownContent-Bi-O3WwF.js";import"./CodeSnippet-DugLxyH3.js";import"./Box-DFVASWD2.js";import"./styled-24VWDP1y.js";import"./CopyTextButton-BZgvs1hH.js";import"./useCopyToClipboard-B681kdeU.js";import"./useMountedState-CQNruCwR.js";import"./Tooltip--unGCy0g.js";import"./Popper-CfVmlnqD.js";import"./Portal-DUiXLT2Z.js";import"./Grid-DVeyPTP6.js";import"./List-DwRDgM_u.js";import"./ListContext-D1z8ROX7.js";import"./ListItem-Dm4rReYJ.js";import"./ListItemText-ByqOJbY1.js";import"./Divider-DBnD1KTp.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
