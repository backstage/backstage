import{bR as e,ca as o,a5 as h}from"./iframe-C134ftd_.js";import{s as y,M as S}from"./api-CPsHm4gf.js";import{c as L}from"./SearchResult-BBRi8Cmp.js";import{S as s}from"./SearchResultList-BNbD0JqH.js";import{S as q}from"./SearchContext-DA3fIIED.js";import{L as f}from"./ListItemText-Bb6qYYVt.js";import{H as x}from"./DefaultResultListItem-BgzHRieh.js";import{C as j}from"./icons-CKPs4tNr.js";import{O as P,a as C}from"./appWrappers-CYF3DtQX.js";import{L as w}from"./ListItem-B0l09fOa.js";import{L as A}from"./ListItemIcon-BO2wCJlX.js";import{a as _}from"./Plugin-NkQJC-mx.js";import{S as R}from"./Grid-CBiX0ZUm.js";import{L as W}from"./Link-DnEb87hH.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DewmQACP.js";import"./useAsync-BcQkgAoG.js";import"./useMountedState-1kmEE_UD.js";import"./lodash-C9xihbHM.js";import"./useElementFilter-Du_JtGEa.js";import"./componentData-Cr7Bcv9D.js";import"./List-b2RWxkMS.js";import"./ListContext-XGHpPVu8.js";import"./translation-Dq5766zw.js";import"./EmptyState-B43fq52U.js";import"./makeStyles-lroa90Fn.js";import"./Progress-BHVGG9Rp.js";import"./LinearProgress-DVUZB4II.js";import"./Box-DOMgNM1H.js";import"./styled-Caou-WSS.js";import"./ResponseErrorPanel-CdxrbVWO.js";import"./ErrorPanel-D9_O3Mb8.js";import"./WarningPanel-BEjel2_A.js";import"./ExpandMore-m646q1EQ.js";import"./AccordionDetails-B-tBpDuX.js";import"./index-B9sM2jn7.js";import"./Collapse-LIBH1A2u.js";import"./MarkdownContent-Dub0LeyB.js";import"./CodeSnippet-C5qbT8cu.js";import"./CopyTextButton-Bu25i5Q6.js";import"./useCopyToClipboard-NQjxIXEr.js";import"./Tooltip-tSI9KshH.js";import"./useObjectRef-CpAZkPjD.js";import"./useOverlayTriggerState-CWuf6Tnn.js";import"./utils-ZhLQjZIu.js";import"./useFocusRing-CEbL5n3V.js";import"./openLink-CXjQqT5j.js";import"./number-DOH9yOte.js";import"./I18nProvider-C3aQlN23.js";import"./useControlledState-BrUi6TrE.js";import"./animation-D0n23P1z.js";import"./useHover-crLX5QKB.js";import"./ButtonIcon-RiLYN9tl.js";import"./Button-DokUs05S.js";import"./Label-NvoSwhWO.js";import"./Hidden-Bciv724x.js";import"./useLabel-BlNKan1O.js";import"./useLabels-DE_o1GVW.js";import"./useButton-DhiKPbl2.js";import"./usePress-DEZzIpor.js";import"./textSelection-DpSIhvEg.js";import"./index-CFfinTmq.js";import"./Divider-CUN2kH8H.js";import"./useApp-aYIlvwkE.js";import"./WebStorage-Cc7y5dRu.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-d0seJLyF.js";import"./useIsomorphicLayoutEffect-BbaT80Md.js";import"./BUIProvider-B4jZ-KWm.js";import"./useResolvedHref-BJj8JYmh.js";import"./useRouteRef-IkuW64IK.js";import"./index-XQ83uw43.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
