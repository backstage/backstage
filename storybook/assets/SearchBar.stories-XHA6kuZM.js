const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CmBnQFIJ.js","./iframe-DLGvYYIN.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-CBbOE4WC.js","./useDebounce-DHXQTYym.js","./translation-B-cXZdKs.js","./SearchContext-OW4vN2P3.js","./lodash-C5x__jU_.js","./useAsync-CbA15NdN.js","./useMountedState-Cv7_7HCx.js","./api-BUgooSL5.js","./useAnalytics-0fvOd3T4.js","./InputAdornment-AEPunAMG.js","./useFormControl-Cmz4PI9F.js","./Button-Baz4R6OW.js","./TextField-D3BQhCMi.js","./Select-CfqWY8gL.js","./index-B9sM2jn7.js","./Popover-DZWOjGlE.js","./Modal-VCWnU0_u.js","./Portal-BesUmCRU.js","./List-CgTpYNOF.js","./ListContext-BtT7WJ3i.js","./formControlState-ByiNFc8I.js","./FormLabel-BDeeaZd_.js","./InputLabel-CeUR67K8.js","./useApp-lLuePZ3T.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-DLGvYYIN.js";import{s as d,M as l}from"./api-BUgooSL5.js";import{SearchBar as m}from"./SearchBar-CmBnQFIJ.js";import{S as h}from"./SearchContext-OW4vN2P3.js";import{S as p}from"./Grid-DpqtaqiR.js";import{m as S}from"./makeStyles-DEKhmeuV.js";import{w as B}from"./appWrappers-BLvGnBUx.js";import"./Search-CBbOE4WC.js";import"./useDebounce-DHXQTYym.js";import"./translation-B-cXZdKs.js";import"./InputAdornment-AEPunAMG.js";import"./useFormControl-Cmz4PI9F.js";import"./Button-Baz4R6OW.js";import"./TextField-D3BQhCMi.js";import"./Select-CfqWY8gL.js";import"./index-B9sM2jn7.js";import"./Popover-DZWOjGlE.js";import"./Modal-VCWnU0_u.js";import"./Portal-BesUmCRU.js";import"./List-CgTpYNOF.js";import"./ListContext-BtT7WJ3i.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BDeeaZd_.js";import"./InputLabel-CeUR67K8.js";import"./useAnalytics-0fvOd3T4.js";import"./useApp-lLuePZ3T.js";import"./lodash-C5x__jU_.js";import"./useAsync-CbA15NdN.js";import"./useMountedState-Cv7_7HCx.js";import"./useObservable-M3H9pj3U.js";import"./useIsomorphicLayoutEffect-B6Z-1KgF.js";import"./componentData-BbWMNPXa.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CzwyT08Z.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-CmBnQFIJ.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
}`,...n.parameters?.docs?.source}}};const se=["Default","CustomPlaceholder","CustomLabel","Focused","WithoutClearButton","CustomStyles"];export{a as CustomLabel,o as CustomPlaceholder,n as CustomStyles,s as Default,t as Focused,c as WithoutClearButton,se as __namedExportsOrder,re as default};
