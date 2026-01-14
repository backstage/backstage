import{j as t}from"./iframe-OUC1hy1H.js";import{H as i}from"./Header-Dohlu_RC.js";import{P as a}from"./Page-CHxZus2N.js";import{H as r}from"./HeaderLabel-fjJAH0Le.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C-rlQ4_a.js";import"./Box-BmoTrTFH.js";import"./styled-A6cHt6de.js";import"./Grid-DL-Pv4jh.js";import"./Breadcrumbs-ClWa2imr.js";import"./index-B9sM2jn7.js";import"./Popover-BGS5mFaN.js";import"./Modal-B-jUxT4P.js";import"./Portal-DWQSZWuh.js";import"./List--3INAzqF.js";import"./ListContext-DyoBs2U6.js";import"./ListItem-CyBq-NVx.js";import"./Link-CyOWt6Zg.js";import"./lodash-DLuUt6m8.js";import"./index-_R9_qqkB.js";import"./useAnalytics-XQGKPciY.js";import"./useApp-DyctZIWE.js";import"./Page-C46vA8aS.js";import"./useMediaQuery-iiV-a3fI.js";import"./Tooltip-BQGIC7Cn.js";import"./Popper-vVGWEO2q.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { type } = args;

  return (
    <Page themeId={type}>
      <Header type="home" title="This is a title" subtitle="This is a subtitle">
        {labels}
      </Header>
    </Page>
  );
};
`,...e.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(args: {
  type: string;
  title: string;
  subtitle: string;
}) => {
  const {
    type
  } = args;
  return <Page themeId={type}>
      <Header {...args}>{labels}</Header>
    </Page>;
}`,...e.parameters?.docs?.source}}};const R=["Default"];export{e as Default,R as __namedExportsOrder,N as default};
