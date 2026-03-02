import{j as t}from"./iframe-CGY8RtMM.js";import{H as i}from"./Header-BJHvwL8m.js";import{P as a}from"./Page-CVfgsriR.js";import{H as r}from"./HeaderLabel-_ABeRoiW.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DRnxo-Zj.js";import"./makeStyles-DsrsBIHr.js";import"./Box-CzermUI4.js";import"./styled-CKkmDcn6.js";import"./Grid-C7KzSS4F.js";import"./Breadcrumbs-Boqc1_7g.js";import"./index-B9sM2jn7.js";import"./Popover-DEBV3NVZ.js";import"./Modal-CjAaGIlL.js";import"./Portal-CPD4eQSx.js";import"./List-BP8Bshto.js";import"./ListContext-CqJ372Q7.js";import"./ListItem-mZsObVR0.js";import"./Link-DezUlcmn.js";import"./index-BLVERU9s.js";import"./lodash-D5DB6SGB.js";import"./index-Brj28hLr.js";import"./useAnalytics-DzkBVlTS.js";import"./useApp-D6E87KeO.js";import"./Page-DOPpg5oB.js";import"./useMediaQuery-BrRGrmzS.js";import"./Tooltip-CKxlzXa0.js";import"./Popper-DldGGRD9.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
