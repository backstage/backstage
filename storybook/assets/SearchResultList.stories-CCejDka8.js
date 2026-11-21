import{j as e,r as o,X as h}from"./iframe-SO2aIStn.js";import{s as y,M as S}from"./api-Cq6OAgJL.js";import{c as L}from"./SearchResult-gBhq22Q4.js";import{S as s}from"./SearchResultList-Br-Is-7J.js";import{S as q}from"./SearchContext-DolnY6vn.js";import{L as f}from"./ListItemText-DcPsx7kL.js";import{H as x}from"./DefaultResultListItem-1hOuLjJB.js";import{C as j}from"./icons-DLJnnvME.js";import{w as P,c as C}from"./appWrappers-sH140Cw5.js";import{L as w}from"./ListItem-Bat2RRg4.js";import{L as A}from"./ListItemIcon-BoFHU3lw.js";import{c as _}from"./Plugin-DOMfypDg.js";import{S as R}from"./Grid-DyKyVuYQ.js";import{L as W}from"./Link-sQvaDLc-.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Dglv9EKv.js";import"./useAsync-BXzo8JBF.js";import"./useMountedState-DKv1wuOp.js";import"./lodash-DNFIy4FG.js";import"./useElementFilter-DkKgMKyr.js";import"./componentData-quWYn8Ma.js";import"./List-OkrJGNXg.js";import"./ListContext-C8Vr105q.js";import"./translation-Ri6--dYY.js";import"./EmptyState-4TLCWyg_.js";import"./makeStyles-DqgeW26M.js";import"./Progress-CONg7ax9.js";import"./LinearProgress-CrgDvwfd.js";import"./Box-DWYmvqFk.js";import"./styled-AHWGCPSK.js";import"./ResponseErrorPanel-BxfC9k8b.js";import"./ErrorPanel-r0FOF1ZM.js";import"./WarningPanel-CrThLmgv.js";import"./ExpandMore-B4GmBpcF.js";import"./AccordionDetails-h4hVdFJB.js";import"./index-B9sM2jn7.js";import"./Collapse-BFN2NOaJ.js";import"./MarkdownContent-z2y9ctJg.js";import"./CopyTextButton-BccbBSmb.js";import"./useCopyToClipboard-B9vry376.js";import"./Tooltip-DwIQbKbb.js";import"./useObjectRef-C4fVgNdG.js";import"./useOverlayTriggerState-Ck3aLq9p.js";import"./utils-CwhAgYFH.js";import"./useFocusRing-DHTQT_lC.js";import"./number-pMJydGgE.js";import"./I18nProvider-BWEEs8VU.js";import"./useControlledState-BBNR5rbN.js";import"./animation-CUxQyO9K.js";import"./useHover-BwVq8lt0.js";import"./ButtonIcon-05b3-25k.js";import"./Button-BGvlfnXd.js";import"./Label-DQRKBs9u.js";import"./Hidden-DBz78_xE.js";import"./useLabel-BqXJUdIq.js";import"./useLabels-Cfrddupv.js";import"./useButton-CWlVdGLP.js";import"./usePress-BBc3t8hk.js";import"./textSelection-BFKOQOEH.js";import"./getMetaValue-DQETedN7.js";import"./index-B1nmLjVU.js";import"./Divider-Bat-i2TT.js";import"./CodeSnippet-DrOcwf2_.js";import"./useApp-BZeBLv5x.js";import"./index-B44vhErU.js";import"./WebStorage-DTclgNSG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Du-q7c5U.js";import"./useIsomorphicLayoutEffect--isHgD0n.js";import"./BUIProvider-NHPZXdvk.js";import"./useRouteRef-3V3PIu1S.js";import"./index-DPwzdWYf.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
