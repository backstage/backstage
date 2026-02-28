import{j as t}from"./iframe-BplO06yy.js";import{H as i}from"./Header-D2AfSQOP.js";import{P as a}from"./Page-DPDuZfCI.js";import{H as r}from"./HeaderLabel-CDK3c28b.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Ck4lSrxk.js";import"./makeStyles-hxoXH1CF.js";import"./Box-NknjwhwY.js";import"./styled-BRp8APBl.js";import"./Grid-C0SXy4wX.js";import"./Breadcrumbs-BMnHj0eQ.js";import"./index-B9sM2jn7.js";import"./Popover-DtIB-P_b.js";import"./Modal-yWMHuEv7.js";import"./Portal-Ax05yPmo.js";import"./List-xC3JEtnt.js";import"./ListContext-TNzuz18n.js";import"./ListItem-CjMmncm8.js";import"./Link-nS41TX38.js";import"./index-BViUYk_j.js";import"./lodash-Bx2jcK7O.js";import"./index-BquTymTZ.js";import"./useAnalytics-yuQdOfMk.js";import"./useApp-Clg36dJH.js";import"./Page-RXbxvGt0.js";import"./useMediaQuery-XLy7WHO3.js";import"./Tooltip-jADLXplJ.js";import"./Popper-Bzo90_V1.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
