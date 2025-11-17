import{j as e,T as h,r as o}from"./iframe-CIM5duhm.js";import{s as y,M as S}from"./api-Bslp_G49.js";import{c as L}from"./SearchResult-hfztOhEZ.js";import{S as s}from"./SearchResultList-BbVaIlZp.js";import{S as R}from"./Grid-Duc3jmgA.js";import{S as q}from"./SearchContext-Gzflvs0o.js";import{L as f}from"./ListItemText-BZPfuyb-.js";import{H as x}from"./DefaultResultListItem-DLhwsFX5.js";import{C as j}from"./icons-DfffA5bC.js";import{L as P}from"./ListItem-C8QkAD_t.js";import{L as C}from"./ListItemIcon-DLWEhI4p.js";import{w,c as A}from"./appWrappers-C9XZWfKp.js";import{c as _}from"./Plugin-BahgJ1_U.js";import{L as W}from"./Link-DCWBCw0R.js";import"./preload-helper-D9Z9MdNV.js";import"./useAsync-BVaj5mJ5.js";import"./useMountedState-BMP6C5TD.js";import"./lodash-CwBbdt2Q.js";import"./List-CGOBvW-t.js";import"./ListContext-BKDMM4_S.js";import"./useElementFilter-BYCU1PRW.js";import"./componentData-CysmgvuR.js";import"./useAnalytics-BRyHidSV.js";import"./translation-Mg0wxjS2.js";import"./EmptyState-C_SssmXd.js";import"./Progress-ClQKxc2a.js";import"./LinearProgress-CI_prkB1.js";import"./Box-BD8Uu_7H.js";import"./styled-Co6KhZ4u.js";import"./ResponseErrorPanel-Bur4Xeqn.js";import"./ErrorPanel-CfBA3Rnk.js";import"./WarningPanel-4pT00iVw.js";import"./ExpandMore-D2DOioK9.js";import"./AccordionDetails-D4PSfG9Y.js";import"./index-DnL3XN75.js";import"./Collapse-BWkOwJIQ.js";import"./MarkdownContent-C54rNlBp.js";import"./CodeSnippet-C2ptadrL.js";import"./CopyTextButton-DEGdjETq.js";import"./useCopyToClipboard-CcN5gAoC.js";import"./Tooltip-DHuqselR.js";import"./Popper-Bdhv-Ri7.js";import"./Portal-6z5sMs7a.js";import"./Divider-DA-kCS2y.js";import"./useApp-DECMHJKF.js";import"./useObservable-phC6TcCN.js";import"./useIsomorphicLayoutEffect-CFVY4_Ue.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-eXSQF74E.js";import"./useRouteRef-BRIN7ftV.js";const v=A({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),Ne={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>w(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})]},i=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:n,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(P,{alignItems:"flex-start",divider:!0,children:[n&&e.jsx(C,{children:n}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:n,document:r,highlight:g,rank:I})=>{switch(n){case"custom":return e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location);default:return e.jsx(x,{result:r},r.location)}}})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>;
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const De=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{i as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,De as __namedExportsOrder,Ne as default};
