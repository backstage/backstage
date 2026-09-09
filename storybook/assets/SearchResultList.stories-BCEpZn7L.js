import{bQ as e,c8 as o,a4 as h}from"./iframe-wUGVZK80.js";import{s as y,M as S}from"./api-R7srMSe2.js";import{c as L}from"./SearchResult-fHe7Y3c6.js";import{S as s}from"./SearchResultList-DGC0zFOi.js";import{S as q}from"./SearchContext-CSXM31sM.js";import{L as f}from"./ListItemText-BucOZA4o.js";import{H as x}from"./DefaultResultListItem-LkIkhNDl.js";import{C as j}from"./icons-E6Ache9z.js";import{O as P,a as C}from"./appWrappers-CLZx3X6D.js";import{L as w}from"./ListItem-DDigxjaw.js";import{L as A}from"./ListItemIcon-Dckq0wok.js";import{a as _}from"./Plugin-gNmuCZ1f.js";import{S as R}from"./Grid-B4FlnJ2g.js";import{L as W}from"./Link-Go23hbH8.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Cx9_3Zxd.js";import"./useAsync-D5qz_x2U.js";import"./useMountedState-CsruVelL.js";import"./lodash-DyeR7AcE.js";import"./useElementFilter-DPCAsRBd.js";import"./componentData-Buq09psZ.js";import"./List-Ci0k_jrS.js";import"./ListContext-50b39xzR.js";import"./translation-DJEIzcSC.js";import"./EmptyState-BqtY-kfD.js";import"./makeStyles-Cw8l4FUa.js";import"./Progress-CbnL7e74.js";import"./LinearProgress-UBxsJMBc.js";import"./Box-DE0sHIcK.js";import"./styled-BJSwmENK.js";import"./ResponseErrorPanel-CJngXtbv.js";import"./ErrorPanel-CMf-DS9w.js";import"./WarningPanel-Dfl2cZ4k.js";import"./ExpandMore-HnztnnpI.js";import"./AccordionDetails-DMgDUEr7.js";import"./index-B9sM2jn7.js";import"./Collapse-Cc1SHgxN.js";import"./MarkdownContent-DCzI_TJA.js";import"./CodeSnippet-CJSpforj.js";import"./CopyTextButton-kooOvTYQ.js";import"./useCopyToClipboard-Da3y2yaX.js";import"./Tooltip-CNr5I1VM.js";import"./useObjectRef-Cer6noLc.js";import"./useOverlayTriggerState-BMbSord3.js";import"./utils-mEgVZwEH.js";import"./useFocusRing-BC7vVkX4.js";import"./openLink-D6ixiiSG.js";import"./number-vyQ0g_EM.js";import"./I18nProvider-Ci8FoB4z.js";import"./useControlledState-BP7q2gJ8.js";import"./animation-CeCl3Lpx.js";import"./useHover-DRcNaDP5.js";import"./ButtonIcon-44wQ_emu.js";import"./Button-d6OZAENs.js";import"./Label-CZ0yGWTb.js";import"./Hidden-yseb-6tt.js";import"./useLabel-r6Cj49-v.js";import"./useLabels-CANwnRLq.js";import"./useButton-DkR_L0-r.js";import"./usePress-0P_K_iFV.js";import"./textSelection-C7djrXyy.js";import"./index-CxFlMd0n.js";import"./Divider-mp5Fqmk_.js";import"./useApp-YEoBNPcr.js";import"./WebStorage-By6TSt6T.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-B7i_eRI-.js";import"./useIsomorphicLayoutEffect-CknHDTyt.js";import"./BUIProvider-BRk5MhI6.js";import"./BUIRoutingProvider-CBGIGxDQ.js";import"./useResolvedHref-DV-Il6Xp.js";import"./useRouteRef-s1TbaLNV.js";import"./index-CGlIW_he.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>;
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultList query={query} />;
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {
      throw new Error();
    })
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultList query={query} renderResultItem={({
    type,
    document,
    highlight,
    rank
  }) => {
    switch (type) {
      case 'custom':
        return <CustomResultListItem key={document.location} icon={<CatalogIcon />} result={document} highlight={highlight} rank={rank} />;
      default:
        return <DefaultResultListItem key={document.location} result={document} />;
    }
  }} />;
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultSearchResultListItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResultList query={query}>
      <DefaultSearchResultListItem />
    </SearchResultList>;
}`,...d.parameters?.docs?.source}}};const rt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,rt as __namedExportsOrder,tt as default};
