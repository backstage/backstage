import{j as t}from"./iframe-3r6KqT77.js";import{R as s}from"./ResponseErrorPanel-Bs8ZkMCw.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DdJxAtYT.js";import"./ErrorPanel-BVejMlYf.js";import"./WarningPanel-BSNARVQ9.js";import"./ExpandMore-3pu57d68.js";import"./AccordionDetails-C8AqI3GH.js";import"./index-B9sM2jn7.js";import"./Collapse-hTrcMAiL.js";import"./MarkdownContent-BGi0QGK9.js";import"./CodeSnippet-DFGIuDUP.js";import"./Box-COPBbbCD.js";import"./styled-DMrvUlKV.js";import"./CopyTextButton-DI6hq-av.js";import"./useCopyToClipboard-P1LGVeth.js";import"./useMountedState-CY6UmiTA.js";import"./Tooltip-CG5wnqUK.js";import"./Popper-BlVfoq_o.js";import"./Portal-bXQToQAq.js";import"./Grid-BkUQ72Tl.js";import"./List-Q1xNDAi1.js";import"./ListContext-Bcxw2JhO.js";import"./ListItem-CAuAnmh9.js";import"./ListItemText-DfNXt3l7.js";import"./Divider-7uj2S2j8.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
