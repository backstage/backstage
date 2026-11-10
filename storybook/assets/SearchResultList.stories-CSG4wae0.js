import{j as e,r as o,a3 as h}from"./iframe-S5OJNhaE.js";import{s as y,M as S}from"./api-8PK06xjS.js";import{c as L}from"./SearchResult-B93WNmeV.js";import{S as s}from"./SearchResultList-CWRo40yY.js";import{S as q}from"./SearchContext-CtLkRXKy.js";import{L as f}from"./ListItemText-BABNhi8i.js";import{H as x}from"./DefaultResultListItem-LYT13QL7.js";import{C as j}from"./icons-PuTSXACZ.js";import{w as P,c as C}from"./appWrappers-SDy2NDGJ.js";import{L as w}from"./ListItem-DgGNurAj.js";import{L as A}from"./ListItemIcon-CrtnbRdY.js";import{c as _}from"./Plugin-CsL0oejA.js";import{S as R}from"./Grid-DjboKT5l.js";import{L as W}from"./Link-CBQOxjrI.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-a2pKeP17.js";import"./useAsync-nDYm94Va.js";import"./useMountedState-BxmbnEIC.js";import"./lodash-eKDtcgkj.js";import"./useElementFilter-Qo-2eGRM.js";import"./componentData-CFVKQESe.js";import"./List-DoT7Ftgb.js";import"./ListContext-DOVL_hFP.js";import"./translation-W9p8eeww.js";import"./EmptyState-B4k83ZjF.js";import"./makeStyles-D0gbbC8R.js";import"./Progress-dcWYL8bT.js";import"./LinearProgress-Bafchl15.js";import"./Box-CLnYDjy1.js";import"./styled-V22BojXI.js";import"./ResponseErrorPanel-BSGZl5VO.js";import"./ErrorPanel-DCdgLj-2.js";import"./WarningPanel-D9u8_8HV.js";import"./ExpandMore-CGf1XY_q.js";import"./AccordionDetails-BpzEffNr.js";import"./index-B9sM2jn7.js";import"./Collapse-BaPNDIaS.js";import"./MarkdownContent-BuRsAd7C.js";import"./CodeSnippet-1ebhFtOF.js";import"./CopyTextButton-BvKVUL2b.js";import"./useCopyToClipboard-B5eLvTIH.js";import"./Tooltip-CkWomL7j.js";import"./useObjectRef-Ce7Pg0IE.js";import"./useOverlayTriggerState-C-PPUK0B.js";import"./utils-Bf43CEqe.js";import"./useFocusRing-DrNn4w0v.js";import"./openLink-gCGEI6Hl.js";import"./number-DPETitzY.js";import"./I18nProvider-B9PKsfTQ.js";import"./useControlledState-sjWVeRbh.js";import"./animation-D5KQd_1z.js";import"./useHover-DRBklp1Y.js";import"./ButtonIcon-Chc3svF-.js";import"./Button-C2Hm-9-t.js";import"./Label-Dm19jsZB.js";import"./Hidden-bbdHFmyf.js";import"./useLabel-D6KUrPXz.js";import"./useLabels-lt4DDiFl.js";import"./useButton-ZsuQVD8S.js";import"./usePress-BKUcGSaX.js";import"./textSelection-C5XFxsbn.js";import"./getMetaValue-DfvZTkcg.js";import"./index-BC5M37nw.js";import"./Divider-KuOpsNRp.js";import"./useApp-DxGdeyks.js";import"./WebStorage-DGbeUCIJ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-3QRG-oq7.js";import"./useIsomorphicLayoutEffect-CT3OHBKv.js";import"./BUIProvider-CxyEA8gh.js";import"./BUIRoutingProvider-MbdU_jc-.js";import"./useResolvedHref-D6pj4Xy7.js";import"./useRouteRef-DMP-PUAT.js";import"./index-DWYBXtX6.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const st=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,st as __namedExportsOrder,rt as default};
