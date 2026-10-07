import{j as e,r as o,a3 as h}from"./iframe-WUTgIN9N.js";import{s as y,M as S}from"./api-BjbWyhwg.js";import{c as L}from"./SearchResult-iygsi13R.js";import{S as s}from"./SearchResultList-PMKQw1uh.js";import{S as q}from"./SearchContext-CLp44Lpp.js";import{L as f}from"./ListItemText-zrcvi365.js";import{H as x}from"./DefaultResultListItem-BrL5smVC.js";import{C as j}from"./icons-DOeFt2k5.js";import{w as P,c as C}from"./appWrappers-Bbe0n_Zp.js";import{L as w}from"./ListItem-CuOMG44s.js";import{L as A}from"./ListItemIcon-pntrBOj-.js";import{c as _}from"./Plugin-CMnDNdo9.js";import{S as R}from"./Grid-QAEhh-IU.js";import{L as W}from"./Link-CuRGlsNT.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-gQW0QBIW.js";import"./useAsync-KKA-Wjg0.js";import"./useMountedState-hBsZdgf2.js";import"./lodash-Dgk92AEG.js";import"./useElementFilter-DFVcNX9X.js";import"./componentData-n4SXAURB.js";import"./List-BwP59E3R.js";import"./ListContext-CASXpzwL.js";import"./translation-DWaK4w8x.js";import"./EmptyState-Di88SFHG.js";import"./makeStyles-D1P9beTg.js";import"./Progress-Dky405yl.js";import"./LinearProgress-JGrw-vzi.js";import"./Box-Dz1w66KV.js";import"./styled-DY6u-KGu.js";import"./ResponseErrorPanel-DeP_TbZm.js";import"./ErrorPanel-CkOctCWY.js";import"./WarningPanel-Sxu00y49.js";import"./ExpandMore-DIy80QFO.js";import"./AccordionDetails-DFhVCqjY.js";import"./index-B9sM2jn7.js";import"./Collapse-CE1N4KeO.js";import"./MarkdownContent-0-vvjMKh.js";import"./CodeSnippet-BPpVm8z0.js";import"./CopyTextButton-CCvx3icw.js";import"./useCopyToClipboard-C9AH3TNR.js";import"./Tooltip-1KTus1LO.js";import"./useObjectRef-CHIArbS8.js";import"./useOverlayTriggerState-Cw8HJspH.js";import"./utils-e_ANvV3R.js";import"./useFocusRing-BzNQUgBS.js";import"./openLink-C4ChH1Hb.js";import"./number-QltqjbkG.js";import"./I18nProvider-DmKJ1bjB.js";import"./useControlledState-CP3bPIEi.js";import"./animation-gc98-Tq1.js";import"./useHover-BXi1yiSF.js";import"./ButtonIcon-CBUq3vfF.js";import"./Button-uNEF8Zyb.js";import"./Label-DYgvNgnu.js";import"./Hidden-cqxb7NEw.js";import"./useLabel-BntByxux.js";import"./useLabels-DVXgHCjp.js";import"./useButton-D7XqHIUl.js";import"./usePress-BuMIReV1.js";import"./textSelection-DRp-kAWi.js";import"./index-BmfM_P7U.js";import"./Divider-LpG7fity.js";import"./useApp-C9iKSsIv.js";import"./WebStorage-BUgSkFbv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D0n64vxR.js";import"./useIsomorphicLayoutEffect-Ca8UfJIg.js";import"./BUIProvider-WuPWvIl5.js";import"./BUIRoutingProvider-CNPvymuD.js";import"./useResolvedHref--v0iYvrv.js";import"./useRouteRef-QuyDC0sL.js";import"./index-DBvvfb3N.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
