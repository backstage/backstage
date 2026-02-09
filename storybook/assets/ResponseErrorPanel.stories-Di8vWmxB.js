import{j as t}from"./iframe-BNPQer77.js";import{R as s}from"./ResponseErrorPanel-C0BLPT9o.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-DtcOFy2G.js";import"./WarningPanel-BL8AsDrP.js";import"./ExpandMore-DnsJ2ZcH.js";import"./AccordionDetails-D3zUb3eJ.js";import"./index-B9sM2jn7.js";import"./Collapse-CiSJJETO.js";import"./MarkdownContent-BjXL71oS.js";import"./CodeSnippet-cVxXfk04.js";import"./Box-C3TqwX1t.js";import"./styled-T_nlQOJW.js";import"./CopyTextButton-CEvihpza.js";import"./useCopyToClipboard-w_54iq4h.js";import"./useMountedState-Zh225SSx.js";import"./Tooltip-ZVPmh-dx.js";import"./Popper-BItIL40F.js";import"./Portal-D6rxE-he.js";import"./Grid-Yv5UUmOJ.js";import"./List-Bj78s_pe.js";import"./ListContext-BZ4pbeSM.js";import"./ListItem-we3G7HGD.js";import"./ListItemText-BhKqNs_V.js";import"./Divider-B0I47vSC.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
