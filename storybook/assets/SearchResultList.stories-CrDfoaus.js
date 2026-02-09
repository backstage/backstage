import{j as e,U as h,r as l}from"./iframe-CZ56O-V9.js";import{s as y,M as S}from"./api-C0b41NLl.js";import{c as g}from"./SearchResult-0Gf_BciX.js";import{S as p}from"./SearchResultList-DrzHz4Dh.js";import{S as R}from"./Grid-DjbHNKXL.js";import{S as I}from"./SearchContext-kWgyC5N7.js";import{L as f}from"./ListItemText-Dn38yijY.js";import{H as q}from"./DefaultResultListItem-4nmu660v.js";import{C as P}from"./icons-CuTfTC0y.js";import{L as A}from"./ListItem-BtvfynNb.js";import{L as C}from"./ListItemIcon-B1QkhF77.js";import{w as j,c as w}from"./appWrappers-BeJ0xyiP.js";import{c as v}from"./Plugin-DZUy8-Yb.js";import{L as W}from"./Link-BQF_zimC.js";import"./preload-helper-PPVm8Dsz.js";import"./useAsync-BZsMG4pg.js";import"./useMountedState-ut5gwY4t.js";import"./lodash-Czox7iJy.js";import"./List-DEdaJe5c.js";import"./ListContext-BmrJCIpO.js";import"./useElementFilter-DsgRz-ny.js";import"./componentData-CSZ8ujY9.js";import"./useAnalytics-BS680IS8.js";import"./translation-zX5vBj7y.js";import"./EmptyState-C0lKoeTI.js";import"./Progress-Du9yI75y.js";import"./LinearProgress-DvsI2E8u.js";import"./Box-MN-uZs4I.js";import"./styled-D9whByUF.js";import"./ResponseErrorPanel-DijxxXkN.js";import"./ErrorPanel-CQnJnEL8.js";import"./WarningPanel-CChAptH0.js";import"./ExpandMore-yvURIOcL.js";import"./AccordionDetails-BaPE-Me3.js";import"./index-B9sM2jn7.js";import"./Collapse-DPNvm9kr.js";import"./MarkdownContent-BOJKT2W9.js";import"./CodeSnippet-rkZMP_wC.js";import"./CopyTextButton-wUac2sWa.js";import"./useCopyToClipboard-CrTqHNaz.js";import"./Tooltip-B8FLw8lE.js";import"./Popper-7tudyaaz.js";import"./Portal-rgcloK6u.js";import"./Divider-C407Z4rN.js";import"./useApp-BeYLp8SO.js";import"./useObservable-ByqNzwSP.js";import"./useIsomorphicLayoutEffect-D3HbnLj9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Ca3h4iDJ.js";import"./useRouteRef-CcFxojYp.js";const T=w({id:"storybook.search.results.list.route"}),D=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),De={title:"Plugins/Search/SearchResultList",component:p,decorators:[t=>j(e.jsx(h,{apis:[[y,D]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":T}})],tags:["!manifest"]},s=()=>e.jsx(I,{children:e.jsx(p,{})}),o=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(p,{query:t})},n=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(p,{query:t})})},a=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(p,{query:t})})},c=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(p,{query:t})})},i=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(p,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},N=t=>{const{icon:d,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(A,{alignItems:"flex-start",divider:!0,children:[d&&e.jsx(C,{children:d}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},u=()=>{const[t]=l.useState({types:["custom"]});return e.jsx(p,{query:t,renderResultItem:({type:d,document:r,highlight:L,rank:x})=>d==="custom"?e.jsx(N,{icon:e.jsx(P,{}),result:r,highlight:L,rank:x},r.location):e.jsx(q,{result:r},r.location)})},m=()=>{const[t]=l.useState({types:["techdocs"]}),r=v({id:"plugin"}).provide(g({name:"DefaultResultListItem",component:async()=>q}));return e.jsx(p,{query:t,children:e.jsx(r,{})})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};n.__docgenInfo={description:"",methods:[],displayName:"Loading"};a.__docgenInfo={description:"",methods:[],displayName:"WithError"};c.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};i.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};u.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};m.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
