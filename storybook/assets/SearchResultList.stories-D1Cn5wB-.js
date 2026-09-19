import{j as e,r as o,a3 as h}from"./iframe-DIcQvc_4.js";import{s as y,M as S}from"./api-C7WePtKH.js";import{c as L}from"./SearchResult-DAr4FSeZ.js";import{S as s}from"./SearchResultList-DqB54Mc1.js";import{S as q}from"./SearchContext-CxW5_fp6.js";import{L as f}from"./ListItemText-BHjQ7-pc.js";import{H as x}from"./DefaultResultListItem-BPxLYo9E.js";import{C as j}from"./icons-DCz_PjQ1.js";import{w as P,c as C}from"./appWrappers-BlasAhwh.js";import{L as w}from"./ListItem-BlT-_Dx7.js";import{L as A}from"./ListItemIcon-BIlzX1AU.js";import{c as _}from"./Plugin-BDRCT-8s.js";import{S as R}from"./Grid-oLNTG-1m.js";import{L as W}from"./Link-CNvpICkX.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CkzkVu-R.js";import"./useAsync-Db8OzfTM.js";import"./useMountedState-BCWjikTD.js";import"./lodash-D5XEdOes.js";import"./useElementFilter-CjIiq6k5.js";import"./componentData-C49Tx7W9.js";import"./List-Bi7BJlgZ.js";import"./ListContext-5lse5t1A.js";import"./translation-Bj24Tpl3.js";import"./EmptyState-D2O5G_w2.js";import"./makeStyles-CSt6JC-p.js";import"./Progress-Uy8_v8MN.js";import"./LinearProgress-DjlcGQjo.js";import"./Box-D_uAdcR5.js";import"./styled-CMENgzGI.js";import"./ResponseErrorPanel-DGEQPVQ-.js";import"./ErrorPanel-CiCq8LYk.js";import"./WarningPanel-CVVHprcv.js";import"./ExpandMore-BVDi44YU.js";import"./AccordionDetails-CHyDv55k.js";import"./index-B9sM2jn7.js";import"./Collapse-D4zspPfO.js";import"./MarkdownContent-CSu_nZsI.js";import"./CodeSnippet-CCMCtViW.js";import"./CopyTextButton-D5_X-SOz.js";import"./useCopyToClipboard-CWZEHZcM.js";import"./Tooltip-BBfUIfIG.js";import"./useObjectRef-CQfKhSp8.js";import"./useOverlayTriggerState-ovQ1kmtR.js";import"./utils-JYodRznf.js";import"./useFocusRing-C4tfuByP.js";import"./openLink-BR6QeS5d.js";import"./number-D2azkskk.js";import"./I18nProvider-BUw0KQ7A.js";import"./useControlledState-CaCljqv7.js";import"./animation-B_Bf72uX.js";import"./useHover-CrozpiDB.js";import"./ButtonIcon-BVlPIGD0.js";import"./Button-C4PGOc91.js";import"./Label-CLke59gh.js";import"./Hidden-BBwtWmDi.js";import"./useLabel-BYY4_2g1.js";import"./useLabels-ITbgZNHU.js";import"./useButton-QYfWJvVm.js";import"./usePress-BIUzH6ox.js";import"./textSelection-DrSKaTGN.js";import"./index-DeTGLoK4.js";import"./Divider-D1lUtq2J.js";import"./useApp-CpeMA22u.js";import"./WebStorage-CQcMlGkG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DzFmSdlL.js";import"./useIsomorphicLayoutEffect-vypdBdWX.js";import"./BUIProvider-DxF_USOs.js";import"./BUIRoutingProvider-gwQ9m4v_.js";import"./useResolvedHref-9YFlmop0.js";import"./useRouteRef-CQ84ZA-i.js";import"./index--onu0eIM.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
