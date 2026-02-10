import{j as t}from"./iframe-gtROSIwU.js";import{H as i}from"./Header-DG5h9CUD.js";import{P as a}from"./Page-4_5WWd0q.js";import{H as r}from"./HeaderLabel-CHaCXrKb.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Cb6SCtsn.js";import"./Box-DVyEyde4.js";import"./styled-Bs_QlAid.js";import"./Grid-Dk9zonhM.js";import"./Breadcrumbs-BVxMklzh.js";import"./index-B9sM2jn7.js";import"./Popover-C_iP5aYt.js";import"./Modal-ybKC94PT.js";import"./Portal-DfJk_0nC.js";import"./List-4z_Kf1-d.js";import"./ListContext-DPykjs2z.js";import"./ListItem-CchOfbIa.js";import"./Link-ISGpl10u.js";import"./lodash-BVz7JNon.js";import"./index-C21dWa9i.js";import"./useAnalytics-CleNnKnR.js";import"./useApp-E5OH6s9s.js";import"./Page-CeLI_eWX.js";import"./useMediaQuery-BMA_Vj61.js";import"./Tooltip-C-NpfkzH.js";import"./Popper-DSlAm5T6.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
