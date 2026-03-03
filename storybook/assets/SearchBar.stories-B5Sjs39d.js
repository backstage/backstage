const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-C2D2357-.js","./iframe-Bakz1Oty.js","./preload-helper-PPVm8Dsz.js","./iframe-Bp3akXZ8.css","./Search-C2860-VI.js","./useDebounce-DZXpx19O.js","./translation-BTPtOpeL.js","./SearchContext-ZyqUKz7h.js","./lodash-DgNMza5D.js","./useAsync-mZK1n-rv.js","./useMountedState-B1G3Agp-.js","./api-CCTktZIe.js","./useAnalytics-C-zfrdUt.js","./InputAdornment-DURlc0ys.js","./useFormControl-DzItd2gw.js","./Button-Ccht4Qvd.js","./TextField-C2DaVg1z.js","./Select-BYPaq-r0.js","./index-B9sM2jn7.js","./Popover-D1adgFrq.js","./Modal-29C48Sgn.js","./Portal-CHaHYX6z.js","./List-B_gy8x3o.js","./ListContext-C1Qr8NkX.js","./formControlState-ByiNFc8I.js","./FormLabel-WJcegaCB.js","./InputLabel-Dkloidq5.js","./useApp-A6R3_jDs.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-Bakz1Oty.js";import{s as d,M as l}from"./api-CCTktZIe.js";import{SearchBar as m}from"./SearchBar-C2D2357-.js";import{S as h}from"./SearchContext-ZyqUKz7h.js";import{S as p}from"./Grid-ORZV85AM.js";import{m as S}from"./makeStyles-3_kuKRiN.js";import{w as B}from"./appWrappers-Ly4XQxgI.js";import"./Search-C2860-VI.js";import"./useDebounce-DZXpx19O.js";import"./translation-BTPtOpeL.js";import"./InputAdornment-DURlc0ys.js";import"./useFormControl-DzItd2gw.js";import"./Button-Ccht4Qvd.js";import"./TextField-C2DaVg1z.js";import"./Select-BYPaq-r0.js";import"./index-B9sM2jn7.js";import"./Popover-D1adgFrq.js";import"./Modal-29C48Sgn.js";import"./Portal-CHaHYX6z.js";import"./List-B_gy8x3o.js";import"./ListContext-C1Qr8NkX.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-WJcegaCB.js";import"./InputLabel-Dkloidq5.js";import"./useAnalytics-C-zfrdUt.js";import"./useApp-A6R3_jDs.js";import"./lodash-DgNMza5D.js";import"./useAsync-mZK1n-rv.js";import"./useMountedState-B1G3Agp-.js";import"./useObservable-cuHp5Jbv.js";import"./useIsomorphicLayoutEffect-uzj8S866.js";import"./componentData-BHNC7kMz.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DCOINpOM.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-C2D2357-.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
