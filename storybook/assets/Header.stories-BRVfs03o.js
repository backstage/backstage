import{j as e}from"./iframe-D-w6RxGv.js";import{H as o}from"./Header-C_AFSJAD.js";import{P as p}from"./Page-2HDLiWcU.js";import{H as r}from"./HeaderLabel-CerjMn7c.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-CyhEo7Zh.js";import"./Box-PhnhPtmh.js";import"./styled-n-xY2yaY.js";import"./Grid-Dts7GzWa.js";import"./Breadcrumbs-Eekm9lXQ.js";import"./index-DnL3XN75.js";import"./Popover-DFIQSwlD.js";import"./Modal-Ds0hJkbL.js";import"./Portal-DWcyIRvv.js";import"./List-CujjVc52.js";import"./ListContext-yRQd_P0Y.js";import"./ListItem-DC_Q_Qo-.js";import"./Link-Dhe_VRcU.js";import"./lodash-CwBbdt2Q.js";import"./index-BY4RoNki.js";import"./useAnalytics-DPlXbgxY.js";import"./useApp-CFgLl9KI.js";import"./Page-Ujhzfv4x.js";import"./useMediaQuery-Bq-TCgRA.js";import"./Tooltip-D4tR_jXC.js";import"./Popper-Dx-ZWhUD.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
