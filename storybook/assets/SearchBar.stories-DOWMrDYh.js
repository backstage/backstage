const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DDDeRmuZ.js","./iframe-DHcBEgBH.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-BgOHpduo.js","./useDebounce-DzEqY11Z.js","./translation-DgECwdee.js","./SearchContext-CYSqSGHN.js","./lodash-BO6khM8p.js","./useAsync-Cocbz1wK.js","./useMountedState-f5Qy4kw8.js","./api-C0xzS8jB.js","./useAnalytics-DzmCXJiR.js","./InputAdornment-BvU8_lqb.js","./useFormControl-C4x-N1af.js","./Button-B0IAR49Q.js","./TextField-DEAQ-7LP.js","./Select-Bsf1NO_T.js","./index-B9sM2jn7.js","./Popover-DBNCOFt-.js","./Modal-D6JI9uWD.js","./Portal-4pR_an9W.js","./List-CzJs69wv.js","./ListContext-bUUGMd0s.js","./formControlState-ByiNFc8I.js","./FormLabel-CzXlMnOV.js","./InputLabel-DGNrG_ha.js","./useApp-DfvXHod2.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-DHcBEgBH.js";import{s as d,M as l}from"./api-C0xzS8jB.js";import{SearchBar as m}from"./SearchBar-DDDeRmuZ.js";import{S as h}from"./SearchContext-CYSqSGHN.js";import{S as p}from"./Grid-BgyCT4VC.js";import{m as S}from"./makeStyles-pGUaJr24.js";import{w as B}from"./appWrappers-B-0EurdD.js";import"./Search-BgOHpduo.js";import"./useDebounce-DzEqY11Z.js";import"./translation-DgECwdee.js";import"./InputAdornment-BvU8_lqb.js";import"./useFormControl-C4x-N1af.js";import"./Button-B0IAR49Q.js";import"./TextField-DEAQ-7LP.js";import"./Select-Bsf1NO_T.js";import"./index-B9sM2jn7.js";import"./Popover-DBNCOFt-.js";import"./Modal-D6JI9uWD.js";import"./Portal-4pR_an9W.js";import"./List-CzJs69wv.js";import"./ListContext-bUUGMd0s.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CzXlMnOV.js";import"./InputLabel-DGNrG_ha.js";import"./useAnalytics-DzmCXJiR.js";import"./useApp-DfvXHod2.js";import"./lodash-BO6khM8p.js";import"./useAsync-Cocbz1wK.js";import"./useMountedState-f5Qy4kw8.js";import"./useObservable-C1db0BVC.js";import"./useIsomorphicLayoutEffect-1W8t8JG8.js";import"./componentData-WQbhBMG4.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CAQ8RYn7.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-DDDeRmuZ.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
