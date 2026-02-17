import{j as t}from"./iframe-DcD9AGXg.js";import{H as i}from"./Header-LXxx-lcp.js";import{P as a}from"./Page-BX4UyM_I.js";import{H as r}from"./HeaderLabel-BIOUXLWI.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CnmHRKO9.js";import"./makeStyles-aq0vcWH5.js";import"./Box-CD9U0JkS.js";import"./styled-Dv4Z9rlI.js";import"./Grid-Cw-xaTkg.js";import"./Breadcrumbs-W5_pOIO1.js";import"./index-B9sM2jn7.js";import"./Popover-CXmA6qz_.js";import"./Modal-DTbiCsDk.js";import"./Portal-B5t-TUu9.js";import"./List-CLA1LZPX.js";import"./ListContext-Bdpr0ztu.js";import"./ListItem-wfNPMux6.js";import"./Link-gUNM1rpZ.js";import"./index-V-0l0hfC.js";import"./lodash-B15ups4d.js";import"./index-DPPn6txq.js";import"./useAnalytics-CfHyGFqG.js";import"./useApp-BGsurTzd.js";import"./Page-BtZMZNWr.js";import"./useMediaQuery-CcaqtSEC.js";import"./Tooltip-CK-bju_x.js";import"./Popper-DI0xczFA.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
