import{j as e}from"./iframe-CY7lbe83.js";import{H as o}from"./Header-CpBkIc8P.js";import{P as p}from"./Page-PKgQ-DzC.js";import{H as r}from"./HeaderLabel-Da4Jo81-.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CIJ2QTbl.js";import"./Box-gZ8thPU9.js";import"./styled-CZ8uUDah.js";import"./Grid-DcImk4IG.js";import"./makeStyles-BGiSvRlD.js";import"./Breadcrumbs-BznFE-ln.js";import"./index-B9sM2jn7.js";import"./Popover-r9Lec8C5.js";import"./Modal-IARjO0T0.js";import"./Portal-DEwmDmBY.js";import"./List-Ci1Aezal.js";import"./ListContext-CUuh2mol.js";import"./ListItem-CeQUv4cf.js";import"./Link-Ccz9XHl0.js";import"./index-B1QT4D-J.js";import"./lodash-ADtPu9nK.js";import"./useAnalytics-BhHlZ_-q.js";import"./useApp-BWWc3uRn.js";import"./Page-BENV0lfr.js";import"./useMediaQuery-BLk1PnQd.js";import"./Tooltip-COPl2w0n.js";import"./Popper-DCMX2Z1y.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
