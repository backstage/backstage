import{j as t}from"./iframe-DC0HuKGF.js";import{R as s}from"./ResponseErrorPanel-CZDFGPZ4.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-CdFTekTr.js";import"./ErrorPanel-Tebf8nic.js";import"./WarningPanel-DgHvJcKU.js";import"./ExpandMore-BviA-7xr.js";import"./AccordionDetails-eCguWzjA.js";import"./index-B9sM2jn7.js";import"./Collapse-BID6kfZ_.js";import"./MarkdownContent-CQ1-5gKP.js";import"./CodeSnippet-BdWgOjZc.js";import"./Box-CHRqFhJe.js";import"./styled-B4TWoPqU.js";import"./CopyTextButton-BUqVBoGZ.js";import"./useCopyToClipboard-BDEmanwU.js";import"./useMountedState-DsJQXF1h.js";import"./Tooltip-CTOYHy8_.js";import"./Popper-3kZsTegL.js";import"./Portal-BQrNoYBv.js";import"./Grid-B4PBabAQ.js";import"./List-CssDjDLP.js";import"./ListContext-P3rTeiNo.js";import"./ListItem-ppf-hIBK.js";import"./ListItemText-BEMMREzR.js";import"./Divider-DNA6aJNh.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
