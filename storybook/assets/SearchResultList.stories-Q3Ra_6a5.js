import{bQ as e,c8 as o,a4 as h}from"./iframe-JPiukB_R.js";import{s as y,M as S}from"./api-Dnl55U7v.js";import{c as L}from"./SearchResult-CvqNvPhK.js";import{S as s}from"./SearchResultList-ZmIHpIjC.js";import{S as q}from"./SearchContext-Dz4cHLmQ.js";import{L as f}from"./ListItemText-D-VVQSJ3.js";import{H as x}from"./DefaultResultListItem-jw4WY8Yn.js";import{C as j}from"./icons-OTfaoXib.js";import{O as P,a as C}from"./appWrappers-CIJES5cn.js";import{L as w}from"./ListItem-Bq2ZKbAR.js";import{L as A}from"./ListItemIcon-DTCvXVFX.js";import{a as _}from"./Plugin-CSpq1331.js";import{S as R}from"./Grid-CNTu3jbM.js";import{L as W}from"./Link-C3f28ZV-.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-D8KrhC1p.js";import"./useAsync-Dxe8QY4C.js";import"./useMountedState-Do2NdkuI.js";import"./lodash-6cxX-S9O.js";import"./useElementFilter-Bh-rvpes.js";import"./componentData-Bmd6ICL1.js";import"./List-T_3_nzLY.js";import"./ListContext-DVVZhWT2.js";import"./translation-BeWpPlUQ.js";import"./EmptyState-DRUmJ9wT.js";import"./makeStyles-CRHqG-EO.js";import"./Progress-nERDt7RZ.js";import"./LinearProgress-BaiICpeO.js";import"./Box-B2a9eHDH.js";import"./styled-DQnat59B.js";import"./ResponseErrorPanel-XZTC_3Fa.js";import"./ErrorPanel-D8xJcORe.js";import"./WarningPanel-omqd1JgS.js";import"./ExpandMore-BkSBOuu1.js";import"./AccordionDetails-ZblsgKn7.js";import"./index-B9sM2jn7.js";import"./Collapse-C9D40sA-.js";import"./MarkdownContent-CKtPazSD.js";import"./CodeSnippet-CtzanSn-.js";import"./CopyTextButton-CnsymFaI.js";import"./useCopyToClipboard-Cve9BWk7.js";import"./Tooltip-DAMzI_jU.js";import"./useObjectRef-DXVQTGA8.js";import"./useOverlayTriggerState-D8Agx5ZP.js";import"./utils-DDi5xxmN.js";import"./useFocusRing-DaX8_kMK.js";import"./openLink-0QZlDlxj.js";import"./number-G04hMwQn.js";import"./I18nProvider-DFp_bXrB.js";import"./useControlledState-BQx1jdRH.js";import"./animation-0YAkd_Wy.js";import"./useHover-BNLW-94k.js";import"./ButtonIcon-DQjFZlPD.js";import"./Button-DEJ5jMKU.js";import"./Label-IokeRjbO.js";import"./Hidden-B-d7XQtl.js";import"./useLabel-D_mWupuI.js";import"./useLabels-NEKiuqWd.js";import"./useButton-CuUkU0tZ.js";import"./usePress-BL8d4Qht.js";import"./textSelection-DFCD4j4A.js";import"./index-DFKLNzc2.js";import"./Divider-DtYbuN8a.js";import"./useApp-XQFXwPZE.js";import"./WebStorage-BeyKAHX6.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Bpb3Dkjw.js";import"./useIsomorphicLayoutEffect-Bt_JK7Bt.js";import"./BUIProvider-DNlcrhsv.js";import"./BUIRoutingProvider-BiCU-bXq.js";import"./useResolvedHref--qUd8mWw.js";import"./useRouteRef-B3KEyANy.js";import"./index-D_sl5V-c.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
