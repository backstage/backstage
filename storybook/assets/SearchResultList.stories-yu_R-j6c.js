import{bQ as e,c8 as o,a4 as h}from"./iframe-J3scbCK7.js";import{s as y,M as S}from"./api-D8m-lJm-.js";import{c as L}from"./SearchResult-DL2HSJIO.js";import{S as s}from"./SearchResultList-C2JlHt0d.js";import{S as q}from"./SearchContext-C3jeQQEF.js";import{L as f}from"./ListItemText-DKunB6f2.js";import{H as x}from"./DefaultResultListItem-B_mQ4_MG.js";import{C as j}from"./icons-zTxai8C4.js";import{O as P,a as C}from"./appWrappers-CN9SIPB5.js";import{L as w}from"./ListItem-B5Wpm8B5.js";import{L as A}from"./ListItemIcon-BEyOM1e0.js";import{a as _}from"./Plugin-C7wXDwVU.js";import{S as R}from"./Grid-BOYW9g7Y.js";import{L as W}from"./Link-B5rKxH23.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-B_NPlYH5.js";import"./useAsync-DEWxXDQm.js";import"./useMountedState-B356xsyg.js";import"./lodash-CTYyc8_x.js";import"./useElementFilter-DRtKoou8.js";import"./componentData-Bn1nm_bO.js";import"./List-CuJDX_kH.js";import"./ListContext-BFUyXz-d.js";import"./translation-DSyklJEG.js";import"./EmptyState-RaF4dlpC.js";import"./makeStyles-D29HlZax.js";import"./Progress-DwgKu_0D.js";import"./LinearProgress-BnCZKPDo.js";import"./Box-CAvHx8RQ.js";import"./styled-VY2eV-L4.js";import"./ResponseErrorPanel-B_nSIbKt.js";import"./ErrorPanel-Btsx6J0H.js";import"./WarningPanel-BbywA0GE.js";import"./ExpandMore-eh3mRtPp.js";import"./AccordionDetails-COl426Gb.js";import"./index-B9sM2jn7.js";import"./Collapse-Bf-5GB7B.js";import"./MarkdownContent-CziNpqFO.js";import"./CodeSnippet-D548JLic.js";import"./CopyTextButton-uT95cKbu.js";import"./useCopyToClipboard-C1B8_neO.js";import"./Tooltip-gmbmHZ4e.js";import"./useObjectRef-CYiyNzgW.js";import"./useOverlayTriggerState-Djk9kxal.js";import"./utils-CXCc_oGJ.js";import"./useFocusRing-lNGJkQ5U.js";import"./openLink-BYbBBzFI.js";import"./number-B1XZmGQH.js";import"./I18nProvider-BmKrAj2D.js";import"./useControlledState-DShAbZI7.js";import"./animation-CIWnDDLd.js";import"./useHover-CwRlhx06.js";import"./ButtonIcon-DjGciNd5.js";import"./Button-BRjZSFG-.js";import"./Label-CZdg3p-k.js";import"./Hidden-RMOzfft_.js";import"./useLabel-CdAWakw3.js";import"./useLabels-tuukLlho.js";import"./useButton-Dz9TOBMM.js";import"./usePress-oQ0Te5kE.js";import"./textSelection-QyuURRcd.js";import"./index-dtgEZu1w.js";import"./Divider-BltfAChQ.js";import"./useApp-BFoiUE5i.js";import"./WebStorage-DcpkP_qv.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BuUJlFTQ.js";import"./useIsomorphicLayoutEffect-BlFa-1xv.js";import"./BUIProvider-BM3j6qBn.js";import"./BUIRoutingProvider-jvw1N9sz.js";import"./useResolvedHref-D6E2eFAl.js";import"./useRouteRef-CBV9tzF7.js";import"./index-0GTWXkVd.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
