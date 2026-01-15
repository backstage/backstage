import{j as t}from"./iframe-C9MahRWh.js";import{H as i}from"./Header-CnEsro27.js";import{P as a}from"./Page-BN_y2cOn.js";import{H as r}from"./HeaderLabel-COdkpzUg.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B4pf13t1.js";import"./Box-CYNkyMDT.js";import"./styled-DiHiiZIS.js";import"./Grid-Bq14PCTk.js";import"./Breadcrumbs-CgzB6q3f.js";import"./index-B9sM2jn7.js";import"./Popover-CAIBXgWq.js";import"./Modal-C6HnS9UY.js";import"./Portal-CaSAJtdX.js";import"./List-Bf1QAwLS.js";import"./ListContext-C4u9JBBU.js";import"./ListItem-CEqAAvo8.js";import"./Link-hmIS8MxR.js";import"./lodash-DLuUt6m8.js";import"./index-Y3I5MZ_O.js";import"./useAnalytics-BziQWZJs.js";import"./useApp-jr5Pcjzr.js";import"./Page-BGZZkbAn.js";import"./useMediaQuery-gX5c5zH6.js";import"./Tooltip-BxZhHFnO.js";import"./Popper-BxhcTIEV.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
