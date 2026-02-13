import{j as t}from"./iframe-DBsVXRYe.js";import{H as i}from"./Header-Dhd2ubRx.js";import{P as a}from"./Page-CzmO4gqW.js";import{H as r}from"./HeaderLabel-D3pXXApW.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BqV4rKE1.js";import"./makeStyles-u8aTytdp.js";import"./Box-DM8WpBiE.js";import"./styled-CtO3CIMm.js";import"./Grid-BdpucV2E.js";import"./Breadcrumbs-1kRlJ-Ub.js";import"./index-B9sM2jn7.js";import"./Popover-CizZCG4E.js";import"./Modal-Ds3oc-YR.js";import"./Portal-9OHpjUEk.js";import"./List-CIVoJXzy.js";import"./ListContext-DUSKHWgB.js";import"./ListItem-DQ9bn4c-.js";import"./Link-B1_ZHna1.js";import"./index-CEKR_-jD.js";import"./lodash-DArDi9rF.js";import"./index-D7OOdF3Y.js";import"./useAnalytics-BiDIJzMW.js";import"./useApp-C-E0MuMI.js";import"./Page-BmMN-taQ.js";import"./useMediaQuery-y5P85psE.js";import"./Tooltip-CPJgV8tS.js";import"./Popper-BrV3NxJy.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
