import{j as t}from"./iframe--eVtoH1I.js";import{H as i}from"./Header-CbOdvv_e.js";import{P as a}from"./Page-RclvCJXj.js";import{H as r}from"./HeaderLabel-2_fy-v_0.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-C4pius_-.js";import"./makeStyles-qwoBpcZQ.js";import"./Box-AxOQv2ZW.js";import"./styled-BNUMKqxB.js";import"./Grid-BxPVFZFG.js";import"./Breadcrumbs-CSJmgSni.js";import"./index-B9sM2jn7.js";import"./Popover-Csu5u7SS.js";import"./Modal-KRqUqHvk.js";import"./Portal-Cqdnd4y_.js";import"./List-erwGNY81.js";import"./ListContext-Dy_vV088.js";import"./ListItem-BKyGWKlr.js";import"./Link-BAdxSWkK.js";import"./index-Dqb3Scx7.js";import"./lodash-CSJy54S8.js";import"./index-btJptzr1.js";import"./useAnalytics-BkWkZjko.js";import"./useApp-Br_-UhXC.js";import"./Page-CGgwuHrw.js";import"./useMediaQuery-CVynZ5vv.js";import"./Tooltip-Ckjn1o_Q.js";import"./Popper-C6VLYrWu.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
