import{j as r,r as a,U as n,e as d,f as m,p as c}from"./iframe-C8yOC2Gz.js";import{F as s}from"./FavoriteToggle-r0T3wGRZ.js";import{w as v}from"./appWrappers-BwqhmqR7.js";import"./preload-helper-PPVm8Dsz.js";import"./Tooltip-BmRm86HZ.js";import"./Popper-DqIt_wBv.js";import"./Portal-CjckT897.js";import"./icons-ZYi9uu7k.js";import"./useApp-_O_9FYmx.js";import"./useObservable-4Q7GBTuk.js";import"./useIsomorphicLayoutEffect-9KuYP6zf.js";import"./useAnalytics-CGjIDoIa.js";import"./useAsync-A762jT4V.js";import"./useMountedState-Bkd0wkwf.js";import"./componentData-BzMhRHzP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CL1m9NR9.js";const w={title:"Core/FavoriteToggle",component:s,decorators:[o=>v(r.jsx(o,{}))],tags:["!manifest"]},e=()=>{const[o,i]=a.useState(!1);return r.jsx(s,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})},p=d({...m({palette:c.dark}),components:{BackstageFavoriteToggleIcon:{styleOverrides:{icon:()=>({color:"aqua"}),iconBorder:()=>({color:"white"})}}}}),t=()=>{const[o,i]=a.useState(!1);return r.jsx(n,{theme:p,children:r.jsx(s,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"WithThemeOverride"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <FavoriteToggle
      id="favorite-toggle"
      title="Add entity to favorites"
      isFavorite={isFavorite}
      onToggle={setFavorite}
    />
  );
};
`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const WithThemeOverride = () => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <UnifiedThemeProvider theme={theme}>
      <FavoriteToggle
        id="favorite-toggle"
        title="Add entity to favorites"
        isFavorite={isFavorite}
        onToggle={setFavorite}
      />
    </UnifiedThemeProvider>
  );
};
`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const [isFavorite, setFavorite] = useState(false);
  return <FavoriteToggle id="favorite-toggle" title="Add entity to favorites" isFavorite={isFavorite} onToggle={setFavorite} />;
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const [isFavorite, setFavorite] = useState(false);
  return <UnifiedThemeProvider theme={theme}>
      <FavoriteToggle id="favorite-toggle" title="Add entity to favorites" isFavorite={isFavorite} onToggle={setFavorite} />
    </UnifiedThemeProvider>;
}`,...t.parameters?.docs?.source}}};const B=["Default","WithThemeOverride"];export{e as Default,t as WithThemeOverride,B as __namedExportsOrder,w as default};
