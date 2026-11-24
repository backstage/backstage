import{j as e,r as o,X as h}from"./iframe-4nxqZpQH.js";import{s as y,M as S}from"./api-2V_tY_rX.js";import{c as L}from"./SearchResult-BNcA-WGF.js";import{S as s}from"./SearchResultList-B55eSw7G.js";import{S as q}from"./SearchContext-BFtfbDAt.js";import{L as f}from"./ListItemText-ChSeEhST.js";import{H as x}from"./DefaultResultListItem-CJzuU2zG.js";import{C as j}from"./icons-BayP1OYZ.js";import{w as P,c as C}from"./appWrappers-BL5tKIQ4.js";import{L as w}from"./ListItem-1vF4zgeG.js";import{L as A}from"./ListItemIcon-h7Pgr2xG.js";import{c as _}from"./Plugin-hE81Viw9.js";import{S as R}from"./Grid-CtTdTKXZ.js";import{L as W}from"./Link-AWxWmhmT.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CLQ0SWuB.js";import"./useAsync-_tUJq3XS.js";import"./useMountedState-gxvlKe0J.js";import"./lodash-D_m0bAY4.js";import"./useElementFilter-BuLLLdSi.js";import"./componentData-Coc2t0be.js";import"./List-5gUO4rvo.js";import"./ListContext-CGw5idQE.js";import"./translation-B2xJKuxx.js";import"./EmptyState-BBwRNdCX.js";import"./makeStyles-JOYHJdob.js";import"./Progress-BEigslct.js";import"./LinearProgress-CRpZwJ9q.js";import"./Box-Cd_GZSF7.js";import"./styled-BbGqbqb-.js";import"./ResponseErrorPanel-BWRDedJf.js";import"./ErrorPanel-2UgOzAAm.js";import"./WarningPanel-B82h1D3R.js";import"./ExpandMore-Di0pktns.js";import"./AccordionDetails-CHf98niJ.js";import"./index-B9sM2jn7.js";import"./Collapse-Bsj1_U-L.js";import"./MarkdownContent-BtGc-FRf.js";import"./CopyTextButton-Cz1xlOI4.js";import"./useCopyToClipboard-CfL4moGC.js";import"./Tooltip-CwMNMe52.js";import"./useObjectRef-CnTOzlP3.js";import"./useOverlayTriggerState-_agSFwEY.js";import"./utils-B_CpPLsC.js";import"./useFocusRing-DLLTypMY.js";import"./number-CWCm_kOs.js";import"./I18nProvider-C7-lUSN5.js";import"./useControlledState-BipTuFfk.js";import"./animation-Drc_DBoe.js";import"./useHover-6QHjRx59.js";import"./ButtonIcon-NeuaoulJ.js";import"./Button-DcUmzCDo.js";import"./Label-DFDy7rWc.js";import"./Hidden-BHEINN-B.js";import"./useLabel-B3SXQ9nf.js";import"./useLabels-LZrLLl2Z.js";import"./useButton-kIYEhZRP.js";import"./usePress-IehbRc7n.js";import"./textSelection-BqsoCXBu.js";import"./getMetaValue-yJ3DJPKd.js";import"./index-CS0rKBQt.js";import"./Divider-Dw_AS9B-.js";import"./CodeSnippet-Dt3BOo_E.js";import"./useApp-BXGH6_Hd.js";import"./index-CKs39xo2.js";import"./WebStorage-1RhSaSCX.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-ZAIT2VOc.js";import"./useIsomorphicLayoutEffect-ClDuK9_t.js";import"./BUIProvider-uTHUz88Y.js";import"./useRouteRef-D_FKPlJ_.js";import"./index-BY3E6cHa.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const tt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,tt as __namedExportsOrder,et as default};
