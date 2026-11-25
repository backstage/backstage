import{j as e}from"./iframe-T196ztmH.js";import{H as o}from"./Header-Bd7JjKDX.js";import{P as p}from"./Page-AkL2pC8l.js";import{H as r}from"./HeaderLabel-BHvcE4aa.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DlOFyaoh.js";import"./Box-D0Hsb4cf.js";import"./styled-D8t9NQsp.js";import"./Grid-tsQx5ZlT.js";import"./makeStyles-wXls5oBk.js";import"./Breadcrumbs-s9NdfTWr.js";import"./index-B9sM2jn7.js";import"./Popover-DX867e-r.js";import"./Modal-B-hnEzn3.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-DwZNXahi.js";import"./List-uBQ_jjoq.js";import"./ListContext-C26h6ShK.js";import"./ListItem-C46GhWUf.js";import"./Link-CM7hnzwh.js";import"./index-CHb-0WlO.js";import"./lodash-CKeCnM0L.js";import"./useApp-BYWpjzsK.js";import"./index-DQMgTQ6t.js";import"./useAnalytics-hRuUiONW.js";import"./Page-B3UZr8aP.js";import"./useMediaQuery-DtskOlPy.js";import"./Tooltip-y6vJFoku.js";import"./Popper-7zVq3KS1.js";const k={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const z=["Default"];export{t as Default,z as __namedExportsOrder,k as default};
