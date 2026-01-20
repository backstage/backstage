import{j as t}from"./iframe-BOihsBca.js";import{H as i}from"./Header-Un7UKb-O.js";import{P as a}from"./Page-Bt3EPoKf.js";import{H as r}from"./HeaderLabel-D6_X1H5c.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-COgbvbMo.js";import"./Box-CI5GVXvc.js";import"./styled-DdU_wQet.js";import"./Grid-1tirjwRV.js";import"./Breadcrumbs-xBQs877L.js";import"./index-B9sM2jn7.js";import"./Popover-CPfwLRxB.js";import"./Modal-jgY3Cn8t.js";import"./Portal-B8qEj_11.js";import"./List-CJIQS_VF.js";import"./ListContext-CI2CUWLZ.js";import"./ListItem-CxNFHnwj.js";import"./Link-Cl4hSzOR.js";import"./lodash-DLuUt6m8.js";import"./index-D4IyxNBc.js";import"./useAnalytics-DhOW7dTn.js";import"./useApp-BZBzLwEw.js";import"./Page-BdWmsiXx.js";import"./useMediaQuery-CiU2CotE.js";import"./Tooltip-DjL5rC5A.js";import"./Popper-CtKIk3Qw.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
