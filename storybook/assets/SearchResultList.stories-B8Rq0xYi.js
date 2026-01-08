import{j as e,T as h,r as l}from"./iframe-CIdfBUNc.js";import{s as y,M as S}from"./api-DPo6etgd.js";import{c as g}from"./SearchResult-BC9fWI3W.js";import{S as p}from"./SearchResultList-vhdV5kME.js";import{S as R}from"./Grid-CNMGd53o.js";import{S as I}from"./SearchContext-Chra9qDZ.js";import{L as f}from"./ListItemText-CPW3cjiy.js";import{H as q}from"./DefaultResultListItem-CE4o17rI.js";import{C as P}from"./icons-ek89QZ9g.js";import{L as A}from"./ListItem-Dfr179My.js";import{L as C}from"./ListItemIcon-ibuIbQe5.js";import{w as j,c as w}from"./appWrappers-AgrnuiEj.js";import{c as v}from"./Plugin-Cal27Rxh.js";import{L as W}from"./Link-BiOJGlt4.js";import"./preload-helper-PPVm8Dsz.js";import"./useAsync-Cop8mLj-.js";import"./useMountedState-CxwBQu50.js";import"./lodash-Y_-RFQgK.js";import"./List-CWTfe060.js";import"./ListContext-BIMkaxMd.js";import"./useElementFilter-DWkD4G57.js";import"./componentData-CJ11DeEU.js";import"./useAnalytics-DK0dZYSI.js";import"./translation-DnjA1iFI.js";import"./EmptyState-C3O2UO4o.js";import"./Progress-Dn06jhVt.js";import"./LinearProgress-CDSuPOQP.js";import"./Box-2FUA-1uv.js";import"./styled-D6NhFGBl.js";import"./ResponseErrorPanel-CUOdDLSC.js";import"./ErrorPanel-BxCVrdam.js";import"./WarningPanel-CssXi-zs.js";import"./ExpandMore-CVq5yZzR.js";import"./AccordionDetails-Db8RrwKQ.js";import"./index-B9sM2jn7.js";import"./Collapse-C667vUQ9.js";import"./MarkdownContent-DeGRTh9e.js";import"./CodeSnippet-yQ1UvqA7.js";import"./CopyTextButton-B2Os4u3r.js";import"./useCopyToClipboard-C5xquscJ.js";import"./Tooltip-CiUyWjSw.js";import"./Popper-zpN6QrBD.js";import"./Portal-CzMBs-js.js";import"./Divider-DSMvF0Rh.js";import"./useApp-DNuP2PYf.js";import"./useObservable-DS2HW8Ao.js";import"./useIsomorphicLayoutEffect-BNA5FOYt.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-6Q4r393t.js";import"./useRouteRef-BtzOE2h6.js";const T=w({id:"storybook.search.results.list.route"}),D=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),De={title:"Plugins/Search/SearchResultList",component:p,decorators:[t=>j(e.jsx(h,{apis:[[y,D]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":T}})],tags:["!manifest"]},s=()=>e.jsx(I,{children:e.jsx(p,{})}),o=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(p,{query:t})},n=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(p,{query:t})})},a=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(p,{query:t})})},c=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(p,{query:t})})},i=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(p,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},N=t=>{const{icon:d,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(A,{alignItems:"flex-start",divider:!0,children:[d&&e.jsx(C,{children:d}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},u=()=>{const[t]=l.useState({types:["custom"]});return e.jsx(p,{query:t,renderResultItem:({type:d,document:r,highlight:L,rank:x})=>{switch(d){case"custom":return e.jsx(N,{icon:e.jsx(P,{}),result:r,highlight:L,rank:x},r.location);default:return e.jsx(q,{result:r},r.location)}}})},m=()=>{const[t]=l.useState({types:["techdocs"]}),r=v({id:"plugin"}).provide(g({name:"DefaultResultListItem",component:async()=>q}));return e.jsx(p,{query:t,children:e.jsx(r,{})})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};n.__docgenInfo={description:"",methods:[],displayName:"Loading"};a.__docgenInfo={description:"",methods:[],displayName:"WithError"};c.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};i.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};u.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};m.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
  return (
    <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>
  );
};
`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const WithQuery = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return <SearchResultList query={query} />;
};
`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Loading = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider
      apis={[
        [searchApiRef, { query: () => new Promise<SearchResultSet>(() => {}) }],
      ]}
    >
      <SearchResultList query={query} />
    </TestApiProvider>
  );
};
`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const WithError = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider
      apis={[
        [
          searchApiRef,
          {
            query: () =>
              new Promise<SearchResultSet>(() => {
                throw new Error();
              }),
          },
        ],
      ]}
    >
      <SearchResultList query={query} />
    </TestApiProvider>
  );
};
`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const WithDefaultNoResultsComponent = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} />
    </TestApiProvider>
  );
};
`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const WithCustomNoResultsComponent = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList
        query={query}
        noResultsComponent={<ListItemText primary="No results were found" />}
      />
    </TestApiProvider>
  );
};
`,...i.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{code:`const WithCustomResultItem = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["custom"],
  });

  return (
    <SearchResultList
      query={query}
      renderResultItem={({ type, document, highlight, rank }) => {
        switch (type) {
          case "custom":
            return (
              <CustomResultListItem
                key={document.location}
                icon={<CatalogIcon />}
                result={document}
                highlight={highlight}
                rank={rank}
              />
            );
          default:
            return (
              <DefaultResultListItem
                key={document.location}
                result={document}
              />
            );
        }
      }}
    />
  );
};
`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{code:`const WithResultItemExtensions = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });
  const plugin = createPlugin({ id: "plugin" });
  const DefaultSearchResultListItem = plugin.provide(
    createSearchResultListItemExtension({
      name: "DefaultResultListItem",
      component: async () => DefaultResultListItem,
    })
  );
  return (
    <SearchResultList query={query}>
      <DefaultSearchResultListItem />
    </SearchResultList>
  );
};
`,...m.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>;
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultList query={query} />;
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...i.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
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
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};const Ne=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{s as Default,n as Loading,i as WithCustomNoResultsComponent,u as WithCustomResultItem,c as WithDefaultNoResultsComponent,a as WithError,o as WithQuery,m as WithResultItemExtensions,Ne as __namedExportsOrder,De as default};
