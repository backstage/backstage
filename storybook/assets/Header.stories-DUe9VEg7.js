import{j as t}from"./iframe-mdeHk8Us.js";import{H as i}from"./Header-DVG1crUv.js";import{P as a}from"./Page-qPAZSzb5.js";import{H as r}from"./HeaderLabel-CclcvVpR.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DW1q99Qq.js";import"./Box-C_VvrdzU.js";import"./styled-BGP2DNJW.js";import"./Grid-DC2Tywm3.js";import"./Breadcrumbs-Bs1hBGTq.js";import"./index-B9sM2jn7.js";import"./Popover-CAGK532k.js";import"./Modal-uDaBb03U.js";import"./Portal-CGi5eRlN.js";import"./List-X7Jezm93.js";import"./ListContext-EwKgne2S.js";import"./ListItem-L1zDUeu9.js";import"./Link-dvajx9JY.js";import"./lodash-Czox7iJy.js";import"./index-DhB3CqmG.js";import"./useAnalytics-Cte0NGRl.js";import"./useApp-DWNk4MUY.js";import"./Page-CaI2vE31.js";import"./useMediaQuery-BWAV4mKr.js";import"./Tooltip-BRtijnu7.js";import"./Popper-D5LaxFiz.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
