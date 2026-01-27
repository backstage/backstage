import{j as t}from"./iframe-je00FURG.js";import{H as i}from"./Header-CE2yzntm.js";import{P as a}from"./Page-BqPC0y4w.js";import{H as r}from"./HeaderLabel-N_NrM8a5.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DGh5Pias.js";import"./Box-D5OPEor2.js";import"./styled-xFV0esG7.js";import"./Grid-B0PQ6h2h.js";import"./Breadcrumbs-DV-kP4N5.js";import"./index-B9sM2jn7.js";import"./Popover-oZeBTllV.js";import"./Modal-CCp-xvQI.js";import"./Portal-CNYY4S2y.js";import"./List-DQRaF7f8.js";import"./ListContext-CO6-aiX7.js";import"./ListItem-DfuXVJU9.js";import"./Link-rQVMVaTb.js";import"./lodash-Czox7iJy.js";import"./index-B0djXPeI.js";import"./useAnalytics-B71HiL1G.js";import"./useApp-CoQBQg-r.js";import"./Page-BMiGw85f.js";import"./useMediaQuery-Cy-U4TLC.js";import"./Tooltip-D5bghJxt.js";import"./Popper-C-tdByCl.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
