import{aP as I,aQ as L,aR as S,aS as j,aE as g,j as t,a2 as D}from"./iframe-D4ojcRBn.js";import{c as f,D as v}from"./InsertDriveFile-D7SRHiQG.js";import{s as C,M as _}from"./api-CG7Yri57.js";import{S as o,c as k}from"./SearchResult-Cm5pkSLT.js";import{L as R}from"./List-F0S5B9Dv.js";import{H as n}from"./DefaultResultListItem-FwxmED3v.js";import{a as N}from"./SearchResultList-B_UTYVNd.js";import{w as q}from"./appWrappers-C18BGkh-.js";import{L as w}from"./ListItem-B4NcQ-mY.js";import{c as E}from"./Plugin-HuiQHv00.js";import{S as A}from"./SearchContext-Bwuvkf_B.js";import{L as W}from"./Link-BY--rZrj.js";import"./preload-helper-PPVm8Dsz.js";import"./index-z_rlBvNL.js";import"./Add-yuI4J7wW.js";import"./ArrowForwardIos-C1FjFk3z.js";import"./translation-2IWac1Em.js";import"./useAnalytics-09trSmCC.js";import"./Select-BLtFOxar.js";import"./index-B9sM2jn7.js";import"./Popover-Br3Mvmbr.js";import"./Modal-DJW-GyYR.js";import"./Portal-CTav-3Kk.js";import"./formControlState-DPQG6hOS.js";import"./MenuItem-Cff9LskS.js";import"./ListSubheader-C5DhaJbc.js";import"./Chip-B7KiQxvh.js";import"./makeStyles-Cl-w1ABh.js";import"./EmptyState-C45WLeTp.js";import"./Grid-DTyJ7xkb.js";import"./Progress-CTfwz6Aw.js";import"./LinearProgress-DQOqEyYP.js";import"./Box-laszcGHL.js";import"./styled-DZLwQIlI.js";import"./ResponseErrorPanel-ypMJsa8L.js";import"./ErrorPanel-CYxdwLAi.js";import"./WarningPanel-DdSVSS0t.js";import"./ExpandMore-VVYq8_kD.js";import"./AccordionDetails-C_SvNiGJ.js";import"./Collapse-DFs2mBo2.js";import"./MarkdownContent-DKcQcqUM.js";import"./CodeSnippet-jM5cvvbc.js";import"./CopyTextButton-CeIJGoRH.js";import"./useCopyToClipboard-DKzr7rta.js";import"./useMountedState-Dd8_3eVW.js";import"./Tooltip-CrYI3p8-.js";import"./Popper-CS4j-s-3.js";import"./ListItemText-DqjEjuKL.js";import"./ListContext-S6LlGKy0.js";import"./Divider-DPJDNd0s.js";import"./useAsync-BUOFjVsl.js";import"./lodash-B6rdiaVd.js";import"./useElementFilter-Dw0OuJO0.js";import"./componentData-BbfOzAVr.js";import"./ListItemIcon-DFfD_X0n.js";import"./WebStorage-CWhMStFC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BwvneYqt.js";import"./useIsomorphicLayoutEffect-Bc6gHKgZ.js";import"./useApp-D8s9Wbol.js";import"./BUIProvider-C7o04JVY.js";import"./openLink-Dgpda5ne.js";import"./useResolvedHref-CTsd7mun.js";import"./useRouteRef-D4mMn1ND.js";import"./index-DW-rjBCk.js";var i={},y;function P(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var G=P();const H=g(G),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},Q=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,Q]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(H,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
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
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
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
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
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
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const te=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{a as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,m as WithQuery,te as __namedExportsOrder,$t as default};
