const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-D03hpqnC.js","./iframe-BtR5uFk3.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-DtNk1poV.js","./useDebounce-C8AcKoVe.js","./translation-CeE4EFVa.js","./SearchContext-JYczXqQ1.js","./lodash-ZuVUN9Fn.js","./useAsync-DSbVnNaQ.js","./useMountedState-D9gb5SvK.js","./api-_RlUZ8bz.js","./useAnalytics-B6wKgkMO.js","./InputAdornment-BFXGwdIN.js","./useFormControl-BsP7WsA4.js","./Button-DxiZ5WmK.js","./TextField-cDdcBFuF.js","./Select-hd7DIRPa.js","./index-B9sM2jn7.js","./Popover-9Iv1wX11.js","./Modal-r2IX8849.js","./Portal-n2LDmCMW.js","./List-CzkDasS3.js","./ListContext-BRtoW0M1.js","./formControlState-ByiNFc8I.js","./FormLabel-ClF7ms37.js","./InputLabel-BbeoIDWB.js","./useApp-5tv6egRH.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-BtR5uFk3.js";import{s as d,M as l}from"./api-_RlUZ8bz.js";import{SearchBar as m}from"./SearchBar-D03hpqnC.js";import{S as h}from"./SearchContext-JYczXqQ1.js";import{S as p}from"./Grid-BcwH-HFr.js";import{m as S}from"./makeStyles-BfJpy4Wy.js";import{w as B}from"./appWrappers-DlnGKvuR.js";import"./Search-DtNk1poV.js";import"./useDebounce-C8AcKoVe.js";import"./translation-CeE4EFVa.js";import"./InputAdornment-BFXGwdIN.js";import"./useFormControl-BsP7WsA4.js";import"./Button-DxiZ5WmK.js";import"./TextField-cDdcBFuF.js";import"./Select-hd7DIRPa.js";import"./index-B9sM2jn7.js";import"./Popover-9Iv1wX11.js";import"./Modal-r2IX8849.js";import"./Portal-n2LDmCMW.js";import"./List-CzkDasS3.js";import"./ListContext-BRtoW0M1.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-ClF7ms37.js";import"./InputLabel-BbeoIDWB.js";import"./useAnalytics-B6wKgkMO.js";import"./useApp-5tv6egRH.js";import"./lodash-ZuVUN9Fn.js";import"./useAsync-DSbVnNaQ.js";import"./useMountedState-D9gb5SvK.js";import"./useObservable-D11eHV_a.js";import"./useIsomorphicLayoutEffect-CM9r8e0x.js";import"./componentData-BeHMODne.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BMej53MO.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-D03hpqnC.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
