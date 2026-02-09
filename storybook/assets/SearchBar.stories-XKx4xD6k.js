const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Ds8i7znb.js","./iframe-BNPQer77.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-BQAQXg6u.js","./useDebounce-DNfMe9na.js","./translation-Dx1K0MZ6.js","./SearchContext-CPqnqvun.js","./lodash-D6Y5cDVN.js","./useAsync-D-OdF4D0.js","./useMountedState-Zh225SSx.js","./api-DjQ3qFVy.js","./useAnalytics-DI9G1xrU.js","./InputAdornment-BoBvoooI.js","./useFormControl-u4c6bt7d.js","./Button-DSVLq8Gc.js","./TextField-BkuAEY9z.js","./Select-BKv9FlUU.js","./index-B9sM2jn7.js","./Popover-DhB4mRyc.js","./Modal-DuAz145P.js","./Portal-D6rxE-he.js","./List-Bj78s_pe.js","./ListContext-BZ4pbeSM.js","./formControlState-ByiNFc8I.js","./FormLabel-3F1wLsZS.js","./InputLabel-DKEgz18B.js","./useApp-C940MqwE.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-BNPQer77.js";import{s as l,M as h}from"./api-DjQ3qFVy.js";import{SearchBar as m}from"./SearchBar-Ds8i7znb.js";import{S}from"./SearchContext-CPqnqvun.js";import{S as p}from"./Grid-Yv5UUmOJ.js";import{w as B}from"./appWrappers-DclPpZoE.js";import"./Search-BQAQXg6u.js";import"./useDebounce-DNfMe9na.js";import"./translation-Dx1K0MZ6.js";import"./InputAdornment-BoBvoooI.js";import"./useFormControl-u4c6bt7d.js";import"./Button-DSVLq8Gc.js";import"./TextField-BkuAEY9z.js";import"./Select-BKv9FlUU.js";import"./index-B9sM2jn7.js";import"./Popover-DhB4mRyc.js";import"./Modal-DuAz145P.js";import"./Portal-D6rxE-he.js";import"./List-Bj78s_pe.js";import"./ListContext-BZ4pbeSM.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-3F1wLsZS.js";import"./InputLabel-DKEgz18B.js";import"./useAnalytics-DI9G1xrU.js";import"./useApp-C940MqwE.js";import"./lodash-D6Y5cDVN.js";import"./useAsync-D-OdF4D0.js";import"./useMountedState-Zh225SSx.js";import"./useObservable-CdBXE0_V.js";import"./useIsomorphicLayoutEffect-Dmyd5J3v.js";import"./componentData-CJSyf2UH.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-D2A2K7dC.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-Ds8i7znb.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
