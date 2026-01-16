import{aD as L,aE as S,aF as x,aG as g,a6 as j,j as e,T as D}from"./iframe-C6d4amxQ.js";import{c as f,D as C}from"./InsertDriveFile-B4xbBREG.js";import{s as k,M as v}from"./api-CFhZfUf8.js";import{a as m,c as _}from"./SearchResult-CejIEHCl.js";import{S as w}from"./SearchContext-Ckc5PXBu.js";import{L as R}from"./List-qMmGjvCV.js";import{H as p}from"./DefaultResultListItem-BpExpKA7.js";import{a as N}from"./SearchResultList-BsPkBFcz.js";import{L as q}from"./ListItem-CUGV6Izn.js";import{w as E}from"./appWrappers-BuwXBYCY.js";import{c as A}from"./Plugin-C7MtdO6s.js";import{L as G}from"./Link-xhhwyYCu.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CJjJYq6V.js";import"./Add-ClOG4AXx.js";import"./ArrowForwardIos-Blv2mkuK.js";import"./translation-CAg_xGpF.js";import"./MenuItem--axzyL0w.js";import"./ListSubheader-b_Cj8uar.js";import"./Chip-q8Ev9GF9.js";import"./Select-DEVQzAOY.js";import"./index-B9sM2jn7.js";import"./Popover-BUbOGoXS.js";import"./Modal-D1YXIVhd.js";import"./Portal-B6ENv45o.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CzoWM_jf.js";import"./useAnalytics-CEJvE44e.js";import"./EmptyState-mXC2cpxt.js";import"./Grid-WtUylni-.js";import"./Progress-CsXkQXV4.js";import"./LinearProgress-YmA4jlO6.js";import"./Box-yXRZ3Xp2.js";import"./styled-BGGy5Grm.js";import"./ResponseErrorPanel-DnithY1L.js";import"./ErrorPanel-C4TycXbx.js";import"./WarningPanel-C-jRLCTC.js";import"./ExpandMore--4wftT15.js";import"./AccordionDetails-BgOvrYOY.js";import"./Collapse-Di3lEKwf.js";import"./MarkdownContent-BYJW4Slr.js";import"./CodeSnippet-3cP_Pubp.js";import"./CopyTextButton-CE5xtLZ0.js";import"./useCopyToClipboard-CH_VlaT9.js";import"./useMountedState-C6W4VPdE.js";import"./Tooltip-5RhOkenH.js";import"./Popper-aoUur9H0.js";import"./ListItemText-DmvyJhay.js";import"./ListContext-Baa1QRS6.js";import"./Divider-BlWYsQ2U.js";import"./useAsync-C2weF2sY.js";import"./lodash-DLuUt6m8.js";import"./useElementFilter-C9B-vPkc.js";import"./componentData-BhUIek-Q.js";import"./ListItemIcon-CHICEp0x.js";import"./useObservable-9WiB_7an.js";import"./useIsomorphicLayoutEffect-DMZDbwPJ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Bwu9Fyg1.js";import"./useApp-BUIf5wuk.js";import"./useRouteRef-D7G3Qpmz.js";var d={},y;function W(){if(y)return d;y=1;var r=L(),t=S();Object.defineProperty(d,"__esModule",{value:!0}),d.default=void 0;var s=t(x()),i=r(g()),I=(0,i.default)(s.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return d.default=I,d}var P=W();const H=j(P),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},F=new v(M),Ke={title:"Plugins/Search/SearchResult",component:m,decorators:[r=>E(e.jsx(D,{apis:[[k,F]],children:e.jsx(w,{children:e.jsx(r,{})})}))],tags:["!manifest"]},h=r=>{const{result:t}=r;return e.jsx(q,{children:e.jsxs(G,{to:t.location,children:[t.title," - ",t.text]})})},n=()=>e.jsx(m,{children:({results:r})=>e.jsx(R,{children:r.map(({type:t,document:s})=>{switch(t){case"custom-result-item":return e.jsx(h,{result:s},s.location);default:return e.jsx(p,{result:s},s.location)}})})}),o=()=>{const r={term:"documentation"};return e.jsx(m,{query:r,children:({results:t})=>e.jsx(R,{children:t.map(({type:s,document:i})=>{switch(s){case"custom-result-item":return e.jsx(h,{result:i},i.location);default:return e.jsx(p,{result:i},i.location)}})})})},u=()=>e.jsx(m,{children:({results:r})=>e.jsx(N,{resultItems:r,renderResultItem:({type:t,document:s})=>{switch(t){case"custom-result-item":return e.jsx(h,{result:s},s.location);default:return e.jsx(p,{result:s},s.location)}}})}),a=()=>e.jsx(m,{children:({results:r})=>e.jsxs(e.Fragment,{children:[e.jsx(f,{icon:e.jsx(H,{}),title:"Custom",link:"See all custom results",resultItems:r.filter(({type:t})=>t==="custom-result-item"),renderResultItem:({document:t})=>e.jsx(h,{result:t},t.location)}),e.jsx(f,{icon:e.jsx(C,{}),title:"Default",resultItems:r.filter(({type:t})=>t!=="custom-result-item"),renderResultItem:({document:t})=>e.jsx(p,{result:t},t.location)})]})}),c=()=>e.jsx(m,{noResultsComponent:e.jsx(e.Fragment,{children:"No results were found"}),children:({results:r})=>e.jsx(R,{children:r.map(({type:t,document:s})=>{switch(t){case"custom-result-item":return e.jsx(h,{result:s},s.location);default:return e.jsx(p,{result:s},s.location)}})})}),l=()=>{const t=A({id:"plugin"}).provide(_({name:"DefaultResultListItem",component:async()=>p}));return e.jsx(m,{children:e.jsx(t,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};u.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};a.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};c.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Default = () => {
  return (
    <SearchResult>
      {({ results }) => (
        <List>
          {results.map(({ type, document }) => {
            switch (type) {
              case "custom-result-item":
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
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
          })}
        </List>
      )}
    </SearchResult>
  );
};
`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const WithQuery = () => {
  const query = {
    term: "documentation",
  };

  return (
    <SearchResult query={query}>
      {({ results }) => (
        <List>
          {results.map(({ type, document }) => {
            switch (type) {
              case "custom-result-item":
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
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
          })}
        </List>
      )}
    </SearchResult>
  );
};
`,...o.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{code:`const ListLayout = () => {
  return (
    <SearchResult>
      {({ results }) => (
        <SearchResultListLayout
          resultItems={results}
          renderResultItem={({ type, document }) => {
            switch (type) {
              case "custom-result-item":
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
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
      )}
    </SearchResult>
  );
};
`,...u.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const GroupLayout = () => {
  return (
    <SearchResult>
      {({ results }) => (
        <>
          <SearchResultGroupLayout
            icon={<CustomIcon />}
            title="Custom"
            link="See all custom results"
            resultItems={results.filter(
              ({ type }) => type === "custom-result-item"
            )}
            renderResultItem={({ document }) => (
              <CustomResultListItem key={document.location} result={document} />
            )}
          />
          <SearchResultGroupLayout
            icon={<DefaultIcon />}
            title="Default"
            resultItems={results.filter(
              ({ type }) => type !== "custom-result-item"
            )}
            renderResultItem={({ document }) => (
              <DefaultResultListItem
                key={document.location}
                result={document}
              />
            )}
          />
        </>
      )}
    </SearchResult>
  );
};
`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const WithCustomNoResultsComponent = () => {
  return (
    <SearchResult noResultsComponent={<>No results were found</>}>
      {({ results }) => (
        <List>
          {results.map(({ type, document }) => {
            switch (type) {
              case "custom-result-item":
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
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
          })}
        </List>
      )}
    </SearchResult>
  );
};
`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{code:`const UsingSearchResultItemExtensions = () => {
  const plugin = createPlugin({ id: "plugin" });
  const DefaultResultItem = plugin.provide(
    createSearchResultListItemExtension({
      name: "DefaultResultListItem",
      component: async () => DefaultResultListItem,
    })
  );
  return (
    <SearchResult>
      <DefaultResultItem />
    </SearchResult>
  );
};
`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const query = {
    term: 'documentation'
  };
  return <SearchResult query={query}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...o.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <SearchResultListLayout resultItems={results} renderResultItem={({
      type,
      document
    }) => {
      switch (type) {
        case 'custom-result-item':
          return <CustomResultListItem key={document.location} result={document} />;
        default:
          return <DefaultResultListItem key={document.location} result={document} />;
      }
    }} />}
    </SearchResult>;
}`,...u.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <>
          <SearchResultGroupLayout icon={<CustomIcon />} title="Custom" link="See all custom results" resultItems={results.filter(({
        type
      }) => type === 'custom-result-item')} renderResultItem={({
        document
      }) => <CustomResultListItem key={document.location} result={document} />} />
          <SearchResultGroupLayout icon={<DefaultIcon />} title="Default" resultItems={results.filter(({
        type
      }) => type !== 'custom-result-item')} renderResultItem={({
        document
      }) => <DefaultResultListItem key={document.location} result={document} />} />
        </>}
    </SearchResult>;
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult noResultsComponent={<>No results were found</>}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultResultItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResult>
      <DefaultResultItem />
    </SearchResult>;
}`,...l.parameters?.docs?.source}}};const Xe=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{n as Default,a as GroupLayout,u as ListLayout,l as UsingSearchResultItemExtensions,c as WithCustomNoResultsComponent,o as WithQuery,Xe as __namedExportsOrder,Ke as default};
