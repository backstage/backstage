import{j as t}from"./iframe-CmjKepAK.js";import{H as i}from"./Header-BG6P5axJ.js";import{P as a}from"./Page-BBFIETke.js";import{H as r}from"./HeaderLabel-DV3dnEMq.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C9IBnVv3.js";import"./makeStyles-rFkGMQln.js";import"./Box-C55POBiq.js";import"./styled-DL3tZMBP.js";import"./Grid-BnHJoKKz.js";import"./Breadcrumbs-BPBgWkET.js";import"./index-B9sM2jn7.js";import"./Popover-BuXPx6d1.js";import"./Modal-BI6ifavC.js";import"./Portal-BqvT6j51.js";import"./List-IEhbKV8f.js";import"./ListContext-2rvRcxSY.js";import"./ListItem-Bnkh6FOH.js";import"./Link-BGP-9ag5.js";import"./index-eKWyzuf6.js";import"./lodash-DX7XxPLm.js";import"./index-B0ldSqfO.js";import"./useAnalytics-C2hMq441.js";import"./useApp-CYm6BWpS.js";import"./Page-Bii0LALH.js";import"./useMediaQuery-CGdIteyf.js";import"./Tooltip-DYOv2ULC.js";import"./Popper-CMPq-ztF.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
