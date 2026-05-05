import{j as e}from"./iframe-DWvOg1Nr.js";import{H as o}from"./Header-BAlHG-bt.js";import{P as p}from"./Page-DEFRQ83U.js";import{H as r}from"./HeaderLabel-DknLnb_r.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CO2KivbS.js";import"./Box-zyqdCy3P.js";import"./styled-RIBlsQy0.js";import"./Grid-Xzlg2O4n.js";import"./makeStyles-CHGG-m_x.js";import"./Breadcrumbs-BVhLKZ34.js";import"./index-B9sM2jn7.js";import"./Popover-BRA9BNP2.js";import"./Modal-DET7dYk7.js";import"./Portal-y55DOJ_z.js";import"./List-BFA7b6ty.js";import"./ListContext-BV1W3iGS.js";import"./ListItem-CYRCHcIm.js";import"./Link-C6IojI8B.js";import"./index-BUDLY78-.js";import"./lodash-BszOACSM.js";import"./useAnalytics-CLrtpPO4.js";import"./useApp-QYowGE2r.js";import"./Page-NIBM9V6w.js";import"./useMediaQuery-B0h4mn6N.js";import"./Tooltip-DwFxLD2U.js";import"./Popper-Dvaylqi7.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,R as default};
