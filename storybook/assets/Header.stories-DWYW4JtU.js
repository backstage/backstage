import{j as t}from"./iframe-DxoM00WU.js";import{H as i}from"./Header-Bqsgn0-D.js";import{P as a}from"./Page-Dm7JWwTP.js";import{H as r}from"./HeaderLabel-BqiAsVxk.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-3t4EBfp6.js";import"./makeStyles-DpSWpYQd.js";import"./Box-BuH3verr.js";import"./styled-4EHbyUJg.js";import"./Grid-CMfdjtyd.js";import"./Breadcrumbs-D1InKlvB.js";import"./index-B9sM2jn7.js";import"./Popover-CFGP6ygZ.js";import"./Modal-IEXX_SfX.js";import"./Portal-DXumaV8r.js";import"./List-BeR0746K.js";import"./ListContext-CgvnrPIp.js";import"./ListItem-wzN9QCAC.js";import"./Link-CCbxACe0.js";import"./index-ClsZGDFK.js";import"./lodash-ciR6S4x9.js";import"./index-qkppG4LT.js";import"./useAnalytics-mBqSlN4Y.js";import"./useApp-Bd-HTri1.js";import"./Page-D2sChA35.js";import"./useMediaQuery-BvqV6vqV.js";import"./Tooltip-BzQR3gsg.js";import"./Popper-Ceh68zhn.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
