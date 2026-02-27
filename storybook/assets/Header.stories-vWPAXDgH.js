import{j as t}from"./iframe-D342WmTn.js";import{H as i}from"./Header-Cvi9eAgK.js";import{P as a}from"./Page-DQmx_Hbb.js";import{H as r}from"./HeaderLabel-8lbW1k52.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-njZgHQjy.js";import"./makeStyles-Dl2xR7o6.js";import"./Box-SEVcZsv4.js";import"./styled-SYFPJtfS.js";import"./Grid-DonucUYR.js";import"./Breadcrumbs-BNL1EdyZ.js";import"./index-B9sM2jn7.js";import"./Popover-CCq25qdM.js";import"./Modal-D62txzus.js";import"./Portal-D4InWYUl.js";import"./List-C_CbbNXo.js";import"./ListContext-hf1vC8cB.js";import"./ListItem-BrpO8RHr.js";import"./Link-Dm3Vi_sn.js";import"./index-CeFL6QDR.js";import"./lodash-C2-_WstS.js";import"./index-EeMuXrdv.js";import"./useAnalytics-BlpddQlR.js";import"./useApp-Da77ShEq.js";import"./Page-C_O5aP6c.js";import"./useMediaQuery-1S_0UWUH.js";import"./Tooltip-BHw6Amth.js";import"./Popper-DdIQvNsr.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
