const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-23Gyenti.js","./iframe-DCoYcZLi.js","./preload-helper-PPVm8Dsz.js","./iframe-DuVk3JC9.css","./Search-CO2SgLFA.js","./useDebounce-BJ8mvT7r.js","./translation-D0_H8PeL.js","./SearchContext-COprA1mB.js","./lodash-Czox7iJy.js","./useAsync-BaVFaK6n.js","./useMountedState-CnGoVtA3.js","./api-CtEo9Teb.js","./useAnalytics-DTSsXZrs.js","./InputAdornment-BaR4Gn_i.js","./useFormControl-DwmME2Xd.js","./Button-Cp5oCkaD.js","./TextField-islGd63O.js","./Select-PZxOyHgK.js","./index-B9sM2jn7.js","./Popover-D-wzkU98.js","./Modal-CPACyKe7.js","./Portal-CFcI6CIt.js","./List-BdybXaA2.js","./ListContext-DkVKA3j4.js","./formControlState-ByiNFc8I.js","./FormLabel-TH7L9HeH.js","./InputLabel-ytmnoEQX.js","./useApp-B6U5E67n.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-DCoYcZLi.js";import{s as l,M as h}from"./api-CtEo9Teb.js";import{SearchBar as m}from"./SearchBar-23Gyenti.js";import{S}from"./SearchContext-COprA1mB.js";import{S as p}from"./Grid-D58TNpxw.js";import{w as B}from"./appWrappers-bScNmkAy.js";import"./Search-CO2SgLFA.js";import"./useDebounce-BJ8mvT7r.js";import"./translation-D0_H8PeL.js";import"./InputAdornment-BaR4Gn_i.js";import"./useFormControl-DwmME2Xd.js";import"./Button-Cp5oCkaD.js";import"./TextField-islGd63O.js";import"./Select-PZxOyHgK.js";import"./index-B9sM2jn7.js";import"./Popover-D-wzkU98.js";import"./Modal-CPACyKe7.js";import"./Portal-CFcI6CIt.js";import"./List-BdybXaA2.js";import"./ListContext-DkVKA3j4.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-TH7L9HeH.js";import"./InputLabel-ytmnoEQX.js";import"./useAnalytics-DTSsXZrs.js";import"./useApp-B6U5E67n.js";import"./lodash-Czox7iJy.js";import"./useAsync-BaVFaK6n.js";import"./useMountedState-CnGoVtA3.js";import"./useObservable-CYrlA7wL.js";import"./useIsomorphicLayoutEffect-ByWXU8SB.js";import"./componentData-OraWGl32.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CZ9gZJRb.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-23Gyenti.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
