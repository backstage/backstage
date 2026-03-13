const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Bo995Ftg.js","./iframe-C-coJuUP.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-DRBIQeJG.js","./useDebounce-f31Hmgu0.js","./translation-BVt3Odwo.js","./SearchContext-BJ7fTOh-.js","./lodash-BMGFMZfQ.js","./useAsync-DVqxPCgr.js","./useMountedState-BzctEBb5.js","./api-ssQ3Qj5i.js","./useAnalytics-Csq2_frD.js","./InputAdornment-D3kjfZv6.js","./formControlState-DabV58J4.js","./Button-BsFcYRf2.js","./TextField-Bj1uwv43.js","./Select-Dhmfb78L.js","./index-B9sM2jn7.js","./Popover-D_ta6ggJ.js","./Modal-CU7kgWSP.js","./Portal-7MVcqHay.js","./List-DmNK4dvp.js","./ListContext-DK0SRiIG.js","./FormLabel-DmTRdOsG.js","./InputLabel-DhMB8FIr.js","./useApp-DwifVUVc.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i}from"./iframe-C-coJuUP.js";import{s as d,M as l}from"./api-ssQ3Qj5i.js";import{SearchBar as m}from"./SearchBar-Bo995Ftg.js";import{S as h}from"./SearchContext-BJ7fTOh-.js";import{S as p}from"./Grid-CpuCkwO3.js";import{m as S}from"./makeStyles-CiHm2TPH.js";import{w as B}from"./appWrappers-CdioH-jm.js";import"./Search-DRBIQeJG.js";import"./useDebounce-f31Hmgu0.js";import"./translation-BVt3Odwo.js";import"./InputAdornment-D3kjfZv6.js";import"./formControlState-DabV58J4.js";import"./Button-BsFcYRf2.js";import"./TextField-Bj1uwv43.js";import"./Select-Dhmfb78L.js";import"./index-B9sM2jn7.js";import"./Popover-D_ta6ggJ.js";import"./Modal-CU7kgWSP.js";import"./Portal-7MVcqHay.js";import"./List-DmNK4dvp.js";import"./ListContext-DK0SRiIG.js";import"./FormLabel-DmTRdOsG.js";import"./InputLabel-DhMB8FIr.js";import"./useAnalytics-Csq2_frD.js";import"./useApp-DwifVUVc.js";import"./lodash-BMGFMZfQ.js";import"./useAsync-DVqxPCgr.js";import"./useMountedState-BzctEBb5.js";import"./useObservable-CtHErxE2.js";import"./useIsomorphicLayoutEffect-BgJo-eyS.js";import"./componentData-CAUcuYKY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-2anb1mQB.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-Bo995Ftg.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
