import{j as t}from"./iframe-DLGvYYIN.js";import{H as i}from"./Header-Cz6xBu8-.js";import{P as a}from"./Page-LHz8E23q.js";import{H as r}from"./HeaderLabel-v7DfLFnY.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CA_sUQg-.js";import"./makeStyles-DEKhmeuV.js";import"./Box-Voe0tXZA.js";import"./styled-B66Ywjg2.js";import"./Grid-DpqtaqiR.js";import"./Breadcrumbs--hLwM9n_.js";import"./index-B9sM2jn7.js";import"./Popover-DZWOjGlE.js";import"./Modal-VCWnU0_u.js";import"./Portal-BesUmCRU.js";import"./List-CgTpYNOF.js";import"./ListContext-BtT7WJ3i.js";import"./ListItem-BaUyqq3j.js";import"./Link-DxwKZrYa.js";import"./index-Bh13v5tn.js";import"./lodash-C5x__jU_.js";import"./index-CzwyT08Z.js";import"./useAnalytics-0fvOd3T4.js";import"./useApp-lLuePZ3T.js";import"./Page-C1P1AbQj.js";import"./useMediaQuery-BSUTARED.js";import"./Tooltip-Btq9c1g-.js";import"./Popper-DYpINPHQ.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
