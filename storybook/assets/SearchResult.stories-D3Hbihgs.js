import{aF as L,aG as S,aH as x,aI as g,V as j,j as e,W as D}from"./iframe-BmigQEv-.js";import{c as f,D as C}from"./InsertDriveFile-DdLjD7b2.js";import{s as k,M as v}from"./api-y-CS0LOC.js";import{S as l,c as _}from"./SearchResult-Cl7OpF9B.js";import{S as w}from"./SearchContext-BXNtrlBt.js";import{L as R}from"./List-DPvCCYNu.js";import{H as p}from"./DefaultResultListItem-BW3bqk--.js";import{a as N}from"./SearchResultList-C8gFXVeq.js";import{L as q}from"./ListItem-gIkgFmX0.js";import{w as E}from"./appWrappers-mMtjOYp0.js";import{c as W}from"./Plugin-Dh5mGDR3.js";import{L as A}from"./Link-zeLLiKoz.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cntmq1y2.js";import"./Add-mjwB3Prs.js";import"./ArrowForwardIos-DB0SD6qP.js";import"./translation-DVFD9jnp.js";import"./makeStyles-0-n1Rujo.js";import"./MenuItem-xEHGHDNh.js";import"./ListSubheader-CkZPgQai.js";import"./Chip-h1xZTPbC.js";import"./Select-Ds8DNeOJ.js";import"./index-B9sM2jn7.js";import"./Popover-CBw5Z0ap.js";import"./Modal-DG7NhvRI.js";import"./Portal-BhbQiPPq.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DE4q5ARv.js";import"./useAnalytics-Cv3q-2FZ.js";import"./EmptyState-DIJy8ckS.js";import"./Grid-BZioZTwU.js";import"./Progress-BtQbv0tc.js";import"./LinearProgress-D5pwLlmQ.js";import"./Box-YqGKr52F.js";import"./styled-DHllcCHM.js";import"./ResponseErrorPanel-CrN6M0fP.js";import"./ErrorPanel-D87FdHM-.js";import"./WarningPanel-Cdm1EbTH.js";import"./ExpandMore-Cam5MjCc.js";import"./AccordionDetails-DJp48nbG.js";import"./Collapse-DCf58tzA.js";import"./MarkdownContent-DYnLORy4.js";import"./CodeSnippet-Cogd1Uem.js";import"./CopyTextButton-CLEZMcEc.js";import"./useCopyToClipboard-B4Ur9exv.js";import"./useMountedState-DFB9Hb7L.js";import"./Tooltip-oWfERYB1.js";import"./Popper-B-YRGJsw.js";import"./ListItemText-BWJ8GOpK.js";import"./ListContext-DDrpeIYl.js";import"./Divider-BJZcR2fB.js";import"./useAsync-kJRCmhqz.js";import"./lodash-BZheRUGK.js";import"./useElementFilter-DoIlwM0U.js";import"./componentData-DQLrmcS3.js";import"./ListItemIcon-Bpr1NGZM.js";import"./useObservable-BQVD3ffY.js";import"./useIsomorphicLayoutEffect-BK5x3ypD.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BfwtKwvN.js";import"./useApp-CTkrqPOE.js";import"./useRouteRef-3r76tHuN.js";import"./index-MgZwvacw.js";var d={},y;function G(){if(y)return d;y=1;var r=L(),t=S();Object.defineProperty(d,"__esModule",{value:!0}),d.default=void 0;var s=t(x()),i=r(g()),I=(0,i.default)(s.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return d.default=I,d}var H=G();const P=j(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},F=new v(M),Ye={title:"Plugins/Search/SearchResult",component:l,decorators:[r=>E(e.jsx(D,{apis:[[k,F]],children:e.jsx(w,{children:e.jsx(r,{})})}))],tags:["!manifest"]},h=r=>{const{result:t}=r;return e.jsx(q,{children:e.jsxs(A,{to:t.location,children:[t.title," - ",t.text]})})},n=()=>e.jsx(l,{children:({results:r})=>e.jsx(R,{children:r.map(({type:t,document:s})=>t==="custom-result-item"?e.jsx(h,{result:s},s.location):e.jsx(p,{result:s},s.location))})}),o=()=>{const r={term:"documentation"};return e.jsx(l,{query:r,children:({results:t})=>e.jsx(R,{children:t.map(({type:s,document:i})=>s==="custom-result-item"?e.jsx(h,{result:i},i.location):e.jsx(p,{result:i},i.location))})})},u=()=>e.jsx(l,{children:({results:r})=>e.jsx(N,{resultItems:r,renderResultItem:({type:t,document:s})=>t==="custom-result-item"?e.jsx(h,{result:s},s.location):e.jsx(p,{result:s},s.location)})}),a=()=>e.jsx(l,{children:({results:r})=>e.jsxs(e.Fragment,{children:[e.jsx(f,{icon:e.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:r.filter(({type:t})=>t==="custom-result-item"),renderResultItem:({document:t})=>e.jsx(h,{result:t},t.location)}),e.jsx(f,{icon:e.jsx(C,{}),title:"Default",resultItems:r.filter(({type:t})=>t!=="custom-result-item"),renderResultItem:({document:t})=>e.jsx(p,{result:t},t.location)})]})}),c=()=>e.jsx(l,{noResultsComponent:e.jsx(e.Fragment,{children:"No results were found"}),children:({results:r})=>e.jsx(R,{children:r.map(({type:t,document:s})=>t==="custom-result-item"?e.jsx(h,{result:s},s.location):e.jsx(p,{result:s},s.location))})}),m=()=>{const t=W({id:"plugin"}).provide(_({name:"DefaultResultListItem",component:async()=>p}));return e.jsx(l,{children:e.jsx(t,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};u.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};a.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};c.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};m.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Default = () => {
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
`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{code:`const UsingSearchResultItemExtensions = () => {
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
`,...m.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};const Ze=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{n as Default,a as GroupLayout,u as ListLayout,m as UsingSearchResultItemExtensions,c as WithCustomNoResultsComponent,o as WithQuery,Ze as __namedExportsOrder,Ye as default};
