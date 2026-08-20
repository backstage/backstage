import{bR as e,ca as o,a5 as h}from"./iframe-BHoENCVc.js";import{s as y,M as S}from"./api-C4r6jMvM.js";import{c as L}from"./SearchResult-wRQoFliL.js";import{S as s}from"./SearchResultList-CtIBHMvA.js";import{S as q}from"./SearchContext-C6nmYHla.js";import{L as f}from"./ListItemText-BRYjbmrS.js";import{H as x}from"./DefaultResultListItem-BUrrI1AA.js";import{C as j}from"./icons-Ce2UqL8l.js";import{O as P,a as C}from"./appWrappers-Bfq9ls44.js";import{L as w}from"./ListItem-CyAObhT7.js";import{L as A}from"./ListItemIcon-BRJcSF19.js";import{a as _}from"./Plugin-UlOKnMmC.js";import{S as R}from"./Grid-DQ6GJWoC.js";import{L as W}from"./Link-DbaMgic8.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Cx5c0pM3.js";import"./useAsync-DaAAM54v.js";import"./useMountedState-CS6T7kHD.js";import"./lodash-C1BWqHDU.js";import"./useElementFilter-D_VtjqXs.js";import"./componentData-BFK1FCBi.js";import"./List-BP5zaq_8.js";import"./ListContext-vBgF8v9C.js";import"./translation-DxvNqVZD.js";import"./EmptyState-VtNz28ut.js";import"./makeStyles-DPkHg9n9.js";import"./Progress-BT2fw4PY.js";import"./LinearProgress-C_-kgo4v.js";import"./Box-69iekKeq.js";import"./styled-DRPdZI7s.js";import"./ResponseErrorPanel-C3efgrs2.js";import"./ErrorPanel-5JzCMKOf.js";import"./WarningPanel-HXs-l0ct.js";import"./ExpandMore-BtXr0D_Z.js";import"./AccordionDetails-CpV5MvGv.js";import"./index-B9sM2jn7.js";import"./Collapse-DdtUoHqJ.js";import"./MarkdownContent-DFt8VKNH.js";import"./CodeSnippet-I1VgKYUJ.js";import"./CopyTextButton-D1NyuzKS.js";import"./useCopyToClipboard-C1eKfL6f.js";import"./Tooltip-DzM1tQjG.js";import"./useObjectRef-uSeYP5xn.js";import"./useOverlayTriggerState-Cx2c-3-p.js";import"./utils-CL0Z8V1C.js";import"./useFocusRing-MHb5XFUp.js";import"./openLink-DZP0UHC7.js";import"./number-CnfK_WTv.js";import"./I18nProvider-BHwrJH4v.js";import"./useControlledState--Wz_vfvx.js";import"./animation-D48GeWFv.js";import"./useHover-CPCQZiGU.js";import"./ButtonIcon-Dbucn7ko.js";import"./Button-BHRDpgL_.js";import"./Label-DlD4XAby.js";import"./Hidden-C6_e4Tzz.js";import"./useLabel-DLz-9M9H.js";import"./useLabels-Dx4Y77vh.js";import"./useButton-DPa3LWsd.js";import"./usePress-D96lUmWf.js";import"./textSelection-Di8U28Mz.js";import"./index-CXAyTdUW.js";import"./Divider-Sa-frcMZ.js";import"./useApp-D78Q1Dx1.js";import"./WebStorage-DQiA-S4e.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CYkRaHNa.js";import"./useIsomorphicLayoutEffect-BQX4Dz1t.js";import"./BUIProvider-BqojK_vt.js";import"./useResolvedHref-KjDbaJ0G.js";import"./useRouteRef-B9PFWjwA.js";import"./index-CwRuBl_7.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
