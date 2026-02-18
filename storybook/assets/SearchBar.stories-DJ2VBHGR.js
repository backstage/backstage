const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Bwh-xJZY.js","./iframe-C97aGyUm.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-DxU1ySun.js","./useDebounce-BEhLJEQk.js","./translation-B748gYKb.js","./SearchContext-CfJy0MCQ.js","./lodash-CjTo-pxC.js","./useAsync-BN-pPxxA.js","./useMountedState-DKTKiVGI.js","./api-D18Ri3Jk.js","./useAnalytics-CPFwZTkm.js","./InputAdornment-CgsrUjWW.js","./useFormControl-HbRl03P6.js","./Button-Cf28NAjI.js","./TextField-CZy_QrRZ.js","./Select-Dh_D7-6F.js","./index-B9sM2jn7.js","./Popover-C1p9-1lq.js","./Modal-Bz25sGJi.js","./Portal-CFNjbNqg.js","./List-BpxYOW0_.js","./ListContext-CrpBZA7K.js","./formControlState-ByiNFc8I.js","./FormLabel-CMdG7IgC.js","./InputLabel-DmSvX0M1.js","./useApp-CJrMf8iL.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-C97aGyUm.js";import{s as d,M as l}from"./api-D18Ri3Jk.js";import{SearchBar as m}from"./SearchBar-Bwh-xJZY.js";import{S as h}from"./SearchContext-CfJy0MCQ.js";import{S as p}from"./Grid-B4D-XE5H.js";import{m as S}from"./makeStyles-BH_X-duW.js";import{w as B}from"./appWrappers-Dd-MH2a_.js";import"./Search-DxU1ySun.js";import"./useDebounce-BEhLJEQk.js";import"./translation-B748gYKb.js";import"./InputAdornment-CgsrUjWW.js";import"./useFormControl-HbRl03P6.js";import"./Button-Cf28NAjI.js";import"./TextField-CZy_QrRZ.js";import"./Select-Dh_D7-6F.js";import"./index-B9sM2jn7.js";import"./Popover-C1p9-1lq.js";import"./Modal-Bz25sGJi.js";import"./Portal-CFNjbNqg.js";import"./List-BpxYOW0_.js";import"./ListContext-CrpBZA7K.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CMdG7IgC.js";import"./InputLabel-DmSvX0M1.js";import"./useAnalytics-CPFwZTkm.js";import"./useApp-CJrMf8iL.js";import"./lodash-CjTo-pxC.js";import"./useAsync-BN-pPxxA.js";import"./useMountedState-DKTKiVGI.js";import"./useObservable-BsTkKb7r.js";import"./useIsomorphicLayoutEffect-JRtGOS2E.js";import"./componentData-B-ZbE2mU.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-D3xivPOe.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-Bwh-xJZY.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
