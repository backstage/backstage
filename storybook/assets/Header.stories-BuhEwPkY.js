import{j as t}from"./iframe-DfpqVrvR.js";import{H as i}from"./Header-CpuVAI92.js";import{P as a}from"./Page-UeSA7vAk.js";import{H as r}from"./HeaderLabel-CPAk_3o_.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-22RfDR1c.js";import"./makeStyles-D6lZMQOZ.js";import"./Box-CBRqSsQo.js";import"./styled-Di8tq9jL.js";import"./Grid-DytBiILQ.js";import"./Breadcrumbs-DPMocrDf.js";import"./index-B9sM2jn7.js";import"./Popover-C_jE5Tn-.js";import"./Modal-BWu1sU36.js";import"./Portal-DJgbgmP8.js";import"./List-BZpx7np8.js";import"./ListContext-rrXMk-NT.js";import"./ListItem-vYcWevWl.js";import"./Link-Ce-VQ3yZ.js";import"./index-DAuYgPgr.js";import"./lodash-DSlsmB_-.js";import"./index-Rl36dthR.js";import"./useAnalytics-BzwuJCU6.js";import"./useApp-CcVlq-lF.js";import"./Page-Dvm4JFjN.js";import"./useMediaQuery-DJAnUDWF.js";import"./Tooltip-CSZ3KiFw.js";import"./Popper-BR9KmGwy.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...e.parameters?.docs?.source}}};const k=["Default"];export{e as Default,k as __namedExportsOrder,S as default};
