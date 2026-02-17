import{j as t}from"./iframe-sMBKWU31.js";import{H as i}from"./Header-CPz8uAh_.js";import{P as a}from"./Page-BOUpVk-S.js";import{H as r}from"./HeaderLabel-DaWZZ8J-.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CWJ9R_Wo.js";import"./makeStyles-CxRaH0Ei.js";import"./Box-DEmnSa5V.js";import"./styled-BMPMz7-8.js";import"./Grid-DA2cDQ0c.js";import"./Breadcrumbs-CVMD70U-.js";import"./index-B9sM2jn7.js";import"./Popover-DiUPx_CD.js";import"./Modal-rmCQ-9KS.js";import"./Portal-B2DdDtMB.js";import"./List-BSQHhUkr.js";import"./ListContext-Bwj2wYBb.js";import"./ListItem-DGmFFyTj.js";import"./Link-DV5C9zz1.js";import"./index-Da0ZMUP-.js";import"./lodash-xPEtg8gK.js";import"./index-DWl5mw-m.js";import"./useAnalytics-BN4IS_dq.js";import"./useApp-CzP7aWaG.js";import"./Page-9gcu0GYD.js";import"./useMediaQuery-_e-NLKrj.js";import"./Tooltip-OhwkXjyi.js";import"./Popper-B2qoKkm9.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
