import{j as t}from"./iframe-DagLMla0.js";import{H as i}from"./Header-DWG9D1mF.js";import{P as a}from"./Page-DwAyzO5N.js";import{H as r}from"./HeaderLabel-BgyEAh2q.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B6fhbySI.js";import"./makeStyles-VKdC8KiN.js";import"./Box-C34VUoZ3.js";import"./styled-CaOR_WMz.js";import"./Grid-FBCbfPk_.js";import"./Breadcrumbs-BJtKNSSr.js";import"./index-B9sM2jn7.js";import"./Popover-Cu6956KG.js";import"./Modal-CPcAs759.js";import"./Portal-D3sdGGII.js";import"./List-CIhN5mci.js";import"./ListContext-Ci5pu3kB.js";import"./ListItem-EqTaubpw.js";import"./Link-BU4ykdVL.js";import"./index-DHWmtkjs.js";import"./lodash-8eZMkpM5.js";import"./index-IelGYWEf.js";import"./useAnalytics-DGkcsGrL.js";import"./useApp-CHi7wILZ.js";import"./Page-CAywVXuZ.js";import"./useMediaQuery-DOUn7-C5.js";import"./Tooltip-C5pe82ax.js";import"./Popper-DphrlTbi.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
