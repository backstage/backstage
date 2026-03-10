import{j as t}from"./iframe-ByBrTvma.js";import{H as i}from"./Header-YKloWcvh.js";import{P as a}from"./Page-n73X-jnI.js";import{H as r}from"./HeaderLabel-Cp_j2YtZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B7C_y_nQ.js";import"./makeStyles-DbNf7az6.js";import"./Box-BTaWTKK7.js";import"./styled-D_mu6x9U.js";import"./Grid-CVJ59jxc.js";import"./Breadcrumbs-BBB3FzyT.js";import"./index-B9sM2jn7.js";import"./Popover-PY7eTZ56.js";import"./Modal-CuM9MEfQ.js";import"./Portal-UHK3xnYf.js";import"./List-COw7E98o.js";import"./ListContext-BWIL9NnA.js";import"./ListItem-DP4h3WVe.js";import"./Link-1Uz9xKdo.js";import"./index-D6Jq2HRw.js";import"./lodash-C3FwuLPO.js";import"./index-gUHaPa4H.js";import"./useAnalytics-BFlIYKys.js";import"./useApp-BryTheKO.js";import"./Page-SvpAEZhG.js";import"./useMediaQuery-Hcix2Tyu.js";import"./Tooltip-Bj3ZS_EF.js";import"./Popper-batIr5mA.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
