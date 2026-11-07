import{j as e,r as o,a3 as h}from"./iframe-DXL2wfUr.js";import{s as y,M as S}from"./api-DY6neQmk.js";import{c as L}from"./SearchResult-aec2op3r.js";import{S as s}from"./SearchResultList-duj2DjQ-.js";import{S as q}from"./SearchContext-B41gpUIB.js";import{L as f}from"./ListItemText-EBUOxn3r.js";import{H as x}from"./DefaultResultListItem-CeFh3fiC.js";import{C as j}from"./icons-CDmFvqhr.js";import{w as P,c as C}from"./appWrappers-DWsi2PsB.js";import{L as w}from"./ListItem-p8V-eNdP.js";import{L as A}from"./ListItemIcon-kHHFQnZ_.js";import{c as _}from"./Plugin-Cc0-ogKV.js";import{S as R}from"./Grid-BXM3QonJ.js";import{L as W}from"./Link-B77ip_ac.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BPKTxT6C.js";import"./useAsync-Cd65YFwz.js";import"./useMountedState-CQD-rq-n.js";import"./lodash-Dl1dFqKb.js";import"./useElementFilter-CoRALsSW.js";import"./componentData-CtlDd_rh.js";import"./List-CTh3iRsj.js";import"./ListContext-D7tGghNq.js";import"./translation-DTyRo-D5.js";import"./EmptyState-DjXpdCF_.js";import"./makeStyles-dq_iUTd0.js";import"./Progress-BhhCcDVs.js";import"./LinearProgress-kzeU_XqB.js";import"./Box-Brmk0yUT.js";import"./styled-CPtkZ7WM.js";import"./ResponseErrorPanel-DVwDYe73.js";import"./ErrorPanel-BkUTNdBe.js";import"./WarningPanel-CgFdixZY.js";import"./ExpandMore-BeL1yuy7.js";import"./AccordionDetails-VHP3o8bo.js";import"./index-B9sM2jn7.js";import"./Collapse-C1WK1tf6.js";import"./MarkdownContent-CLbP88ox.js";import"./CodeSnippet-Bz9vYZqv.js";import"./CopyTextButton-ClVimKvs.js";import"./useCopyToClipboard-DSSNv7Gj.js";import"./Tooltip-BJKgG_We.js";import"./useObjectRef-B4LXbu6C.js";import"./useOverlayTriggerState-CXXMw3IC.js";import"./utils-AUqHPGYf.js";import"./useFocusRing-Dz_6jVoa.js";import"./openLink-CjcP3ChZ.js";import"./number-BBGa0xxY.js";import"./I18nProvider-c1tBNH4d.js";import"./useControlledState-B45g810H.js";import"./animation-BTqVon43.js";import"./useHover-Ci84khs7.js";import"./ButtonIcon-QBhAzv3P.js";import"./Button-BhsXa_hO.js";import"./Label-CTSb-hLZ.js";import"./Hidden-MswoXlTM.js";import"./useLabel-Dw1khwQq.js";import"./useLabels-CUtKyTJZ.js";import"./useButton-n2_J4JRw.js";import"./usePress-DEPKiAoD.js";import"./textSelection-AY9oPxK_.js";import"./getMetaValue-BT-1afLR.js";import"./index-BXp_o7O6.js";import"./Divider-pUsur1_V.js";import"./useApp-B5hGsOxI.js";import"./WebStorage-tN-B8_3i.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Cvw6es2l.js";import"./useIsomorphicLayoutEffect-DjbJNnV2.js";import"./BUIProvider-BLX9Ljti.js";import"./BUIRoutingProvider-DnSIApiV.js";import"./useResolvedHref-C3ATKrxL.js";import"./useRouteRef-Bpqe7aet.js";import"./index-C-0D0ERV.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const st=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,st as __namedExportsOrder,rt as default};
