const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-YUHY5X6i.js","./iframe-D342WmTn.js","./preload-helper-PPVm8Dsz.js","./iframe-D3TzzGM-.css","./Search-Ofkmc5KE.js","./useDebounce-M36uAiOW.js","./translation-CkwsvNbf.js","./SearchContext-Bv5aOKdX.js","./lodash-C2-_WstS.js","./useAsync-B04OMus7.js","./useMountedState-BNluGJjz.js","./api-BTrYe2vX.js","./useAnalytics-BlpddQlR.js","./InputAdornment-m87PKjGi.js","./useFormControl-BZP9Cs2b.js","./Button-Bj3J30wS.js","./TextField-CPdHRH-a.js","./Select-Ba3gkRUn.js","./index-B9sM2jn7.js","./Popover-CCq25qdM.js","./Modal-D62txzus.js","./Portal-D4InWYUl.js","./List-C_CbbNXo.js","./ListContext-hf1vC8cB.js","./formControlState-ByiNFc8I.js","./FormLabel-hu7DYp1C.js","./InputLabel-DHbEC4jS.js","./useApp-Da77ShEq.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,Z as u}from"./iframe-D342WmTn.js";import{s as d,M as l}from"./api-BTrYe2vX.js";import{SearchBar as m}from"./SearchBar-YUHY5X6i.js";import{S as h}from"./SearchContext-Bv5aOKdX.js";import{S as p}from"./Grid-DonucUYR.js";import{m as S}from"./makeStyles-Dl2xR7o6.js";import{w as B}from"./appWrappers-C6AX-mxK.js";import"./Search-Ofkmc5KE.js";import"./useDebounce-M36uAiOW.js";import"./translation-CkwsvNbf.js";import"./InputAdornment-m87PKjGi.js";import"./useFormControl-BZP9Cs2b.js";import"./Button-Bj3J30wS.js";import"./TextField-CPdHRH-a.js";import"./Select-Ba3gkRUn.js";import"./index-B9sM2jn7.js";import"./Popover-CCq25qdM.js";import"./Modal-D62txzus.js";import"./Portal-D4InWYUl.js";import"./List-C_CbbNXo.js";import"./ListContext-hf1vC8cB.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-hu7DYp1C.js";import"./InputLabel-DHbEC4jS.js";import"./useAnalytics-BlpddQlR.js";import"./useApp-Da77ShEq.js";import"./lodash-C2-_WstS.js";import"./useAsync-B04OMus7.js";import"./useMountedState-BNluGJjz.js";import"./useObservable-c5Ssijv2.js";import"./useIsomorphicLayoutEffect-CNzqpcNs.js";import"./componentData-BQJEUhpR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-EeMuXrdv.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-YUHY5X6i.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
