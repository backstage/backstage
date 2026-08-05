import{bR as e,ca as o,a5 as h}from"./iframe-B8uJzJnC.js";import{s as y,M as S}from"./api-EJdcO3Kb.js";import{c as L}from"./SearchResult-C_16mEic.js";import{S as s}from"./SearchResultList-KFU5LWtV.js";import{S as q}from"./SearchContext-DAt3uNwn.js";import{L as f}from"./ListItemText-dB0fGlEm.js";import{H as x}from"./DefaultResultListItem-DLTzt6s6.js";import{C as j}from"./icons-CMsJjwLV.js";import{O as P,a as C}from"./appWrappers-jqPKU8m4.js";import{L as w}from"./ListItem-BUvXVTsE.js";import{L as A}from"./ListItemIcon-Cey2zalD.js";import{a as _}from"./Plugin-DkDxTppg.js";import{S as R}from"./Grid-oRgMNHPR.js";import{L as W}from"./Link-p9F1wzce.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DmS_ziXv.js";import"./useAsync-TaeDQlC6.js";import"./useMountedState-kS2pBaHK.js";import"./lodash-D9y7SekR.js";import"./useElementFilter-jV1XxsjG.js";import"./componentData-Bvjt-BZH.js";import"./List-jJMlgd41.js";import"./ListContext-DB1EvxRt.js";import"./translation-BtKHFUt2.js";import"./EmptyState-Dfh7q_Ou.js";import"./makeStyles-CENq9NVb.js";import"./Progress-D3GWNdiW.js";import"./LinearProgress-sH4jCZww.js";import"./Box-C1vqOm76.js";import"./styled-BF0ejy4K.js";import"./ResponseErrorPanel-Qf9yuujb.js";import"./ErrorPanel-DILd_YuW.js";import"./WarningPanel-BGtN9eHQ.js";import"./ExpandMore-h74Mv7eG.js";import"./AccordionDetails-LfQ1yJlW.js";import"./index-B9sM2jn7.js";import"./Collapse-Dyw97_4a.js";import"./MarkdownContent-8tODnh51.js";import"./CodeSnippet-DNlCYf73.js";import"./CopyTextButton-Dj8SLSVe.js";import"./useCopyToClipboard-COvIt86Q.js";import"./Tooltip-Gmp_C_i_.js";import"./useObjectRef-B58w8bQG.js";import"./useOverlayTriggerState-DCu5HTgY.js";import"./utils-C9WtHl0n.js";import"./useFocusRing-uHGre-No.js";import"./openLink-BUwh7SN8.js";import"./number-Cc-kUzHo.js";import"./I18nProvider-BAFWouLl.js";import"./useControlledState-Bsv8jzCO.js";import"./animation-DAXhfvHs.js";import"./useHover-CGBJrmnR.js";import"./ButtonIcon-DXDifQ2F.js";import"./Button-9hcql9Z1.js";import"./Label-B8rV63W8.js";import"./Hidden--CtbbQAG.js";import"./useLabel-DuQ-sB8F.js";import"./useLabels-vvtSY4r8.js";import"./useButton-B84fiS4B.js";import"./usePress-z5JJKJO5.js";import"./textSelection-COVkqnKL.js";import"./index-C3TndV9r.js";import"./Divider-CPt0w2jx.js";import"./useApp-Crzm4FAT.js";import"./WebStorage-D83Ek40K.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DJYSpznI.js";import"./useIsomorphicLayoutEffect-C-N-_QA0.js";import"./BUIProvider-B485Y6HT.js";import"./useResolvedHref-CVch4iPG.js";import"./useRouteRef-B7cWRPgM.js";import"./index-CrkExXws.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
