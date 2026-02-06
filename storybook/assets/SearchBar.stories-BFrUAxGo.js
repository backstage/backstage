const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Dh_oiSDy.js","./iframe-Bfb6es7h.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-DSQBwqES.js","./useDebounce-dZNuZiXB.js","./translation-BCD5YnFA.js","./SearchContext-DdfJXW0C.js","./lodash-Czox7iJy.js","./useAsync-DkTP0ua2.js","./useMountedState-BiNiTtFn.js","./api-Bhq5iyV7.js","./useAnalytics-CVOFFuvg.js","./InputAdornment-C5_DIl-S.js","./useFormControl-B2mOR3QN.js","./Button-DgLe45Cx.js","./TextField-BKgGshaK.js","./Select-D3G4kv-0.js","./index-B9sM2jn7.js","./Popover-BH0ZmLnx.js","./Modal-CMLC8fQ-.js","./Portal-DoGSafYV.js","./List-DdY4r3Qa.js","./ListContext-DK41gHFX.js","./formControlState-ByiNFc8I.js","./FormLabel-f684eXIp.js","./InputLabel-85EUBiAa.js","./useApp-kTvTF_u-.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-Bfb6es7h.js";import{s as l,M as h}from"./api-Bhq5iyV7.js";import{SearchBar as m}from"./SearchBar-Dh_oiSDy.js";import{S}from"./SearchContext-DdfJXW0C.js";import{S as p}from"./Grid-fOEQuWsY.js";import{w as B}from"./appWrappers-DdoKMAzO.js";import"./Search-DSQBwqES.js";import"./useDebounce-dZNuZiXB.js";import"./translation-BCD5YnFA.js";import"./InputAdornment-C5_DIl-S.js";import"./useFormControl-B2mOR3QN.js";import"./Button-DgLe45Cx.js";import"./TextField-BKgGshaK.js";import"./Select-D3G4kv-0.js";import"./index-B9sM2jn7.js";import"./Popover-BH0ZmLnx.js";import"./Modal-CMLC8fQ-.js";import"./Portal-DoGSafYV.js";import"./List-DdY4r3Qa.js";import"./ListContext-DK41gHFX.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-f684eXIp.js";import"./InputLabel-85EUBiAa.js";import"./useAnalytics-CVOFFuvg.js";import"./useApp-kTvTF_u-.js";import"./lodash-Czox7iJy.js";import"./useAsync-DkTP0ua2.js";import"./useMountedState-BiNiTtFn.js";import"./useObservable-D9R9w3U2.js";import"./useIsomorphicLayoutEffect-3QlRcHa3.js";import"./componentData-ALPptmD3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BH1Qp3-H.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-Dh_oiSDy.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
