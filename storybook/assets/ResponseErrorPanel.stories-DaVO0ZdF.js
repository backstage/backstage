import{j as t}from"./iframe-CAn0lpb7.js";import{R as s}from"./ResponseErrorPanel-CUIVIBem.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DYHcJhPK.js";import"./ErrorPanel-dJStxzKK.js";import"./WarningPanel-Cj6whWD2.js";import"./ExpandMore-xICNXpG1.js";import"./AccordionDetails-_HyDmEav.js";import"./index-B9sM2jn7.js";import"./Collapse-CGSHL87p.js";import"./MarkdownContent-BL82eX4x.js";import"./CodeSnippet-g0Bf0_yA.js";import"./Box-Bjf2DMwk.js";import"./styled-D2e0uBXe.js";import"./CopyTextButton-QWCPLp9Y.js";import"./useCopyToClipboard-C1STrRey.js";import"./useMountedState-CX5z9T7u.js";import"./Tooltip-ofHGhymy.js";import"./Popper-CTfH6WVF.js";import"./Portal-BzlmyQcI.js";import"./Grid-YTZOmRBF.js";import"./List-D_KByg89.js";import"./ListContext-CK2zO4S5.js";import"./ListItem-ri7MtAQ3.js";import"./ListItemText-CSTbdY-P.js";import"./Divider-BIPsYmmT.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
