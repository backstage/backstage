import{bR as e,ca as o,a5 as h}from"./iframe-BT856zKW.js";import{s as y,M as S}from"./api-UyhTl0Re.js";import{c as L}from"./SearchResult-BWUdStak.js";import{S as s}from"./SearchResultList-Cf1WJES5.js";import{S as q}from"./SearchContext-D2y__VNn.js";import{L as f}from"./ListItemText-CU2-oZ6m.js";import{H as x}from"./DefaultResultListItem-BsKv-2DG.js";import{C as j}from"./icons-BuBPb2Qg.js";import{O as P,a as C}from"./appWrappers-B9ReHvUd.js";import{L as w}from"./ListItem-CB-Gvt6Y.js";import{L as A}from"./ListItemIcon-CBftgBYY.js";import{a as _}from"./Plugin-Ct0RFgWb.js";import{S as R}from"./Grid-BxchgH-S.js";import{L as W}from"./Link-R-hp-ZLy.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DNoiAALH.js";import"./useAsync-Bcz2H1Jw.js";import"./useMountedState-8KNWpExT.js";import"./lodash-BVPr3iau.js";import"./useElementFilter-yVtWo2jj.js";import"./componentData-BoUGJzhp.js";import"./List-IEeojV8D.js";import"./ListContext-SRmSumki.js";import"./translation-XXnJEosT.js";import"./EmptyState-DA1-XbUM.js";import"./makeStyles-BvvLmOsG.js";import"./Progress-ART2Vv7_.js";import"./LinearProgress-BkhRcbWK.js";import"./Box-DRDGYh8a.js";import"./styled-CRVzAmQX.js";import"./ResponseErrorPanel-BEi_4ZP1.js";import"./ErrorPanel-Toi3e49m.js";import"./WarningPanel-C8IMyBHC.js";import"./ExpandMore-BfOktmc8.js";import"./AccordionDetails-BlOaekJ7.js";import"./index-B9sM2jn7.js";import"./Collapse-C5HLlfSB.js";import"./MarkdownContent-DWz31GUq.js";import"./CodeSnippet-DQQbvAWJ.js";import"./CopyTextButton-DUrzruX8.js";import"./useCopyToClipboard-CkPuwwln.js";import"./Tooltip-o3hefnT9.js";import"./useObjectRef-C9B7I4dA.js";import"./useOverlayTriggerState-jSPLUxR-.js";import"./utils-CpwCIt4g.js";import"./useFocusRing-BT_-10ZK.js";import"./openLink-cidOSJP4.js";import"./number-DEPRmkya.js";import"./I18nProvider-D0MkpVu-.js";import"./useControlledState-B8MFkE-b.js";import"./animation-D-E6JIW4.js";import"./useHover-qIfqE_w_.js";import"./ButtonIcon-D9H8Rxke.js";import"./Button-C7kwpLvK.js";import"./Label-DWhvkKMc.js";import"./Hidden-49UROW8g.js";import"./useLabel-4EIIh35K.js";import"./useLabels-mD4IPMLK.js";import"./useButton-BY1LIf6_.js";import"./usePress-D8DHmOrO.js";import"./textSelection-BbGtchwD.js";import"./index-DX-mGHlN.js";import"./Divider-BC_qSnbz.js";import"./useApp-Cpkvybk9.js";import"./WebStorage-CA_OBbyQ.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CIuM5PCN.js";import"./useIsomorphicLayoutEffect-s3nrltr1.js";import"./BUIProvider-ji7JuJVK.js";import"./useResolvedHref-D25t_NXC.js";import"./useRouteRef-0a-P5QPl.js";import"./index-DQwWzZ9l.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
