import{j as t}from"./iframe-DbI6eD9d.js";import{H as i}from"./Header-B93_jXoo.js";import{P as a}from"./Page-sqFbwbzm.js";import{H as r}from"./HeaderLabel-DOXIb5iZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CaPSDnVO.js";import"./Box-B_5N4RtH.js";import"./styled-Ca3T9n7C.js";import"./Grid-Bk30WVxK.js";import"./Breadcrumbs-Dl3JbARY.js";import"./index-B9sM2jn7.js";import"./Popover-D25hhzHL.js";import"./Modal-DSfyr1-Y.js";import"./Portal-1epzlOBv.js";import"./List-B28Z8F3S.js";import"./ListContext-D83WNTGA.js";import"./ListItem-BiTyGeEf.js";import"./Link-BjQEuYrU.js";import"./lodash-Czox7iJy.js";import"./index-BpirQtKL.js";import"./useAnalytics-DxBTGODq.js";import"./useApp-By-GP-XF.js";import"./Page-DQpzUFaD.js";import"./useMediaQuery-CTY4Nnqc.js";import"./Tooltip-Bq7wKed5.js";import"./Popper-9ImL6E1W.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
