import{bQ as e,c8 as o,a4 as h}from"./iframe-CLUDVQ5J.js";import{s as y,M as S}from"./api-B4wJcCtj.js";import{c as L}from"./SearchResult-Dqsms3LL.js";import{S as s}from"./SearchResultList-BNirTzn-.js";import{S as q}from"./SearchContext-Bal95pIH.js";import{L as f}from"./ListItemText-CHRQEXCC.js";import{H as x}from"./DefaultResultListItem-12UA3ySn.js";import{C as j}from"./icons-mCvxT9ex.js";import{O as P,a as C}from"./appWrappers-M16_5XTi.js";import{L as w}from"./ListItem-Dh8Rtio2.js";import{L as A}from"./ListItemIcon-HvIIjV2K.js";import{a as _}from"./Plugin-CmwiTpHp.js";import{S as R}from"./Grid-D50qQlpO.js";import{L as W}from"./Link-BhsWtFDr.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CzwPeQ36.js";import"./useAsync-D1OU5X-I.js";import"./useMountedState-tSS_CzU1.js";import"./lodash-CdFrZFKb.js";import"./useElementFilter-bZKxdEZ7.js";import"./componentData-BtngvXCx.js";import"./List-iHDmihoL.js";import"./ListContext-NBUZM1XF.js";import"./translation-Db2GWsXQ.js";import"./EmptyState-hI9QfSXn.js";import"./makeStyles-C-SzIQdx.js";import"./Progress-DOOWqObw.js";import"./LinearProgress-DqTE4MLd.js";import"./Box-DcD5c5-B.js";import"./styled-hgTb5-qM.js";import"./ResponseErrorPanel-DN4Jilhi.js";import"./ErrorPanel-DZOoudER.js";import"./WarningPanel-B0VO6nyZ.js";import"./ExpandMore-JNID2q_8.js";import"./AccordionDetails-DOQ580-r.js";import"./index-B9sM2jn7.js";import"./Collapse-BCjN4UZr.js";import"./MarkdownContent-CXhXmNdS.js";import"./CodeSnippet-dQxR7JI3.js";import"./CopyTextButton-WI5gcQHm.js";import"./useCopyToClipboard-DNcv9faM.js";import"./Tooltip-BgYCttf5.js";import"./useObjectRef-CQXTcWYX.js";import"./useOverlayTriggerState-CQGaE1Jp.js";import"./utils-CdHRLi7C.js";import"./useFocusRing-Cx5cCMJc.js";import"./openLink-lG-tuZVC.js";import"./number-CoCtNFQ5.js";import"./I18nProvider-s5nF7SKo.js";import"./useControlledState-CzVtswPQ.js";import"./animation-o_HaFoft.js";import"./useHover-DTy99tks.js";import"./ButtonIcon-oVA306rU.js";import"./Button-BmqzM9an.js";import"./Label-CNIOxAyj.js";import"./Hidden-DkhqOV0y.js";import"./useLabel-CjwBUe0X.js";import"./useLabels-q6j7b-So.js";import"./useButton-D_vL7KO0.js";import"./usePress-jgC8cslr.js";import"./textSelection-BVXh5k5C.js";import"./index-CCFrD1rS.js";import"./Divider-Bosz2hZb.js";import"./useApp-DKdDpZNp.js";import"./WebStorage-DmGZDQrQ.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-KM6kHiFR.js";import"./useIsomorphicLayoutEffect-CzSm6uOM.js";import"./BUIProvider-C0zgFkPZ.js";import"./BUIRoutingProvider-BRX0aVpd.js";import"./useResolvedHref-BjPkToeD.js";import"./useRouteRef-DMkGEaYT.js";import"./index-ceSBD9fz.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
