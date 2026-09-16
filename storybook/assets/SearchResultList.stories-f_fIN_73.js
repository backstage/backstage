import{bQ as e,c8 as o,a4 as h}from"./iframe-Bkld27Xv.js";import{s as y,M as S}from"./api-TH6zqA1p.js";import{c as L}from"./SearchResult-ChuqHEzL.js";import{S as s}from"./SearchResultList-BIpo9QGE.js";import{S as q}from"./SearchContext-BMieN8V8.js";import{L as f}from"./ListItemText-BqtvaA3J.js";import{H as x}from"./DefaultResultListItem-0sB19dKE.js";import{C as j}from"./icons-B1CCFwMa.js";import{O as P,a as C}from"./appWrappers-Kk9K4UG1.js";import{L as w}from"./ListItem-Df-rkWNj.js";import{L as A}from"./ListItemIcon--JkZcCwf.js";import{a as _}from"./Plugin-DTFe5i56.js";import{S as R}from"./Grid-NPf6_mtF.js";import{L as W}from"./Link-Gb2zw1eg.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DgzNfNA8.js";import"./useAsync-Ciu42EII.js";import"./useMountedState-tSzLaBrI.js";import"./lodash-B0aJYi5c.js";import"./useElementFilter-BuJzTmS2.js";import"./componentData-2LorLZQO.js";import"./List-B2gY9KR3.js";import"./ListContext-whwYHu0a.js";import"./translation-BhjK0qeG.js";import"./EmptyState-BXFKggJr.js";import"./makeStyles-c8tM0-Si.js";import"./Progress-BQ3LrRIs.js";import"./LinearProgress-CIwWIMCB.js";import"./Box-U7ly1rzl.js";import"./styled-Ckr-4rIS.js";import"./ResponseErrorPanel-DTnlYhSd.js";import"./ErrorPanel-BT-PQSDE.js";import"./WarningPanel-CQmY_mE9.js";import"./ExpandMore-9E7NU3_r.js";import"./AccordionDetails-CNTtopAw.js";import"./index-B9sM2jn7.js";import"./Collapse-Ly35HTAO.js";import"./MarkdownContent-CBD_YzTz.js";import"./CodeSnippet-BAb-CPDN.js";import"./CopyTextButton-60X9q-dG.js";import"./useCopyToClipboard-CXeRQixX.js";import"./Tooltip-BUUG8-Nl.js";import"./useObjectRef-hOSdhRq8.js";import"./useOverlayTriggerState-D0ayscvr.js";import"./utils-DEGlt2_H.js";import"./useFocusRing-Sg8Yc6Zc.js";import"./openLink-Dls5t0TL.js";import"./number-CQltgpBt.js";import"./I18nProvider-CcjFgoxB.js";import"./useControlledState-BDm5gUq3.js";import"./animation-CJ47w7Fx.js";import"./useHover-BTVKyR5u.js";import"./ButtonIcon-BmtQzhOx.js";import"./Button-Dq2R9N9l.js";import"./Label-CzzbJTkN.js";import"./Hidden-CJz8ByQd.js";import"./useLabel-D1T8LrYx.js";import"./useLabels-DgACLhvG.js";import"./useButton-CPwh7t0a.js";import"./usePress-Bi6q7Yb-.js";import"./textSelection-BI78VxK7.js";import"./index--5rDCIj_.js";import"./Divider-Ct__Pu1F.js";import"./useApp-BeXbzCkx.js";import"./WebStorage-dVVBLCSt.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-KL69k-0O.js";import"./useIsomorphicLayoutEffect-2h0McDmQ.js";import"./BUIProvider-CZxZ_ya5.js";import"./BUIRoutingProvider-kRMOb9Tv.js";import"./useResolvedHref-69pkV9Nv.js";import"./useRouteRef-YwVR45xu.js";import"./index-CzJgrKEb.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
