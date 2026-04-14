import{j as e}from"./iframe-KINrIo_f.js";import{H as o}from"./Header-DTOxqE_A.js";import{P as p}from"./Page-BT2RR_Ne.js";import{H as r}from"./HeaderLabel-aajjE3U8.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BTbmFPSc.js";import"./Box-DQI8Jhin.js";import"./styled-DYfYOEQM.js";import"./Grid-FoW9JHab.js";import"./makeStyles-Br0G-hkA.js";import"./Breadcrumbs-VkFlHl1k.js";import"./index-B9sM2jn7.js";import"./Popover-CGkHhi4M.js";import"./Modal-DCr6J3HP.js";import"./Portal-MO4PhXZB.js";import"./List-BFqrCY8I.js";import"./ListContext-CxZLnUvv.js";import"./ListItem-T4Kaa4Sv.js";import"./Link-DnWmf_w2.js";import"./index-CIy2Pw8-.js";import"./lodash-Cfs9LtR9.js";import"./useAnalytics-Cjgpjhm8.js";import"./useApp-C5R7puQC.js";import"./Page-BCn4hxqI.js";import"./useMediaQuery-D8cltQib.js";import"./Tooltip-DJxyRh0l.js";import"./Popper-_e1X1nRB.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
