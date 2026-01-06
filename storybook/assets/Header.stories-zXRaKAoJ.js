import{j as e}from"./iframe-nUyzSU_S.js";import{H as o}from"./Header-DAvus_x1.js";import{P as p}from"./Page-DGK1Azbm.js";import{H as r}from"./HeaderLabel-DEvAUaqZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D3hjQV8s.js";import"./Box-CplorJ0g.js";import"./styled-D6A2oy1q.js";import"./Grid-DwDNjNmk.js";import"./Breadcrumbs-BdH5Gyop.js";import"./index-B9sM2jn7.js";import"./Popover-CqQntd3a.js";import"./Modal-CyZtSQZC.js";import"./Portal-B4a8gD0I.js";import"./List-D6JW15z2.js";import"./ListContext-CXea3Vhu.js";import"./ListItem-PgZpHMG5.js";import"./Link-Dwrts35l.js";import"./lodash-Y_-RFQgK.js";import"./index-RHyzx4fN.js";import"./useAnalytics-zfcNJTQf.js";import"./useApp-BPL8rQQ0.js";import"./Page-DaZ2zZHW.js";import"./useMediaQuery-BaVSkscO.js";import"./Tooltip-HC5n3ZHa.js";import"./Popper-DpFVguQf.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
