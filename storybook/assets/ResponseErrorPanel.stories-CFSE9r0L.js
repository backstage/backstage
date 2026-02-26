import{j as t}from"./iframe-r9k78NKI.js";import{R as s}from"./ResponseErrorPanel-DojgKDWp.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-CipF_TRV.js";import"./ErrorPanel-BoltPlz9.js";import"./WarningPanel-CP3Uvm3P.js";import"./ExpandMore-B3MsvMOX.js";import"./AccordionDetails-Dq0J3I9r.js";import"./index-B9sM2jn7.js";import"./Collapse-EhUXEIAK.js";import"./MarkdownContent-BdHL4Rvi.js";import"./CodeSnippet-BnayZY1N.js";import"./Box-CPjilEka.js";import"./styled-Cg4IVtII.js";import"./CopyTextButton-0h5jNQNi.js";import"./useCopyToClipboard-DfNipbZK.js";import"./useMountedState-CrP_-pBR.js";import"./Tooltip-B1Vym-uO.js";import"./Popper-oo_sRFxI.js";import"./Portal-CW8an0o0.js";import"./Grid-Bz9nGms7.js";import"./List-BDEgjW0i.js";import"./ListContext-BzmVZQwf.js";import"./ListItem-DD0_kxo4.js";import"./ListItemText-B4TkGekz.js";import"./Divider-IUkKH4dH.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
