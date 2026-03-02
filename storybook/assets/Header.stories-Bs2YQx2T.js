import{j as t}from"./iframe-ONoB0Qo9.js";import{H as i}from"./Header-D3Wy1O7_.js";import{P as a}from"./Page-DqFZCnuQ.js";import{H as r}from"./HeaderLabel-0JcINjsz.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CdTWeKxQ.js";import"./makeStyles-dBjLM41z.js";import"./Box-CTTPvdx5.js";import"./styled-CsufaxdX.js";import"./Grid-Bsj_4SyV.js";import"./Breadcrumbs-B6rb1_yA.js";import"./index-B9sM2jn7.js";import"./Popover-BHOdxM3Q.js";import"./Modal-DIHdFi4H.js";import"./Portal-B76g_OhK.js";import"./List-BrOrhSy2.js";import"./ListContext-DWK5PcRa.js";import"./ListItem-WR66Sxo3.js";import"./Link-DOQzRVnU.js";import"./index-CJMbbZwi.js";import"./lodash-BHbbKwIp.js";import"./index-D2HI0Bg7.js";import"./useAnalytics-Dfpcn-Os.js";import"./useApp-Bpmtfts2.js";import"./Page-DP2Z5WDv.js";import"./useMediaQuery-YLZmlUPy.js";import"./Tooltip-C7OHiPo1.js";import"./Popper-BX5EB3tO.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
