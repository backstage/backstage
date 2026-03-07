const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-ClSONkLf.js","./iframe-B0Lf5NUM.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-D5RryG59.js","./useDebounce-Cox13PcB.js","./translation-CThOurOW.js","./SearchContext-lkMp76EX.js","./lodash-DH4atvbO.js","./useAsync-jr_JLJU3.js","./useMountedState-DEhMjaJi.js","./api-jCopdwY0.js","./useAnalytics-CH2yDCbJ.js","./InputAdornment-CfGT-HGE.js","./formControlState-fwG5p3el.js","./Button-BuRlNemE.js","./TextField-qo5vTu5W.js","./Select-DG060AKQ.js","./index-B9sM2jn7.js","./Popover-D7BDCpOw.js","./Modal-Fw3H3BIv.js","./Portal-CFdZTsMU.js","./List-H_vSxU0X.js","./ListContext-71Kb5fnr.js","./FormLabel-DhAT4lSG.js","./InputLabel-CePXy9HT.js","./useApp-CqqROC9U.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i}from"./iframe-B0Lf5NUM.js";import{s as d,M as l}from"./api-jCopdwY0.js";import{SearchBar as m}from"./SearchBar-ClSONkLf.js";import{S as h}from"./SearchContext-lkMp76EX.js";import{S as p}from"./Grid-DX6cOXg5.js";import{m as S}from"./makeStyles-DeZCCiZz.js";import{w as B}from"./appWrappers-Cb_SdAbw.js";import"./Search-D5RryG59.js";import"./useDebounce-Cox13PcB.js";import"./translation-CThOurOW.js";import"./InputAdornment-CfGT-HGE.js";import"./formControlState-fwG5p3el.js";import"./Button-BuRlNemE.js";import"./TextField-qo5vTu5W.js";import"./Select-DG060AKQ.js";import"./index-B9sM2jn7.js";import"./Popover-D7BDCpOw.js";import"./Modal-Fw3H3BIv.js";import"./Portal-CFdZTsMU.js";import"./List-H_vSxU0X.js";import"./ListContext-71Kb5fnr.js";import"./FormLabel-DhAT4lSG.js";import"./InputLabel-CePXy9HT.js";import"./useAnalytics-CH2yDCbJ.js";import"./useApp-CqqROC9U.js";import"./lodash-DH4atvbO.js";import"./useAsync-jr_JLJU3.js";import"./useMountedState-DEhMjaJi.js";import"./useObservable-J6JZdQJK.js";import"./useIsomorphicLayoutEffect-D1wuUzNo.js";import"./componentData-t2dFRqgI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DKt6U3gJ.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-ClSONkLf.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
  return <SearchBar />;
};
`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const CustomPlaceholder = () => {
  return <SearchBar placeholder="This is a custom placeholder" />;
};
`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const CustomLabel = () => {
  return <SearchBar label="This is a custom label" />;
};
`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Focused = () => {
  return (
    // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <SearchBar autoFocus />
  );
};
`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const WithoutClearButton = () => {
  return <SearchBar clearButton={false} />;
};
`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const CustomStyles = () => {
  const classes = useStyles();
  return (
    <SearchBar
      InputProps={{
        classes: {
          root: classes.searchBarRoot,
          notchedOutline: classes.searchBarOutline,
        },
      }}
    />
  );
};
`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar />;
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar placeholder="This is a custom placeholder" />;
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar label="This is a custom label" />;
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return (
    // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <SearchBar autoFocus />
  );
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar clearButton={false} />;
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  return <SearchBar InputProps={{
    classes: {
      root: classes.searchBarRoot,
      notchedOutline: classes.searchBarOutline
    }
  }} />;
}`,...n.parameters?.docs?.source}}};const re=["Default","CustomPlaceholder","CustomLabel","Focused","WithoutClearButton","CustomStyles"];export{a as CustomLabel,o as CustomPlaceholder,n as CustomStyles,s as Default,t as Focused,c as WithoutClearButton,re as __namedExportsOrder,ee as default};
