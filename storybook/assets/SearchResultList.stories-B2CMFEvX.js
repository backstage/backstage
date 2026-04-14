import{j as e,r as o,$ as h}from"./iframe-KINrIo_f.js";import{s as y,M as S}from"./api-DrXoM2Fb.js";import{c as L}from"./SearchResult-BguzYWEL.js";import{S as s}from"./SearchResultList-L2FqwHUo.js";import{S as q}from"./SearchContext-BHfokyX0.js";import{L as f}from"./ListItemText-3zlpephB.js";import{H as x}from"./DefaultResultListItem-mWbvTkJd.js";import{C as j}from"./icons-CzQYYh0X.js";import{w as P,c as C}from"./appWrappers-z6NxJqlC.js";import{L as w}from"./ListItem-T4Kaa4Sv.js";import{L as A}from"./ListItemIcon-vSBS_DW2.js";import{c as _}from"./Plugin-B2KqZHWe.js";import{S as R}from"./Grid-FoW9JHab.js";import{L as W}from"./Link-DnWmf_w2.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Cjgpjhm8.js";import"./useAsync-DngpNpKD.js";import"./useMountedState-CjwlO_ha.js";import"./lodash-Cfs9LtR9.js";import"./useElementFilter-Dlwg5cra.js";import"./componentData-qZciE7mF.js";import"./List-BFqrCY8I.js";import"./ListContext-CxZLnUvv.js";import"./translation-u0hxjqwJ.js";import"./EmptyState-ClY7Agb1.js";import"./makeStyles-Br0G-hkA.js";import"./Progress-DaajmS_g.js";import"./LinearProgress-BMtY-KbP.js";import"./Box-DQI8Jhin.js";import"./styled-DYfYOEQM.js";import"./ResponseErrorPanel-RW56rJ9L.js";import"./ErrorPanel-CYYHykPz.js";import"./WarningPanel-BxYnA6XA.js";import"./ExpandMore-DHVSTq_X.js";import"./AccordionDetails-Dd7pKb7g.js";import"./index-B9sM2jn7.js";import"./Collapse-9ymh8UbQ.js";import"./MarkdownContent-FGNp8B08.js";import"./CodeSnippet-tg7bz2Br.js";import"./CopyTextButton-lw-xGP4D.js";import"./useCopyToClipboard-DfOSg3XZ.js";import"./Tooltip-DJxyRh0l.js";import"./Popper-_e1X1nRB.js";import"./Portal-MO4PhXZB.js";import"./Divider-sHtYZKP3.js";import"./useApp-C5R7puQC.js";import"./WebStorage-B6vFWMkV.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Ck2mvxcb.js";import"./useIsomorphicLayoutEffect-72DB9J2o.js";import"./BUIProvider-Ciu3w9NY.js";import"./openLink-BCV1Ju3v.js";import"./useRouteRef-BjpYbkhm.js";import"./index-CIy2Pw8-.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),ke={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const Qe=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,Qe as __namedExportsOrder,ke as default};
