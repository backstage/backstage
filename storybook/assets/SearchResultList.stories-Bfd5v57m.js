import{bR as e,ca as o,a5 as h}from"./iframe-Bfeun6FV.js";import{s as y,M as S}from"./api-zlQ-erVe.js";import{c as L}from"./SearchResult-D9NNTe-X.js";import{S as s}from"./SearchResultList-BT5lEtdc.js";import{S as q}from"./SearchContext-BgiFWYed.js";import{L as f}from"./ListItemText-BA03E3jC.js";import{H as x}from"./DefaultResultListItem-zDj5cxF4.js";import{C as j}from"./icons-BoK5SufQ.js";import{O as P,a as C}from"./appWrappers-B8UGm4an.js";import{L as w}from"./ListItem-CVsqLCjK.js";import{L as A}from"./ListItemIcon-Cc2Ii60F.js";import{a as _}from"./Plugin-DHp63wUt.js";import{S as R}from"./Grid-DpcxvWnM.js";import{L as W}from"./Link-Ck5B18Ox.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BM8yTVVe.js";import"./useAsync-Brb_wdOh.js";import"./useMountedState-BD7hbG-Z.js";import"./lodash-BgRn0AvU.js";import"./useElementFilter-DA5Bx2Pb.js";import"./componentData-CeN5KGeH.js";import"./List-Be5BF-4X.js";import"./ListContext-xaY7-bAc.js";import"./translation-XEs0JwZ5.js";import"./EmptyState-BQYd7Ffl.js";import"./makeStyles-C7fNhz2-.js";import"./Progress-BLHpA0vx.js";import"./LinearProgress-Cy-7wBZH.js";import"./Box-VVBVNoPf.js";import"./styled-tsuVmXB5.js";import"./ResponseErrorPanel-5QPV6HD8.js";import"./ErrorPanel-wH3aTGgG.js";import"./WarningPanel-Bh_JLXft.js";import"./ExpandMore-D8FI7LLa.js";import"./AccordionDetails-C3kQn4qo.js";import"./index-B9sM2jn7.js";import"./Collapse-COymxWJx.js";import"./MarkdownContent-BMUIE5i7.js";import"./CodeSnippet-J4dETvm2.js";import"./CopyTextButton-CxOzeIL9.js";import"./useCopyToClipboard-DkiEyTWi.js";import"./Tooltip-BAHNPtWJ.js";import"./useObjectRef-DpvjfcTN.js";import"./useOverlayTriggerState-DF5r881j.js";import"./utils-C1fACjU5.js";import"./useFocusRing-D2D9w2h7.js";import"./openLink-Z9FeXa0N.js";import"./number-3AeMSo45.js";import"./I18nProvider-TylybwwN.js";import"./useControlledState-CC8JDBnw.js";import"./animation-DPrX5Bmr.js";import"./useHover-Bl99Bvws.js";import"./ButtonIcon-Dk4ShQ2Z.js";import"./Button-CXBJEZu8.js";import"./Label-CMwfur8h.js";import"./Hidden-sFV-2aQN.js";import"./useLabel-fE5WpueX.js";import"./useLabels-ClA9bczX.js";import"./useButton-35EaW1qC.js";import"./usePress-TbacPce5.js";import"./textSelection-DZyb17vv.js";import"./index-CVNQhIDx.js";import"./Divider-9p1EUYx5.js";import"./useApp-CxJ04SgY.js";import"./WebStorage-CPTg-TPv.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DQnr_CRj.js";import"./useIsomorphicLayoutEffect-DKlU5upP.js";import"./BUIProvider-B3JZ5_CR.js";import"./useResolvedHref-C1ukixa2.js";import"./useRouteRef-D0JCAodS.js";import"./index-Bj4M52Zv.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
